const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get customer analytics and statistics
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    // Build search query
    let searchQuery = { role: { $ne: 'admin' } }; // Exclude admin users
    
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users (customers)
    const users = await User.find(searchQuery)
      .select('name email phone createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get order statistics for each customer (only paid orders)
    const customersWithStats = await Promise.all(
      users.map(async (user) => {
        const allOrders = await Order.find({ user: user._id });
        const paidOrders = allOrders.filter(order => order.paymentStatus === 'paid');
        const totalOrders = allOrders.length; // Total orders (including pending)
        const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const lastPaidOrder = paidOrders.length > 0 ? paidOrders[paidOrders.length - 1].createdAt : null;
        
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          joinDate: user.createdAt,
          totalOrders,
          totalSpent: Math.round(totalSpent),
          lastOrder: lastPaidOrder,
          status: user.isActive ? 'active' : 'inactive'
        };
      })
    );

    // Filter by status if specified
    let filteredCustomers = customersWithStats;
    if (status && status !== 'all') {
      filteredCustomers = customersWithStats.filter(customer => customer.status === status);
    }

    // Calculate statistics
    const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' } });
    const activeCustomers = await User.countDocuments({ 
      role: { $ne: 'admin' }, 
      isActive: true 
    });
    
    // Calculate average order value (only from paid orders)
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    console.log('Paid orders count:', paidOrders.length);
    console.log('Total orders count:', await Order.countDocuments());
    const avgOrderValue = paidOrders.length > 0 
      ? Math.round(paidOrders.reduce((sum, order) => sum + order.totalPrice, 0) / paidOrders.length)
      : 0;
    
    // Calculate repeat customers percentage (based on customers with multiple paid orders)
    const customersWithMultiplePaidOrders = await Promise.all(
      customersWithStats.map(async (customer) => {
        const paidOrdersCount = await Order.countDocuments({ 
          user: customer._id, 
          paymentStatus: 'paid' 
        });
        return paidOrdersCount > 1;
      })
    );
    const repeatCustomersCount = customersWithMultiplePaidOrders.filter(Boolean).length;
    const repeatCustomerPercentage = totalCustomers > 0 
      ? Math.round((repeatCustomersCount / totalCustomers) * 100)
      : 0;

    res.status(200).json({
      success: true,
      customers: filteredCustomers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCustomers / limit),
        totalCustomers,
        hasNextPage: page * limit < totalCustomers,
        hasPrevPage: page > 1
      },
      statistics: {
        totalCustomers,
        activeCustomers,
        avgOrderValue,
        repeatCustomerPercentage
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get specific customer details
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
exports.getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findById(id).select('-password');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer's orders
    const orders = await Order.find({ user: id })
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });

    // Calculate total spent from paid orders only
    const paidOrders = orders.filter(order => order.paymentStatus === 'paid');
    const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    const customerDetails = {
      ...customer.toObject(),
      totalOrders: orders.length,
      totalSpent: Math.round(totalSpent),
      orders: orders.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        itemsCount: order.items.length
      }))
    };

    res.status(200).json({
      success: true,
      customer: customerDetails
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update customer status
// @route   PUT /api/admin/customers/:id/status
// @access  Private/Admin
exports.updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const customer = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Customer ${isActive ? 'activated' : 'deactivated'} successfully`,
      customer
    });
  } catch (error) {
    console.error('Error updating customer status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all orders with customer details
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    
    // Build filter query
    let filterQuery = {};
    if (status && status !== 'all') {
      filterQuery.status = status;
    }
    if (paymentStatus && paymentStatus !== 'all') {
      filterQuery.paymentStatus = paymentStatus;
    }

    // Get orders with customer details
    const orders = await Order.find(filterQuery)
      .populate('user', 'name email phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customer: {
        name: order.user?.name || 'Unknown',
        email: order.user?.email || 'N/A',
        phone: order.user?.phone || 'N/A'
      },
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: order.totalPrice,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      actualDeliveryDate: order.actualDeliveryDate,
      trackingNumber: order.trackingNumber,
      shippingAddress: order.shippingAddress
    }));

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filterQuery);
    
    // Calculate order statistics
    const totalOrdersCount = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const pendingPayments = await Order.countDocuments({ paymentStatus: 'pending' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      success: true,
      orders: formattedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1
      },
      statistics: {
        totalOrders: totalOrdersCount,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        paidOrders,
        pendingPayments,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:orderId/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status, 
        ...(trackingNumber && { trackingNumber }),
        ...(status === 'delivered' && { actualDeliveryDate: new Date() })
      },
      { new: true }
    ).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};