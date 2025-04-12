const express = require('express');
const router = express.Router();

const {
    getAccounts,
    setAccount,
    updateAccount,
    deleteAccount
} = require('../controllers/account.controller.js');

const { protect } = require('../middleware/authMiddleware.js');

router.route('/')
    .get(protect, getAccounts)
    .post(protect, setAccount);

router.route('/:id')
    .put(protect, updateAccount)
    .delete(protect, deleteAccount);

module.exports = router;