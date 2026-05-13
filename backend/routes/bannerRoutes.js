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

const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const bannerData = { ...req.body };
    if (req.file) {
      bannerData.image = `/uploads/${req.file.filename}`;
    }
    if (!bannerData.image) return res.status(400).json({ message: 'Image is required' });
    const banner = await Banner.create(bannerData);
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

router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const bannerData = { ...req.body };
    if (req.file) {
      bannerData.image = `/uploads/${req.file.filename}`;
    }
    const banner = await Banner.findByIdAndUpdate(req.params.id, bannerData, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
