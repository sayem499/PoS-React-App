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
        console.log(category)
        if (!imageCategories.includes(category)) {
            return cb(new Error('Invalid image category'), null);
        }
        const uploadPath = path.join(__dirname, '..', 'uploads', category);

        // ✅ Ensure the directory exists before saving the file
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Create folder recursively
        }
        cb(null, uploadPath);
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

        // Construct the full file URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // ✅ Delete previous image if provided and valid
        if (req.body.previousImageUrl) {
            try {
                const previousImagePath = path.join(
                    __dirname,
                    '..',
                    req.body.previousImageUrl.replace(`${req.protocol}://${req.get('host')}/`, '')
                );

                if (fs.existsSync(previousImagePath)) {
                    fs.unlinkSync(previousImagePath);
                    console.log('Previous image deleted:', previousImagePath);
                }
            } catch (error) {
                console.error('Error deleting previous image:', error);
            }
        }

        res.json({
            message: 'File uploaded successfully',
            filePath: fileUrl
        });
    });
});


module.exports = {
    imageUpload
}