const asyncHandler = require('express-async-handler');
const PaymentTypes = require('../model/paymenttype.model');
const PaymentAccounts = require('../model/paymentaccount.model');

// @desc    Get all payment types
// @route   GET /api/payment-types
// @access  Private
const getPaymentTypes = asyncHandler(async (req, res) => {
  const userIdV = req.users._id;
  // First, get the payment types of the user
  const types = await PaymentTypes.find({ user_id: userIdV });

  // Then for each type, fetch its related payment accounts
  const typesWithAccounts = await Promise.all(
    types.map(async (type) => {
      const accounts = await PaymentAccounts.find({ payment_type_id: type._id });

      return {
        ...type._doc, // spread the original payment type fields
        paymentAccounts: accounts, // add paymentAccounts array
      };
    })
  );
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