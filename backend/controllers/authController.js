// Authentication Controller (Native MongoDB)
import jwt from 'jsonwebtoken';
import {
  createUser,
  getUserByEmailWithPassword,
  getUserById,
  updateUser,
  updateUserPassword,
  getPublicProfile,
  matchPassword,
} from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendWelcomeEmail } from '../services/emailService.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, division, district, role, avatar } = req.body;

  try {
    // Create user (will throw error if validation fails or user exists)
    const user = await createUser({
      name,
      email,
      password,
      division,
      district,
      role: role || 'user',
      avatar,
    });

    const token = generateToken(user._id);
    const userProfile = getPublicProfile(user);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user).catch(err =>
      console.error('Failed to send welcome email:', err)
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userProfile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  // Get user with password
  const user = await getUserByEmailWithPassword(email);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if password matches
  const isMatch = await matchPassword(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated',
    });
  }

  const token = generateToken(user._id);
  const userProfile = getPublicProfile(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: userProfile,
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, district, avatar } = req.body;

  const updateData = {};
  if (name) updateData.name = name.trim();
  if (district) updateData.district = district;
  if (avatar) updateData.avatar = avatar;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update',
    });
  }

  const user = await updateUser(req.user.id, updateData);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters',
    });
  }

  // Get user with password
  const user = await getUserByIdWithPassword(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Check if current password is correct
  const isMatch = await matchPassword(currentPassword, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Update password
  await updateUserPassword(req.user.id, newPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});
