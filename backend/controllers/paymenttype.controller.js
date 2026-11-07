const asyncHandler = require("express-async-handler");
const PaymentTypes = require("../model/paymenttype.model");
const PaymentAccounts = require("../model/paymentaccount.model");
const fs = require("fs");
const path = require("path");
const imagekit = require("../config/imagekit.js");

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
      const accounts = await PaymentAccounts.find({
        payment_type_id: type._id,
      });

      return {
        ...type._doc, // spread the original payment type fields
        paymentAccounts: accounts, // add paymentAccounts array
      };
    }),
  );
  res.status(200).json(typesWithAccounts);
});

// @desc    Create new payment type
// @route   POST /api/payment-types
// @access  Private
const setPaymentType = asyncHandler(async (req, res) => {
  const { type_name, type_image, typeImageFileId } = req.body;

  const userId = req.users._id;

  const paymentType = await PaymentTypes.create({
    userId,
    type_name,
    type_image,
    typeImageFileId,
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
    throw new Error("Payment type not found!");
  }

  const oldFileId = paymentType.typeImageFileId;

  const updated = await PaymentTypes.findByIdAndUpdate(
    req.params.id,
    {
      type_name: req.body.type_name,
      type_image: req.body.type_image,
      typeImageFileId: req.body.typeImageFileId,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  // Delete old ImageKit image only after MongoDB update succeeds
  const newFileId = updated.typeImageFileId;

  if (oldFileId && oldFileId !== newFileId) {
    try {
      await imagekit.deleteFile(oldFileId);
    } catch (error) {
      console.error("Old ImageKit image deletion failed:", error.message);
    }
  }

  res.status(200).json(updated);
});

// @desc    Delete a payment type
// @route   DELETE /api/payment-types/:id
// @access  Private
const deletePaymentType = asyncHandler(async (req, res) => {
  const paymentType = await PaymentTypes.findById(req.params.id);

  if (!paymentType) {
    res.status(404);
    throw new Error("Payment type not found!");
  }

  const fileId = paymentType.typeImageFileId;

  // Delete MongoDB document
  await PaymentTypes.findByIdAndDelete(req.params.id);

  // Delete ImageKit image
  if (fileId) {
    try {
      await imagekit.deleteFile(fileId);
    } catch (error) {
      console.error("ImageKit image deletion failed:", error.message);
    }
  }

  res.status(200).json({
    _id: paymentType._id,
    message: "Payment type deleted successfully",
  });
});

module.exports = {
  getPaymentTypes,
  setPaymentType,
  updatePaymentType,
  deletePaymentType,
};
