const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Validate required environment variables early
const requiredEnv = ['JWT_SECRET', 'JWT_EXPIRE', 'MONGODB_URI'];
const missingEnv = requiredEnv.filter((k) => !process.env[k]);
if (missingEnv.length) {
  // eslint-disable-next-line no-console
  console.error(`\n[CONFIG ERROR] Missing required environment variables: ${missingEnv.join(', ')}\n`);
  process.exit(1);
}

// Database connection
const connectDB = require('./config/database');

// Route files
const auth = require('./routes/auth');
const products = require('./routes/products');
const orders = require('./routes/orders');
const users = require('./routes/users');
const upload = require('./routes/upload');
const dashboard = require('./routes/dashboard');
const admin = require('./routes/admin');
const coupon = require('./routes/coupon');
const contact = require('./routes/contact');
const wishlist = require('./routes/wishlist');
const testRoutes = require('./routes/test');

// Middleware
const { errorHandler, notFound } = require('./middleware/error');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://readdy.ai", "https://via.placeholder.com"],
    },
  },
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['sort', 'fields', 'page', 'limit', 'category', 'price']
}));

// RATE LIMITING PERMANENTLY DISABLED - NO LIMITS ON REQUESTS
console.log('⚠️  Rate limiting is PERMANENTLY DISABLED - Unlimited requests allowed');

// CORS with production configuration
const corsOriginsEnv = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()) : [];
const devOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [...corsOriginsEnv, 'https://hanuma-crackers.netlify.app']
  : [...devOrigins, ...corsOriginsEnv];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Pragma']
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser (needed before any middleware accessing req.cookies)
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hanuma Crackers API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', auth); // Rate limiting removed permanently
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/users', users);
app.use('/api/upload', upload);
app.use('/api/dashboard', dashboard);
app.use('/api/admin', admin);
app.use('/api/coupons', coupon);
app.use('/api/contact', contact);
app.use('/api/wishlist', wishlist);
app.use('/api/test', testRoutes); // Test routes for email functionality

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Hanuma Crackers API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╭─────────────────────────────────────────────────╮
  │                                                 │
  │   🎆 Hanuma Crackers API Server Running 🎆     │
  │                                                 │
  │   Port: ${PORT}                                    │
  │   Environment: ${process.env.NODE_ENV || 'development'}                     │
  │   Database: Connected                           │
  │                                                 │
  ╰─────────────────────────────────────────────────╯
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;