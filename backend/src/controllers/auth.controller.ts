import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const register = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const result = await AuthService.registerUser(req.body);

		res.cookie('token', result.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			data: result,
		});
	},
);

export const login = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const result = await AuthService.loginUser(req.body);

		res.cookie('token', result.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			success: true,
			message: 'Login successful',
			data: result,
		});
	},
);

export const getMe = asyncHandler(
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		res.status(200).json({
			success: true,
			data: {
				user: req.user,
			},
		});
	},
);

export const logout = asyncHandler(
	async (_req: Request, res: Response): Promise<void> => {
		res.clearCookie('token');
		res.status(200).json({
			success: true,
			message: 'Logged out successfully',
		});
	},
);
