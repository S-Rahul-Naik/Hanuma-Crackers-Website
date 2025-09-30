# 📊 Production Monitoring & Logging Setup Guide

## 1. Application Monitoring Stack

### Winston Logging (Already Configured)
- **Error Logs**: `logs/error.log` - Critical application errors
- **Combined Logs**: `logs/combined.log` - All application events
- **Audit Logs**: `logs/audit.log` - Security and authentication events
- **Performance Logs**: Track API response times

### Log Analysis Tools

#### Option A: ELK Stack (Elasticsearch, Logstash, Kibana)
```bash
# Docker Compose for ELK Stack
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    ports:
      - "5601:5601"
```

#### Option B: Cloud Logging Services
- **DataDog**: Enterprise monitoring with APM
- **New Relic**: Application performance monitoring  
- **LogDNA/Mezmo**: Specialized log analysis
- **AWS CloudWatch**: If hosting on AWS
- **Google Cloud Logging**: If hosting on GCP

## 2. Health Check Monitoring

### Create Health Check Endpoint
```javascript
// Add to server.js
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Database connection check
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Memory usage
    const memoryUsage = process.memoryUsage();
    
    // Uptime
    const uptime = process.uptime();
    
    const responseTime = Date.now() - startTime;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptime: `${Math.floor(uptime / 60)} minutes`,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB'
      },
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

## 3. Performance Monitoring

### API Response Time Tracking
```javascript
// Add performance monitoring middleware
const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logger = require('./utils/logger');
    
    logger.logPerformance(`${req.method} ${req.path}`, duration, {
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    // Alert on slow requests (>2 seconds)
    if (duration > 2000) {
      logger.warn(`Slow request detected: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
};

// Apply to all routes
app.use(performanceMiddleware);
```

## 4. Error Tracking & Alerting

### Sentry Integration (Recommended)
```bash
npm install @sentry/node @sentry/tracing
```

```javascript
// Add to server.js
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      new Tracing.Integrations.Mongo()
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Add Sentry error handler before other error handlers
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}
```

## 5. Database Monitoring

### MongoDB Performance Monitoring
```javascript
// Add MongoDB connection monitoring
const mongoose = require('mongoose');
const logger = require('./utils/logger');

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Monitor slow queries (MongoDB Atlas has built-in profiling)
mongoose.set('debug', (collectionName, method, query, doc) => {
  const start = Date.now();
  logger.logPerformance(`MongoDB ${method} on ${collectionName}`, Date.now() - start);
});
```

## 6. System Resource Monitoring

### Server Resource Monitoring
```javascript
const os = require('os');

// System stats endpoint
app.get('/api/system-stats', (req, res) => {
  const stats = {
    cpu: {
      usage: process.cpuUsage(),
      loadAverage: os.loadavg()
    },
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      process: process.memoryUsage()
    },
    uptime: {
      system: os.uptime(),
      process: process.uptime()
    },
    platform: os.platform(),
    arch: os.arch()
  };
  
  res.json(stats);
});
```

## 7. Alert Configuration

### Critical Alerts Setup
```javascript
// Alert thresholds
const ALERT_THRESHOLDS = {
  ERROR_RATE: 10, // errors per minute
  RESPONSE_TIME: 2000, // milliseconds
  MEMORY_USAGE: 85, // percentage
  DISK_USAGE: 90, // percentage
  DATABASE_CONNECTIONS: 80 // percentage of max
};

// Alert manager
class AlertManager {
  constructor() {
    this.errorCount = 0;
    this.lastErrorReset = Date.now();
  }

  checkErrorRate() {
    const now = Date.now();
    if (now - this.lastErrorReset > 60000) { // 1 minute
      if (this.errorCount > ALERT_THRESHOLDS.ERROR_RATE) {
        this.sendAlert('HIGH_ERROR_RATE', `${this.errorCount} errors in the last minute`);
      }
      this.errorCount = 0;
      this.lastErrorReset = now;
    }
  }

  sendAlert(type, message) {
    const logger = require('./utils/logger');
    logger.error(`ALERT [${type}]: ${message}`);
    
    // Send to monitoring service
    if (process.env.SLACK_WEBHOOK_URL) {
      // Send to Slack
      this.sendSlackAlert(type, message);
    }
    
    if (process.env.EMAIL_ALERT_ENDPOINT) {
      // Send email alert
      this.sendEmailAlert(type, message);
    }
  }
}

const alertManager = new AlertManager();
```

## 8. Uptime Monitoring

### External Uptime Monitoring Services
- **Uptime Robot**: Free tier available
- **Pingdom**: Comprehensive monitoring
- **StatusCake**: Free and paid tiers
- **New Relic Synthetics**: Advanced monitoring

### Configuration Example (Uptime Robot):
```
Monitor Type: HTTP(s)
URL: https://yourdomain.com/api/health
Alert Contacts: your-email@domain.com
Check Interval: 5 minutes
```

## 9. Log Retention Policy

### Production Log Management
```javascript
// Log rotation configuration (in logger.js)
const DailyRotateFile = require('winston-daily-rotate-file');

const transport = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d' // Keep logs for 14 days
});

logger.add(transport);
```

## 10. Security Monitoring

### Security Event Logging
```javascript
// Add to authentication middleware
const securityLogger = (event, req, additionalInfo = {}) => {
  const logger = require('./utils/logger');
  
  logger.logAuth(event, req.user?.id || 'anonymous', req.ip, req.get('User-Agent'));
  
  // Log suspicious activities
  if (event.includes('FAILED') || event.includes('BLOCKED')) {
    logger.warn(`Security Event: ${event}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      ...additionalInfo
    });
  }
};

// Usage in auth middleware
if (!user) {
  securityLogger('LOGIN_FAILED', req, { email: req.body.email });
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
}
```

## 11. Deployment Monitoring

### PM2 Monitoring (if using PM2)
```bash
# Install PM2 monitoring
npm install -g @pm2/io

# Configure monitoring
pm2 install pm2-server-monit
pm2 set pm2-server-monit:password YOUR_PASSWORD
```

### Docker Health Checks
```dockerfile
# Add to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1
```

## 12. Monitoring Dashboard Setup

### Custom Dashboard with Express
```javascript
// Create monitoring dashboard route
app.get('/admin/monitoring', protect, authorize('admin'), (req, res) => {
  // Return monitoring data
  const stats = {
    server: getServerStats(),
    database: getDatabaseStats(),
    errors: getErrorStats(),
    performance: getPerformanceStats()
  };
  
  res.json(stats);
});
```

## Best Practices Summary

### ✅ Production Monitoring Checklist:
- [ ] Application logging configured
- [ ] Error tracking setup (Sentry/similar)
- [ ] Health check endpoints created
- [ ] Performance monitoring active
- [ ] Database monitoring configured
- [ ] Alert thresholds defined
- [ ] Uptime monitoring setup
- [ ] Log retention policy implemented
- [ ] Security event logging active
- [ ] Monitoring dashboard accessible