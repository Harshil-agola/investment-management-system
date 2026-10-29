import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { AppError } from '../utils/errorHandler.js';

type RequestLocation = 'body' | 'query' | 'params';

export const validate = (
	schema: ZodType<any>,
	source: RequestLocation = 'body',
) => {
	return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
		try {
			const parsed = await schema.parseAsync(req[source]);
			req[source] = parsed;
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const message = error.issues
					.map((err) => `${err.path.join('.') || 'field'}: ${err.message}`)
					.join(', ');
				return next(new AppError(message, 400));
			}
			next(error);
		}
	};
};
