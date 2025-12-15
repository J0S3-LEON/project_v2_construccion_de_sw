import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import v1Routes from './routes/v1.js';
import errorHandler from './common/middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use(cors({ origin: config.corsOrigin }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use('/api/v1', v1Routes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (último middleware)
app.use(errorHandler);

export default app;
