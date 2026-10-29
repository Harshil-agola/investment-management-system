import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { generateReferralCode } from '../utils/generateReferralCode.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/errorHandler.js';
import { RegisterInput, LoginInput } from '../validators/auth.validator.js';

export class AuthService {
	public static async registerUser(input: RegisterInput) {
		const { fullName, email, mobile, password, referralCode } = input;

		const existingUser = await User.findOne({
			$or: [{ email: email.toLowerCase() }, { mobile }],
		});
		if (existingUser) {
			throw new AppError('User with this email or mobile already exists', 409);
		}

		let referredBy = null;
		if (referralCode) {
			const sponsor = await User.findOne({
				referralCode: referralCode.toUpperCase().trim(),
			});
			if (!sponsor) {
				throw new AppError('Invalid referral code provided', 400);
			}
			referredBy = sponsor._id;
		}

		let newReferralCode = generateReferralCode();
		let isUnique = false;
		while (!isUnique) {
			const exists = await User.findOne({ referralCode: newReferralCode });
			if (!exists) {
				isUnique = true;
			} else {
				newReferralCode = generateReferralCode();
			}
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			fullName,
			email,
			mobile,
			password: hashedPassword,
			referralCode: newReferralCode,
			referredBy,
		});

		const token = generateToken({
			userId: String(user._id),
			email: user.email,
		});

		return {
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				mobile: user.mobile,
				referralCode: user.referralCode,
				referredBy: user.referredBy,
				walletBalance: user.walletBalance,
				status: user.status,
			},
			token,
		};
	}

	public static async loginUser(input: LoginInput) {
		const { email, password } = input;

		const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
			'+password',
		);
		if (!user) {
			throw new AppError('Invalid email or password', 401);
		}

		if (user.status === 'blocked') {
			throw new AppError('Your account has been blocked. Contact support.', 403);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new AppError('Invalid email or password', 401);
		}

		const token = generateToken({
			userId: String(user._id),
			email: user.email,
		});

		return {
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				mobile: user.mobile,
				referralCode: user.referralCode,
				referredBy: user.referredBy,
				walletBalance: user.walletBalance,
				totalRoiEarned: user.totalRoiEarned,
				totalLevelIncomeEarned: user.totalLevelIncomeEarned,
				status: user.status,
			},
			token,
		};
	}
}

