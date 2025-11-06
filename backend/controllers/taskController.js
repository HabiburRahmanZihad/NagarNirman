// Task Controller
import Task from '../models/Task.js';
import Report from '../models/Report.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { status, assignedTo, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;

  // If user is problemSolver/ngo, only show their tasks
  if (req.user.role === 'problemSolver' || req.user.role === 'ngo') {
    filter.assignedTo = req.user.id;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tasks = await Task.find(filter)
    .populate('reportId', 'title description location status photoURL')
    .populate('assignedTo', 'name email role points')
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('reportId')
    .populate('assignedTo', 'name email role points')
    .populate('assignedBy', 'name email');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user is authorized to view this task
  if (
    req.user.role !== 'authority' &&
    task.assignedTo._id.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this task',
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Assign task to problem solver
// @route   POST /api/tasks/assign
// @access  Private (Authority only)
export const assignTask = asyncHandler(async (req, res) => {
  const { reportId, assignedTo, deadline, notes } = req.body;

  // Check if report exists
  const report = await Report.findById(reportId);
  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  // Check if user exists and is a problem solver
  const solver = await User.findById(assignedTo);
  if (!solver || (solver.role !== 'problemSolver' && solver.role !== 'ngo')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid problem solver',
    });
  }

  // Check if solver is approved
  if (!solver.approved) {
    return res.status(400).json({
      success: false,
      message: 'Problem solver is not approved yet',
    });
  }

  // Check if task already exists for this report
  const existingTask = await Task.findOne({ reportId, status: { $in: ['pending', 'inProgress'] } });
  if (existingTask) {
    return res.status(400).json({
      success: false,
      message: 'An active task already exists for this report',
    });
  }

  // Create task
  const task = await Task.create({
    reportId,
    assignedTo,
    assignedBy: req.user.id,
    deadline,
    notes,
  });

  // Update report
  report.assignedTo = assignedTo;
  report.status = 'inProgress';
  report.history.push({
    status: 'inProgress',
    updatedBy: req.user.id,
    date: new Date(),
    note: `Task assigned to ${solver.name}`,
  });
  await report.save();

  const populatedTask = await Task.findById(task._id)
    .populate('reportId', 'title description location')
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Task assigned successfully',
    data: populatedTask,
  });
});

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check authorization
  if (
    req.user.role !== 'authority' &&
    task.assignedTo.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task',
    });
  }

  task.status = status;
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate('reportId')
    .populate('assignedTo', 'name email');

  res.status(200).json({
    success: true,
    message: 'Task status updated successfully',
    data: updatedTask,
  });
});

// @desc    Submit task completion
// @route   POST /api/tasks/:id/complete
// @access  Private (Problem Solver only)
export const completeTask = asyncHandler(async (req, res) => {
  const { proofURL, proofDescription } = req.body;

  const task = await Task.findById(req.params.id).populate('reportId');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user is the assigned solver
  if (task.assignedTo.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to complete this task',
    });
  }

  // Update task
  task.status = 'completed';
  task.proofURL = proofURL;
  task.proofDescription = proofDescription;
  task.completedAt = new Date();
  await task.save();

  // Update report status
  const report = task.reportId;
  report.status = 'resolved';
  report.history.push({
    status: 'resolved',
    updatedBy: req.user.id,
    date: new Date(),
    note: 'Task completed by problem solver',
  });
  await report.save();

  const updatedTask = await Task.findById(task._id)
    .populate('reportId')
    .populate('assignedTo', 'name email');

  res.status(200).json({
    success: true,
    message: 'Task marked as completed',
    data: updatedTask,
  });
});

// @desc    Grant reward for completed task
// @route   POST /api/tasks/:id/reward
// @access  Private (Authority only)
export const grantReward = asyncHandler(async (req, res) => {
  const { rewardPoints, rating, feedback } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  if (task.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Task must be completed before granting reward',
    });
  }

  if (task.rewardGranted) {
    return res.status(400).json({
      success: false,
      message: 'Reward already granted for this task',
    });
  }

  // Update task
  task.rewardGranted = true;
  task.rewardPoints = rewardPoints || 10;
  task.rating = rating;
  task.feedback = feedback;
  await task.save();

  // Update user points
  const solver = await User.findById(task.assignedTo);
  solver.points = (solver.points || 0) + task.rewardPoints;
  await solver.save();

  res.status(200).json({
    success: true,
    message: 'Reward granted successfully',
    data: task,
  });
});

// @desc    Get user's tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
export const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id })
    .populate('reportId', 'title description location status')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});
