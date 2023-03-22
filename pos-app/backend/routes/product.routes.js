const express = require('express')
const router = express.Router()
const {getProducts, 
       setProducts, 
       updateProduct, 
       deleteProduct} 
       = require('../controllers/product.controller.js')



router.route('/').get(getProducts).post(setProducts)       
router.route('/:id').put(updateProduct).delete(deleteProduct)


module.exports = router

