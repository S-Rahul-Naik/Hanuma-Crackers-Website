const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');

// Protect routes - require authentication with session validation
exports.protect = async (req, res, next) => {
  let sessionId;

  // Check for session ID in cookies (primary method)
  if (req.cookies && req.cookies.sessionId) {
    sessionId = req.cookies.sessionId;
    console.log('Found session in cookies:', sessionId);
  }
  // Fallback: Check for session in custom header (for debugging)
  else if (req.headers['x-session-id']) {
    sessionId = req.headers['x-session-id'];
    console.log('Found session in header:', sessionId);
  }
  // Fallback: Check for JWT token in headers (for API clients)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Create temporary session for JWT users
      sessionId = `jwt_${decoded.id}_${Date.now()}`;
      req.isJwtAuth = true;
      req.user = await User.findById(decoded.id);
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }

  // Make sure session ID exists
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Find active session in MongoDB
    const session = await Session.findOne({
      sessionId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!session || !session.userId) {
      // Clear invalid cookie
      res.clearCookie('sessionId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid'
      });
    }

    // Check if user still exists and is active
    if (!session.userId.isActive) {
      await session.updateOne({ isActive: false });
      res.clearCookie('sessionId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // Update last activity
    await session.updateActivity();

    req.user = session.userId;
    req.session = session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Helper function to create secure session
exports.createSession = async (user, req) => {
  // Generate secure session ID
  const sessionId = crypto.randomBytes(32).toString('hex');
  
  // Session expires in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  // Create session in MongoDB
  const session = await Session.create({
    sessionId,
    userId: user._id,
    userData: {
      email: user.email,
      name: user.name,
      role: user.role
    },
    userAgent: req.headers['user-agent'] || '',
    ipAddress: req.ip || req.connection.remoteAddress,
    expiresAt
  });
  
  return session;
};

// Helper function to clear session
exports.clearSession = async (sessionId) => {
  if (sessionId) {
    await Session.findOneAndUpdate(
      { sessionId },
      { isActive: false }
    );
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional auth - don't fail if no token
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }

  next();
};