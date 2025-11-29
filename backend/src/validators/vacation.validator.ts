import Joi from 'joi';

export const addVacationValidator = Joi.object({
    destination: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.base': 'Destination must be a string',
            'string.min': 'Destination must be at least 2 characters long',
            'string.max': 'Destination must not exceed 255 characters',
            'any.required': 'Destination is required'
        }),

    description: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
            'string.base': 'Description must be a string',
            'string.min': 'Description must be at least 10 characters long',
            'string.max': 'Description must not exceed 2000 characters',
            'any.required': 'Description is required'
        }),

    start_date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'Start date must be a valid date',
            'date.format': 'Start date must be in ISO format',
            'any.required': 'Start date is required'
        }),

    end_date: Joi.date()
        .iso()
        .min(Joi.ref('start_date'))
        .required()
        .messages({
            'date.base': 'End date must be a valid date',
            'date.format': 'End date must be in ISO format',
            'date.min': 'End date cannot be earlier than start date',
            'any.required': 'End date is required'
        }),

    price: Joi.number()
        .min(0)
        .max(10000)
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative',
            'number.max': 'Price cannot exceed 10,000',
            'any.required': 'Price is required'
        }),

    image_filename: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.base': 'Image filename must be a string',
            'string.max': 'Image filename must not exceed 255 characters'
        })
});

export const updateVacationValidator = Joi.object({
    destination: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.base': 'Destination must be a string',
            'string.min': 'Destination must be at least 2 characters long',
            'string.max': 'Destination must not exceed 255 characters',
            'any.required': 'Destination is required'
        }),

    description: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
            'string.base': 'Description must be a string',
            'string.min': 'Description must be at least 10 characters long',
            'string.max': 'Description must not exceed 2000 characters',
            'any.required': 'Description is required'
        }),

    start_date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'Start date must be a valid date',
            'date.format': 'Start date must be in ISO format',
            'any.required': 'Start date is required'
        }),

    end_date: Joi.date()
        .iso()
        .min(Joi.ref('start_date'))
        .required()
        .messages({
            'date.base': 'End date must be a valid date',
            'date.format': 'End date must be in ISO format',
            'date.min': 'End date cannot be earlier than start date',
            'any.required': 'End date is required'
        }),

    price: Joi.number()
        .min(0)
        .max(10000)
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative',
            'number.max': 'Price cannot exceed 10,000',
            'any.required': 'Price is required'
        }),

    image_filename: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.base': 'Image filename must be a string',
            'string.max': 'Image filename must not exceed 255 characters'
        })
});
