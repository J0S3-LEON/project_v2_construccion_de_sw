import { Product } from './products.model.js';
import { Op, fn, col, where } from 'sequelize';

export async function createProduct(payload) {
  const product = await Product.create(payload);
  return product;
}

export async function listProducts({ page = 1, limit = 20, q } = {}) {
  const offset = (page - 1) * limit;
  const whereClause = { active: true };
  if (q) {
    const like = `%${q.toLowerCase()}%`;
    whereClause[Op.or] = [
      where(fn('LOWER', col('name')), { [Op.like]: like }),
      where(fn('LOWER', col('description')), { [Op.like]: like }),
      where(fn('LOWER', col('sku')), { [Op.like]: like }),
    ];
  }
  const { rows, count } = await Product.findAndCountAll({ where: whereClause, limit, offset, order: [['createdAt', 'DESC']] });
  return { data: rows, meta: { count, page, limit } };
}

export async function getProductById(id) {
  return Product.findByPk(id);
}

export async function updateProduct(id, payload) {
  const product = await Product.findByPk(id);
  if (!product) throw { status: 404, message: 'Product not found' };
  await product.update(payload);
  return product;
}

export async function deleteProduct(id) {
  const product = await Product.findByPk(id);
  if (!product) throw { status: 404, message: 'Product not found' };
  await product.destroy();
  return;
}
