const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type is required (income or expense)']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['salary', 'investment', 'business', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for querying records by user and date
financialRecordSchema.index({ user: 1, date: -1 });
financialRecordSchema.index({ user: 1, type: 1 });
financialRecordSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);