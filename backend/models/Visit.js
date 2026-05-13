const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  ip: { type: String },
  path: { type: String },
  userAgent: { type: String },
  referer: { type: String },
  source: { type: String, default: 'direct' },
  device: { type: String, default: 'unknown' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', visitSchema);
