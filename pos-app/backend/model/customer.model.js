const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    customerName: { type: String, required: true},
    customerPhoneNumber: { type: String, required: true},
    customerTotalExpenditure: { type: Number, required: true},
    customerTotalTrades: { type: Number, required: true },
})

module.exports = mongoose.model( 'Customers', customerSchema )