const express = require('express')
const cors = require('cors')
const {errorHandler} = require('./middleware/errorMiddleware.js')
const connectDB = require('./config/db.js')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

connectDB()

//app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use('/api/sales', require('./routes/sale.routes'))
app.use('/api/products', require('./routes/product.routes'))
app.use('/api/users', require('./routes/user.routes'))
app.use('/api/customers', require('./routes/customer.routes'))


app.use(errorHandler)






app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
} )


