import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
	authRoutes,
	investmentRoutes,
	dashboardRoutes,
	referralRoutes,
} from './routes/index.js';
import { errorHandler } from './utils/errorHandler.js';

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
	res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referrals', referralRoutes);

app.use(errorHandler);

export default app;
