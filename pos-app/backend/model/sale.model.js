const mongoose = require('mongoose')

const saleSchema = mongoose.Schema({
    products:[{
        _id: {type: String },
        productID: {type: Number, required: true},
        productTitle: {type: String, required: true},
        productQuantity: {type: Number, required: true},
        productUnitPrice: {type: Number, required:true},
        productTotal: { type:Number, required: true },
    }],
    saleSubTotal: {type: Number, required: true},
    saleVAT: {type:Number, required: true},
    saleDiscount: {type:Number, required: true},
    saleTotal: {type: Number, required:true},
    salePayType: {type: String, required: true},
    salePayByCard: {type: Number, required: true},
    salePayByCash: {type: Number, required:true},
    saleTime: {type: String},
    saleDate: {type: Date, default: Date.now},
    saleServedBy: {type: String, required:true}
},{
    timestamps: true,
})

module.exports = mongoose.model('Sales',saleSchema)