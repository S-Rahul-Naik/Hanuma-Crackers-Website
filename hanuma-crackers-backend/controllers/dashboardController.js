const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Simple in-memory cache (per instance) to reduce aggregation cost
const CACHE = new Map();
const TTL_MS = 60 * 1000; // 1 minute

function getCache(key) {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    CACHE.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  CACHE.set(key, { data, timestamp: Date.now() });
}

exports.getDashboardOverview = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    
    // Check if user is admin
    if (req.user.role === 'admin') {
      return getAdminDashboard(req, res, next);
    }
    
    // Regular user dashboard
    const cacheKey = `overview:${userId}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }

    // Get user basic aggregates
    const user = await User.findById(userId).select('wishlist totalSpent totalOrders');

    // Orders aggregate - only count PAID orders for total spent
    // Total orders count = all orders except cancelled/refunded
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Count all orders (except cancelled/refunded)
    const orderCount = await Order.countDocuments({ 
      user: userObjectId, 
      status: { $nin: ['cancelled', 'refunded'] } 
    });

    // Calculate total spent - only from PAID orders, minus any refunded amounts
    const spentAgg = await Order.aggregate([
      { 
        $match: { 
          user: userObjectId, 
          paymentStatus: 'paid',
          status: { $ne: 'refunded' }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Subtract refunded amounts
    const refundAgg = await Order.aggregate([
      { 
        $match: { 
          user: userObjectId, 
          status: 'refunded',
          paymentStatus: 'paid' // Only subtract if was actually paid
        } 
      },
      { $group: { _id: null, refunded: { $sum: '$totalPrice' } } }
    ]);

    const paidTotal = spentAgg.length ? spentAgg[0].total : 0;
    const refundedTotal = refundAgg.length ? refundAgg[0].refunded : 0;
    const totalSpent = Math.max(0, paidTotal - refundedTotal); // Ensure non-negative

    // Loyalty points simple rule: 1 point per ₹10 spent (adjust later if needed)
    const loyaltyPoints = Math.floor(totalSpent / 10);

    const wishlistCount = user && Array.isArray(user.wishlist) ? user.wishlist.length : 0;

    // Recent orders (latest 10)
    const recentOrdersRaw = await Order.find({ user: userObjectId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber createdAt status totalPrice items trackingNumber')
      .lean();

    const recentOrders = recentOrdersRaw.map(o => ({
      id: o.orderNumber || o._id.toString(),
      date: o.createdAt,
      items: Array.isArray(o.items) ? o.items.slice(0,3).map(i => i.name).join(', ') : 'Order',
      amount: o.totalPrice || 0,
      status: (o.status || 'processing').replace(/^(.)/, c => c.toUpperCase()),
      tracking: o.trackingNumber
    }));

    const data = {
      orderCount,
      totalSpent,
      wishlistCount,
      loyaltyPoints,
      recentOrders
    };

    setCache(cacheKey, data);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Admin Dashboard Overview
const getAdminDashboard = async (req, res, next) => {
  try {
    const cacheKey = 'admin:dashboard:overview';
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Get total revenue from paid orders only
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAgg.length ? revenueAgg[0].total : 0;

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get active customers count (users who have made at least one order)
    const activeCustomersAgg = await Order.aggregate([
      { $group: { _id: '$user' } },
      { $count: 'activeCustomers' }
    ]);
    const activeCustomers = activeCustomersAgg.length ? activeCustomersAgg[0].activeCustomers : 0;

    // Get recent orders with customer details (latest 10)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email phone')
      .select('orderNumber totalPrice status createdAt items')
      .lean();

    const formattedRecentOrders = recentOrders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customer: {
        name: order.user?.name || 'Unknown Customer'
      },
      items: order.items || [],
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt
    }));

    const data = {
      totalRevenue,
      totalOrders,
      totalProducts,
      activeCustomers,
      recentOrders: formattedRecentOrders
    };

    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Admin Analytics Data
exports.getAnalytics = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const cacheKey = 'admin:analytics';
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Get monthly revenue data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = monthlyRevenueAgg.map(item => ({
      month: months[item._id.month - 1],
      revenue: item.revenue,
      orders: item.orders
    }));

    // Get top-selling products
    const topProductsAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    const topProducts = topProductsAgg.map(product => ({
      name: product._id,
      sales: product.sales,
      revenue: product.revenue
    }));

    const data = {
      monthlyRevenue,
      topProducts
    };

    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
