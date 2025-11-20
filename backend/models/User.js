const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },           // optional for signup (only required for login form in your request)
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
