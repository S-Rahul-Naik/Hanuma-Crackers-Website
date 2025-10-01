const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/error');

const router = express.Router();

// Temporary debug route for testing
router.get('/debug', (req, res) => {
  res.json({
    success: true,
    debug: {
      cookies: req.cookies || {},
      sessionId: req.cookies?.sessionId || 'No session cookie',
      origin: req.headers.origin,
      userAgent: req.headers['user-agent'],
      environment: process.env.NODE_ENV,
      corsOrigins: process.env.CORS_ORIGINS,
      timestamp: new Date().toISOString()
    }
  });
});

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Temporary test login route
router.post('/test-login', async (req, res) => {
  try {
    const { createSession } = require('../middleware/auth');
    const User = require('../models/User');
    
    // Find admin user
    const user = await User.findOne({ email: 'admin@hanuma.com' });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Create session
    const session = await createSession(user, req);

    // Set cookie
    res.cookie('sessionId', session.sessionId, {
      expires: session.expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.json({
      success: true,
      message: 'Test session created',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      sessionInfo: {
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
        environment: process.env.NODE_ENV
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test login failed',
      error: error.message
    });
  }
});

// Temporary admin promotion route for testing
router.post('/promote-admin', async (req, res) => {
  try {
    const { email } = req.body;
    const User = require('../models/User');
    
    const user = await User.findOneAndUpdate(
      { email: email || 'admin@hanuma.com' },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User promoted to admin',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to promote user',
      error: error.message
    });
  }
});

// Routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resettoken', resetPassword);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePasswordValidation, handleValidationErrors, updatePassword);

module.exports = router;