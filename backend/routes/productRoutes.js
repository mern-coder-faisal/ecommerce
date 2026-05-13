const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };

    const products = await Product.find(query).sort(sortObj);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const upload = require('../middleware/uploadMiddleware');

// POST /api/products (admin)
router.post('/', protect, adminOnly, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
  try {
    const productData = { ...req.body };
    
    if (req.files) {
      if (req.files.image) {
        productData.image = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.gallery) {
        productData.gallery = req.files.gallery.map(file => `/uploads/${file.filename}`);
      }
    }
    
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', protect, adminOnly, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.files) {
      if (req.files.image) {
        productData.image = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.gallery) {
        const newGallery = req.files.gallery.map(file => `/uploads/${file.filename}`);
        productData.gallery = productData.gallery ? [...JSON.parse(productData.gallery), ...newGallery] : newGallery;
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
