const Coupon = require('../models/Coupon');
const Product = require('../models/Product');

// @desc    Create new coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res) => {
  try {
    const { 
      code, 
      discountPercentage, 
      applicableProducts, 
      usageLimit, 
      validUntil, 
      description 
    } = req.body;

    // Validate required fields
    if (!code || !discountPercentage) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and discount percentage are required'
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    // Validate products if specified
    if (applicableProducts && applicableProducts.length > 0) {
      const validProducts = await Product.find({ _id: { $in: applicableProducts } });
      if (validProducts.length !== applicableProducts.length) {
        return res.status(400).json({
          success: false,
          message: 'Some products are invalid'
        });
      }
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercentage,
      applicableProducts: applicableProducts || [],
      usageLimit,
      validUntil,
      description,
      createdBy: req.user._id
    });

    await coupon.populate('applicableProducts', 'name images price');
    await coupon.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private/Admin
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('applicableProducts', 'name images price')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // If updating code, check uniqueness
    if (updates.code && updates.code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: updates.code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
      updates.code = updates.code.toUpperCase();
    }

    Object.assign(coupon, updates);
    await coupon.save();
    await coupon.populate('applicableProducts', 'name images price');
    await coupon.populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Validate and apply coupon
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartItems } = req.body;

    if (!code || !cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and cart items are required'
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    }).populate('applicableProducts');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon is valid (date range)
    const now = new Date();
    if (coupon.validFrom > now) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not yet valid'
      });
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired'
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit exceeded'
      });
    }

    // Calculate discount
    let applicableItems = [];
    let totalDiscount = 0;
    let originalTotal = 0;

    for (const item of cartItems) {
      originalTotal += item.price * item.quantity;

      // Check if coupon applies to this product
      const isApplicable = coupon.applicableProducts.length === 0 || 
        coupon.applicableProducts.some(product => product._id.toString() === item.product);

      if (isApplicable) {
        const itemTotal = item.price * item.quantity;
        const itemDiscount = (itemTotal * coupon.discountPercentage) / 100;
        totalDiscount += itemDiscount;

        applicableItems.push({
          product: item.product,
          name: item.name,
          originalPrice: item.price,
          discountedPrice: item.price - (item.price * coupon.discountPercentage / 100),
          discount: item.price * coupon.discountPercentage / 100,
          quantity: item.quantity
        });
      }
    }

    if (applicableItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is not applicable to any items in your cart'
      });
    }

    // Calculate shipping cost (₹150 if total < ₹2000, free otherwise)
    const discountedTotal = originalTotal - totalDiscount;
    const shippingCost = discountedTotal < 2000 ? 150 : 0;
    const finalTotal = discountedTotal + shippingCost;

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        description: coupon.description
      },
      discount: {
        totalDiscount: Math.round(totalDiscount),
        originalTotal: Math.round(originalTotal),
        discountedTotal: Math.round(discountedTotal),
        shippingCost: Math.round(shippingCost),
        finalTotal: Math.round(finalTotal),
        applicableItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark coupon as used (called after successful order)
// @route   POST /api/coupons/use
// @access  Private
exports.useCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (coupon) {
      coupon.usedCount += 1;
      await coupon.save();
    }

    res.status(200).json({
      success: true,
      message: 'Coupon usage recorded'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};