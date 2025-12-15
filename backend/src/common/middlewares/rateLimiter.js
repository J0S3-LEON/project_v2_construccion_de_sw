import rateLimit from 'express-rate-limit';
import config from '../../config/index.js';

// Read limits from env with sensible defaults
const GLOBAL_WINDOW_MS = parseInt(process.env.GLOBAL_RATE_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes
const GLOBAL_MAX = parseInt(process.env.GLOBAL_RATE_MAX, 10) || 100;

const AUTH_WINDOW_MS = parseInt(process.env.AUTH_RATE_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes
const AUTH_MAX = parseInt(process.env.AUTH_RATE_MAX, 10) || 20; // relax default a bit for dev

export const globalLimiter = rateLimit({ windowMs: GLOBAL_WINDOW_MS, max: GLOBAL_MAX });

// For auth endpoints we return a friendly JSON body and add Retry-After header
export const authLimiter = rateLimit({
	windowMs: AUTH_WINDOW_MS,
	max: AUTH_MAX,
	// expose standard rate limit headers so clients can read remaining attempts
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		// Retry-After expects seconds
		res.set('Retry-After', String(Math.ceil(AUTH_WINDOW_MS / 1000)));
		return res.status(429).json({ message: 'Too many auth attempts, please try again later.' });
	}
});

// Export constants so other parts of the app (e.g., controllers) can report them
export { AUTH_MAX, AUTH_WINDOW_MS };

export default { globalLimiter, authLimiter };
