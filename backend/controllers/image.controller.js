const asyncHandler = require('express-async-handler')
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const imageCategories = ['logos', 'profiles', 'products'];


//@dec Configure Multer Storage for Dynamic Destination
//@route no route
//@access no access
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const category = req.params.category; // Get category from URL
        if (!imageCategories.includes(category)) {
            return cb(new Error('Invalid image category'), null);
        }
        cb(null, `uploads/${category}/`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

//@dec Set images
//@route POST/api/uploads/upload/:category
//@access Private
const imageUpload = asyncHandler( async (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.json({
            message: 'File uploaded successfully',
            filePath: `/uploads/${req.file.filename}`
        });
    });
});


module.exports = {
    imageUpload
}