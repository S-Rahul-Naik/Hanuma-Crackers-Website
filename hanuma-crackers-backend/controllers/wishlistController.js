const User = require('../models/User');
const Product = require('../models/Product');
const logger = require('../utils/logger');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist',
        model: 'Product',
        select: 'name price originalPrice images category stock'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    logger.error('Get wishlist error:', error);
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add product to wishlist
    user.wishlist.push(productId);
    await user.save();

    logger.info('Product added to wishlist', {
      userId: req.user.id,
      productId: productId,
      productName: product.name
    });

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully'
    });
  } catch (error) {
    logger.error('Add to wishlist error:', error);
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
    await user.save();

    logger.info('Product removed from wishlist', {
      userId: req.user.id,
      productId: productId
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });
  } catch (error) {
    logger.error('Remove from wishlist error:', error);
    next(error);
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const previousCount = user.wishlist.length;
    user.wishlist = [];
    await user.save();

    logger.info('Wishlist cleared', {
      userId: req.user.id,
      itemsRemoved: previousCount
    });

    res.status(200).json({
      success: true,
      message: `Removed ${previousCount} items from wishlist`
    });
  } catch (error) {
    logger.error('Clear wishlist error:', error);
    next(error);
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlistStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id).select('wishlist');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isInWishlist = user.wishlist.includes(productId);

    res.status(200).json({
      success: true,
      isInWishlist: isInWishlist
    });
  } catch (error) {
    logger.error('Check wishlist status error:', error);
    next(error);
  }
};