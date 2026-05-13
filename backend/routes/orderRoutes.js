const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      paymentMethod,
      deliveryCharge,
      products,
      total,
      source,
    } = req.body;

    if (!customerName || !email || !phone || !address || !products?.length || !total) {
      return res.status(400).json({ message: 'Missing order data' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      user = await User.create({
        name: customerName,
        email: email.toLowerCase(),
        password: randomPassword,
        phone,
        role: 'user',
      });
    } else if (!user.phone && phone) {
      user.phone = phone;
      await user.save();
    }

    const order = await Order.create({
      user: user._id,
      customerName,
      email: email.toLowerCase(),
      phone,
      address,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      deliveryCharge: deliveryCharge || 0,
      products,
      total,
      source: source || 'website',
    });

    const token = signToken(user._id);
    res.status(201).json({ order, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});

// GET /api/orders/user
router.get('/user', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin-only orders summary, for completeness
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/orders/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
