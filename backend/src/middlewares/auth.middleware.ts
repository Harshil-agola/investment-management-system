import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';
import { AppError } from '../utils/errorHandler.js';
import { User } from '../models/user.model.js';
import { UserType } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
	user?: UserType;
}

export const authenticate = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		let token: string | undefined;

		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.split(' ')[1];
		} else if (req.cookies && req.cookies.token) {
			token = req.cookies.token;
		}

		if (!token) {
			return next(new AppError('Authentication token is required', 401));
		}

		let decoded: JwtPayload;
		try {
			decoded = verifyToken(token);
		} catch (err) {
			return next(new AppError('Invalid or expired authentication token', 401));
		}

		const user = await User.findById(decoded.userId);
		if (!user) {
			return next(new AppError('User not found or account deactivated', 401));
		}

		if (user.status === 'blocked') {
			return next(
				new AppError(
					'Your account has been blocked. Please contact support.',
					403,
				),
			);
		}

		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};
