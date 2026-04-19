const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       required:
 *         - title
 *         - file_url
 *       properties:
 *         title:
 *           type: string
 *         file_url:
 *           type: string
 *         category:
 *           type: string
 *           enum: [loan_docs, kyc, financials, other]
 *         uploadedBy:
 *           type: string
 */

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  file_url: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['loan_docs', 'kyc', 'financials', 'other'],
    default: 'other'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
