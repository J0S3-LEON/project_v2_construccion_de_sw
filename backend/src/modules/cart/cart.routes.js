import { Router } from 'express';
import { getCart, saveCart } from './cart.controller.js';
import authMiddleware from '../../common/middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getCart);
router.put('/', authMiddleware, saveCart);

export default router;
