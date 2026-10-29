import { Schema, model } from 'mongoose';
import { RoiHistoryType } from '../types/index.js';

export enum RoiStatus {
	CREDITED = 'Credited',
	PENDING = 'Pending',
	FAILED = 'Failed',
}

const roiHistorySchema = new Schema<RoiHistoryType>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		investmentId: {
			type: Schema.Types.ObjectId,
			ref: 'Investment',
			required: true,
			index: true,
		},
		roiAmount: {
			type: Number,
			required: true,
			min: [0, 'ROI amount must be non-negative'],
		},
		date: {
			type: Date,
			default: Date.now,
			required: true,
		},
		payoutDate: {
			type: String,
			required: true,
			index: true,
		},
		status: {
			type: String,
			enum: Object.values(RoiStatus),
			default: RoiStatus.CREDITED,
		},
	},
	{ timestamps: true },
);

roiHistorySchema.index({ investmentId: 1, payoutDate: 1 }, { unique: true });
roiHistorySchema.index({ userId: 1, date: -1 });

export const RoiHistory = model<RoiHistoryType>('RoiHistory', roiHistorySchema);
