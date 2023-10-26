const mongoose = require('mongoose')

const supplierSchema = mongoose.Schema({
    supplierProducts: {type: Array, required: true},
    supplierName: {type: String, required: true},
    supplierPhoneNumber: {type: String},
    supplierAddress: {type:String},
    supplierEmail: {type: String}
})

module.exports = mongoose.model('Sppliers', supplierSchema)