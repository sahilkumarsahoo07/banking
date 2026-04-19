const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, sales_rep, manager]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
const Organization = require('../models/Organization');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, orgCode } = req.body;

    // Block super_admin from public registration
    if (role === 'super_admin') {
      return res.status(403).json({ message: 'This role cannot be registered publicly.' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    let orgId = null;

    // Sales reps MUST provide a valid org code
    if (role === 'sales_rep') {
      if (!orgCode) return res.status(400).json({ message: 'Organization code is required for Sales Representatives.' });
      const org = await Organization.findOne({ code: orgCode.toUpperCase() });
      if (!org) return res.status(400).json({ message: 'Invalid organization code. Please check with your manager.' });
      orgId = org._id;
    }

    user = new User({ name, email, password, role, orgId });
    await user.save();

    // Add sales rep to org members
    if (role === 'sales_rep' && orgId) {
      await Organization.findByIdAndUpdate(orgId, { $addToSet: { members: user._id } });
    }

    res.status(201).json({
      message: role === 'customer'
        ? 'Registration successful'
        : role === 'manager'
          ? 'Registration successful. Waiting for admin approval.'
          : 'Registration successful. Waiting for admin approval.',
      requiresOrgSetup: role === 'manager',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials or account pending approval
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, remember, fingerprint, deviceName } = req.body;

    if (!email || typeof email !== 'string' || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.status !== 'approved') {
      return res.status(401).json({ message: 'Account is pending approval by administrator' });
    }

    // ─── Device Fingerprint Check ────────────────────────────────────────────
    if (fingerprint) {
      const existingDevice = user.devices.find(d => d.fingerprint === fingerprint);

      if (existingDevice) {
        // Known device — check if it's revoked
        if (existingDevice.status === 'revoked') {
          return res.status(403).json({ message: 'This device has been revoked. Contact your administrator.' });
        }
        if (existingDevice.status === 'pending') {
          return res.status(403).json({
            message: 'This device is awaiting admin approval.',
            code: 'DEVICE_PENDING'
          });
        }
        // Approved — update lastUsed
        existingDevice.lastUsed = new Date();
      } else {
        // New device — Auto-approve ONLY the very first device
        const isFirstDevice = user.devices.length === 0;

        user.devices.push({
          fingerprint,
          deviceName: deviceName || 'Unknown Device',
          status: isFirstDevice ? 'approved' : 'pending',
          isPrimary: isFirstDevice,
        });

        await user.save();

        if (!isFirstDevice) {
          return res.status(403).json({
            message: `New device detected. A request has been sent to your administrator for approval.`,
            code: 'DEVICE_PENDING'
          });
        }
      }

      await user.save();
    }
    // ────────────────────────────────────────────────────────────────────────

    const expiresIn = remember ? '7d' : '24h';
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key',
      { expiresIn }
    );

    res.json({
      token,
      expiresIn,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        orgId: user.orgId,
        requiresOrgSetup: user.role === 'manager' && !user.orgId
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Device Management Routes (Admin) ───────────────────────────────────────

// GET all users with their devices (admin only)
router.get('/devices', async (req, res) => {
  try {
    const users = await User.find({}, 'name email devices maxDevices subscriptionTier');
    const deviceList = users.map(u => ({
      userId: u._id,
      userName: u.name,
      userEmail: u.email,
      maxDevices: u.maxDevices,
      subscriptionTier: u.subscriptionTier,
      devices: u.devices,
    }));
    res.json(deviceList);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH approve a pending device
router.patch('/devices/:userId/:deviceId/approve', async (req, res) => {
  try {
    const { userId, deviceId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const device = user.devices.id(deviceId);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    device.status = 'approved';
    await user.save();
    res.json({ message: 'Device approved successfully', device });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE / revoke a device
router.delete('/devices/:userId/:deviceId', async (req, res) => {
  try {
    const { userId, deviceId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.devices = user.devices.filter(d => d._id.toString() !== deviceId);
    await user.save();
    res.json({ message: 'Device removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH update user maxDevices (subscription upgrade)
router.patch('/users/:userId/subscription', async (req, res) => {
  try {
    const { userId } = req.params;
    const { maxDevices, subscriptionTier } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { maxDevices, subscriptionTier },
    );
    res.json({ message: 'Subscription updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
