const express = require('express')
const router = express.Router()


const { getCustomers,
        setCustomers,
        updateCustomer,
        deleteCustomer }
        = require('../controllers/customer.controller.js')

const { protect } = require('../middleware/authMiddleware')


router.route('/').get(protect, getCustomers).post(protect, setCustomers)
router.route('/:id').put(protect,updateCustomer).delete(protect, deleteCustomer)


module.exports = router