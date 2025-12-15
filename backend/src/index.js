import app from './app.js';
import config from './config/index.js';
import { sequelize } from './db/index.js';

const PORT = process.env.PORT || config.port || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synced');

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
