const express = require('express');
const { validateCoupon, useCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Validate and apply coupon
// @route   POST /api/coupons/validate
// @access  Public
router.post('/validate', validateCoupon);

// @desc    Mark coupon as used
// @route   POST /api/coupons/use
// @access  Private (called after order creation)
router.post('/use', protect, useCoupon);

module.exports = router;