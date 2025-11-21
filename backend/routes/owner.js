// backend/routes/owner.js
const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner');
const auth = require('../middleware/auth'); // <-- auth middleware

// Create or update owner profile (protected)
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized: user missing' });

    const payload = {
      user: userId,
      ownerName: req.body.ownerName,
      ownerMobile: req.body.ownerMobile,
      thresholdValue: req.body.thresholdValue,
      securityContact: req.body.securityContact,
      higherAuthority: req.body.higherAuthority,
      ambulanceNumber: req.body.ambulanceNumber,
    };

    let owner = await Owner.findOne({ user: userId });
    if (owner) {
      owner = await Owner.findOneAndUpdate({ user: userId }, payload, { new: true });
      return res.json(owner);
    }

    owner = new Owner(payload);
    await owner.save();
    return res.json(owner);
  } catch (err) {
    console.error('Owner POST error:', err);
    return res.status(500).send('Server error');
  }
});

// Get current user's owner profile (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized: user missing' });

    const owner = await Owner.findOne({ user: userId });
    if (!owner) return res.status(404).json({ msg: 'Profile not found' });

    return res.json(owner);
  } catch (err) {
    console.error('Owner GET /me error:', err);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
