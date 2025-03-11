const express = require('express')
const router = express.Router()

const { imageUpload } = require('../controllers/image.controller.js')
const { protect } = require('../middleware/authMiddleware')

router.route('/:category').post(protect, imageUpload)
module.exports = router