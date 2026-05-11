const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true, trim: true },
  shopDescription: { type: String, default: '' },
  shopLogo: { type: String, default: '' },
  shopBanner: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'suspended', 'rejected'], default: 'pending' },
  bankDetails: {
    accountTitle: String,
    accountNumber: String,
    bankName: String
  }
}, { timestamps: true });

vendorProfileSchema.index({ user: 1 });
vendorProfileSchema.index({ status: 1 });

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);
