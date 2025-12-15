import { Router } from 'express';

const router = Router();

// health check already in app.js
router.get('/', (req, res) => res.json({ api: 'Kioma Sport API', version: 'v1' }));

// Mount auth module
import authRoutes from '../modules/auth/auth.routes.js';
router.use('/auth', authRoutes);
import clientsRoutes from '../modules/clients/clients.routes.js';
router.use('/clients', clientsRoutes);
import productsRoutes from '../modules/products/products.routes.js';
router.use('/products', productsRoutes);
import salesRoutes from '../modules/sales/sales.routes.js';
router.use('/sales', salesRoutes);

// TODO: montar otros módulos
// router.use('/clients', clientsRoutes);
// router.use('/products', productsRoutes);
// router.use('/sales', salesRoutes);

export default router;
