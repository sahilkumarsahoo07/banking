const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           description: Unique email address
 *         password:
 *           type: string
 *           description: Hashed password
 *         role:
 *           type: string
 *           enum: [customer, sales_rep, manager, admin]
 *           description: User role for RBAC
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Access status for sales_rep and manager (admin approved)
 */

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'sales_rep', 'manager', 'admin'],
    default: 'customer',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function () {
      // Customers are automatically approved, staff must be approved by admin
      return this.role === 'customer' || this.role === 'admin' ? 'approved' : 'pending';
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
