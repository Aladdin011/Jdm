import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Contact form validation schema
const contactFormSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be less than 100 characters',
      'any.required': 'Name is required',
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  
  subject: Joi.string()
    .min(5)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Subject must be at least 5 characters long',
      'string.max': 'Subject must be less than 200 characters',
    }),
  
  message: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message must be less than 2000 characters',
      'any.required': 'Message is required',
    }),
  
  projectType: Joi.string()
    .valid('residential', 'commercial', 'infrastructure', 'smart-city', 'other')
    .optional()
    .allow('')
    .messages({
      'any.only': 'Please select a valid project type',
    }),
  
  budget: Joi.string()
    .valid('under-100k', '100k-500k', '500k-1m', '1m-5m', '5m-plus', 'not-specified')
    .optional()
    .allow('')
    .messages({
      'any.only': 'Please select a valid budget range',
    }),
});

// Middleware to validate contact form
export const validateContactForm = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = contactFormSchema.validate(req.body, {
    abortEarly: false, // Return all validation errors
    stripUnknown: true, // Remove unknown fields
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validationErrors,
    });
  }

  // Replace request body with validated and sanitized data
  req.body = value;
  next();
};

// Generic validation middleware generator
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    req.body = value;
    next();
  };
};
