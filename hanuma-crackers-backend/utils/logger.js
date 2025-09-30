const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format with request ID for better tracking
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(), // Use JSON format for better parsing in production
  winston.format.printf(({ timestamp, level, message, stack, requestId, userId, ...meta }) => {
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message: stack || message,
      requestId,
      userId,
      ...meta
    };
    return JSON.stringify(logEntry);
  })
);

// Production-optimized logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'hanuma-crackers-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Separate error logs for critical issues
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
      tailable: true
    }),
    
    // All application logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
      tailable: true
    }),

    // Audit logs for security events
    new winston.transports.File({
      filename: path.join(logDir, 'audit.log'),
      level: 'warn',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, requestId, userId }) => {
        const reqInfo = requestId ? ` [${requestId}]` : '';
        const userInfo = userId ? ` [User: ${userId}]` : '';
        return `${timestamp} ${level}${reqInfo}${userInfo}: ${message}`;
      })
    )
  }));
}

// Create a stream object for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.info(message.trim(), { type: 'http' });
  }
};

// Enhanced logging methods
logger.logRefund = (action, orderId, userId, details = {}) => {
  logger.info(`Refund ${action}`, {
    type: 'refund',
    action,
    orderId,
    userId,
    ...details
  });
};

logger.logAuth = (action, userId, ip, userAgent = '') => {
  logger.warn(`Auth ${action}`, {
    type: 'auth',
    action,
    userId,
    ip,
    userAgent
  });
};

logger.logPerformance = (operation, duration, details = {}) => {
  logger.info(`Performance: ${operation} took ${duration}ms`, {
    type: 'performance',
    operation,
    duration,
    ...details
  });
};

logger.logError = (error, context = {}) => {
  logger.error(error.message, {
    type: 'error',
    stack: error.stack,
    ...context
  });
};

// Request ID middleware
logger.requestIdMiddleware = (req, res, next) => {
  req.id = require('crypto').randomBytes(16).toString('hex');
  req.logger = logger.child({ requestId: req.id });
  next();
};

module.exports = logger;