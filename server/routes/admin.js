const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: System administration and user management
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', auth(['admin', 'super_admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}/approve:
 *   patch:
 *     summary: Approve a pending staff account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch('/users/:id/approve', auth(['admin', 'super_admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.status = status;
    await user.save();
    res.json({ message: `User status updated to ${status}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system-wide statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System KPIs
 */
router.get('/stats', auth(['admin', 'super_admin', 'manager']), async (req, res) => {
  try {
    const totalLeads = await Customer.countDocuments();
    const totalLogins = await Customer.countDocuments({ status: 'login_done' });
    const totalDisbursements = await Customer.countDocuments({ status: 'disbursement' });
    const pendingApprovals = await User.countDocuments({ status: 'pending' });

    res.json({
      totalLeads,
      totalLogins,
      totalDisbursements,
      pendingApprovals
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
