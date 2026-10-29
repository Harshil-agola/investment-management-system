import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import type { ReferralTreeNode } from '../types/index.js';


export class ReferralService {
	public static async buildReferralTree(
		parentId: mongoose.Types.ObjectId,
		currentDepth = 1,
		maxDepth = 5,
	): Promise<ReferralTreeNode[]> {
		if (currentDepth > maxDepth) {
			return [];
		}

		const directChildren = await User.find({ referredBy: parentId })
			.select('fullName email mobile referralCode walletBalance status createdAt')
			.lean();

		const tree: ReferralTreeNode[] = [];
		for (const child of directChildren) {
			const descendants = await ReferralService.buildReferralTree(
				child._id as mongoose.Types.ObjectId,
				currentDepth + 1,
				maxDepth,
			);
			tree.push({
				_id: child._id as mongoose.Types.ObjectId,
				fullName: child.fullName,
				email: child.email,
				mobile: child.mobile,
				referralCode: child.referralCode,
				walletBalance: child.walletBalance,
				status: child.status,
				createdAt: child.createdAt as Date,
				level: currentDepth,
				directReferralCount: descendants.length,
				children: descendants,
			});
		}

		return tree;
	}

	public static async getDirectReferrals(userId: mongoose.Types.ObjectId) {
		return await User.find({ referredBy: userId })
			.select(
				'fullName email mobile referralCode walletBalance totalRoiEarned totalLevelIncomeEarned status createdAt',
			)
			.sort({ createdAt: -1 });
	}

	public static async getReferralTree(userId: mongoose.Types.ObjectId) {
		return await ReferralService.buildReferralTree(userId);
	}
}
