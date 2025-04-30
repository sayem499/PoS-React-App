const asyncHandler = require('express-async-handler');
const PaymentTypes = require('../model/paymenttype.model');
const PaymentAccounts = require('../model/paymentaccount.model');
const fs = require('fs');
const path = require('path');

// @desc    Get all payment types
// @route   GET /api/payment-types
// @access  Private
const getPaymentTypes = asyncHandler(async (req, res) => {
  const userIdV = req.users._id;
  // First, get the payment types of the user
  const types = await PaymentTypes.find({ userId: userIdV });

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
  res.status(200).json(typesWithAccounts);
});

// @desc    Create new payment type
// @route   POST /api/payment-types
// @access  Private
const setPaymentType = asyncHandler(async (req, res) => {
  const { type_name, type_image } = req.body;
  const userId = req.users._id;
  const paymentType = await PaymentTypes.create({
    userId,
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
const deletePaymentType = async (req, res) => {
  try {
      const paymentType = await PaymentTypes.findById(req.params.id);
      if (!paymentType) {
          return res.status(404).json({ message: 'Payment type not found' });
      }

      // Extract filename from URL
      const imageUrl = paymentType.type_image;
      if (imageUrl) {
          const filename = imageUrl.split('/uploads/paymentTypes/')[1]; // Get filename only
          const filePath = path.join(__dirname, '..', 'uploads', 'paymentTypes', filename);

          // Delete the file if it exists
          if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
          }
      }

      // Then delete the database document
      await PaymentTypes.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: 'Payment type and image deleted successfully' });
  } catch (error) {
      console.error('Error deleting payment type:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPaymentTypes,
  setPaymentType,
  updatePaymentType,
  deletePaymentType
};