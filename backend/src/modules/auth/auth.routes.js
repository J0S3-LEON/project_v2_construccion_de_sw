import { Router } from 'express';
import { register, login, me } from './auth.controller.js';
import authMiddleware from '../../common/middlewares/authMiddleware.js';
import validationMiddleware from '../../common/middlewares/validationMiddleware.js';
import { registerSchema, loginSchema } from './auth.dto.js';

const router = Router();

router.post('/register', validationMiddleware(registerSchema), register);
router.post('/login', validationMiddleware(loginSchema), login);
router.get('/me', authMiddleware, me);

export default router;
