import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV_CONFIG } from '../config/env.js';

export interface JwtPayload {
	userId: string;
	email: string;
}

export const generateToken = (payload: JwtPayload): string => {
	const options: SignOptions = {
		expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as any,
	};
	return jwt.sign(payload, ENV_CONFIG.JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
	return jwt.verify(token, ENV_CONFIG.JWT_SECRET) as JwtPayload;
};
