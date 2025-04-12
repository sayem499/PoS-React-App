const asyncHandler = require('express-async-handler');
const PaymentAccounts = require('../model/paymentaccount.model');

// @desc    Get all payment accounts
// @route   GET /api/payment-accounts
// @access  Private
const getPaymentAccounts = asyncHandler(async (req, res) => {
  const accounts = await PaymentAccounts.find();
  res.status(200).json(accounts);
});

// @desc    Create new payment account
// @route   POST /api/payment-accounts
// @access  Private
const setPaymentAccount = asyncHandler(async (req, res) => {
  const {
    user_id,
    payment_type_id,
    account_name,
    account_number,
    branch_name
  } = req.body;

  const account = await PaymentAccounts.create({
    user_id,
    payment_type_id,
    account_name,
    account_number,
    branch_name
  });

  res.status(201).json(account);
});

// @desc    Update a payment account
// @route   PUT /api/payment-accounts/:id
// @access  Private
const updatePaymentAccount = asyncHandler(async (req, res) => {
  const account = await PaymentAccounts.findById(req.params.id);

  if (!account) {
    res.status(404);
    throw new Error('Payment account not found!');
  }

  const updated = await PaymentAccounts.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updated);
});

// @desc    Delete a payment account
// @route   DELETE /api/payment-accounts/:id
// @access  Private
const deletePaymentAccount = asyncHandler(async (req, res) => {
  const account = await PaymentAccounts.findById(req.params.id);

  if (!account) {
    res.status(404);
    throw new Error('Payment account not found!');
  }

  await account.deleteOne();

  res.status(200).json({ message: `Deleted Payment Account ${req.params.id}` });
});

module.exports = {
  getPaymentAccounts,
  setPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount
};