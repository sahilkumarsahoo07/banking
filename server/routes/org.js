const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key');
    next();
  } catch {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};

// POST /api/org/create — Manager creates their organization
router.post('/create', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Organization name is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'manager' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only managers can create organizations' });
    }
    if (user.orgId) {
      const existing = await Organization.findById(user.orgId);
      if (existing) return res.status(400).json({ message: 'You already have an organization', org: existing });
    }

    const code = await Organization.generateUniqueCode(name);
    const org = new Organization({
      name,
      code,
      managerId: user._id,
      members: [user._id],
    });
    await org.save();

    // Link the manager to the org
    user.orgId = org._id;
    await user.save();

    res.status(201).json({ org, code });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/org/me — Get current user's org
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.orgId) return res.status(404).json({ message: 'No organization found' });

    const org = await Organization.findById(user.orgId).populate('managerId', 'name email');
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/org/validate/:code — Validate an org code (for sales rep registration)
router.get('/validate/:code', async (req, res) => {
  try {
    const org = await Organization.findOne({ code: req.params.code.toUpperCase() })
      .populate('managerId', 'name email');
    if (!org) return res.status(404).json({ message: 'Invalid organization code. Please check with your manager.' });
    res.json({ valid: true, org: { id: org._id, name: org.name, code: org.code, manager: org.managerId?.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/org/all — Super Admin: list all orgs
router.get('/all', protect, async (req, res) => {
  try {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const orgs = await Organization.find().populate('managerId', 'name email');
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
