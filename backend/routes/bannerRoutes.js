const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, image, link, active } = req.body;
    if (!image) return res.status(400).json({ message: 'Image URL is required' });
    const banner = await Banner.create({ title, description, image, link, active: active !== false });
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, image, link, active } = req.body;
    const banner = await Banner.findByIdAndUpdate(req.params.id, { title, description, image, link, active }, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
