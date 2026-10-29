import { Schema, model } from 'mongoose';
import { UserType } from '../types/index.js';

export enum AccountStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	BLOCKED = 'blocked',
}

const userSchema = new Schema<UserType>(
	{
		fullName: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		mobile: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true, select: false },
		referralCode: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		referredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
		walletBalance: { type: Number, default: 0, min: 0 },
		totalRoiEarned: { type: Number, default: 0, min: 0 },
		totalLevelIncomeEarned: { type: Number, default: 0, min: 0 },
		status: {
			type: String,
			enum: Object.values(AccountStatus),
			default: AccountStatus.ACTIVE,
		},
	},
	{ timestamps: true },
);

userSchema.index({ referredBy: 1 });

export const User = model<UserType>('User', userSchema);
