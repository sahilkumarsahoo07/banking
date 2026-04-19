const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Lead management (Sales Rep, Manager, Admin)
 */

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new lead (Sales Rep only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Lead created successfully
 */
const { calculateScore } = require('../utils/scoringEngine');

router.post('/', auth(['sales_rep', 'manager', 'admin']), async (req, res) => {
  try {
    const score = calculateScore(req.body);
    const customer = new Customer({
      ...req.body,
      score,
      assignedTo: req.user.id
    });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get leads based on role
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leads
 */
router.get('/', auth(['sales_rep', 'manager', 'admin']), async (req, res) => {
  try {
    let query = {};
    
    // Sales Reps only see their own leads
    if (req.user.role === 'sales_rep') {
      query = { assignedTo: req.user.id };
    }
    
    const customers = await Customer.find(query).populate('assignedTo', 'name email');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/customers/{id}/status:
 *   patch:
 *     summary: Update lead status
 *     tags: [Customers]
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
 *                 enum: [pending, login_done, follow_up, branch_visit, disbursement, padayatra]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', auth(['sales_rep', 'manager', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) return res.status(404).json({ message: 'Lead not found' });
    
    // Sales Reps can only update their own leads
    if (req.user.role === 'sales_rep' && customer.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    customer.status = status;
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
