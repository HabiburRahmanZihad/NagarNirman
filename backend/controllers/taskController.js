import {
  createTask,
  getTaskById,
  findTasks,
  updateTaskStatus,
  submitTaskProof,
  verifyTask,
  getTasksByUserId,
  getTasksCollection,
  acceptTask,
  startTask,
  submitProof,
  approveTask,
  rejectTask,
  getTasksPendingReview,
} from '../models/Task.js';
import { getReportById, updateReportStatus } from '../models/Report.js';
import { getUserById, incrementUserPoints, getUsersCollection } from '../models/User.js';
import { createNotification } from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendTaskAssignmentEmail, sendRewardEmail } from '../services/emailService.js';





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

    // Update report status to approved when task is assigned
    await updateReportStatus(report, 'approved', `Task assigned: ${title}`, req.user.id);

    // Create notification for assigned solver
    await createNotification({
      userId: assignedTo,
      title: 'New Task Assigned',
      message: `You have been assigned a new task: "${title}"`,
      type: 'task_assigned',
      actionUrl: `/dashboard/problemSolver/tasks`,
      metadata: {
        taskId: task._id.toString(),
        taskTitle: title,
        priority: priority || 'medium',
      },
    });

    // Send email notification (non-blocking)
    sendTaskAssignmentEmail(user, task, reportExists).catch(err =>
      console.error('Failed to send task assignment email:', err)
    );

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

    // Check if task is assigned to current user or user is superAdmin
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'superAdmin') {
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




// @desc    Get solver statistics (task performance)
// @route   GET /api/tasks/solver-statistics
// @access  Private (SuperAdmin)
export const getSolverStatistics = asyncHandler(async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const tasksCollection = getTasksCollection();

    // Get all problem solvers with their task statistics in ONE aggregation query
    const statistics = await usersCollection
      .aggregate([
        // Match approved solvers
        {
          $match: {
            role: 'problemSolver',
            approved: true,
          },
        },
        // Lookup tasks for each solver
        {
          $lookup: {
            from: 'tasks',
            let: { solverId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$assignedTo', '$$solverId'] },
                },
              },
              {
                $facet: {
                  total: [{ $count: 'count' }],
                  completed: [
                    { $match: { status: 'completed' } },
                    { $count: 'count' },
                  ],
                  verified: [
                    { $match: { status: 'verified' } },
                    { $count: 'count' },
                  ],
                  pending: [
                    {
                      $match: {
                        status: { $in: ['assigned', 'accepted', 'in-progress', 'submitted'] },
                      },
                    },
                    { $count: 'count' },
                  ],
                  inProgress: [
                    { $match: { status: 'in-progress' } },
                    { $count: 'count' },
                  ],
                  avgRating: [
                    {
                      $match: {
                        status: 'completed',
                        rating: { $exists: true, $ne: null },
                      },
                    },
                    {
                      $group: {
                        _id: null,
                        avgRating: { $avg: '$rating' },
                      },
                    },
                  ],
                },
              },
            ],
            as: 'taskStats',
          },
        },
        // Transform the data - exclude password first
        {
          $project: {
            password: 0,
          },
        },
        // Then include the fields we need
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            division: 1,
            district: 1,
            points: 1,
            avatar: 1,
            isActive: 1,
            taskData: { $arrayElemAt: ['$taskStats', 0] },
          },
        },
        {
          $addFields: {
            totalTasks: { $ifNull: [{ $arrayElemAt: ['$taskData.total.count', 0] }, 0] },
            completedTasks: { $ifNull: [{ $arrayElemAt: ['$taskData.completed.count', 0] }, 0] },
            verifiedTasks: { $ifNull: [{ $arrayElemAt: ['$taskData.verified.count', 0] }, 0] },
            pendingTasks: { $ifNull: [{ $arrayElemAt: ['$taskData.pending.count', 0] }, 0] },
            inProgressTasks: { $ifNull: [{ $arrayElemAt: ['$taskData.inProgress.count', 0] }, 0] },
            avgRating: { $ifNull: [{ $arrayElemAt: ['$taskData.avgRating.avgRating', 0] }, 0] },
          },
        },
        {
          $addFields: {
            isBusy: { $gte: ['$pendingTasks', 5] },
            successRate: {
              $cond: {
                if: { $gt: ['$totalTasks', 0] },
                then: {
                  $multiply: [
                    { $divide: ['$completedTasks', '$totalTasks'] },
                    100,
                  ],
                },
                else: 0,
              },
            },
          },
        },
        {
          $addFields: {
            isFree: { $not: '$isBusy' },
            status: {
              $cond: {
                if: '$isBusy',
                then: 'Busy',
                else: 'Free',
              },
            },
          },
        },
        // Format final output
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            division: { $ifNull: ['$division', ''] },
            district: { $ifNull: ['$district', ''] },
            points: { $ifNull: ['$points', 0] },
            avatar: { $ifNull: ['$avatar', ''] },
            isActive: 1,
            taskStats: {
              total: '$totalTasks',
              completed: '$completedTasks',
              pending: '$pendingTasks',
              rating: {
                $cond: {
                  if: { $gt: ['$avgRating', 0] },
                  then: { $round: ['$avgRating', 1] },
                  else: 0,
                },
              },
              successRate: { $round: ['$successRate', 0] },
              status: '$status',
              isBusy: '$isBusy',
            },
            // Keep old structure for backward compatibility
            tasks: {
              pending: '$pendingTasks',
              'in-progress': '$inProgressTasks',
              completed: '$completedTasks',
              verified: '$verifiedTasks',
              total: '$totalTasks',
            },
            isFree: '$isFree',
            status: '$status',
          },
        },
        // Sort by total tasks (descending) and then by name
        {
          $sort: {
            'tasks.total': -1,
            name: 1,
          },
        },
      ])
      .toArray();

    res.status(200).json({
      success: true,
      count: statistics.length,
      data: statistics,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});




