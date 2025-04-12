const express = require('express');
const router = express.Router();

const {
  getPaymentTypes,
  setPaymentType,
  updatePaymentType,
  deletePaymentType
} = require('../controllers/paymenttype.controller.js');

const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPaymentTypes)
  .post(protect, setPaymentType);

router.route('/:id')
  .put(protect, updatePaymentType)
  .delete(protect, deletePaymentType);

module.exports = router;