const express = require('express');
const router = express.Router();
const Popup = require('../models/Popup');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

// GET /api/popups
router.get('/', async (req, res) => {
  try {
    const popups = await Popup.find({ active: true }).sort({ createdAt: -1 });
    res.json(popups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/popups/all (admin)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const popups = await Popup.find().sort({ createdAt: -1 });
    res.json(popups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/popups (admin)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    const popup = await Popup.create({ image: `/uploads/${req.file.filename}` });
    res.status(201).json(popup);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/popups/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const popup = await Popup.findByIdAndDelete(req.params.id);
    if (!popup) return res.status(404).json({ message: 'Popup not found' });
    res.json({ message: 'Popup deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
