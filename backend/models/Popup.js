const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
  image: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Popup', popupSchema);
