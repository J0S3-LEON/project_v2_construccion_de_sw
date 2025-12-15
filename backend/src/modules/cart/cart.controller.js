import * as service from './cart.service.js';

export async function getCart(req, res, next) {
  try {
    const userId = req.user.id;
    const data = await service.getCartByUserId(userId);
    res.json({ cart: data });
  } catch (err) {
    next(err);
  }
}

export async function saveCart(req, res, next) {
  try {
    const userId = req.user.id;
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart.items)) {
      return res.status(400).json({ message: 'Invalid cart format' });
    }
    const data = await service.upsertCartForUser(userId, cart);
    res.json({ cart: data });
  } catch (err) {
    next(err);
  }
}
