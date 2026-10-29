import { Response } from 'express';
import mongoose from 'mongoose';
import { DashboardService } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getDashboardMetrics = asyncHandler(
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		const userId = req.user!._id as mongoose.Types.ObjectId;
		const metrics = await DashboardService.getMetrics(userId);

		res.status(200).json({
			success: true,
			data: metrics,
		});
	},
);
