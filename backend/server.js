require('dotenv').config();
const path = require('path');
const express = require('express')
const cors = require('cors')
const {errorHandler} = require('./middleware/errorMiddleware.js')
const connectDB = require('./config/db.js')
const fs = require('fs')

const imageCategories = ['logos', 'profiles', 'products'];
const app = express()
const port = process.env.SERVER_PORT || 5000

imageCategories.forEach(category => {
    const dir = path.join(__dirname, 'uploads', category);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

connectDB()

app.use(cors({origin:true, credentials:true}))
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use('/api/sales', require('./routes/sale.routes'))
app.use('/api/purchases', require('./routes/purchase.routes'))
app.use('/api/products', require('./routes/product.routes'))
app.use('/api/users', require('./routes/user.routes'))
app.use('/api/customers', require('./routes/customer.routes'))
app.use('/api/suppliers', require('./routes/supplier.routes'))
app.use('/api/uploads', require('./routes/image.routes'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


if(process.env.NODE_ENV === "production"){
    const _rootdire = path.resolve()
    app.use(express.static(path.join(_rootdire, '/build')))
    app.get('*', (req, res) => res.sendFile(path.resolve(_rootdire, 'build', 'index.html')))
}else{
    app.get('/', (req, res) => res.send('Server is ready.'))
}



app.use(errorHandler)






app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
} )


