import { z } from 'zod';

export const registerSchema = z.object({
	fullName: z
		.string()
		.min(1, 'Full name is required')
		.trim()
		.min(2, 'Full name must be at least 2 characters'),
	email: z
		.email('Please provide a valid email address')
		.min(1, 'Email is required')
		.trim()
		.toLowerCase(),
	mobile: z
		.string()
		.min(1, 'Mobile number is required')
		.trim()
		.min(6, 'Mobile number must be at least 6 digits'),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters'),
	referralCode: z.string().trim().optional(),
});

export const loginSchema = z.object({
	email: z
		.email('Please provide a valid email address')
		.min(1, 'Email is required')
		.trim()
		.toLowerCase(),
	password: z
		.string()
		.min(1, 'Password cannot be empty'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
