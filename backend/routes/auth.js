const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const SIGNUP_PIN = process.env.SIGNUP_PIN;
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';

// SIGNUP: expects { email, password }
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // PIN REMOVED FROM SIGNUP
    if (!email || !password) 
      return res.status(400).json({ message: 'email and password required' });

    const existing = await User.findOne({ email });
    if (existing) 
      return res.status(409).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ email, passwordHash });
    await user.save();

    // No token generation required — optional
    res.json({ message: 'Signup successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN: expects { email, password, pin }
router.post('/login', async (req, res) => {
  try {
    const { email, password, pin } = req.body;

    // PIN ADDED TO LOGIN
    if (!email || !password || !pin) 
      return res.status(400).json({ message: 'email, password and pin required' });

    if (pin !== SIGNUP_PIN) 
      return res.status(403).json({ message: 'Invalid camera secret pin' });

    const user = await User.findOne({ email });
    if (!user) 
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) 
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
