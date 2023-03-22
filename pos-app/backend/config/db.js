const mongoose = require('mongoose')


const connectDB = async () => {
    try {
        const uri = process.env.ATLAS_URI
        const conn = await mongoose.connect(uri, {dbName:'PoSReactApp', useNewUrlParser: true }) 
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)

    }
}



module.exports = connectDB
