const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Users = require('../model/user.model')

//@desc GET users
//@route GET/api/users
//@acess Private
const getUsers = asyncHandler( async (req, res) => {
    const users = await Users.find()
    res.status(200).json(users)
})


//@desc Register new users
//@route POST /api/users/register
//@acess Private
const registerUser = asyncHandler( async (req, res) => {
    const {userName, userPassword, userType} = req.body

    //Check whether the field is empty or not.
    if(!req.body.userName && !req.body.userType && !req.body.userPassword){
        res.status(400)
        throw new Error('User field error!')
    }

    //Check whether the user exists or not.
    const userExists = await Users.findOne({userName})
    if(userExists){
        res.status(400)
        throw new Error('Username already exists!')
    }

    //Generate Salt & Password hash.
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userPassword, salt)
    
    //Create user
    const users = await Users.create({
        userName: userName,
        userPassword: hashedPassword,
        userType: userType
        
    })

    //Check whether user is created successfully or not
    if(users){
    
        res.status(201).json({
            _id: users.id,
            userName: users.userName,
            userType: users.userType,
            token: generateToken(users._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data!')
    }
})

//@desc Authenticate current user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler( async (req, res) => {
    const {userName, userPassword } = req.body

    const user = await Users.findOne({userName})
    if(user && (await bcrypt.compare(userPassword, user.userPassword))){
        res.json({
            _id: user.id,
            userName: user.userName,
            userType: user.userType,
            token: generateToken(user._id)  
        })
    }else{
        res.status(400)
        throw new Error('Invalid credentials!')
    }
    
})

//desc Update user
//@route PUT/api/users/:id
//@access Private
const updateUser = asyncHandler( async(req, res) => {
    const user = Users.findById(req.params.id)

    if(!user){
        res.status(400)
        throw new Error('User not found!')
    }
    const {userName, userType, userPassword} = req.body

    //Generate Salt & Password hash.
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userPassword, salt)
    
    const incryptedPasswordData = {
        userName: userName,
        userPassword: hashedPassword,
        userType: userType,

    }

    const updatedUser = await Users.findByIdAndUpdate(req.params.id, incryptedPasswordData, {new: true})
    res.status(200).json(updatedUser)
})

//desc Delete user
//@route DELETE /api/users/:id
//@access Private
const deleteUser = asyncHandler( async(req, res) => {
    const user = Users.findById(req.params.id)
    if(!user){
        res.status(400)
        throw new Error('User not found!')
    }

    await user.deleteOne()
    res.status(200).json({message: `Deleted user ${req.params.id}`})

})

//@desc Get current user
//@route Get /api/users/me
//@access Private
const getCurrentUser = asyncHandler( async (req, res) => {
    const {_id, userName } = await Users.findById(req.users.id)

    res.status(200).json({
        id: _id,
        userName: userName,
    })
})


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    }) 
}


module.exports = {
    getUsers,
    registerUser,
    loginUser,
    getCurrentUser,
    updateUser,
    deleteUser,
}