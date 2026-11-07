const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imagekit = require("../config/imagekit");

const imageCategories = ["logos", "profiles", "products", "paymentTypes"];

const { uploadDirectory } = require("../config/uploadStorage");

//@dec Configure Multer Storage for Dynamic Destination
//@route no route
//@access no access
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP and GIF images are allowed."));
    }
  },
});

//@dec Set images
//@route POST/api/uploads/upload/:category
//@access Private
const imageUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please select an image.");
  }

  const { category } = req.params;

  const allowedCategories = ["logos", "profiles", "products", "paymentTypes"];

  if (!allowedCategories.includes(category)) {
    res.status(400);
    throw new Error("Invalid image category.");
  }

  const uploadedImage = await imagekit.upload({
    file: req.file.buffer,
    fileName: `${Date.now()}-${req.file.originalname}`,
    folder: `/my-app/${category}`,
    useUniqueFileName: true,
  });

  res.status(201).json({
    success: true,
    message: "Image uploaded successfully",
    image: {
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
      filePath: uploadedImage.filePath,
      name: uploadedImage.name,
    },
  });
});

module.exports = {
  upload,
  imageUpload,
};
