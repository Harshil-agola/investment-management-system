import { config } from 'dotenv';

config();

interface Config {
	PORT: number;
	NODE_ENV: string;
	MONGO_URI: string;
	JWT_SECRET: string;
	JWT_EXPIRES_IN: string;
}

export const ENV_CONFIG: Config = {
	PORT: Number(process.env.PORT) || 8080,
	NODE_ENV: process.env.NODE_ENV || 'development',
	MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/investment_db',
	JWT_SECRET:
		process.env.JWT_SECRET || 'nexa_super_secret_jwt_key_2026_dev_mode',
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
