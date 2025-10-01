const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userData: {
    email: String,
    name: String,
    role: String
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  userAgent: String,
  ipAddress: String,
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index for automatic cleanup
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ sessionId: 1, isActive: 1 });

// Clean up expired sessions
sessionSchema.statics.cleanupExpired = function() {
  return this.deleteMany({ 
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false }
    ]
  });
};

// Deactivate all sessions for a user (for logout all devices)
sessionSchema.statics.deactivateUserSessions = function(userId) {
  return this.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
};

// Update last activity
sessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

module.exports = mongoose.model('Session', sessionSchema);