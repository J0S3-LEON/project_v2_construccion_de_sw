import { Sequelize } from 'sequelize';
import config from '../config/index.js';

// Usamos SQLite por defecto para dev; DATABASE_URL en .env puede cambiarlo
export const sequelize = new Sequelize(config.databaseUrl, {
  logging: config.nodeEnv === 'development' ? console.log : false,
});

export default sequelize;
