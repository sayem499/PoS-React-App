const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
/*     productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: true,
    }, */
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
    productSupplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suppliers", // Reference to the Supplier model
      required: true,
    },
/*     productQuantity: {
      type: Number,
      required: true,
      min: 1, // Ensures at least 1 quantity
    },
    productUnitCost: {
      type: Number,
      required: true,
      min: 0,
    },
    productTotalCost: {
      type: Number,
      required: true,
      min: 0,
    }, */
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