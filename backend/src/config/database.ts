import mongoose from 'mongoose';
import { ENV_CONFIG } from './env.js';

export const connectDatabase = async (): Promise<void> => {
	try {
		await mongoose.connect(ENV_CONFIG.MONGO_URI);
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};
