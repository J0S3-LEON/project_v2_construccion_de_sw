import { Router } from 'express';
import authMiddleware from '../../common/middlewares/authMiddleware.js';
import validationMiddleware from '../../common/middlewares/validationMiddleware.js';
import { createSaleSchema } from './sales.dto.js';
import { createSaleController, listSalesController, getSaleController } from './sales.controller.js';

const router = Router();

// Create sale (protected)
router.post('/', authMiddleware, validationMiddleware(createSaleSchema), createSaleController);

// List and get (protected)
router.get('/', authMiddleware, listSalesController);
router.get('/:id', authMiddleware, getSaleController);

export default router;
