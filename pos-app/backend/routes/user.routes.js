const express = require('express')
const router = express.Router()

const {getUsers, 
      registerUser, 
      loginUser,
      getCurrentUser,
      updateUser,
      deleteUser,
} 
      = require('../controllers/user.controller')

const {protect} = require('../middleware/authMiddleware')
router.route('/:id').put(protect, updateUser).delete(protect, deleteUser)
router.route('/').get(getUsers)
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, getCurrentUser)


module.exports = router