require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const verifyProduction = async () => {
  try {
    console.log('🔍 Verifying production database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check admin user
    const adminUser = await User.findOne({ email: 'admin@hanumacrackers.com' });
    console.log('\n👤 Admin User:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Name: ${adminUser.name}`);

    // Check products
    const products = await Product.find();
    console.log('\n📦 Products:');
    console.log(`   Total: ${products.length} items`);
    products.forEach(product => {
      console.log(`   - ${product.name} (${product.category}) - ₹${product.price}`);
    });

    // Check coupons
    const coupons = await Coupon.find().populate('createdBy', 'name email');
    console.log('\n🎫 Coupons:');
    console.log(`   Total: ${coupons.length} codes`);
    coupons.forEach(coupon => {
      console.log(`   - ${coupon.code} (${coupon.discountPercentage}% off) - Created by: ${coupon.createdBy.name}`);
    });

    // Check collections count
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const couponCount = await Coupon.countDocuments();
    
    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Coupons: ${couponCount}`);
    
    console.log('\n✅ Production verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

verifyProduction();