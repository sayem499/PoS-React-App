const express = require("express");
const router = express.Router();

const { upload, imageUpload } = require("../controllers/image.controller.js");

const { protect } = require("../middleware/authMiddleware");

router.route("/:category").post(protect, upload.single("image"), imageUpload);

module.exports = router;
