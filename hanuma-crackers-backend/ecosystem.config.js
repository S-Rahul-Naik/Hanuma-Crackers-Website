module.exports = {
  apps: [{
    name: 'hanuma-api',
    script: './server.js',
    instances: 'max', // Use all available CPUs
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 5000
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced PM2 features
    max_memory_restart: '500M',
    min_uptime: '10s',
    max_restarts: 5,
    
    // Graceful shutdown
    kill_timeout: 5000,
    
    // Watch and restart on file changes (development only)
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    
    // Auto restart on crash
    autorestart: true,
    
    // Cron restart (optional)
    // cron_restart: '0 2 * * *', // Restart daily at 2 AM
    
    // Environment variables from file
    env_file: '.env'
  }]
};