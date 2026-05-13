const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Visit = require('../models/Visit');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalProducts, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(100)
    ]);

    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = await Order.countDocuments();
    const totalVisits = await Visit.countDocuments();
    const visits = await Visit.find().sort({ createdAt: -1 }).limit(200);

    const deviceCounts = visits.reduce((acc, visit) => {
      const key = visit.device || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sourceCounts = visits.reduce((acc, visit) => {
      const key = visit.source || 'direct';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Monthly sales (last 6 months)
    const now = new Date();
    const monthlySales = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthOrders = await Order.find({ createdAt: { $gte: d, $lt: end } });
      const revenue = monthOrders.reduce((s, o) => s + o.total, 0);
      monthlySales.push({
        month: d.toLocaleString('default', { month: 'short' }),
        revenue,
        orders: monthOrders.length
      });
    }

    res.json({
      totalUsers,
      totalProducts,
      totalSales,
      totalOrders,
      totalVisits,
      deviceCounts,
      sourceCounts,
      monthlySales,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(20);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
