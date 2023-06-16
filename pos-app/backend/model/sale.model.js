const mongoose = require('mongoose')

const saleSchema = mongoose.Schema({
    saleTitle: {type: String, required: true},
    saleQuantity: {type: Number, required: true},
    saleTotal: {type: Number, required:true},
    salePayType: {type: String, required: true},
    salePayByCard: {type: Number, required: true},
    salePayByCash: {type: Number, required:true},
    saleTime: {type: String},
    saleDate: {type: Date, default: Date.now},
},{
    timestamps: true,
})

module.exports = mongoose.model('Sales',saleSchema)