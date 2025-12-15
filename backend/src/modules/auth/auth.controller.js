import { registerService, loginService } from './auth.service.js';

export async function register(req, res, next) {
  try {
    const user = await registerService(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const token = await loginService(req.body);
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
