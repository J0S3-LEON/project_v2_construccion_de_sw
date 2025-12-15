import * as productsService from './products.service.js';

export async function createProductController(req, res, next) {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

export async function listProductsController(req, res, next) {
  try {
    const { page, limit, q } = req.query;
    const result = await productsService.listProducts({ page: Number(page) || 1, limit: Number(limit) || 20, q });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProductController(req, res, next) {
  try {
    const product = await productsService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function updateProductController(req, res, next) {
  try {
    const product = await productsService.updateProduct(req.params.id, req.body);
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    await productsService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
