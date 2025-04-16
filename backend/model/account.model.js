const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // Reference to the User model
    required: true,
  },
  invoice: {
    type: String,
    default: null,
  },
  sales_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sales',
    default: null,
  },
  purchase_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchases',
    default: null,
  },
  account_type: {
    type: String,
    enum: ['credit', 'debit', 'other'], // Customize if needed
    default: null,
  },
  transaction_id: {
    type: String,
    default: null,
  },
  payment_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentType',
    default: null,
  },
  payment_account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentAccount',
    default: null,
  },
  payment_amount: {
    type: Number,
    default: null,
  },
  timestamp: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Accounts', AccountSchema);