# 🚀 Production Deployment Guide

Complete production deployment guide for Hanuma Crackers E-commerce Backend API.

## 📋 Production Environment Variables

### Required Environment Variables
Set these environment variables in your production platform:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 🚂 Railway Deployment (Recommended)

### Prerequisites:
1. GitHub account with your code pushed
2. Railway account (free at railway.app)
3. MongoDB Atlas cluster set up
4. Cloudinary account configured

### Quick Deploy Steps:

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize:**
```bash
railway login
railway init
```

3. **Set Environment Variables:**
```bash
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your_atlas_uri"
railway variables set JWT_SECRET="your_jwt_secret"
railway variables set CLOUDINARY_CLOUD_NAME="your_cloud_name"
railway variables set CLOUDINARY_API_KEY="your_api_key"
railway variables set CLOUDINARY_API_SECRET="your_api_secret"
railway variables set CORS_ORIGIN="https://your-frontend-domain.com"
```

4. **Deploy:**
```bash
railway up
```

### Alternative: GitHub Integration
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables:**
   - In your Railway project dashboard
   - Go to "Variables" tab
   - Add all variables from your `.env.example`
   - **Important variables:**
     ```
     NODE_ENV=production
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-strong-secret-key
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     ```

4. **Deploy:**
   - Railway will automatically detect your Node.js app
   - It will run `npm install` and `npm start`
   - Wait for deployment to complete
   - Your API will be available at: `https://your-app-name.railway.app`

5. **Seed the database:**
   - In Railway dashboard, go to "Deployments"
   - Click on your latest deployment
   - Open "Command Line"
   - Run: `npm run seed`

## 🔧 Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created and configured
- [ ] Cloudinary account set up
- [ ] CORS origins updated for production
- [ ] JWT secret is strong and unique
- [ ] Admin credentials are secure
- [ ] Database seeded with initial data
- [ ] API endpoints tested

## 🌍 Environment-Specific Configurations

### Development (.env):
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hanuma-crackers
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Production (.env):
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...atlas.connection.string...
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🔒 Security for Production

1. **Strong Passwords:**
   ```bash
   # Generate strong JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Environment Variables:**
   - Never commit `.env` files
   - Use platform-specific variable management
   - Rotate secrets regularly

3. **CORS Configuration:**
   - Only allow your frontend domains
   - Remove `*` wildcards in production

4. **Rate Limiting:**
   - Adjust limits based on usage
   - Monitor for abuse

## 📊 Monitoring and Logs

### Railway:
- Built-in logs and metrics
- Set up alerts for downtime
- Monitor resource usage

### General Monitoring:
- Set up health check endpoints
- Monitor database connections
- Track API response times
- Log important events

## 🛠️ Post-Deployment Tasks

1. **Test API endpoints:**
```bash
curl https://your-api-url.railway.app/api/health
curl https://your-api-url.railway.app/api/products
```

2. **Update frontend configuration:**
```javascript
// In your React app
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-url.railway.app/api'
  : 'http://localhost:5000/api'
```

3. **Set up custom domain (optional):**
   - Configure DNS records
   - Update CORS settings
   - Update SSL certificates

## 🔄 CI/CD Setup (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run test  # if you have tests
    - name: Deploy to Railway
      uses: railway/cli@v2
      with:
        command: up
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 🚨 Common Issues

1. **Port Configuration:**
   - Railway auto-assigns PORT
   - Use `process.env.PORT || 5000`

2. **Database Connection:**
   - Check MongoDB Atlas network access
   - Verify connection string format

3. **CORS Errors:**
   - Update allowed origins
   - Check frontend URL

4. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json

## 📞 Support Resources

- Railway Documentation: https://docs.railway.app
- MongoDB Atlas Support: https://docs.atlas.mongodb.com
- Cloudinary Documentation: https://cloudinary.com/documentation
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

---

Your backend is ready for the cloud! 🌟