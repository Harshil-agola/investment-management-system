import mongoose from 'mongoose';
import { Investment, InvestmentStatus } from '../models/investment.model.js';
import { User } from '../models/user.model.js';
import { RoiHistory, RoiStatus } from '../models/roiHistory.model.js';

export interface RoiProcessResult {
	totalActiveInvestments: number;
	processedCount: number;
	skippedCount: number;
	completedCount: number;
	totalDistributedRoi: number;
	errors: Array<{ investmentId: string; message: string }>;
}

export class RoiService {
	public static formatPayoutDate(date: Date = new Date()): string {
		return date.toISOString().split('T')[0];
	}

	public static async processDailyRoi(
		payoutDateStr?: string,
	): Promise<RoiProcessResult> {
		const targetDate = new Date();
		const payoutDate = payoutDateStr || RoiService.formatPayoutDate(targetDate);

		const result: RoiProcessResult = {
			totalActiveInvestments: 0,
			processedCount: 0,
			skippedCount: 0,
			completedCount: 0,
			totalDistributedRoi: 0,
			errors: [],
		};

		const activeInvestments = await Investment.find({
			status: InvestmentStatus.ACTIVE,
		});

		result.totalActiveInvestments = activeInvestments.length;

		for (const investment of activeInvestments) {
			const investmentId = investment._id as mongoose.Types.ObjectId;
			const userId = investment.userId as mongoose.Types.ObjectId;

			if (new Date() >= new Date(investment.endDate)) {
				investment.status = InvestmentStatus.COMPLETED;
				await investment.save();
				result.completedCount++;
				continue;
			}

			const existingRoi = await RoiHistory.findOne({
				investmentId,
				payoutDate,
			});

			if (existingRoi) {
				result.skippedCount++;
				continue;
			}

			const roiAmount = Number(
				((investment.amount * investment.dailyRoiPercentage) / 100).toFixed(2),
			);

			if (roiAmount <= 0) {
				result.skippedCount++;
				continue;
			}

			try {
				let session: mongoose.ClientSession | null = null;
				try {
					session = await mongoose.startSession();
					session.startTransaction();
				} catch {
					session = null;
				}

				try {
					await RoiHistory.create(
						[
							{
								userId,
								investmentId,
								roiAmount,
								date: targetDate,
								payoutDate,
								status: RoiStatus.CREDITED,
							},
						],
						{ session: session || undefined },
					);

					await User.findByIdAndUpdate(
						userId,
						{
							$inc: {
								walletBalance: roiAmount,
								totalRoiEarned: roiAmount,
							},
						},
						{ session: session || undefined },
					);

					await Investment.findByIdAndUpdate(
						investmentId,
						{ lastRoiProcessedDate: targetDate },
						{ session: session || undefined },
					);

					if (session) {
						await session.commitTransaction();
						session.endSession();
					}

					result.processedCount++;
					result.totalDistributedRoi = Number(
						(result.totalDistributedRoi + roiAmount).toFixed(2),
					);
				} catch (innerError: unknown) {
					if (session) {
						await session.abortTransaction();
						session.endSession();
					}
					throw innerError;
				}
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Unknown error';
				if (message.includes('E11000')) {
					result.skippedCount++;
				} else {
					result.errors.push({
						investmentId: investmentId.toString(),
						message,
					});
				}
			}
		}

		return result;
	}

	public static async getUserRoiHistory(
		userId: mongoose.Types.ObjectId,
		page = 1,
		limit = 20,
	) {
		const skip = (page - 1) * limit;

		const [history, total] = await Promise.all([
			RoiHistory.find({ userId })
				.populate('investmentId', 'planDetails amount dailyRoiPercentage')
				.sort({ date: -1 })
				.skip(skip)
				.limit(limit),
			RoiHistory.countDocuments({ userId }),
		]);

		return {
			history,
			total,
			page,
			totalPages: Math.ceil(total / limit),
		};
	}
}
