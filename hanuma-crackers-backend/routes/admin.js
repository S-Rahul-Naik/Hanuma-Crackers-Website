const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, authorize } = require('../middleware/auth');
const PaymentSettings = require('../models/PaymentSettings');
const Order = require('../models/Order');
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const {
  getCustomers,
  getCustomerDetails,
  updateCustomerStatus,
  getOrders,
  updateOrderStatus
} = require('../controllers/adminController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// @desc    Get payment settings
// @route   GET /api/admin/payment-settings
// @access  Public (for checkout page to fetch settings)
router.get('/payment-settings', async (req, res) => {
  try {
    let paymentSettings = await PaymentSettings.findOne();
    
    // Create default settings if none exist
    if (!paymentSettings) {
      paymentSettings = await PaymentSettings.create({
        primaryUpi: 'hanuma@paytm',
        alternativeUpi: '8688556898@ybl',
        qrCodeImage: 'https://readdy.ai/api/search-image?query=UPI%20QR%20code%20payment%20scanner%20for%20Indian%20digital%20payments%2C%20clean%20white%20background%20with%20QR%20code%20pattern%2C%20professional%20payment%20gateway%20design%2C%20mobile%20payment%20interface%20style%2C%20simple%20and%20clear%20QR%20code%20for%20scanning&width=200&height=200&seq=upi-qr-001&orientation=squarish',
        whatsappNumber: '918688556898',
        phoneNumber: '+918688556898'
      });
    }

    res.status(200).json({
      success: true,
      settings: paymentSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @desc    Update payment settings
// @route   PUT /api/admin/payment-settings
// @access  Private/Admin
router.put('/payment-settings', protect, authorize('admin'), async (req, res) => {
  try {
    const { primaryUpi, alternativeUpi, qrCodeImage, whatsappNumber, phoneNumber } = req.body;

    // Validation
    if (!primaryUpi || !qrCodeImage || !whatsappNumber || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Primary UPI, QR code image, WhatsApp number, and phone number are required',
      });
    }

    // Find existing settings or create new one
    let paymentSettings = await PaymentSettings.findOne();
    
    if (paymentSettings) {
      // Update existing
      paymentSettings.primaryUpi = primaryUpi;
      paymentSettings.alternativeUpi = alternativeUpi || '';
      paymentSettings.qrCodeImage = qrCodeImage;
      paymentSettings.whatsappNumber = whatsappNumber;
      paymentSettings.phoneNumber = phoneNumber;
      
      await paymentSettings.save();
    } else {
      // Create new
      paymentSettings = await PaymentSettings.create({
        primaryUpi,
        alternativeUpi: alternativeUpi || '',
        qrCodeImage,
        whatsappNumber,
        phoneNumber,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment settings updated successfully',
      settings: paymentSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @desc    Upload QR code image
// @route   POST /api/admin/upload-qr
// @access  Private/Admin
router.post('/upload-qr', protect, authorize('admin'), upload.single('qr-code'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a QR code image',
      });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'hanuma-crackers/qr-codes',
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'QR code uploaded successfully',
      imageUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload QR code',
      error: error.message,
    });
  }
});

// @desc    Get orders with payment receipts
// @route   GET /api/admin/orders-with-receipts
// @access  Private/Admin
router.get('/orders-with-receipts', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find({
      paymentReceipt: { $exists: true, $ne: null }
    })
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @desc    Update payment status for an order
// @route   PUT /api/admin/orders/:orderId/payment-status
// @access  Private/Admin
router.put('/orders/:orderId/payment-status', protect, authorize('admin'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    // Validate payment status
    const validStatuses = ['pending', 'pending_verification', 'paid', 'failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update payment status
    order.paymentStatus = paymentStatus;
    
    // If payment is approved, update order status to processing
    if (paymentStatus === 'paid' && order.status === 'payment_verification') {
      order.status = 'processing';
    }
    
    // If payment is rejected, set order status to cancelled
    if (paymentStatus === 'failed') {
      order.status = 'cancelled';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// Coupon Management Routes
// @desc    Create new coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
router.post('/coupons', protect, authorize('admin'), createCoupon);

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private/Admin
router.get('/coupons', protect, authorize('admin'), getAllCoupons);

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
router.put('/coupons/:id', protect, authorize('admin'), updateCoupon);

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
router.delete('/coupons/:id', protect, authorize('admin'), deleteCoupon);

// Customer Management Routes
// @desc    Get customers with analytics
// @route   GET /api/admin/customers
// @access  Private/Admin
router.get('/customers', protect, authorize('admin'), getCustomers);

// @desc    Get specific customer details
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
router.get('/customers/:id', protect, authorize('admin'), getCustomerDetails);

// @desc    Update customer status
// @route   PUT /api/admin/customers/:id/status
// @access  Private/Admin
router.put('/customers/:id/status', protect, authorize('admin'), updateCustomerStatus);

// @desc    Get all orders with customer details
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, authorize('admin'), getOrders);

// @desc    Update order status
// @route   PUT /api/admin/orders/:orderId/status
// @access  Private/Admin
router.put('/orders/:orderId/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
