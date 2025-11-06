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
  const validStatuses = ['pending', 'assigned', 'in-progress', 'completed', 'verified'];
  return validStatuses.includes(status);
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
    priority,
    deadline: deadline ? new Date(deadline) : null,
    proofUrl: null,
    completedAt: null,
    verifiedAt: null,
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
  return await getTasksCollection().findOne({ _id: new ObjectId(taskId) });
};

// Find tasks with filters
export const findTasks = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;

  const tasks = await getTasksCollection()
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
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
