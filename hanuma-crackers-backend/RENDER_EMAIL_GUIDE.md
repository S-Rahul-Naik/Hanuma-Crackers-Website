# 📧 Render Email Configuration Guide

## 🎯 Problem: Emails Not Delivered in Production

When your app works locally but emails don't send on Render, it's usually due to:

### 1. **Environment Variables Not Set**
Make sure these are configured in Render Dashboard:

```
EMAIL_USER=hanumacrackers@gmail.com
EMAIL_PASS=uupemepdpsexmjov
BUSINESS_EMAIL=hanumacrackers@gmail.com
NODE_ENV=production
```

### 2. **Gmail Security Issues**
- Enable 2-Factor Authentication on Gmail
- Generate App-specific password
- Use the App Password (not your regular Gmail password)

## 🔧 Quick Fix Steps

### Step 1: Verify Environment Variables
1. Go to Render Dashboard → Your Service → Environment
2. Add/verify these variables:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail App Password (16 characters)
   - `NODE_ENV`: production

### Step 2: Test Email Service
1. Deploy the updated code with enhanced logging
2. Check Render logs for email errors
3. Run the debug script manually on Render

### Step 3: Alternative Solution - SendGrid
If Gmail continues to fail, use SendGrid (more reliable for production):

```bash
npm install @sendgrid/mail
```

Add to environment variables:
```
SENDGRID_API_KEY=your_sendgrid_api_key
```

## 🔍 Debug Commands for Render

### Check Logs:
```bash
# In Render shell
node debug-production-email.js
```

### Manual Email Test:
```bash
# Test contact form
curl -X POST https://your-render-url.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "phone": "1234567890",
    "subject": "test",
    "message": "Testing email from production"
  }'
```

## 🚀 SendGrid Integration (Recommended)

### 1. Install SendGrid:
```bash
npm install @sendgrid/mail
```

### 2. Update emailService.js:
```javascript
// Add at top
const sgMail = require('@sendgrid/mail');

// In production mode
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
```

### 3. Alternative send method:
```javascript
if (process.env.SENDGRID_API_KEY) {
  // Use SendGrid
  await sgMail.send(mailOptions);
} else {
  // Use Gmail SMTP
  await this.transporter.sendMail(mailOptions);
}
```

## 📊 Common Error Solutions

### Error: "Invalid login"
- Check Gmail App Password
- Verify 2FA is enabled
- Regenerate App Password

### Error: "Connection timeout"
- Use SMTP settings instead of service
- Increase timeout values
- Check Render firewall settings

### Error: "ENOTFOUND smtp.gmail.com"
- DNS issues on Render
- Try different SMTP server
- Use SendGrid instead

## ✅ Quick Test

Run this on your local machine to verify the production config works:

```bash
NODE_ENV=production node debug-production-email.js
```

If it works locally but not on Render:
1. Environment variables issue
2. Render network restrictions
3. Gmail blocking Render IPs

**Recommendation:** Switch to SendGrid for production email delivery.