# 🚀 Production Deployment Guide - Hanuma Crackers

## 🔧 Render Backend Deployment

### 1. Environment Variables Setup

Add these environment variables in your Render dashboard:

```bash
# Core Configuration
NODE_ENV=production
PORT=5000

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://hanumacrackers_db_user:SIV1cILwZxvNrCry@hanuma.n4dzger.mongodb.net/hanuma-crackers?retryWrites=true&w=majority&appName=Hanuma

# JWT Secret - Production Strong Key
JWT_SECRET=hanuma-crackers-super-secure-jwt-secret-key-2024-production-version-32-chars-minimum
JWT_EXPIRE=3000d

# Admin Default Credentials
ADMIN_EMAIL=admin@hanuma.com
ADMIN_PASSWORD=HanumaCrackers@2024!

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dongekzob
CLOUDINARY_API_KEY=984123595296894
CLOUDINARY_API_SECRET=LxL83YzQeC9SyvVWAvFGf88ka8c

# File Upload
MAX_FILE_SIZE=5000000

# Email Configuration (Gmail SMTP)
EMAIL_USER=hanumacrackers@gmail.com
EMAIL_PASS=qpfbjojrdailoxzr
BUSINESS_EMAIL=hanumacrackers@gmail.com

# CORS Configuration - CRITICAL FOR AUTHENTICATION
CORS_ORIGINS=https://hanuma-crackers.netlify.app

# Rate Limiting (Optional - uncomment for production)
# RATE_LIMIT_MAX=1000
# RATE_LIMIT_WINDOW=900000
```

### 2. Render Service Configuration

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: `Node`
- **Auto-Deploy**: `Yes`

## 🌐 Netlify Frontend Deployment

### 1. Environment Variables Setup

Add in Netlify dashboard under Site Settings → Environment Variables:

```bash
# Backend API URL - Your Render Service URL
REACT_APP_API_URL=https://hanuma-crackers.onrender.com
```

### 2. Build Configuration

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: `18.x`

### 3. Netlify Redirects

Create `public/_redirects` file:

```
/* /index.html 200
```

## 🔐 Authentication Configuration

### Critical Changes Made for Production:

1. **Session-Based Authentication**: 
   - Replaced localStorage JWT with HTTP-only cookies
   - Sessions stored in MongoDB with automatic cleanup
   - Enhanced security against XSS attacks

2. **Cross-Origin Cookie Configuration**:
   - `credentials: 'include'` on all frontend requests
   - `SameSite: 'None'` for cross-domain cookies
   - `Secure: true` for HTTPS-only cookies

3. **CORS Setup**:
   - Allows credentials from Netlify domain
   - Proper preflight handling for cross-origin requests

## 🧪 Testing Authentication

### 1. Test Login Flow:
```bash
# Frontend: https://hanuma-crackers.netlify.app/signin
# Backend: https://hanuma-crackers.onrender.com/api/auth/login
```

### 2. Demo Credentials:
- **Admin**: admin@hanuma.com / HanumaCrackers@2024!
- **User**: Register new account via signup

### 3. Expected Behavior:
- No tokens in localStorage
- Session cookies set automatically
- Admin dashboard accessible after login
- Automatic logout after session expiry

## 🚨 Common Issues & Solutions

### Issue 1: 401 Unauthorized Errors
**Cause**: Missing CORS_ORIGINS environment variable
**Solution**: Set `CORS_ORIGINS=https://hanuma-crackers.netlify.app` in Render

### Issue 2: Cookies Not Set
**Cause**: Incorrect domain configuration
**Solution**: Ensure HTTPS on both domains and proper SameSite settings

### Issue 3: MongoDB Connection Error
**Cause**: Missing MONGODB_URI or network issues
**Solution**: Verify MongoDB Atlas whitelist includes Render's IPs (0.0.0.0/0)

### Issue 4: Build Failures
**Cause**: Missing environment variables during build
**Solution**: Set REACT_APP_API_URL before deployment

## 📊 Monitoring & Logs

### Render Logs:
- Check for "MongoDB Connected" message
- Verify CORS origins are loaded correctly
- Monitor authentication endpoint responses

### Netlify Logs:
- Check build process for environment variable loading
- Verify API URL is correctly set during build

## 🔄 Deployment Steps

### Backend (Render):
1. Commit all authentication changes to main branch
2. Set all environment variables in Render dashboard
3. Trigger manual deploy
4. Verify health endpoint: `https://hanuma-crackers.onrender.com/api/health`

### Frontend (Netlify):
1. Set REACT_APP_API_URL environment variable
2. Trigger redeploy
3. Test authentication flow

## ✅ Verification Checklist

- [ ] All environment variables set in Render
- [ ] CORS_ORIGINS includes Netlify domain
- [ ] MongoDB connection successful
- [ ] Health endpoint returns 200
- [ ] Login creates session cookie
- [ ] Admin dashboard accessible
- [ ] Logout clears session
- [ ] Cross-origin requests work

## 🎯 Next Steps

After successful deployment:
1. Test all admin functions (products, orders, analytics)
2. Verify customer registration and login
3. Test checkout process with authentication
4. Monitor session performance and cleanup

---

**Security Note**: The new session-based authentication is production-ready and significantly more secure than the previous localStorage approach. Sessions are automatically cleaned up and provide better security against common web vulnerabilities.