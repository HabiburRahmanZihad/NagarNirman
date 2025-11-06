// Task Controller (Native MongoDB)
import { ObjectId } from 'mongodb';
import {
  createTask,
  getTaskById,
  findTasks,
  updateTask,
  updateTaskStatus,
  submitTaskProof,
  verifyTask,
  getTasksByUserId,
} from '../models/Task.js';
import { getReportById, updateReportStatus } from '../models/Report.js';
import { getUserById, incrementUserPoints } from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private (Authority)
export const getTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

  const result = await findTasks(filter, {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
  });

  res.status(200).json({
    success: true,
    count: result.tasks.length,
    pagination: result.pagination,
    data: result.tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Assign task
// @route   POST /api/tasks/assign
// @access  Private (Authority)
export const assignTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    report,
    assignedTo,
    priority,
    deadline,
  } = req.body;

  if (!title || !description || !report || !assignedTo) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  try {
    // Verify report exists
    const reportExists = await getReportById(report);
    if (!reportExists) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Verify user exists and is approved
    const user = await getUserById(assignedTo);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Assigned user not found',
      });
    }

    if (!user.approved) {
      return res.status(400).json({
        success: false,
        message: 'User is not approved to receive tasks',
      });
    }

    // Create task
    const task = await createTask({
      title,
      description,
      report,
      assignedTo,
      assignedBy: req.user.id,
      priority: priority || 'medium',
      deadline,
    });

    // Update report status to in-progress
    await updateReportStatus(report, 'in-progress', `Task assigned: ${title}`, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Task assigned successfully',
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const changeTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Please provide status',
    });
  }

  try {
    const task = await updateTaskStatus(req.params.id, status);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Complete task
// @route   POST /api/tasks/:id/complete
// @access  Private (Solver - Approved)
export const completeTask = asyncHandler(async (req, res) => {
  const { proofUrl, notes } = req.body;

  if (!proofUrl) {
    return res.status(400).json({
      success: false,
      message: 'Please provide proof URL',
    });
  }

  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if task is assigned to current user
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this task',
      });
    }

    const updatedTask = await submitTaskProof(req.params.id, proofUrl, notes);

    res.status(200).json({
      success: true,
      message: 'Task marked as completed',
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Grant reward for completed task
// @route   POST /api/tasks/:id/reward
// @access  Private (Authority)
export const grantReward = asyncHandler(async (req, res) => {
  const { points, rating, feedback } = req.body;

  if (!points) {
    return res.status(400).json({
      success: false,
      message: 'Please provide reward points',
    });
  }

  try {
    const task = await getTaskById(req.params.id);

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

    // Verify task and award points
    const updatedTask = await verifyTask(req.params.id, points, rating, feedback);

    // Increment user points
    await incrementUserPoints(task.assignedTo.toString(), points);

    // Update report status to resolved
    await updateReportStatus(
      task.report.toString(),
      'resolved',
      `Task completed and verified. Reward: ${points} points`,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Reward granted successfully',
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get my tasks
// @route   GET /api/tasks/my-tasks
// @access  Private (Approved users)
export const getMyTasks = asyncHandler(async (req, res) => {
  try {
    const result = await getTasksByUserId(req.user.id, {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    });

    res.status(200).json({
      success: true,
      count: result.tasks.length,
      pagination: result.pagination,
      data: result.tasks,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
