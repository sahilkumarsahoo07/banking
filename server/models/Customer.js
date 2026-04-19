const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - businessType
 *         - loanAmount
 *       properties:
 *         name:
 *           type: string
 *         businessType:
 *           type: string
 *           enum: [proprietor, pvt_ltd, llp]
 *         loanAmount:
 *           type: number
 *         annualIncome:
 *           type: number
 *         existingEmis:
 *           type: number
 *         score:
 *           type: number
 *           description: Lead quality score (1-100)
 *         turnover:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, login_done, follow_up, branch_visit, disbursement, padayatra]
 *         assignedTo:
 *           type: string
 *           description: ID of the Sales Rep managing this lead
 *         notes:
 *           type: string
 */

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessType: { 
    type: String, 
    enum: ['proprietor', 'pvt_ltd', 'llp'], 
    required: true 
  },
  loanAmount: { type: Number, required: true },
  annualIncome: { type: Number, default: 0 },
  existingEmis: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  turnover: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'login_done', 'follow_up', 'branch_visit', 'disbursement', 'padayatra'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: { type: String },
  documents: [{
    title: String,
    url: String,
    status: { type: String, enum: ['pending', 'uploaded', 'verified'], default: 'pending' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CustomerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Customer', CustomerSchema);
