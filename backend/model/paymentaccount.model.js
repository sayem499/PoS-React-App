const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentAccountSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  payment_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentType',
    default: null,
  },
  account_name: {
    type: String,
    default: null,
  },
  account_number: {
    type: String,
    default: null,
  },
  branch_name: {
    type: String,
    default: null,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('PaymentAccounts', PaymentAccountSchema);