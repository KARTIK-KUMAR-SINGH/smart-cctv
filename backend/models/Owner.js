// backend/models/Owner.js
const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  ownerName: { type: String, required: true },
  ownerMobile: { type: String, required: true },

  // ⭐ NEW FIELD — Owner Address
  ownerAddress: { type: String, required: true },

  thresholdValue: { type: Number, required: true },
  securityContact: { type: String, required: true },
  higherAuthority: { type: String, required: true },
  ambulanceNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Owner', OwnerSchema);
