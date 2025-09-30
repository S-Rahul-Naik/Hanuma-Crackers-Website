# 🎆 Hanuma Crackers Backend API

A comprehensive Node.js/Express backend for the Hanuma Crackers e-commerce platform featuring authentication, product management, order processing, and admin dashboard APIs.

## 🚀 Features

### Core Features
- **Authentication System** - JWT-based auth with role management
- **Product Management** - CRUD operations, search, filtering, categories
- **Order Management** - Order creation, tracking, status updates
- **User Management** - Customer profiles, admin controls
- **Admin Dashboard** - Analytics, statistics, comprehensive management

### Security Features
- JWT Authentication & Authorization
- Password hashing with bcrypt
- Rate limiting
- Input validation & sanitization
- CORS protection
- Security headers with Helmet

### API Features
- RESTful API design
- Comprehensive error handling
- Request validation
- Pagination support
- Search and filtering
- File upload support

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Password**: bcryptjs
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install
```bash
cd hanuma-crackers-backend
npm install
```

### 2. Environment Setup
Copy the `.env` file and update the variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hanuma-crackers
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@hanuma.com
ADMIN_PASSWORD=admin123
```

### 3. Database Setup
Make sure MongoDB is running, then seed the database:
```bash
npm run seed
```

### 4. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Private |
| GET | `/me` | Get current user | Private |
| PUT | `/updatedetails` | Update user details | Private |
| PUT | `/updatepassword` | Update password | Private |

### Product Routes (`/api/products`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all products | Public |
| GET | `/featured` | Get featured products | Public |
| GET | `/search` | Search products | Public |
| GET | `/category/:category` | Get products by category | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

### Order Routes (`/api/orders`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/` | Create new order | Private |
| GET | `/myorders` | Get user's orders | Private |
| GET | `/:id` | Get order by ID | Private |
| PUT | `/:id/cancel` | Cancel order | Private |
| GET | `/` | Get all orders | Admin |
| PUT | `/:id/status` | Update order status | Admin |
| GET | `/stats` | Get order statistics | Admin |

### User Management Routes (`/api/users`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all users | Admin |
| POST | `/` | Create user | Admin |
| GET | `/stats` | Get user statistics | Admin |
| GET | `/:id` | Get single user | Admin |
| PUT | `/:id` | Update user | Admin |
| DELETE | `/:id` | Delete user | Admin |
| PUT | `/:id/toggle-status` | Toggle user status | Admin |
| GET | `/:id/orders` | Get user's orders | Admin |

## 🔧 API Usage Examples

### Authentication
```javascript
// Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 98765 43210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Product Management
```javascript
// Create Product (Admin only)
POST /api/products
{
  "name": "Premium Sparklers",
  "description": "Beautiful sparklers for celebrations",
  "category": "Sparklers",
  "price": 150,
  "discountPrice": 120,
  "stock": 50,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "altText": "Premium Sparklers"
    }
  ]
}

// Search Products
GET /api/products/search?q=sparklers&category=Sparklers&minPrice=50&maxPrice=200
```

### Order Management
```javascript
// Create Order
POST /api/orders
{
  "items": [
    {
      "product": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Premium Sparklers",
      "price": 120,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+91 98765 43210",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cash_on_delivery",
  "itemsPrice": 240,
  "taxPrice": 24,
  "shippingPrice": 50,
  "totalPrice": 314
}
```

## 🗂️ Database Models

### User Model
- Personal information (name, email, phone, address)
- Authentication (password, JWT tokens)
- Role-based access (user, admin)
- Shopping statistics (total orders, amount spent, tier)
- Account status and wishlist

### Product Model
- Basic info (name, description, category, price)
- Inventory (stock, sales tracking)
- Media (images with alt text)
- Specifications (weight, dimensions, effects)
- Reviews and ratings
- Feature flags (active, featured)

### Order Model
- Order details (number, items, pricing)
- Customer info (shipping address, contact)
- Payment details (method, status, transaction info)
- Order status and tracking
- Status history and timeline

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request handling
- **Security Headers**: Helmet.js for security headers

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hanuma-crackers
JWT_SECRET=super-secure-secret-key-for-production
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "hanuma-api"
pm2 startup
pm2 save
```

## 🧪 Development

### Available Scripts
```bash
npm run dev     # Start with nodemon
npm start       # Start production server
npm run seed    # Seed database with sample data
```

### Database Seeding
The seed script creates:
- 1 Admin user (admin@hanuma.com / admin123)
- 3 Sample customers
- 6 Sample products across different categories
- 2 Sample orders

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "pagination": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🤝 Integration with Frontend

The API is designed to work seamlessly with the React frontend. Key integration points:

- **Authentication**: JWT tokens in headers or cookies
- **Product Catalog**: Supports all frontend product display needs
- **Shopping Cart**: Order creation and management
- **Admin Dashboard**: Comprehensive management APIs
- **User Dashboard**: Profile and order history

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**🎆 Happy Celebrations with Hanuma Crackers! 🎆**