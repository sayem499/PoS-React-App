
const mongoose = require('mongoose')

const  productSchema = mongoose.Schema({
    productTitle: {type: String, required: true},
    productBrand: {type: String},
    productQuantity: {type: Number, required: true},
    productType: {type: String, required: true},
    productUnitPrice: {type: Number, required: true},
    productUnitCost: { type: Number, requird: true},
    productBarcode:{type: String},
    productCurrentPurchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchases",
        default: null, // Ensures no empty string issues
    }

}, {
    timestamps: true
})

module.exports = mongoose.model( 'Products', productSchema )