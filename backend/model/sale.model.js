const mongoose = require('mongoose')

const saleSchema = mongoose.Schema({
    products:{ type: Array, required:true},
    userId:{ type:String, required:true },
    invoiceId: { type:String, requred:true},
    saleSubTotal: {type: Number, required: true},
    saleVAT: {type:Number, required: true},
    saleDiscount: {type:Number, required: true},
    saleTotal: {type: Number, required:true},
    saleTotalCost: {type: Number, required: true},
    salePayType: {type: String, required: true},
    salePayByCard: {type: Number, required: true},
    salePayByCash: {type: Number, required:true},
    saleTime: {type: String},
    saleDate: {type: String, default: Date.now},
    saleServedBy: {type: String, required:true},
    saleLessAdjustment: { type: String },
    saleVATAmount: { type: Number, required: true},
    saleDiscountAmount: { type: Number, required: true},
    saleCustomerName: { type: String, },
    saleCustomerPhoneNumber: { type: String, },
    saleCashPaid: { type: Number },
    saleChange: {type: Number},
},{
    timestamps: true,
})

module.exports = mongoose.model('Sales',saleSchema)