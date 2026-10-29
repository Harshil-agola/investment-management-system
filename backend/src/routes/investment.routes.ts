import { Router } from 'express';
import {
	createInvestment,
	getUserInvestments,
} from '../controllers/investment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
	createInvestmentSchema,
	getInvestmentsQuerySchema,
} from '../validators/investment.validator.js';

const router = Router();

router.use(authenticate);

router
	.route('/')
	.post(validate(createInvestmentSchema), createInvestment)
	.get(validate(getInvestmentsQuerySchema, 'query'), getUserInvestments);

export default router;
