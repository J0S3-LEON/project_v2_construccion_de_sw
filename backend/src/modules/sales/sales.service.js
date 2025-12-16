import { Sale, SaleItem } from './sales.model.js';
import { Product } from '../products/products.model.js';
import { sequelize } from '../../db/index.js';

export async function createSale({ clientId, items, paymentMethod }) {
  // Transaction: validar stock, decrementar, crear sale y sale items en una transacción
  return sequelize.transaction(async (trx) => {
    // load products and validate stock
    const productIds = items.map(i => i.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction: trx });
    const productMap = new Map(products.map(p => [p.id, p]));

    // Validate all exist and stock
    for (const it of items) {
      const prod = productMap.get(it.productId);
      if (!prod) throw { status: 400, message: `Product ${it.productId} not found` };
      if (prod.stock < it.qty) throw { status: 400, message: `Insufficient stock for product ${prod.name}` };
    }

    // Calculate total
    let total = 0;
    for (const it of items) {
      const prod = productMap.get(it.productId);
      total += Number(prod.price) * it.qty;
    }

    // Create sale
    const sale = await Sale.create({ clientId, total, paymentMethod }, { transaction: trx });

    // Create sale items and decrement stock
    for (const it of items) {
      const prod = productMap.get(it.productId);
      await SaleItem.create({ saleId: sale.id, productId: prod.id, qty: it.qty, price: prod.price }, { transaction: trx });
      // decrement stock
      await prod.decrement('stock', { by: it.qty, transaction: trx });
    }

    const saleWithItems = await Sale.findByPk(sale.id, { include: [{ model: SaleItem, as: 'items', include: [{ model: Product, as: 'product' }] }], transaction: trx });
    return saleWithItems;
  });
}

export async function listSales({ page = 1, limit = 20, clientId } = {}) {
  const offset = (page - 1) * limit;
  const where = {};
  if (clientId) where.clientId = clientId;
  const { rows, count } = await Sale.findAndCountAll({ where, limit, offset, order: [['createdAt', 'DESC']], include: [{ model: SaleItem, as: 'items', include: [{ model: Product, as: 'product' }] }] });
  return { data: rows, meta: { count, page, limit } };
}

export async function getSaleById(id) {
  return Sale.findByPk(id, { include: [{ model: SaleItem, as: 'items' }] });
}

export async function getSalesStats() {
  // Return total count and sum of total (handled by DB)
  const result = await Sale.findAll({ attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'totalVentas'], [sequelize.fn('SUM', sequelize.col('total')), 'ingresosTotales']] });
  const row = result && result[0] ? result[0].dataValues : { totalVentas: 0, ingresosTotales: 0 };
  return { totalVentas: Number(row.totalVentas || 0), ingresosTotales: Number(row.ingresosTotales || 0) };
}
