const mongoose = require('mongoose');

const aiLogSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  action: { type: String, enum: ['classification', 'tagging', 'search', 'recommendation', 'chatbot'], required: true },
  input: { type: String },
  output: { type: mongoose.Schema.Types.Mixed },
  confidence: { type: Number },
  modelUsed: { type: String, default: 'gemini-2.0-flash' },
  responseTimeMs: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('AILog', aiLogSchema);
