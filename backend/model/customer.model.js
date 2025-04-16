const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Reference to the User model
        required: true,
    },
    customerName: { type: String, required: true},
    customerPhoneNumber: { type: String, required: true},
    customerTotalExpenditure: { type: Number, required: true},
    customerTotalTrades: { type: Number, required: true },
})

module.exports = mongoose.model( 'Customers', customerSchema )