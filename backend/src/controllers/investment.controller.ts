import { Response } from 'express';
import mongoose from 'mongoose';
import { InvestmentService } from '../services/investment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const createInvestment = asyncHandler(
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		const userId = req.user!._id as mongoose.Types.ObjectId;
		const createdInvestment = await InvestmentService.createInvestment(
			userId,
			req.body,
		);

		res.status(201).json({
			success: true,
			message: 'Investment created successfully',
			data: {
				investment: createdInvestment,
			},
		});
	},
);

export const getUserInvestments = asyncHandler(
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		const userId = req.user!._id as mongoose.Types.ObjectId;
		const status = req.query.status as string | undefined;

		const investments = await InvestmentService.getUserInvestments(userId, status);

		res.status(200).json({
			success: true,
			count: investments.length,
			data: {
				investments,
			},
		});
	},
);
