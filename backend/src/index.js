import app from './app.js';
import config from './config/index.js';
import { sequelize } from './db/index.js';

const PORT = process.env.PORT || config.port || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synced');

    // Seed a default admin user for easier testing (only if not exists)
    try {
      const { User } = await import('./modules/auth/auth.model.js');
      const bcrypt = (await import('bcryptjs')).default;
      const adminEmail = 'admin@example.com';
      const admin = await User.findOne({ where: { email: adminEmail } });
      if (!admin) {
        const hashed = await bcrypt.hash('admin123', 10);
        await User.create({ name: 'Admin', email: adminEmail, password: hashed });
        console.log('Seeded admin user -> admin@example.com / admin123');
      }
    } catch (seedErr) {
      console.warn('Warning seeding admin user:', seedErr.message || seedErr);
    }

    // Seed some example products if none exist
    try {
      const { Product } = await import('./modules/products/products.model.js');
      const count = await Product.count();
      if (count === 0) {
        await Product.bulkCreate([
          { name: 'Zapatillas Runner', description: 'Cómodas y ligeras', price: 59.99, stock: 10, sku: 'ZR-001', image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=400&q=80' },
          { name: 'Camiseta Deportiva', description: 'Transpirable', price: 19.50, stock: 25, sku: 'CD-002', image: 'https://images.unsplash.com/photo-1520975913811-6e3a7a6b4a6b?auto=format&fit=crop&w=400&q=80' },
          { name: 'Balón Oficial', description: 'Tamaño 5', price: 29.00, stock: 5, sku: 'BO-003', image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=400&q=80' },
          { name: 'Malla de Natación', description: 'Resistente al cloro', price: 24.99, stock: 8, sku: 'MN-004', image: 'https://images.unsplash.com/photo-1506634572419-9d27be54d1b7?auto=format&fit=crop&w=400&q=80' },
          { name: 'Gorra Runner', description: 'Ligera y ajustable', price: 12.00, stock: 0, sku: 'GR-005', image: 'https://images.unsplash.com/photo-1471550668521-9f8aa0c4d6d2?auto=format&fit=crop&w=400&q=80' },
          { name: 'Sudadera con capucha', description: 'Cálida y cómoda', price: 39.99, stock: 15, sku: 'SC-006', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80' },
          { name: 'Calcetines deportivos (pack 3)', description: 'Transpirables', price: 9.99, stock: 50, sku: 'CD-007', image: 'https://images.unsplash.com/photo-1520975913811-6e3a7a6b4a6b?auto=format&fit=crop&w=400&q=80' },
          { name: 'Botella de agua', description: 'Acero inoxidable 500ml', price: 14.99, stock: 30, sku: 'BW-008', image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=400&q=80' },
          { name: 'Mochila deportiva', description: 'Espaciosa, con compartimento para zapatillas', price: 49.99, stock: 12, sku: 'MD-009', image: 'https://images.unsplash.com/photo-1542444459-db44f5e3b9d6?auto=format&fit=crop&w=400&q=80' }
        ])
        console.log('Seeded example products')
      }
    } catch (pErr) {
      console.warn('Warning seeding products:', pErr.message || pErr)
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received: closing server');
  sequelize.close().then(() => process.exit(0));
});
