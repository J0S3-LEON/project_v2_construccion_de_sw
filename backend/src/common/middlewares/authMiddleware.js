import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import { User } from '../../modules/auth/auth.model.js';

export default async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Authorization header missing' });
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(payload.sub, {
      attributes: ['id', 'name', 'email']
    });
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
