const asyncHandler = require('express-async-handler');
const PaymentTypes = require('../model/paymenttype.model');

// @desc    Get all payment types
// @route   GET /api/payment-types
// @access  Private
const getPaymentTypes = asyncHandler(async (req, res) => {
  const types = await PaymentTypes.find();
  res.status(200).json(types);
});

// @desc    Create new payment type
// @route   POST /api/payment-types
// @access  Private
const setPaymentType = asyncHandler(async (req, res) => {
  const { user_id, type_name, type_image } = req.body;

  const paymentType = await PaymentTypes.create({
    user_id,
    type_name,
    type_image
  });

  res.status(201).json(paymentType);
});

// @desc    Update a payment type
// @route   PUT /api/payment-types/:id
// @access  Private
const updatePaymentType = asyncHandler(async (req, res) => {
  const paymentType = await PaymentTypes.findById(req.params.id);

  if (!paymentType) {
    res.status(404);
    throw new Error('Payment type not found!');
  }

  const updated = await PaymentTypes.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updated);
});

// @desc    Delete a payment type
// @route   DELETE /api/payment-types/:id
// @access  Private
const deletePaymentType = asyncHandler(async (req, res) => {
  const paymentType = await PaymentTypes.findById(req.params.id);

  if (!paymentType) {
    res.status(404);
    throw new Error('Payment type not found!');
  }

  await paymentType.deleteOne();

  res.status(200).json({ message: `Deleted Payment Type ${req.params.id}` });
});

module.exports = {
  getPaymentTypes,
  setPaymentType,
  updatePaymentType,
  deletePaymentType
};