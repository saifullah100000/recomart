const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  compareAtPrice: {
    type: Number,
    default: null
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  brand: {
    type: String,
    default: ''
  },

  images: [{
    url: String,
    publicId: String,

    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  // CLIP VECTOR EMBEDDING
  embedding: {
    type: [Number],
    required: false,
    default: []
  },

  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },

  specifications: {
    type: Map,
    of: String
  },

  tags: [{
    type: String,
    trim: true
  }],

  aiCategory: {
    type: String,
    default: ''
  },

  aiConfidence: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  reviewCount: {
    type: Number,
    default: 0
  },

  totalSold: {
    type: Number,
    default: 0
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isFeatured: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

productSchema.index({ vendor: 1 });
productSchema.index({ category: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ isApproved: 1, isActive: 1 });

productSchema.index({
  title: 'text',
  description: 'text',
  brand: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Product', productSchema);