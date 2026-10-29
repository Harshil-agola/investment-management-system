import { Response } from 'express';
import mongoose from 'mongoose';
import { ReferralService } from '../services/referral.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getDirectReferrals = asyncHandler(
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		const userId = req.user!._id as mongoose.Types.ObjectId;
		const directReferrals = await ReferralService.getDirectReferrals(userId);

		res.status(200).json({
			success: true,
			count: directReferrals.length,
			data: {
				referrals: directReferrals,
			},
		});
	},
);

export const getReferralTree = asyncHandler(
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		const userId = req.user!._id as mongoose.Types.ObjectId;
		const tree = await ReferralService.getReferralTree(userId);

		res.status(200).json({
			success: true,
			data: {
				tree,
			},
		});
	},
);
