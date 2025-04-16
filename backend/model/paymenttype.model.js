const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentTypeSchema = new Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the User model
      required: true,
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
