const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // orderNumber is generated in a pre-save hook; cannot be 'required' at validation time
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: String
  }],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'card', 'upi', 'net_banking'],
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'pending_verification', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentReceipt: {
    type: String,
    trim: true
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    paymentGateway: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discountAmount: {
    type: Number,
    default: 0.0
  },
  couponCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    enum: ['pending', 'payment_verification', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  notes: String,
  cancellationReason: {
    type: String,
    trim: true
  },
  cancellationComment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  cancelledAt: {
    type: Date
  },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'processed', 'rejected'],
    default: 'none'
  },
  refundReason: {
    type: String,
    trim: true
  },
  refundComment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  refundRequestedAt: {
    type: Date
  },
  refundProcessedAt: {
    type: Date
  },
  adminRefundComment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Calculate estimated delivery date based on shipping method
orderSchema.methods.calculateEstimatedDelivery = function() {
  const baseDeliveryDays = 3; // Standard delivery time
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + baseDeliveryDays);
  this.estimatedDeliveryDate = deliveryDate;
  return deliveryDate;
};

// Check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.status);
};

// Get formatted shipping address
orderSchema.methods.getFormattedAddress = function() {
  const addr = this.shippingAddress;
  return `${addr.name}\n${addr.street}\n${addr.city}, ${addr.state} ${addr.pincode}\n${addr.country}\nPhone: ${addr.phone}`;
};

// Indexes for better dashboard query performance
orderSchema.index({ user: 1, createdAt: -1 }); // For recent orders by user
orderSchema.index({ user: 1, status: 1, paymentStatus: 1 }); // For dashboard aggregations
orderSchema.index({ createdAt: -1 }); // For admin recent orders
orderSchema.index({ orderNumber: 1 }); // For order lookup (already unique, but explicit index)

module.exports = mongoose.model('Order', orderSchema);