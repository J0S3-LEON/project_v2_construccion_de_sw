import * as salesService from './sales.service.js';

export async function statsController(req, res, next) {
  try {
    const stats = await salesService.getSalesStats();
    res.json(stats);
  } catch (err) { next(err) }
}

export async function createSaleController(req, res, next) {
  try {
    const sale = await salesService.createSale(req.body);
    res.status(201).json({ sale });
  } catch (err) {
    next(err);
  }
}

export async function listSalesController(req, res, next) {
  try {
    const { page, limit, clientId } = req.query;
    const result = await salesService.listSales({ page: Number(page) || 1, limit: Number(limit) || 20, clientId });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSaleController(req, res, next) {
  try {
    const sale = await salesService.getSaleById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json({ sale });
  } catch (err) {
    next(err);
  }
}
