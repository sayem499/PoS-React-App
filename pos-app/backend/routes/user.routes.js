const express = require('express')
const router = express.Router()

const {getUsers, 
      registerUser, 
      loginUser,
      getCurrentUser} 
      = require('../controllers/user.controller')

const {protect} = require('../middleware/authMiddleware')

router.route('/').get(getUsers)
router.route('/authenticate').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, getCurrentUser)


module.exports = router