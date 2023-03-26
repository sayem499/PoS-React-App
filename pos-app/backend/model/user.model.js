const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName:{ type: String, required: true, unique: true },
    userType:{ type: String, required: true},
    userPassword: { type: String, required: true}
}, {
    timestamps: true,
})


module.exports = mongoose.model("Users", userSchema)