const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const categoryData = { ...req.body };
    if (req.file) {
      categoryData.image = `/uploads/${req.file.filename}`;
    }
    const category = await Category.create(categoryData);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const categoryData = { ...req.body };
    if (req.file) {
      categoryData.image = `/uploads/${req.file.filename}`;
    }
    const category = await Category.findByIdAndUpdate(req.params.id, categoryData, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
