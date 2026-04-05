const Joi = require('joi');

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  };
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('viewer', 'analyst', 'admin').default('viewer')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateUser: Joi.object({
    username: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    role: Joi.string().valid('viewer', 'analyst', 'admin'),
    status: Joi.string().valid('active', 'inactive')
  })
};

// Financial record validation schemas
const recordSchemas = {
  create: Joi.object({
    amount: Joi.number().positive().required(),
    type: Joi.string().valid('income', 'expense').required(),
    category: Joi.string().valid('salary', 'investment', 'business', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'other').required(),
    date: Joi.date().iso(),
    description: Joi.string().max(500)
  }),

  update: Joi.object({
    amount: Joi.number().positive(),
    type: Joi.string().valid('income', 'expense'),
    category: Joi.string().valid('salary', 'investment', 'business', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'other'),
    date: Joi.date().iso(),
    description: Joi.string().max(500)
  }),

  query: Joi.object({
    type: Joi.string().valid('income', 'expense'),
    category: Joi.string(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('date', 'amount', 'createdAt').default('date'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

module.exports = {
  validate,
  userSchemas,
  recordSchemas
};