import { z } from 'zod';

export const createInvestmentSchema = z.object({
	amount: z
		.number()
		.positive('Investment amount must be greater than 0'),
	planName: z
		.string()
		.trim()
		.min(1, 'Plan name cannot be empty'),
	durationDays: z
		.number()
		.int('Duration days must be an integer')
		.positive('Duration must be at least 1 day'),
	dailyRoiPercentage: z
		.number()
		.min(0, 'Daily ROI percentage must be 0 or greater'),
});

export const getInvestmentsQuerySchema = z.object({
	status: z.enum(['Active', 'Completed', 'Cancelled']).optional(),
});

export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;
export type GetInvestmentsQueryInput = z.infer<typeof getInvestmentsQuerySchema>;
