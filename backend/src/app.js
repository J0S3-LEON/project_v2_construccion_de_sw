import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import xss from 'xss-clean';
import { globalLimiter } from './common/middlewares/rateLimiter.js';
import config from './config/index.js';
import v1Routes from './routes/v1.js';
import errorHandler from './common/middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Security middlewares
app.use(xss()); // sanitize user input
app.use(cors({ origin: config.corsOrigin }));
app.use(helmet.contentSecurityPolicy({
	useDefaults: true,
	directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'"],
		objectSrc: ["'none'"],
		upgradeInsecureRequests: [],
	},
}));

app.use(globalLimiter);

// Routes
app.use('/api/v1', v1Routes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (último middleware)
app.use(errorHandler);

export default app;
