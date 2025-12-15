import { Router } from 'express';
import { register, login, me } from './auth.controller.js';
import authMiddleware from '../../common/middlewares/authMiddleware.js';
import validationMiddleware from '../../common/middlewares/validationMiddleware.js';
import { registerSchema, loginSchema } from './auth.dto.js';
import { authLimiter } from '../../common/middlewares/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validationMiddleware(registerSchema), register);
router.post('/login', authLimiter, validationMiddleware(loginSchema), login);
router.get('/me', authMiddleware, me);

export default router;
