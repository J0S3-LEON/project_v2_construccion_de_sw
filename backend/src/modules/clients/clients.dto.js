import Joi from 'joi';

export const createClientSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
});

export const updateClientSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  email: Joi.string().email().optional().allow(null),
  phone: Joi.string().optional().allow(null),
  address: Joi.string().optional().allow(null),
});
