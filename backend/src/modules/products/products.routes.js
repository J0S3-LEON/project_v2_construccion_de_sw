import { Router } from 'express';
import authMiddleware from '../../common/middlewares/authMiddleware.js';
import validationMiddleware from '../../common/middlewares/validationMiddleware.js';
import { createProductSchema, updateProductSchema } from './products.dto.js';
import {
  createProductController,
  listProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
} from './products.controller.js';

const router = Router();

// Public: list and get
router.get('/', listProductsController);
router.get('/:id', getProductController);

// Protected: create/update/delete
router.post('/', authMiddleware, validationMiddleware(createProductSchema), createProductController);
router.put('/:id', authMiddleware, validationMiddleware(updateProductSchema), updateProductController);
router.delete('/:id', authMiddleware, deleteProductController);

export default router;
