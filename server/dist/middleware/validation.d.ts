import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const registerSchema: Joi.ObjectSchema<any>;
export declare const loginSchema: Joi.ObjectSchema<any>;
export declare const addToCartSchema: Joi.ObjectSchema<any>;
export declare const updateQuantitySchema: Joi.ObjectSchema<any>;
export declare const addToFavoritesSchema: Joi.ObjectSchema<any>;
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
