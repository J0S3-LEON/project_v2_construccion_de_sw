import Joi from 'joi';

export const createSaleSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  items: Joi.array().items(
    Joi.object({ productId: Joi.string().uuid().required(), qty: Joi.number().integer().min(1).required() })
  ).min(1).required(),
  paymentMethod: Joi.string().optional().allow(null, '')
});
