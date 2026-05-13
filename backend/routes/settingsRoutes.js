const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, adminOnly } = require('../middleware/auth');

const getSetting = async (key, fallback = null) => {
  const setting = await Setting.findOne({ key });
  return setting ? setting.value : fallback;
};

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const settings = await Setting.find();
    const response = settings.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const updates = req.body;
    const saved = {};
    for (const key of Object.keys(updates)) {
      const value = updates[key];
      const setting = await Setting.findOneAndUpdate(
        { key },
        { value, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      saved[key] = setting.value;
    }
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
