import mongoose from 'mongoose';
import { Investment, InvestmentStatus } from '../models/investment.model.js';
import { User } from '../models/user.model.js';
import { ReferralIncome } from '../models/referralIncome.model.js';
import { CreateInvestmentInput } from '../validators/investment.validator.js';
import { InvestmentType } from '../types/index.js';

const REFERRAL_COMMISSION_RATES = [0.05, 0.03, 0.02];

export class InvestmentService {
	public static async distributeReferralIncome(
		sourceUserId: mongoose.Types.ObjectId,
		investmentId: mongoose.Types.ObjectId,
		investmentAmount: number,
		session?: mongoose.ClientSession,
	): Promise<void> {
		let currentUserId = sourceUserId;

		for (let level = 1; level <= REFERRAL_COMMISSION_RATES.length; level++) {
			const currentUser = await User.findById(currentUserId).session(session || null);
			if (!currentUser || !currentUser.referredBy) {
				break;
			}

			const parentUser = await User.findById(currentUser.referredBy).session(
				session || null,
			);
			if (!parentUser) {
				break;
			}

			const commissionRate = REFERRAL_COMMISSION_RATES[level - 1];
			const commissionAmount = Number((investmentAmount * commissionRate).toFixed(2));

			if (commissionAmount > 0 && parentUser.status === 'active') {
				await ReferralIncome.create(
					[
						{
							recipientId: parentUser._id,
							sourceUserId,
							investmentId,
							referralLevel: level,
							amount: commissionAmount,
							date: new Date(),
						},
					],
					{ session },
				);

				await User.findByIdAndUpdate(
					parentUser._id,
					{
						$inc: {
							walletBalance: commissionAmount,
							totalLevelIncomeEarned: commissionAmount,
						},
					},
					{ session },
				);
			}

			currentUserId = parentUser._id as mongoose.Types.ObjectId;
		}
	}

	public static async createInvestment(
		userId: mongoose.Types.ObjectId,
		input: CreateInvestmentInput,
	): Promise<InvestmentType> {
		const { amount, planName, durationDays, dailyRoiPercentage } = input;

		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + durationDays);

		let createdInvestment: InvestmentType;

		try {
			const session = await mongoose.startSession();
			session.startTransaction();

			try {
				const [investment] = await Investment.create(
					[
						{
							userId,
							amount,
							planDetails: {
								planName,
								durationDays,
							},
							startDate,
							endDate,
							dailyRoiPercentage,
							status: InvestmentStatus.ACTIVE,
						},
					],
					{ session },
				);

				createdInvestment = investment;

				await InvestmentService.distributeReferralIncome(
					userId,
					investment._id as mongoose.Types.ObjectId,
					amount,
					session,
				);

				await session.commitTransaction();
				session.endSession();
			} catch (err) {
				await session.abortTransaction();
				session.endSession();
				throw err;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '';
			if (
				errorMessage.includes('replica set') ||
				errorMessage.includes('Transactions are not supported')
			) {
				const investment = await Investment.create({
					userId,
					amount,
					planDetails: {
						planName,
						durationDays,
					},
					startDate,
					endDate,
					dailyRoiPercentage,
					status: InvestmentStatus.ACTIVE,
				});

				createdInvestment = investment;

				await InvestmentService.distributeReferralIncome(
					userId,
					investment._id as mongoose.Types.ObjectId,
					amount,
				);
			} else {
				throw error;
			}
		}

		return createdInvestment;
	}

	public static async getUserInvestments(
		userId: mongoose.Types.ObjectId,
		status?: string,
	): Promise<InvestmentType[]> {
		const filter: Record<string, unknown> = { userId };
		if (status) {
			filter.status = status;
		}

		return await Investment.find(filter).sort({ createdAt: -1 });
	}
}
