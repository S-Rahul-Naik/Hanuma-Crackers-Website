// Test MongoDB Connection and Dashboard Query
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Order = require('./models/Order');

async function testDatabase() {
  try {
    console.log('🔍 Testing Database Connection and Dashboard Query');
    console.log('==================================================');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Find our test user
    console.log('\n👤 Finding test user...');
    const user = await User.findOne({ email: 'testuser@example.com' });
    if (user) {
      console.log('✅ Test user found:', user.name);
      console.log('🆔 User ID:', user._id);
      console.log('🔐 Role:', user.role);
      console.log('📝 Wishlist:', user.wishlist ? user.wishlist.length : 0, 'items');
    } else {
      console.log('❌ Test user not found');
      return;
    }

    // Test Order aggregation
    console.log('\n📊 Testing Order aggregation...');
    const userObjectId = new mongoose.Types.ObjectId(user._id);
    
    try {
      const orderStats = await Order.aggregate([
        { $match: { user: userObjectId } },
        {
          $group: {
            _id: null,
            totalOrders: { 
              $sum: { 
                $cond: [
                  { 
                    $not: { 
                      $in: ['$status', ['cancelled', 'refunded']] 
                    } 
                  }, 
                  1, 
                  0
                ] 
              }
            },
            totalSpent: { 
              $sum: { 
                $cond: [
                  { 
                    $and: [
                      { $eq: ['$paymentStatus', 'paid'] },
                      { $ne: ['$status', 'refunded'] }
                    ]
                  }, 
                  '$totalPrice', 
                  0
                ] 
              }
            },
            refundedAmount: { 
              $sum: { 
                $cond: [
                  { 
                    $and: [
                      { $eq: ['$status', 'refunded'] },
                      { $eq: ['$paymentStatus', 'paid'] }
                    ]
                  }, 
                  '$totalPrice', 
                  0
                ] 
              }
            }
          }
        }
      ]);

      console.log('✅ Order aggregation successful');
      console.log('📊 Stats:', JSON.stringify(orderStats, null, 2));

      // Test recent orders query
      const recentOrders = await Order.find({ user: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber createdAt status totalPrice items trackingNumber')
        .lean();

      console.log('✅ Recent orders query successful');
      console.log('📦 Recent orders count:', recentOrders.length);

      // Simulate dashboard data creation
      const stats = orderStats[0] || { totalOrders: 0, totalSpent: 0, refundedAmount: 0 };
      const orderCount = stats.totalOrders;
      const totalSpent = Math.max(0, stats.totalSpent - stats.refundedAmount);
      const wishlistCount = user.wishlist ? user.wishlist.length : 0;
      const loyaltyPoints = Math.floor(totalSpent / 10);

      const dashboardData = {
        orderCount,
        totalSpent,
        wishlistCount,
        loyaltyPoints,
        recentOrders: recentOrders.map(o => ({
          id: o.orderNumber || o._id.toString(),
          date: o.createdAt,
          items: Array.isArray(o.items) ? o.items.slice(0,2).map(i => i.name).join(', ') : 'Order',
          amount: o.totalPrice || 0,
          status: (o.status || 'processing').replace(/^(.)/, c => c.toUpperCase()),
          tracking: o.trackingNumber
        }))
      };

      console.log('\n✅ Dashboard data simulation successful:');
      console.log(JSON.stringify(dashboardData, null, 2));

    } catch (aggError) {
      console.log('❌ Aggregation error:', aggError.message);
      console.log('📄 Full error:', aggError);
    }

  } catch (error) {
    console.log('❌ Database test error:', error.message);
    console.log('📄 Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
}

testDatabase();