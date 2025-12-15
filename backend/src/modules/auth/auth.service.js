import { User } from './auth.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../../config/index.js';

export async function registerService({ name, email, password }) {
  if (!email || !password) throw { status: 400, message: 'Email and password required' };
  const existing = await User.findOne({ where: { email } });
  if (existing) throw { status: 409, message: 'Email already registered' };
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  return { id: user.id, name: user.name, email: user.email };
}

export async function loginService({ email, password }) {
  if (!email || !password) throw { status: 400, message: 'Email and password required' };
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid credentials' };
  const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  return token;
}
