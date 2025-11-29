import Joi from 'joi';

export const registerValidator = Joi.object({
    first_name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.base': 'First name must be a string',
            'string.min': 'First name must be at least 2 characters long',
            'string.max': 'First name must not exceed 255 characters',
            'any.required': 'First name is required'
        }),

    last_name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.base': 'Last name must be a string',
            'string.min': 'Last name must be at least 2 characters long',
            'string.max': 'Last name must not exceed 255 characters',
            'any.required': 'Last name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(4)
        .max(255)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.min': 'Password must be at least 4 characters long',
            'string.max': 'Password must not exceed 255 characters',
            'any.required': 'Password is required'
        })
});

export const loginValidator = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(4)
        .max(255)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.min': 'Password must be at least 4 characters long',
            'string.max': 'Password must not exceed 255 characters',
            'any.required': 'Password is required'
        })
});
