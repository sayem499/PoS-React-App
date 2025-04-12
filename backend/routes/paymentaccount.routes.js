const express = require('express');
const router = express.Router();

const {
  getPaymentAccounts,
  setPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount
} = require('../controllers/paymentaccount.controller.js');

const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPaymentAccounts)
  .post(protect, setPaymentAccount);

router.route('/:id')
  .put(protect, updatePaymentAccount)
  .delete(protect, deletePaymentAccount);

module.exports = router;