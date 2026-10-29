import { Schema, model } from 'mongoose';
import { InvestmentType } from '../types/index.js';

export enum InvestmentStatus {
	ACTIVE = 'Active',
	COMPLETED = 'Completed',
	CANCELLED = 'Cancelled',
}

const investmentSchema = new Schema<InvestmentType>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		amount: {
			type: Number,
			required: true,
			min: [0, 'Investment amount must be positive'],
		},
		planDetails: {
			planName: { type: String, required: true, trim: true },
			durationDays: { type: Number, required: true, min: 1 },
			description: { type: String, trim: true },
		},
		startDate: {
			type: Date,
			required: true,
			default: Date.now,
		},
		endDate: {
			type: Date,
			required: true,
		},
		dailyRoiPercentage: {
			type: Number,
			required: true,
			min: [0, 'Daily ROI percentage must be non-negative'],
		},
		status: {
			type: String,
			enum: Object.values(InvestmentStatus),
			default: InvestmentStatus.ACTIVE,
			index: true,
		},
		lastRoiProcessedDate: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true },
);

investmentSchema.index({ status: 1, startDate: 1, endDate: 1 });
investmentSchema.index({ userId: 1, status: 1 });

export const Investment = model<InvestmentType>('Investment', investmentSchema);
