const User = require('../models/User');
const StaffProfile = require('../models/StaffProfile');
const generateToken = require('../utils/generateToken');

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password,
      phone: phone ? phone.trim() : '',
      role: 'customer'
    });

    const token = generateToken(user._id, user.role);

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: userPayload,
      data: {
        ...userPayload,
        token
      }
    });
  } catch (error) {
    console.error('[Register Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.role);

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: userPayload,
      data: {
        ...userPayload,
        token
      }
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let staffInfo = null;
    if (user.role === 'staff') {
      staffInfo = await StaffProfile.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        staffProfile: staffInfo
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error fetching user profile'
    });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, profileImage, password } = req.body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (password) user.passwordHash = password;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
