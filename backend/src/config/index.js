import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'sqlite:./dev.sqlite',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

export default config;
