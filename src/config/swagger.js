const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'Backend API for Finance Dashboard with user management, financial records, and analytics',
      contact: {
        name: 'Sunkara Srinivas',
        email: 'srinivaschowdary1203@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'] },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['income', 'expense'] },
            category: { type: 'string', enum: ['salary', 'investment', 'business', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'other'] },
            date: { type: 'string', format: 'date' },
            description: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [path.resolve(__dirname, '../routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;