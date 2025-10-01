const express = require('express');
const multer = require('multer');
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  requestRefund,
  getOrders,
  updateOrderStatus,
  getRefundRequests,
  processRefund,
  getOrderStats,
  uploadPaymentReceipt,
  confirmOrder
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for receipt uploads
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

// Protected routes for users
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/refund', protect, requestRefund);
router.put('/:id/confirm', protect, confirmOrder);
router.post('/upload-receipt', protect, upload.single('receipt'), uploadPaymentReceipt);

// Admin only routes (specific routes first)
router.get('/refund-requests', protect, authorize('admin'), getRefundRequests);
router.get('/stats', protect, authorize('admin'), getOrderStats);
router.get('/', protect, authorize('admin'), getOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.put('/:id/process-refund', protect, authorize('admin'), processRefund);

// General routes (with params) should come last
router.get('/:id', protect, getOrder);

module.exports = router;