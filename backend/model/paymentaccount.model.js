const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentAccountSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // Reference to the User model
    required: true,
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