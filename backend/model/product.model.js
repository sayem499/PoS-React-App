
const mongoose = require('mongoose')

const  productSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Reference to the User model
        required: true,
    },
    productTitle: {type: String, required: true},
    productBrand: {type: String},
    productQuantity: {type: Number, required: true},
    productType: {type: String, required: true},
    productUnitPrice: {type: Number, required: true},
    productUnitCost: { type: Number, requird: true},
    productBarcode: {type: String},
    productImageUrl: {type: String},
    productCurrentPurchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchases",
        default: null, // Ensures no empty string issues
    }

}, {
    timestamps: true
})

module.exports = mongoose.model( 'Products', productSchema )