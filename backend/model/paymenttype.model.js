const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentTypeSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  type_name: {
    type: String,
    default: null,
  },
  type_image: {
    type: String, // Could be a file path or URL
    default: null,
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('PaymentTypes', PaymentTypeSchema);
