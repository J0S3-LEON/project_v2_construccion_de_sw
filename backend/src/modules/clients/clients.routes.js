import { Router } from 'express';
import authMiddleware from '../../common/middlewares/authMiddleware.js';
import validationMiddleware from '../../common/middlewares/validationMiddleware.js';
import { createClientSchema, updateClientSchema } from './clients.dto.js';
import {
  createClientController,
  listClientsController,
  getClientController,
  updateClientController,
  deleteClientController,
} from './clients.controller.js';

const router = Router();

router.use(authMiddleware); // todas las rutas requieren auth

router.get('/', listClientsController);
router.post('/', validationMiddleware(createClientSchema), createClientController);
router.get('/:id', getClientController);
router.put('/:id', validationMiddleware(updateClientSchema), updateClientController);
router.delete('/:id', deleteClientController);

export default router;
