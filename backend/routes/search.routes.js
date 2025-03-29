const express = require('express')
const router = express.Router()
const {searchProduct} = require('../controllers/product.controller.js')
const {protect} = require('../middleware/authMiddleware.js')

router.route('/search-product').post(protect, searchProduct)

module.exports = router