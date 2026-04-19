const mongoose = require('mongoose');

// Generate a unique org code like "HPN012"
const generateOrgCode = (name) => {
  const prefix = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3).padEnd(3, 'X');
  const suffix = Math.floor(100 + Math.random() * 900).toString();
  return `${prefix}${suffix}`;
};

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscriptionTier: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  maxMembers: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
});

OrganizationSchema.statics.generateUniqueCode = async function (name) {
  let code;
  let exists = true;
  while (exists) {
    code = generateOrgCode(name);
    exists = await this.findOne({ code });
  }
  return code;
};

module.exports = mongoose.model('Organization', OrganizationSchema);
