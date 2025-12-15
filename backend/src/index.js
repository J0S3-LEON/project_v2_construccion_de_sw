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
