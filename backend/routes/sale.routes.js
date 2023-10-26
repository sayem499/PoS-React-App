const express = require('express')
const router = express.Router()
const {
    getSales,
    setSales,
    updateSales,
    deleteSale
} = require('../controllers/sale.controller.js')
const {protect} = require('../middleware/authMiddleware.js')


router.route('/').get(protect, getSales).post(protect, setSales)
router.route('/:id').put(protect, updateSales).delete(protect, deleteSale)

module.exports = router