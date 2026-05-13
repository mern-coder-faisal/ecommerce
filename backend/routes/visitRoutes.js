const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');

router.post('/', async (req, res) => {
  try {
    const { path, userAgent, referer, source, device } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await Visit.create({ ip, path, userAgent, referer, source, device });
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ message: 'Visit capture failed', error: err.message });
  }
});

module.exports = router;
