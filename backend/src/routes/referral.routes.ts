import { Router } from 'express';
import {
	getDirectReferrals,
	getReferralTree,
} from '../controllers/referral.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/direct', getDirectReferrals);
router.get('/tree', getReferralTree);

export default router;
