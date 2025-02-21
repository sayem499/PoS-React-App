const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/user.model')

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.users = await User.findById(decode.id).select('-userPassword');
            
            if (!req.users) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
            return;

        } catch (error) {
            console.error('JWT Error:', error.message);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
});

module.exports = { protect }