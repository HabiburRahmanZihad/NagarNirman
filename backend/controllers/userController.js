// User Controller
import User from '../models/User.js';
import Report from '../models/Report.js';
import Task from '../models/Task.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Authority only)
export const getUsers = asyncHandler(async (req, res) => {
  const { role, district, approved, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (district) filter.district = district;
  if (approved !== undefined) filter.approved = approved === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Apply to become problem solver/NGO
// @route   POST /api/users/apply-problem-solver
// @access  Private
export const applyProblemSolver = asyncHandler(async (req, res) => {
  const { role } = req.body; // 'problemSolver' or 'ngo'

  if (!['problemSolver', 'ngo'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be problemSolver or ngo',
    });
  }

  const user = await User.findById(req.user.id);

  if (user.role === 'problemSolver' || user.role === 'ngo') {
    return res.status(400).json({
      success: false,
      message: 'You are already a problem solver/NGO',
    });
  }

  user.role = role;
  user.approved = false; // Requires authority approval
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Application submitted successfully. Awaiting approval.',
    data: user.getPublicProfile(),
  });
});

// @desc    Approve/Reject problem solver application
// @route   PATCH /api/users/:id/approve
// @access  Private (Authority only)
export const approveUser = asyncHandler(async (req, res) => {
  const { approved } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (user.role !== 'problemSolver' && user.role !== 'ngo') {
    return res.status(400).json({
      success: false,
      message: 'User is not a problem solver/NGO',
    });
  }

  user.approved = approved;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${approved ? 'approved' : 'rejected'} successfully`,
    data: user.getPublicProfile(),
  });
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Check authorization
  if (req.user.id !== userId && req.user.role !== 'authority') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view these statistics',
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  let stats = {
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
    totalTasks: 0,
    completedTasks: 0,
    points: user.points || 0,
  };

  // Stats for regular users
  if (user.role === 'user') {
    const reports = await Report.find({ createdBy: userId });
    stats.totalReports = reports.length;
    stats.pendingReports = reports.filter(r => r.status === 'pending').length;
    stats.inProgressReports = reports.filter(r => r.status === 'inProgress').length;
    stats.resolvedReports = reports.filter(r => r.status === 'resolved').length;
  }

  // Stats for problem solvers
  if (user.role === 'problemSolver' || user.role === 'ngo') {
    const tasks = await Task.find({ assignedTo: userId });
    stats.totalTasks = tasks.length;
    stats.completedTasks = tasks.filter(t => t.status === 'completed').length;
  }

  // Stats for authorities
  if (user.role === 'authority') {
    const districtReports = await Report.find({ 'location.district': user.district });
    stats.totalReports = districtReports.length;
    stats.pendingReports = districtReports.filter(r => r.status === 'pending').length;
    stats.inProgressReports = districtReports.filter(r => r.status === 'inProgress').length;
    stats.resolvedReports = districtReports.filter(r => r.status === 'resolved').length;
  }

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const leaderboard = await User.find({
    role: { $in: ['problemSolver', 'ngo'] },
    approved: true,
  })
    .select('name email district role points avatar')
    .sort({ points: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: leaderboard.length,
    data: leaderboard,
  });
});

// @desc    Deactivate/Activate user
// @route   PATCH /api/users/:id/status
// @access  Private (Authority only)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.isActive = isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: user.getPublicProfile(),
  });
});
