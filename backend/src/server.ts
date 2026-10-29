import app from './app.js';
import { ENV_CONFIG } from './config/env.js';

app.listen(ENV_CONFIG.PORT, () => {});
