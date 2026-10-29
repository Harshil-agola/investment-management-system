import type { Document, Types } from 'mongoose';

export type AccountStatusType = 'active' | 'inactive' | 'blocked';
export type InvestmentStatusType = 'Active' | 'Completed' | 'Cancelled';
export type RoiStatusType = 'Credited' | 'Pending' | 'Failed';

export interface UserType extends Document {
	fullName: string;
	email: string;
	mobile: string;
	password: string;
	referralCode: string;
	referredBy: Types.ObjectId | null;
	walletBalance: number;
	totalRoiEarned: number;
	totalLevelIncomeEarned: number;
	status: AccountStatusType;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface InvestmentType extends Document {
	userId: Types.ObjectId;
	amount: number;
	planDetails: {
		planName: string;
		durationDays: number;
		description?: string;
	};
	startDate: Date;
	endDate: Date;
	dailyRoiPercentage: number;
	status: InvestmentStatusType;
	lastRoiProcessedDate?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ReferralIncomeType extends Document {
	recipientId: Types.ObjectId;
	sourceUserId: Types.ObjectId;
	investmentId?: Types.ObjectId;
	referralLevel: number;
	amount: number;
	date: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface RoiHistoryType extends Document {
	userId: Types.ObjectId;
	investmentId: Types.ObjectId;
	roiAmount: number;
	date: Date;
	payoutDate: string;
	status: RoiStatusType;
	createdAt?: Date;
	updatedAt?: Date;
}


export interface ReferralTreeNode {
	_id: Types.ObjectId;
	fullName: string;
	email: string;
	mobile: string;
	referralCode: string;
	walletBalance: number;
	status: string;
	createdAt: Date;
	level: number;
	directReferralCount: number;
	children: ReferralTreeNode[];
}