import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().optional().allow(''),
  sku: Joi.string().optional().allow(null, ''),
  price: Joi.number().precision(2).min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  active: Joi.boolean().optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  description: Joi.string().optional().allow(null, ''),
  sku: Joi.string().optional().allow(null, ''),
  price: Joi.number().precision(2).min(0).optional(),
  stock: Joi.number().integer().min(0).optional(),
  active: Joi.boolean().optional(),
});
