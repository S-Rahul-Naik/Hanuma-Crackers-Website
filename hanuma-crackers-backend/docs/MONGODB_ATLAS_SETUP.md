# 🍃 MongoDB Atlas Production Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account or log in
3. Create a new organization (e.g., "Hanuma Crackers")

## Step 2: Create Production Cluster
1. Click "Build a Database"
2. Choose deployment option:
   - **Shared (Free)**: M0 Sandbox (good for testing)
   - **Dedicated**: M10+ (recommended for production)
3. Choose cloud provider and region (close to your users)
4. Cluster Name: `hanuma-crackers-prod`

## Step 3: Configure Database Security
1. **Database Access**:
   - Create database user
   - Username: `hanuma-admin`
   - Password: Generate strong password
   - Built-in role: `Atlas admin` or `readWriteAnyDatabase`

2. **Network Access**:
   - Add IP addresses that should have access
   - For production: Add your server's IP address
   - For development: Add your current IP (0.0.0.0/0 for any IP - NOT recommended for production)

## Step 4: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 4.1 or later
4. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@hanuma-crackers-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 5: Update Environment Variables
Replace in your `.env.production`:
```env
MONGODB_URI=mongodb+srv://hanuma-admin:<password>@hanuma-crackers-prod.xxxxx.mongodb.net/hanuma-crackers-prod?retryWrites=true&w=majority&ssl=true
```

## Step 6: Database Schema Setup
After connecting, seed your database:
```bash
npm run seed:prod
```

## Step 7: Production Optimizations
1. **Enable Backup**: Go to Backup tab and enable continuous backup
2. **Performance Advisor**: Monitor and optimize queries
3. **Alerts**: Set up alerts for high CPU, memory usage
4. **Connection Limits**: Monitor concurrent connections

## Security Best Practices
- ✅ Use strong database passwords
- ✅ Whitelist only necessary IP addresses
- ✅ Enable database auditing
- ✅ Use separate databases for different environments
- ✅ Regularly rotate database credentials
- ✅ Enable MongoDB encryption at rest

## Monitoring
- Use MongoDB Atlas built-in monitoring
- Set up alerts for:
  - High CPU usage (>80%)
  - High memory usage (>80%)
  - Connection spikes
  - Slow queries (>100ms)

## Backup Strategy
- Automatic backups: Enabled by default
- Point-in-time recovery: Available with M10+
- Download backups: For additional security
- Test restore procedures regularly