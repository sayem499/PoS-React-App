const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    purchaseProducts: { type: Array, required:true},
    invoiceId: {
      type: String,
      required: true,
      unique: true, // Ensures invoiceId is unique
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the User model
      required: true,
    },
    purchaseSupplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suppliers", // Reference to the Supplier model
      required: true,
    },
    purchaseCustomerName: { 
      type: String, 
    },
    purchaseCustomerPhoneNumber: { 
      type: String, 
    },
    purchaseTotalCost: {
      type: Number,
      required: true,
      min: 0,
    }, 
    purchaseVat: {
      type: Number,
      default: 0, // VAT percentage (e.g., 5 for 5%)
      min: 0,
    },
    purchaseTime: {
      type: String
    },
    purchaseDate: { 
      type: String, default: Date.now
    },
    purchaseVatAmount: {
      type: Number,
      default: 0, // Calculated based on VAT percentage
      min: 0,
    },
    purchaseDiscount: {
      type: Number,
      default: 0, // Discount amount
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("Purchases", purchaseSchema);