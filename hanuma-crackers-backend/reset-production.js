const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Session = require('./models/Session');
const Coupon = require('./models/Coupon');

const MONGODB_URI = process.env.MONGODB_URI;

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Clear all existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Session.deleteMany({});
    await Coupon.deleteMany({});
    console.log('✅ All collections cleared');

    // 2. Create clean admin user
    console.log('👤 Creating admin user...');
    const adminPassword = 'Admin@123'; // Shop owner should change this
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const adminUser = new User({
      name: 'Shop Admin',
      email: 'admin@hanumacrackers.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+919876543210', // Shop owner should update
      isVerified: true,
      address: {
        street: 'Shop Address Line 1',
        city: 'Your City',
        state: 'Your State',
        pincode: '123456',
        country: 'India'
      }
    });
    await adminUser.save();
    console.log('✅ Admin user created');
    console.log(`📧 Admin Email: admin@hanumacrackers.com`);
    console.log(`🔑 Admin Password: ${adminPassword}`);

    // 3. Create professional product catalog
    console.log('📦 Creating product catalog...');
    const products = [
      {
        name: "Premium Flower Pots",
        description: "Beautiful flowerpot crackers that bloom into colorful displays. Perfect for celebrations and festivals.",
        price: 299,
        category: "Flower Pots",
        stock: 50,
        images: [{
          url: "https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Flower+Pots",
          alt: "Premium Flower Pots"
        }],
        featured: true,
        specifications: {
          duration: "30 seconds",
          colors: "Multi-color",
          noise_level: "Medium",
          safety_distance: "5 meters"
        }
      },
      {
        name: "Sparkler Pack (10 pieces)",
        description: "Premium quality sparklers perfect for birthday celebrations, weddings, and festive occasions.",
        price: 150,
        category: "Sparklers",
        stock: 100,
        images: [{
          url: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Sparklers",
          alt: "Sparkler Pack"
        }],
        featured: true,
        specifications: {
          duration: "60 seconds per piece",
          colors: "Golden sparks",
          noise_level: "Low",
          safety_distance: "2 meters"
        }
      },
      {
        name: "Chakra Special",
        description: "Traditional rotating firework that creates mesmerizing circular patterns of light and color.",
        price: 199,
        category: "Chakras",
        stock: 30,
        images: [{
          url: "https://via.placeholder.com/400x300/A8E6CF/FFFFFF?text=Chakra",
          alt: "Chakra Special"
        }],
        featured: true,
        specifications: {
          duration: "45 seconds",
          colors: "Red, Green, Blue",
          noise_level: "Medium",
          safety_distance: "4 meters"
        }
      },
      {
        name: "Rocket Launcher",
        description: "Spectacular rocket with shooting sparks and vibrant colors. Great for outdoor celebrations.",
        price: 349,
        category: "Rockets",
        stock: 25,
        images: [{
          url: "https://via.placeholder.com/400x300/FFD93D/FFFFFF?text=Rocket",
          alt: "Rocket Launcher"
        }],
        featured: false,
        specifications: {
          duration: "90 seconds",
          colors: "Multi-color with golden effects",
          noise_level: "High",
          safety_distance: "8 meters"
        }
      },
      {
        name: "Family Safety Pack",
        description: "Carefully curated collection of safe, low-noise crackers perfect for family celebrations with children.",
        price: 599,
        category: "Gift Boxes",
        stock: 20,
        images: [{
          url: "https://via.placeholder.com/400x300/FF8B94/FFFFFF?text=Family+Pack",
          alt: "Family Safety Pack"
        }],
        featured: true,
        specifications: {
          duration: "Various",
          colors: "Multi-color",
          noise_level: "Low to Medium",
          safety_distance: "3-5 meters"
        }
      },
      {
        name: "Ground Spinner",
        description: "Exciting ground-level firework that spins rapidly while emitting colorful sparks and lights.",
        price: 179,
        category: "Ground Spinners",
        stock: 40,
        images: [{
          url: "https://via.placeholder.com/400x300/C7CEEA/FFFFFF?text=Spinner",
          alt: "Ground Spinner"
        }],
        featured: false,
        specifications: {
          duration: "25 seconds",
          colors: "Red, Blue, Green",
          noise_level: "Medium",
          safety_distance: "3 meters"
        }
      }
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
    }
    console.log('✅ Products created successfully');

    // 4. Create professional coupon codes
    console.log('🎫 Creating coupon codes...');
    const coupons = [
      {
        code: 'WELCOME10',
        discountPercentage: 10,
        description: 'Welcome discount for new customers',
        isActive: true,
        usageLimit: 100,
        createdBy: adminUser._id,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      {
        code: 'FESTIVAL25',
        discountPercentage: 25,
        description: 'Special festival season discount',
        isActive: true,
        usageLimit: 50,
        createdBy: adminUser._id,
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days
      },
      {
        code: 'BULK15',
        discountPercentage: 15,
        description: 'Bulk purchase discount for orders above ₹1000',
        isActive: true,
        usageLimit: 200,
        createdBy: adminUser._id,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
      },
      {
        code: 'FIRSTORDER',
        discountPercentage: 20,
        description: 'Special discount for first-time buyers',
        isActive: true,
        usageLimit: 500,
        createdBy: adminUser._id,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      }
    ];

    for (const couponData of coupons) {
      const coupon = new Coupon(couponData);
      await coupon.save();
    }
    console.log('✅ Coupon codes created successfully');

    console.log('\n🎉 Database reset completed successfully!');
    console.log('\n📋 PRODUCTION SETUP SUMMARY:');
    console.log('════════════════════════════════════════');
    console.log(`👤 Admin Login:`);
    console.log(`   Email: admin@hanumacrackers.com`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`\n📦 Products: ${products.length} items created`);
    console.log(`🎫 Coupons: ${coupons.length} codes created`);
    console.log(`\n🔐 IMPORTANT: Change admin password after first login!`);
    console.log(`📧 IMPORTANT: Update admin email and contact details!`);
    console.log(`\n✅ Website is ready for production handover`);

  } catch (error) {
    console.error('❌ Error during database reset:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the reset
resetDatabase();