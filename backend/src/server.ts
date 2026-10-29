import app from './app.js';
import { ENV_CONFIG } from './config/env.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
	await connectDatabase();

	app.listen(ENV_CONFIG.PORT, () => {
		console.log(
			`Server running in ${ENV_CONFIG.NODE_ENV} mode on port ${ENV_CONFIG.PORT}`,
		);
	});
};

startServer();
