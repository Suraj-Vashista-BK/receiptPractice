import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from 'express-validation';
import Joi from 'joi';

const receiptSchema = Joi.object({
    retailer: Joi.string()
                 .pattern(/^[\w\s\-&]+$/)
                 .required()
                 .messages({
                     'string.base': `retailer should be a type of 'string'`,
                     'string.empty': `retailer cannot be an empty field`,
                     'string.pattern.base': `retailer can only contain letters, numbers, spaces, hyphens, and ampersands`,
                     'any.required': `retailer is a required field`
                 }),
    purchaseDate: Joi.string()
                    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
                    .required()
                    .messages({
                        'string.pattern.base': `purchaseDate should be in fromat YYYY-MM-DD with valid values`,
                        'string.empty': `purchaseDate cannot be an empty field`,
                        'any.required': `purchaseDate is a required field`
                    }),
    purchaseTime: Joi.string()
                     .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
                     .required()
                     .messages({
                         'string.pattern.base': `purchaseTime should be in HH:MM format (24-hour clock)`,
                         'string.empty': `purchaseTime cannot be an empty field`,
                         'any.required': `purchaseTime is a required field`
                     }),
    total: Joi.string()
              .pattern(/^\d+\.\d{2}$/)
              .required()
              .messages({
                  'string.pattern.base': `total should be a decimal number with 2 decimal places`,
                  'string.empty': `total cannot be an empty field`,
                  'any.required': `total is a required field`
              }),
    items: Joi.array()
              .items(Joi.object({
                  shortDescription: Joi.string()
                                       .pattern(/^[\w\s\-&]+$/)
                                       .required()
                                       .messages({
                                           'string.pattern.base': `shortDescription can only contain letters, numbers, spaces, and hyphens`,
                                           'any.required': `shortDescription is a required field`,
                                           'string.empty': `shortDescription cannot be an empty field`,
                                       }),
                  price: Joi.string()
                            .pattern(/^\d+\.\d{2}$/)
                            .required()
                            .messages({
                                'string.pattern.base': `price should be a decimal number with 2 decimal places`,
                                'any.required': `price is a required field`,
                                'string.empty': `price cannot be an empty field`,
                            })
              }))
              .min(1)
              .required()
              .messages({
                  'array.base': `items should be an array`,
                  'array.min': `items should contain at least 1 item`,
                  'any.required': `items is a required field`
              }),
}).required();

// First Layer of Middleware checks for input format
const validateReceiptMiddleware = validate({ body: receiptSchema }, {}, {});

export {validateReceiptMiddleware};
