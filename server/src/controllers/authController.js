const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mealmate_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Hotel or Camp)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, organizationName, phone } = req.body;

    if (!name || !email || !password || !role || !organizationName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, role, organizationName, phone'
      });
    }

    // Role validation
    if (!['hotel', 'camp'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "hotel" or "camp"'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      organizationName,
      phone
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

// @desc    Get directory of registered hotels and camps
// @route   GET /api/auth/directory
// @access  Public
const getCommunityDirectory = async (req, res, next) => {
  try {
    const hotels = await User.find({ role: 'hotel' })
      .select('organizationName name phone email createdAt')
      .sort({ organizationName: 1 });

    const camps = await User.find({ role: 'camp' })
      .select('organizationName name phone email createdAt')
      .sort({ organizationName: 1 });

    res.status(200).json({
      success: true,
      data: {
        hotels,
        camps
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getCommunityDirectory
};
