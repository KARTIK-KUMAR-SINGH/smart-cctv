// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';

module.exports = function (req, res, next) {
  const authHeader = req.header('authorization') || req.header('Authorization');
  if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ msg: 'Token format invalid' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded should contain { id, email } per your login route
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
