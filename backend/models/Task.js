// Task Model Helper Functions (Native MongoDB)
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// Get tasks collection
export const getTasksCollection = () => getDB().collection('tasks');

// Validate priority
export const isValidPriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  return validPriorities.includes(priority);
};

// Validate status
export const isValidStatus = (status) => {
  const validStatuses = ['pending', 'assigned', 'accepted', 'in-progress', 'submitted', 'completed', 'verified', 'rejected'];
  return validStatuses.includes(status);
};

// Validate review status
export const isValidReviewStatus = (reviewStatus) => {
  const validReviewStatuses = ['pending', 'approved', 'rejected'];
  return validReviewStatuses.includes(reviewStatus);
};

// Create new task
export const createTask = async (taskData) => {
  const {
    title,
    description,
    report,
    assignedTo,
    assignedBy,
    priority = 'medium',
    deadline,
  } = taskData;

  // Validate required fields
  if (!title || !description || !report || !assignedTo || !assignedBy) {
    throw new Error('Please provide all required fields');
  }

  if (!ObjectId.isValid(report) || !ObjectId.isValid(assignedTo) || !ObjectId.isValid(assignedBy)) {
    throw new Error('Invalid ID');
  }

  if (!isValidPriority(priority)) {
    throw new Error('Invalid priority');
  }

  // Create task document
  const task = {
    title: title.trim(),
    description: description.trim(),
    report: new ObjectId(report),
    assignedTo: new ObjectId(assignedTo),
    assignedBy: new ObjectId(assignedBy),
    status: 'assigned',
    progress: 50, // 50% when assigned
    priority,
    deadline: deadline ? new Date(deadline) : null,
    acceptedAt: null,
    startedAt: null,
    submittedAt: null,
    completedAt: null,
    verifiedAt: null,
    proof: {
      images: [],
      description: '',
      submittedAt: null,
    },
    reviewStatus: 'pending',
    rejectionReason: '',
    resubmissionCount: 0,
    points: 0,
    rating: null,
    feedback: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await getTasksCollection().insertOne(task);
  task._id = result.insertedId;

  return task;
};

// Get task by ID
export const getTaskById = async (taskId) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  // Use aggregation to populate related data
  const tasks = await getTasksCollection()
    .aggregate([
      { $match: { _id: new ObjectId(taskId) } },
      {
        $lookup: {
          from: 'reports',
          localField: 'report',
          foreignField: '_id',
          as: 'report'
        }
      },
      {
        $unwind: {
          path: '$report',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'solver'
        }
      },
      {
        $unwind: {
          path: '$solver',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedBy',
          foreignField: '_id',
          as: 'assigner'
        }
      },
      {
        $unwind: {
          path: '$assigner',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          'solver.password': 0,
          'assigner.password': 0
        }
      }
    ])
    .toArray();

  return tasks.length > 0 ? tasks[0] : null;
};

// Find tasks with filters
export const findTasks = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;

  // Use aggregation to populate report data
  const tasks = await getTasksCollection()
    .aggregate([
      { $match: filter },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'reports',
          localField: 'report',
          foreignField: '_id',
          as: 'report'
        }
      },
      {
        $unwind: {
          path: '$report',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'solver'
        }
      },
      {
        $unwind: {
          path: '$solver',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          'solver.password': 0
        }
      }
    ])
    .toArray();

  const total = await getTasksCollection().countDocuments(filter);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Update task
export const updateTask = async (taskId, updateData) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  updateData.updatedAt = new Date();

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  return result;
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  if (!isValidStatus(status)) {
    throw new Error('Invalid status');
  }

  const updateData = {
    status,
    updatedAt: new Date(),
  };

  // Set completed time if status is completed
  if (status === 'completed') {
    updateData.completedAt = new Date();
  }

  // Set verified time if status is verified
  if (status === 'verified') {
    updateData.verifiedAt = new Date();
  }

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  return result;
};

// Submit task completion proof
export const submitTaskProof = async (taskId, proofUrl, notes) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        proofUrl,
        notes: notes || '',
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Verify task and award points
export const verifyTask = async (taskId, points, rating, feedback) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        status: 'verified',
        points: points || 0,
        rating: rating || null,
        feedback: feedback || '',
        verifiedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Delete task
export const deleteTask = async (taskId) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  const result = await getTasksCollection().deleteOne({
    _id: new ObjectId(taskId),
  });

  return result.deletedCount > 0;
};

// Get tasks by user ID
export const getTasksByUserId = async (userId, options = {}) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  return await findTasks({ assignedTo: new ObjectId(userId) }, options);
};

// Get tasks by report ID
export const getTasksByReportId = async (reportId) => {
  if (!ObjectId.isValid(reportId)) {
    throw new Error('Invalid report ID');
  }

  return await getTasksCollection()
    .find({ report: new ObjectId(reportId) })
    .toArray();
};

// Accept task (solver accepts the assignment)
export const acceptTask = async (taskId) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        status: 'accepted',
        progress: 75, // 75% when accepted and in progress
        acceptedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Start working on task
export const startTask = async (taskId) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        status: 'in-progress',
        progress: 75,
        startedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Submit proof for task completion
export const submitProof = async (taskId, proofData) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  const { images, description } = proofData;

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        status: 'submitted',
        progress: 90, // 90% when submitted, waiting for review
        'proof.images': images || [],
        'proof.description': description || '',
        'proof.submittedAt': new Date(),
        submittedAt: new Date(),
        reviewStatus: 'pending',
        updatedAt: new Date(),
      },
      $inc: {
        resubmissionCount: 1,
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Review and approve task
export const approveTask = async (taskId, reviewData) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  const { points = 0, rating = null, feedback = '' } = reviewData;

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        status: 'completed',
        progress: 100, // 100% when approved
        reviewStatus: 'approved',
        points,
        rating,
        feedback,
        completedAt: new Date(),
        verifiedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Reject task submission
export const rejectTask = async (taskId, rejectionReason) => {
  if (!ObjectId.isValid(taskId)) {
    throw new Error('Invalid task ID');
  }

  const result = await getTasksCollection().findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        status: 'rejected',
        progress: 75, // Back to 75%, need to resubmit
        reviewStatus: 'rejected',
        rejectionReason: rejectionReason || 'Work needs improvement',
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Get tasks pending review (for authority/superadmin)
export const getTasksPendingReview = async (options = {}) => {
  return await findTasks(
    {
      status: 'submitted',
      reviewStatus: 'pending'
    },
    options
  );
};
