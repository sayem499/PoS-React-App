const express = require('express')
const router = express.Router()
const {getProducts, 
       setProducts, 
       updateProduct,
       getProductById, 
       deleteProduct} 
       = require('../controllers/product.controller.js')
const {protect} = require('../middleware/authMiddleware')      



router.route('/').get(protect, getProducts).post(protect, setProducts)       
router.route('/:id').put(protect, updateProduct).delete(protect, deleteProduct).get(protect, getProductById)


module.exports = router