// @desc    Accept task (problem solver accepts the assignment)
// @route   POST /api/tasks/:id/accept
// @access  Private (Problem Solver, NGO)
export const acceptTaskAssignment = asyncHandler(async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Verify the task is assigned to the requesting user
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this task',
      });
    }

    if (task.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Task cannot be accepted in its current status',
      });
    }

    const updatedTask = await acceptTask(req.params.id);

    // Update report status to in-progress when task is accepted
    try {
      if (task.report) {
        const reportId = typeof task.report === 'object' ? task.report._id : task.report;
        const userId = req.user?._id || req.user?.id;
        if (reportId && userId) {
          await updateReportStatus(
            reportId.toString(),
            'in-progress',
            `Task accepted by ${req.user.name || 'solver'}`,
            userId.toString()
          );
        }
      }
    } catch (reportError) {
      console.error('Failed to update report status on accept:', reportError);
    }

    // Create notification for authority who assigned the task
    try {
      if (task.assignedBy) {
        const assignerId = typeof task.assignedBy === 'object' ? task.assignedBy._id : task.assignedBy;
        await createNotification({
          userId: assignerId.toString(),
          title: 'Task Accepted',
          message: `${req.user.name} has accepted the task: "${task.title}"`,
          type: 'task_accepted',
          actionUrl: `/dashboard/authority/review-tasks`,
          metadata: {
            taskId: task._id.toString(),
            solverName: req.user.name,
          },
        });
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    res.status(200).json({
      success: true,
      message: 'Task accepted successfully',
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});




// @desc    Start working on task
// @route   POST /api/tasks/:id/start
// @access  Private (Problem Solver, NGO)
export const startWorkingOnTask = asyncHandler(async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to start this task',
      });
    }

    const updatedTask = await startTask(req.params.id);

    // Ensure report status is in-progress when work starts
    try {
      if (task.report) {
        const reportId = typeof task.report === 'object' ? task.report._id : task.report;
        const userId = req.user?._id || req.user?.id;
        if (reportId && userId) {
          await updateReportStatus(
            reportId.toString(),
            'in-progress',
            `Work started by ${req.user.name || 'solver'}`,
            userId.toString()
          );
        }
      }
    } catch (reportError) {
      console.error('Failed to update report status on start:', reportError);
    }

    res.status(200).json({
      success: true,
      message: 'Task started successfully',
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});




