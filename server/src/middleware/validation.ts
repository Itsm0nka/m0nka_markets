import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).default(1),
});

export const updateQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

export const addToFavoritesSchema = Joi.object({
  productId: Joi.string().required(),
});

export const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  req.body = value;
  next();
};
