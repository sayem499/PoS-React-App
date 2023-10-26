const express = require('express')
const router = express.Router()
const { 
    setSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
} = require('../controllers/supplier.controller')

const {protect} = require('../middleware/authMiddleware')

router.route('/').post(protect, setSupplier).get(protect, getSuppliers)
router.route('/:id').put(protect, updateSupplier).delete(protect, deleteSupplier)

module.exports = router