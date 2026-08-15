const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'classflow_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user / Admin
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, organizationCode, organizationName } = req.body;

    let org;
    if (organizationCode) {
      org = await Organization.findOne({ code: organizationCode.toUpperCase() });
    }

    if (!org) {
      org = await Organization.create({
        name: organizationName || 'Imperial Institute of Technology',
        code: (organizationCode || 'IIT-MAIN').toUpperCase(),
        contactEmail: email,
        settings: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          timeSlots: [
            { slotIndex: 0, startTime: '09:00', endTime: '10:00', label: 'Period 1' },
            { slotIndex: 1, startTime: '10:00', endTime: '11:00', label: 'Period 2' },
            { slotIndex: 2, startTime: '11:00', endTime: '12:00', label: 'Period 3' },
            { slotIndex: 3, startTime: '12:00', endTime: '13:00', isBreak: true, label: 'Lunch Break' },
            { slotIndex: 4, startTime: '13:00', endTime: '14:00', label: 'Period 4' },
            { slotIndex: 5, startTime: '14:00', endTime: '15:00', label: 'Period 5' },
            { slotIndex: 6, startTime: '15:00', endTime: '16:00', label: 'Period 6' },
          ]
        }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
      organizationId: org._id,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organization: org,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('organizationId');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId._id,
        organization: user.organizationId,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('organizationId')
      .populate('departmentId')
      .populate('facultyProfile')
      .populate('studentProfile');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
