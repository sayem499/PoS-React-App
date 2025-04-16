const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../model/user.model");

//@desc GET users
//@route GET/api/users
//@acess Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await Users.find();
  res.status(200).json(users);
});

//@desc Register new users
//@route POST /api/users/register
//@acess Private
const registerUser = asyncHandler(async (req, res) => {
  const { userName, userPassword, userType, adminUser } = req.body;

  // Validate required fields
  if (!userName || !userPassword || !userType) {
    res.status(400);
    throw new Error("Required user fields are missing!");
  }

  // Check if username already exists
  const userExists = await Users.findOne({ userName });
  if (userExists) {
    res.status(400);
    throw new Error("Username already exists!");
  }

  // For non-admin users (e.g. employees), adminUser must be valid
  let adminUserId = null;
  if (userType !== "admin") {
    if (!adminUser) {
      res.status(400);
      throw new Error("Admin user ID is required for non-admin users!");
    }

    const admin = await Users.findById(adminUser);
    if (!admin || admin.userType !== "admin") {
      res.status(400);
      throw new Error("Invalid admin user ID provided!");
    }

    adminUserId = admin._id;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userPassword, salt);

  // Create the user
  const user = await Users.create({
    userName,
    userPassword: hashedPassword,
    userType,
    adminUser: adminUserId, // Will be null for admin users
  });

  //Check whether user is created successfully or not
  if (user) {
    res.status(201).json({
      _id: user.id,
      userName: user.userName,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!");
  }
});

//@desc Authenticate current user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { userName, userPassword } = req.body;

  const user = await Users.findOne({ userName });

  if (user && (await bcrypt.compare(userPassword, user.userPassword))) {
    res.json({
      _id: user.id,
      userName: user.userName,
      userType: user.userType,
      ...(user.userType !== "admin" && { adminUser: user.adminUser }),
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials!");
  }
});

//desc Update user
//@route PUT/api/users/:id
//@access Private
const updateUser = asyncHandler(async (req, res) => {
  // Make sure only admins can update users
  if (req.users.userType !== "admin") {
    res.status(403);
    throw new Error("Access denied! Only admins can update users.");
  }

  const user = await Users.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  const { userName, userType, userPassword } = req.body;

  // Build update object conditionally
  const updateData = {
    userName: userName || user.userName,
    userType: userType || user.userType,
  };

  // 🔒 Set adminUser only if the updated user is not admin
  const effectiveUserType = userType || user.userType;
  if (effectiveUserType !== "admin") {
    updateData.adminUser = req.users._id;
  }

  // Only hash password if a new one is provided
  if (userPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    updateData.userPassword = hashedPassword;
  }

  const updatedUser = await Users.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  res.status(200).json({
    _id: updatedUser.id,
    userName: updatedUser.userName,
    userType: updatedUser.userType,
    ...(updatedUser.userType !== "admin" && {
      adminUser: updatedUser.adminUser,
    }),
  });
});

//desc Delete user
//@route DELETE /api/users/:id
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = Users.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  await user.deleteOne();
  res.status(200).json({ message: `Deleted user ${req.params.id}` });
});

//@desc Get current user
//@route Get /api/users/me
//@access Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id, userName } = await Users.findById(req.users.id);

  res.status(200).json({
    id: _id,
    userName: userName,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
};
