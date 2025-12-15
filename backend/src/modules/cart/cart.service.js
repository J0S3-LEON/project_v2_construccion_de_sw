import Cart from './cart.model.js';

export async function getCartByUserId(userId) {
  const record = await Cart.findOne({ where: { userId } });
  return record ? record.data : { items: [] };
}

export async function upsertCartForUser(userId, data) {
  const [record] = await Cart.findOrCreate({ where: { userId }, defaults: { data } });
  if (record) {
    record.data = data;
    await record.save();
    return record.data;
  }
  return data;
}
