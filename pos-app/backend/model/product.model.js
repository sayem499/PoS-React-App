
const mongoose = require('mongoose')

const  productSchema = mongoose.Schema({
    productTitle: {type: String, required: true},
    productBrand: {type: String},
    productQuantity: {type: Number, required: true},
    productType: {type: String, required: true},
    productUnitPrice: {type: Number, required: true},
    productBarcode:{type: String}

}, {
    timestamps: true
})

module.exports = mongoose.model( 'Products', productSchema )