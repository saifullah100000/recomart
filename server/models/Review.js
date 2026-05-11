const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  // ✅ OPTIONAL NOW
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  title: {
    type: String,
    trim: true,
    maxlength: 100
  },

  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  images: [
    {
      url: String,
      publicId: String
    }
  ],

  isApproved: {
    type: Boolean,
    default: true
  }

},
{
  timestamps: true
});

reviewSchema.index({ product: 1 });

reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true }
);

module.exports =
  mongoose.model('Review', reviewSchema);