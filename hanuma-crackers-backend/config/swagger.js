const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hanuma Crackers API',
      version: '1.0.0',
      description: 'A comprehensive e-commerce API for Hanuma Crackers - Premium Diwali Fireworks & Crackers',
      contact: {
        name: 'Hanuma Crackers Team',
        email: 'api@hanuma.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://hanuma-api.railway.app' 
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
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
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            isActive: { type: 'boolean' },
            totalOrders: { type: 'number' },
            totalSpent: { type: 'number' },
            tier: { type: 'string', enum: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { 
              type: 'string',
              enum: ['Flower Pots', 'Rockets', 'Ground Spinners', 'Sparklers', 'Bombs', 'Chakras', 'Multi-shots', 'Gift Boxes', 'Eco-friendly', 'Safety Items']
            },
            price: { type: 'number' },
            discountPrice: { type: 'number' },
            stock: { type: 'number' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  publicId: { type: 'string' },
                  altText: { type: 'string' }
                }
              }
            },
            isActive: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
            averageRating: { type: 'number' },
            numReviews: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            orderNumber: { type: 'string' },
            user: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'number' },
                  image: { type: 'string' }
                }
              }
            },
            totalPrice: { type: 'number' },
            status: { 
              type: 'string',
              enum: ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled']
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'paid', 'failed', 'refunded']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJSDoc(options);

module.exports = { specs, swaggerUi };