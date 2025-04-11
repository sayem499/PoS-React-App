const asyncHandler = require('express-async-handler');
const Accounts = require('../model/account.model'); // Adjust path if needed

//@desc Get all accounts
//@route GET /api/accounts
//@access Private
const getAccounts = asyncHandler(async (req, res) => {
    const accounts = await Accounts.find();
    res.status(200).json(accounts);
});

//@desc Create a new account
//@route POST /api/accounts
//@access Private
const setAccount = asyncHandler(async (req, res) => {
    const {
        user_id,
        invoice,
        sales_id,
        purchase_id,
        account_type,
        transaction_id,
        payment_type_id,
        payment_account_id,
        payment_amount,
        timestamp
    } = req.body;

    const account = await Accounts.create({
        user_id,
        invoice,
        sales_id,
        purchase_id,
        account_type,
        transaction_id,
        payment_type_id,
        payment_account_id,
        payment_amount,
        timestamp
    });

    res.status(201).json(account);
});

//@desc Update an account
//@route PUT /api/accounts/:id
//@access Private
const updateAccount = asyncHandler(async (req, res) => {
    const account = await Accounts.findById(req.params.id);

    if (!account) {
        res.status(404);
        throw new Error('Account not found!');
    }

    const updatedAccount = await Accounts.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedAccount);
});

//@desc Delete an account
//@route DELETE /api/accounts/:id
//@access Private
const deleteAccount = asyncHandler(async (req, res) => {
    const account = await Accounts.findById(req.params.id);

    if (!account) {
        res.status(404);
        throw new Error('Account not found!');
    }

    await account.deleteOne();

    res.status(200).json({ message: `Deleted Account ${req.params.id}` });
});

module.exports = {
    getAccounts,
    setAccount,
    updateAccount,
    deleteAccount
};