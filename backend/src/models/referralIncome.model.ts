import { Schema, model } from 'mongoose';
import { ReferralIncomeType } from '../types/index.js';

const referralIncomeSchema = new Schema<ReferralIncomeType>(
	{
		recipientId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		sourceUserId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		investmentId: {
			type: Schema.Types.ObjectId,
			ref: 'Investment',
			default: null,
		},
		referralLevel: {
			type: Number,
			required: true,
			min: [1, 'Referral level must be at least 1'],
		},
		amount: {
			type: Number,
			required: true,
			min: [0, 'Referral income amount must be positive'],
		},
		date: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	{ timestamps: true },
);

referralIncomeSchema.index({ recipientId: 1, date: -1 });
referralIncomeSchema.index({ recipientId: 1, referralLevel: 1 });
referralIncomeSchema.index({ sourceUserId: 1, recipientId: 1 });

export const ReferralIncome = model<ReferralIncomeType>(
	'ReferralIncome',
	referralIncomeSchema,
);

