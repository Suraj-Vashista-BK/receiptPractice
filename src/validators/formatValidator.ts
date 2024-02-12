import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from 'express-validation';
import Joi from 'joi';

// Joi schemas for input format validation.
const receiptSchema = Joi.object({
    retailer: Joi.string().pattern(/^[\w\s\-&]+$/).required(),
    purchaseDate: Joi.date().iso().required(),
    purchaseTime: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
    total: Joi.string().pattern(/^\d+\.\d{2}$/).required(),
    items: Joi.array().items(Joi.object({
        shortDescription: Joi.string().pattern(/^[\w\s\-&]+$/).required(),
        price: Joi.string().pattern(/^\d+\.\d{2}$/).required(),
    })).min(1).required(),
});

// First Layer of Middleware checks for input format
const validateReceiptMiddleware = validate({ body: receiptSchema }, {}, {});

export {validateReceiptMiddleware};
