const mongoose = require('mongoose')

const saleSchema = mongoose.Schema({
    products:{ type: Array, required:true},
    saleSubTotal: {type: Number, required: true},
    saleVAT: {type:Number, required: true},
    saleDiscount: {type:Number, required: true},
    saleTotal: {type: Number, required:true},
    salePayType: {type: String, required: true},
    salePayByCard: {type: Number, required: true},
    salePayByCash: {type: Number, required:true},
    saleTime: {type: String},
    saleDate: {type: String, default: Date.now},
    saleServedBy: {type: String, required:true},
    saleLessAdjustment: { type: String },
    saleVATAmount: { type: Number, required: true},
    saleDiscountAmount: { type: Number, required: true},
},{
    timestamps: true,
})

module.exports = mongoose.model('Sales',saleSchema)