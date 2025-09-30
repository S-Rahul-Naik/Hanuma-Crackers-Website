# ☁️ Cloudinary Production Setup Guide

## Step 1: Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for an account
3. Choose a plan:
   - **Free**: 25GB storage, 25GB monthly bandwidth
   - **Plus**: More storage and bandwidth for production

## Step 2: Get API Credentials
1. Go to Dashboard after signup
2. Find your **Account Details**:
   - Cloud Name: `your-cloud-name`
   - API Key: `123456789012345`
   - API Secret: `your-api-secret` (click eye icon to reveal)

## Step 3: Configure Upload Settings
1. Go to **Settings** > **Upload**
2. Configure upload presets:
   - Name: `hanuma-products`
   - Folder: `hanuma-crackers`
   - Access: `Resource type: Image`

## Step 4: Set Up Auto-Optimization
1. **Settings** > **Image and Video**
2. Enable auto-optimization:
   - Quality: `auto:good`
   - Format: `auto`
   - Progressive JPEG: `Enabled`

## Step 5: Configure Security
1. **Settings** > **Security**
2. Enable unsigned uploads for your preset
3. Set allowed formats: `jpg, jpeg, png, webp, gif`
4. Set maximum file size: `5MB`

## Step 6: Update Environment Variables
Replace in your `.env.production`:
```env
CLOUDINARY_CLOUD_NAME=your-production-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 7: Test Upload Functionality
```bash
# Test upload endpoint
curl -X POST http://localhost:5000/api/upload \
  -F "image=@test-image.jpg" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Production Configuration

### Image Optimization Settings
```javascript
// Already configured in config/cloudinary.js
transformation: [
  {
    width: 800,
    height: 800,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto'
  }
]
```

### Folder Structure
```
hanuma-crackers/
├── products/
│   ├── sparklers/
│   ├── rockets/
│   └── gift-boxes/
├── qr-codes/
├── receipts/
└── avatars/
```

## Security Best Practices
- ✅ Use signed uploads for sensitive content
- ✅ Set up upload restrictions
- ✅ Enable auto-moderation for user uploads
- ✅ Use transformation URLs for consistent sizing
- ✅ Implement hotlink protection
- ✅ Set up webhook notifications

## Performance Optimization
1. **CDN**: Cloudinary provides global CDN
2. **Auto-format**: Automatically serve best format (WebP, AVIF)
3. **Auto-quality**: Optimize quality vs file size
4. **Lazy loading**: Implement in frontend
5. **Responsive images**: Use dynamic URLs for different screen sizes

## Monitoring & Analytics
1. **Usage Dashboard**: Monitor bandwidth and storage
2. **Analytics**: Track image performance
3. **Alerts**: Set up usage alerts
4. **Reports**: Monthly usage reports

## Backup Strategy
1. **Auto-backup**: Cloudinary handles redundancy
2. **Export**: Use Admin API to export asset list
3. **Local backup**: Download critical images locally
4. **Version control**: Keep track of image versions