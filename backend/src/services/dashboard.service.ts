import mongoose from 'mongoose';
import { Investment, InvestmentStatus } from '../models/investment.model.js';
import { User } from '../models/user.model.js';

export class DashboardService {
	public static async getMetrics(userId: mongoose.Types.ObjectId) {
		const user = await User.findById(userId).select(
			'walletBalance totalRoiEarned totalLevelIncomeEarned',
		);

		const investmentAggregation = await Investment.aggregate([
			{ $match: { userId: new mongoose.Types.ObjectId(userId.toString()) } },
			{
				$group: {
					_id: null,
					totalInvestmentAmount: { $sum: '$amount' },
					activeInvestmentAmount: {
						$sum: {
							$cond: [
								{ $eq: ['$status', InvestmentStatus.ACTIVE] },
								'$amount',
								0,
							],
						},
					},
					totalCount: { $sum: 1 },
					activeCount: {
						$sum: {
							$cond: [{ $eq: ['$status', InvestmentStatus.ACTIVE] }, 1, 0],
						},
					},
				},
			},
		]);

		const totalInvestments =
			investmentAggregation.length > 0
				? investmentAggregation[0].totalInvestmentAmount
				: 0;
		const activeInvestments =
			investmentAggregation.length > 0
				? investmentAggregation[0].activeInvestmentAmount
				: 0;

		return {
			totalInvestments,
			activeInvestments,
			totalRoiEarned: user?.totalRoiEarned || 0,
			totalLevelIncomeEarned: user?.totalLevelIncomeEarned || 0,
			walletBalance: user?.walletBalance || 0,
		};
	}
}
