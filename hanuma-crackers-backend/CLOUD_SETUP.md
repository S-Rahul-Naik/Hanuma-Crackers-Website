# 🌩️ Cloud Services Setup Guide

This guide will help you set up MongoDB Atlas and Cloudinary for your Hanuma Crackers backend.

## 🍃 MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project called "Hanuma Crackers"

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (Free tier)
3. Select a region closest to you
4. Name your cluster (e.g., "hanuma-cluster")
5. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `hanuma_admin`
5. Generate a secure password (save it!)
6. Set permissions to "Atlas admin"
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP address
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `hanuma-crackers`

Your connection string should look like:
```
mongodb+srv://hanuma_admin:<password>@hanuma-cluster.xxxxx.mongodb.net/hanuma-crackers?retryWrites=true&w=majority
```

## 📸 Cloudinary Setup

### Step 1: Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

### Step 2: Get API Credentials
1. Go to your Dashboard
2. You'll see your credentials:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 3: Configure Upload Presets (Optional)
1. Go to Settings > Upload
2. Click "Add upload preset"
3. Set preset name: `hanuma_products`
4. Set folder: `hanuma-crackers`
5. Set transformation: Width/Height 800px, Quality Auto
6. Save

## ⚙️ Environment Configuration

Update your `.env` file with the following:

```env
# Environment Variables
NODE_ENV=development
PORT=5000

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://hanuma_admin:<password>@hanuma-cluster.xxxxx.mongodb.net/hanuma-crackers?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Admin Default Credentials
ADMIN_EMAIL=admin@hanuma.com
ADMIN_PASSWORD=admin123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# File Upload
MAX_FILE_SIZE=5000000

# API Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

## 🚀 Installation and Start

1. **Install new dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm run dev
```

3. **Seed the database:**
```bash
npm run seed
```

## 📡 New API Endpoints

### Image Upload Endpoints:

#### Upload Single Image
```http
POST /api/upload/single
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- image: [file]
```

#### Upload Multiple Images
```http
POST /api/upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- images: [file1, file2, file3, ...]
```

#### Delete Image
```http
DELETE /api/upload/:publicId
Authorization: Bearer <token>
```

## 🧪 Testing Image Upload

### Using Postman:
1. Set method to POST
2. URL: `http://localhost:5000/api/upload/single`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Body: form-data, key: `image`, value: select file
5. Send request

### Using curl:
```bash
curl -X POST \
  http://localhost:5000/api/upload/single \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'image=@/path/to/your/image.jpg'
```

## 🔧 Updated Product Schema

Products now support cloud-stored images:

```javascript
{
  "name": "Premium Sparklers",
  "description": "Beautiful sparklers for celebrations",
  "category": "Sparklers",
  "price": 150,
  "images": [
    {
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/hanuma-crackers/abc123.jpg",
      "publicId": "hanuma-crackers/abc123",
      "altText": "Premium Sparklers"
    }
  ]
}
```

## 🛡️ Security Features

- **File Type Validation**: Only image files allowed
- **File Size Limit**: 5MB maximum
- **Auto Optimization**: Images automatically optimized
- **Secure Storage**: Images stored securely in Cloudinary
- **CDN Delivery**: Fast global delivery via Cloudinary CDN

## 💰 Cost Considerations

### MongoDB Atlas (Free Tier):
- 512 MB storage
- Shared RAM
- No credit card required
- Upgrade when you need more

### Cloudinary (Free Tier):
- 25 GB storage
- 25 GB monthly bandwidth
- 10,000 images/videos
- Basic transformations

## 🚨 Production Considerations

1. **MongoDB Atlas:**
   - Upgrade to dedicated cluster for production
   - Set up database backups
   - Configure IP whitelist properly
   - Use strong passwords

2. **Cloudinary:**
   - Set up folder structure
   - Configure upload presets
   - Set up webhooks if needed
   - Monitor usage

3. **Environment Variables:**
   - Never commit `.env` to git
   - Use different credentials for dev/staging/prod
   - Rotate secrets regularly

## 🔍 Troubleshooting

### MongoDB Connection Issues:
- Check network access settings
- Verify username/password
- Ensure IP is whitelisted

### Cloudinary Upload Issues:
- Verify API credentials
- Check file size limits
- Ensure proper file types

### Common Errors:
- `MongoNetworkError`: Check internet connection and MongoDB Atlas settings
- `Invalid signature`: Check Cloudinary API secret
- `File too large`: Increase MAX_FILE_SIZE or optimize images

---

Your backend is now ready for cloud deployment! 🎉