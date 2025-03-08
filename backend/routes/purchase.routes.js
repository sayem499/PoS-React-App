const express = require('express')
const router = express.Router()
const {getPurchase, 
       setPurchase, 
       updatePurchase, 
       deletePurchase,
       getPurchaseById} 
       = require('../controllers/purchase.controller.js')
const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getPurchase).post(protect, setPurchase)       
router.route('/:id').put(protect, updatePurchase).delete(protect, deletePurchase).get(protect, getPurchaseById)


module.exports = router