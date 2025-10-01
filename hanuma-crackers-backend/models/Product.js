const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a sale price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please provide an original price'],
    min: [0, 'Original price cannot be negative']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot be more than 100'],
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String
    },
    altText: String
  }],
  specifications: {
    weight: String,
    dimensions: String,
    duration: String,
    effects: String,
    safetyRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  maxOrderQuantity: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

// Create indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });

// Check if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Get effective price (current sale price)
productSchema.virtual('effectivePrice').get(function() {
  return this.price;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);