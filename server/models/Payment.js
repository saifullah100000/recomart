const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['stripe', 'cod'], required: true },
  stripePaymentIntentId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'pkr' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' }
}, { timestamps: true });

paymentSchema.index({ order: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