// @desc    Submit proof for task completion
// @route   POST /api/tasks/:id/submit-proof
// @access  Private (Problem Solver, NGO)
export const submitTaskProofHandler = asyncHandler(async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit proof for this task',
      });
    }

    const { images, description } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one proof image',
      });
    }

    const updatedTask = await submitProof(req.params.id, { images, description });

    // Update report status when proof is submitted
    try {
      if (task.report) {
        const reportId = typeof task.report === 'object' ? task.report._id : task.report;
        const userId = req.user?._id || req.user?.id;
        if (reportId && userId) {
          await updateReportStatus(
            reportId.toString(),
            'in-progress',
            `Proof submitted by ${req.user.name || 'solver'}, awaiting authority review`,
            userId.toString()
          );
        }
      }
    } catch (reportError) {
      console.error('Failed to update report status on proof submit:', reportError);
    }

    // Create notification for authority who assigned the task
    try {
      if (task.assignedBy) {
        const assignerId = typeof task.assignedBy === 'object' ? task.assignedBy._id : task.assignedBy;
        await createNotification({
          userId: assignerId.toString(),
          title: 'Task Submitted for Review',
          message: `${req.user.name} has submitted proof for task: "${task.title}"`,
          type: 'task_submitted',
          actionUrl: `/dashboard/authority/review-tasks`,
          metadata: {
            taskId: task._id.toString(),
            solverName: req.user.name,
          },
        });
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    res.status(200).json({
      success: true,
      message: 'Proof submitted successfully. Waiting for review.',
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});





// @desc    Get tasks pending review
// @route   GET /api/tasks/pending-review
// @access  Private (Authority, SuperAdmin)
export const getPendingReviewTasks = asyncHandler(async (req, res) => {
  try {
    const result = await getTasksPendingReview({
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      division: req.query.division, // Filter by report division
    });

    // Populate task details if not already populated
    const tasksWithDetails = await Promise.all(
      result.tasks.map(async (task) => {
        // Check if report is already populated (object) or needs fetching (ObjectId)
        let reportData = task.report;
        if (task.report && !task.report.title) {
          const report = await getReportById(task.report.toString());
          reportData = report ? {
            _id: report._id,
            title: report.title,
            location: report.location,
            images: report.images,
          } : null;
        }

        // Check if solver is already populated (object) or needs fetching (ObjectId)
        let solverData = task.solver;
        if (task.assignedTo && (!task.solver || !task.solver.name)) {
          const solver = await getUserById(task.assignedTo.toString());
          solverData = solver ? {
            _id: solver._id,
            name: solver.name,
            email: solver.email,
            role: solver.role,
          } : null;
        }

        return {
          ...task,
          report: reportData,
          solver: solverData,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: tasksWithDetails.length,
      pagination: result.pagination,
      data: tasksWithDetails,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});




// @desc    Approve task submission
// @route   POST /api/tasks/:id/approve
// @access  Private (Authority, SuperAdmin)
export const approveTaskSubmission = asyncHandler(async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Task is not in submitted status',
      });
    }

    const { points = 50, rating = 5, feedback = 'Great work!' } = req.body;

    // Calculate points based on priority if not provided
    let awardPoints = points;
    if (!req.body.points) {
      const pointsMap = { low: 20, medium: 30, high: 50, urgent: 100 };
      awardPoints = pointsMap[task.priority] || 30;
    }

    // Apply deadline penalty if task is completed after deadline
    if (task.deadline) {
      const deadline = new Date(task.deadline);
      const now = new Date();

      if (now > deadline) {
        // Task missed deadline - apply 50% penalty
        awardPoints = Math.floor(awardPoints / 2);
        console.log(`⚠️ Deadline missed! Points reduced from ${awardPoints * 2} to ${awardPoints}`);
      }
    }

    // Approve the task
    const updatedTask = await approveTask(req.params.id, {
      points: awardPoints,
      rating,
      feedback,
    });

    // Award points to solver (non-blocking, continue even if fails)
    try {
      if (task.assignedTo) {
        await incrementUserPoints(task.assignedTo.toString(), awardPoints);
      }
    } catch (pointError) {
      console.error('Failed to award points:', pointError);
    }

    // Update report status to resolved (non-blocking, continue even if fails)
    try {
      if (task.report) {
        const reportId = typeof task.report === 'object' ? task.report._id : task.report;
        const userId = req.user?._id || req.user?.id;

        console.log('🔄 Updating report status to resolved:', {
          reportId: reportId?.toString(),
          userId: userId?.toString(),
          taskId: task._id
        });

        if (userId && reportId) {
          const result = await updateReportStatus(
            reportId.toString(),
            'resolved',
            `Task completed and approved. Reward: ${awardPoints} points`,
            userId.toString()
          );
          console.log('✅ Report status updated successfully:', result);
        } else {
          console.warn('⚠️ Missing userId or reportId:', { userId, reportId });
        }
      } else {
        console.warn('⚠️ No report linked to this task');
      }
    } catch (reportError) {
      console.error('❌ Failed to update report status:', reportError);
    }

    // Create notification for solver
    try {
      if (task.assignedTo) {
        const solverId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
        await createNotification({
          userId: solverId.toString(),
          title: 'Task Approved! 🎉',
          message: `Your task "${task.title}" has been approved! You earned ${awardPoints} points.`,
          type: 'task_approved',
          actionUrl: `/dashboard/problemSolver/tasks`,
          metadata: {
            taskId: task._id.toString(),
            points: awardPoints,
            rating,
            feedback,
          },
        });

        // Send reward email (non-blocking)
        getUserById(solverId.toString()).then(solverUser => {
          if (solverUser) {
            sendRewardEmail(solverUser, task, awardPoints).catch(err =>
              console.error('Failed to send reward email:', err)
            );
          }
        }).catch(err => console.error('Failed to get solver user:', err));
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    // Always return success response
    return res.status(200).json({
      success: true,
      message: 'Task approved successfully. Points awarded to solver.',
      data: updatedTask || task,
    });
  } catch (error) {
    console.error('Approve task error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to approve task',
    });
  }
});




// @desc    Sync completed tasks with report status (utility endpoint)
// @route   POST /api/tasks/sync-reports
// @access  Private (SuperAdmin)
export const syncCompletedTasksWithReports = asyncHandler(async (req, res) => {
  try {
    // Get all completed tasks
    const completedTasks = await getTasksCollection()
      .find({ status: 'completed' })
      .toArray();

    console.log(`Found ${completedTasks.length} completed tasks to sync`);

    let successCount = 0;
    let errorCount = 0;

    for (const task of completedTasks) {
      try {
        if (task.report) {
          const reportId = typeof task.report === 'object' ? task.report._id : task.report;
          const userId = task.assignedBy || task.assignedTo;

          if (reportId && userId) {
            await updateReportStatus(
              reportId.toString(),
              'resolved',
              `Task completed (synced from completed task)`,
              userId.toString()
            );
            successCount++;
            console.log(`✅ Synced report ${reportId} for task ${task._id}`);
          }
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to sync task ${task._id}:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${successCount} reports successfully, ${errorCount} failed`,
      data: {
        total: completedTasks.length,
        synced: successCount,
        failed: errorCount
      }
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});





// @desc    Reject task submission
// @route   POST /api/tasks/:id/reject
// @access  Private (Authority, SuperAdmin)
export const rejectTaskSubmission = asyncHandler(async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Task is not in submitted status',
      });
    }

    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rejection reason',
      });
    }

    const updatedTask = await rejectTask(req.params.id, rejectionReason);

    // Keep report in-progress when task is rejected (needs resubmission)
    try {
      if (task.report) {
        const reportId = typeof task.report === 'object' ? task.report._id : task.report;
        const userId = req.user?._id || req.user?.id;
        if (reportId && userId) {
          await updateReportStatus(
            reportId.toString(),
            'in-progress',
            `Task rejected by ${req.user.name || 'authority'}. Reason: ${rejectionReason}`,
            userId.toString()
          );
        }
      }
    } catch (reportError) {
      console.error('Failed to update report status on rejection:', reportError);
    }

    // Create notification for solver
    try {
      if (task.assignedTo) {
        const solverId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
        await createNotification({
          userId: solverId.toString(),
          title: 'Task Rejected',
          message: `Your task "${task.title}" was rejected. Reason: ${rejectionReason}`,
          type: 'task_rejected',
          actionUrl: `/dashboard/problemSolver/tasks`,
          metadata: {
            taskId: task._id.toString(),
            rejectionReason,
          },
        });
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    res.status(200).json({
      success: true,
      message: 'Task rejected. Solver needs to resubmit.',
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});





// @desc    Get task statistics (fast counts only)
// @route   GET /api/tasks/statistics
// @access  Private (SuperAdmin, Authority)
export const getTaskStatistics = asyncHandler(async (req, res) => {
  try {
    const tasksCollection = getTasksCollection();

    // Get all counts in parallel using aggregation
    const stats = await tasksCollection.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          assigned: [{ $match: { status: 'assigned' } }, { $count: 'count' }],
          accepted: [{ $match: { status: 'accepted' } }, { $count: 'count' }],
          inProgress: [{ $match: { status: 'in-progress' } }, { $count: 'count' }],
          submitted: [{ $match: { status: 'submitted' } }, { $count: 'count' }],
          completed: [{ $match: { status: 'completed' } }, { $count: 'count' }],
          verified: [{ $match: { status: 'verified' } }, { $count: 'count' }],
          rejected: [{ $match: { status: 'rejected' } }, { $count: 'count' }],
          pendingReview: [
            { $match: { status: 'submitted', reviewStatus: 'pending' } },
            { $count: 'count' }
          ]
        }
      }
    ]).toArray();

    const result = stats[0];

    res.status(200).json({
      success: true,
      data: {
        totalTasks: result.total[0]?.count || 0,
        assignedTasks: result.assigned[0]?.count || 0,
        acceptedTasks: result.accepted[0]?.count || 0,
        inProgressTasks: (result.inProgress[0]?.count || 0) + (result.accepted[0]?.count || 0),
        submittedTasks: result.submitted[0]?.count || 0,
        completedTasks: (result.completed[0]?.count || 0) + (result.verified[0]?.count || 0),
        verifiedTasks: result.verified[0]?.count || 0,
        rejectedTasks: result.rejected[0]?.count || 0,
        pendingReviewTasks: result.pendingReview[0]?.count || 0
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});
