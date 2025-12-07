// User Model Helper Functions (Native MongoDB)
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getDB } from '../config/db.js';

// Get users collection
export const getUsersCollection = () => getDB().collection('users');

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
export const matchPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

// Validate role
export const isValidRole = (role) => {
  const validRoles = ['user', 'authority', 'problemSolver', 'superAdmin'];
  return validRoles.includes(role);
};

// Create new user
export const createUser = async (userData) => {
  const {
    name,
    email,
    password,
    role = 'user',
    division,
    district,
    avatar,
  } = userData;

  // Validate required fields
  if (!name || !email || !password || !district) {
    throw new Error('Please provide all required fields');
  }

  if (name.length < 3) {
    throw new Error('Name must be at least 3 characters');
  }

  if (!isValidEmail(email)) {
    throw new Error('Please provide a valid email');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  if (!isValidRole(role)) {
    throw new Error('Invalid role');
  }

  // Check if user already exists
  const existingUser = await getUsersCollection().findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user document
  const user = {
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    division: division || '',
    district,
    points: 0,
    approved: role === 'user' || role === 'authority',
    isActive: true,
    avatar: avatar || '',
    profilePicture: '',
    // Report submission limit tracking (2 per week)
    reportSubmissions: {
      weeklyLimit: 2,
      submittedThisWeek: 0,
      completedThisWeek: 0,
      lastResetDate: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await getUsersCollection().insertOne(user);
  user._id = result.insertedId;

  return user;
};

// Get user by ID
export const getUserById = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await getUsersCollection().findOne(
    { _id: new ObjectId(userId) },
    { projection: { password: 0 } }
  );
};

// Get user by ID with password
export const getUserByIdWithPassword = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await getUsersCollection().findOne({ _id: new ObjectId(userId) });
};

// Get user by email
export const getUserByEmail = async (email) => {
  return await getUsersCollection().findOne(
    { email: email.toLowerCase() },
    { projection: { password: 0 } }
  );
};

// Get user by email with password
export const getUserByEmailWithPassword = async (email) => {
  return await getUsersCollection().findOne({ email: email.toLowerCase() });
};

// Update user
export const updateUser = async (userId, updateData) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  updateData.updatedAt = new Date();

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updateData },
    { returnDocument: 'after', projection: { password: 0 } }
  );

  if (!result) {
    throw new Error('User not found');
  }

  return result;
};

// Update user password
export const updateUserPassword = async (userId, newPassword) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after', projection: { password: 0 } }
  );

  return result;
};

// Get public profile (without password)
export const getPublicProfile = (user) => {
  if (!user) return null;
  const { password, ...publicProfile } = user;
  return publicProfile;
};

// Find users with filters
export const findUsers = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;

  const users = await getUsersCollection()
    .find(filter, { projection: { password: 0 } })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await getUsersCollection().countDocuments(filter);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Increment user points
export const incrementUserPoints = async (userId, points) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $inc: { points },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: 'after', projection: { password: 0 } }
  );

  return result;
};

// Update user approval status
export const updateUserApproval = async (userId, approved) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        approved,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after', projection: { password: 0 } }
  );

  return result;
};

// Check if user has exceeded weekly report submission limit
export const checkReportSubmissionLimit = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const user = await getUsersCollection().findOne(
    { _id: new ObjectId(userId) },
    { projection: { reportSubmissions: 1 } }
  );

  if (!user) {
    throw new Error('User not found');
  }

  // If user has no reportSubmissions field (legacy user), initialize it
  if (!user.reportSubmissions) {
    await getUsersCollection().updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          reportSubmissions: {
            weeklyLimit: 2,
            submittedThisWeek: 0,
            completedThisWeek: 0,
            lastResetDate: new Date(),
          },
        },
      }
    );
    return { canSubmit: true, remaining: 2, message: 'You can submit 2 reports this week' };
  }

  const { reportSubmissions } = user;
  const now = new Date();
  const lastReset = new Date(reportSubmissions.lastResetDate);
  
  // Calculate days since last reset
  const daysSinceReset = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));

  // Reset weekly count if 7 days have passed
  if (daysSinceReset >= 7) {
    await getUsersCollection().updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'reportSubmissions.submittedThisWeek': 0,
          'reportSubmissions.completedThisWeek': 0,
          'reportSubmissions.lastResetDate': new Date(),
        },
      }
    );
    return { canSubmit: true, remaining: 2, message: 'Weekly limit reset. You can submit 2 reports this week' };
  }

  // Check if user has reached the limit
  const submitted = reportSubmissions.submittedThisWeek || 0;
  const completed = reportSubmissions.completedThisWeek || 0;
  const weeklyLimit = reportSubmissions.weeklyLimit || 2;

  // User can submit more reports if:
  // 1. They haven't reached the limit for new submissions, OR
  // 2. They have completed previous reports
  const canSubmitMore = submitted < weeklyLimit || completed > 0;
  const remaining = weeklyLimit - submitted;

  if (!canSubmitMore) {
    const daysLeft = 7 - daysSinceReset;
    return {
      canSubmit: false,
      remaining: 0,
      message: `You've reached your weekly limit of ${weeklyLimit} reports. You can submit again in ${daysLeft} days or after completing current reports.`,
      daysLeft,
      limitInfo: {
        weeklyLimit,
        submitted,
        completed,
      },
    };
  }

  return {
    canSubmit: true,
    remaining,
    message: `You can submit ${remaining} more report(s) this week`,
    limitInfo: {
      weeklyLimit,
      submitted,
      completed,
    },
  };
};

// Increment user's weekly report submission count
export const incrementReportSubmission = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $inc: { 'reportSubmissions.submittedThisWeek': 1 },
    },
    { returnDocument: 'after', projection: { reportSubmissions: 1 } }
  );

  return result;
};

// Increment user's weekly completed report count
export const incrementCompletedReport = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $inc: { 'reportSubmissions.completedThisWeek': 1 },
    },
    { returnDocument: 'after', projection: { reportSubmissions: 1 } }
  );

  return result;
};

// Reset weekly report limit for a user
export const resetWeeklyReportLimit = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        'reportSubmissions.submittedThisWeek': 0,
        'reportSubmissions.completedThisWeek': 0,
        'reportSubmissions.lastResetDate': new Date(),
      },
    },
    { returnDocument: 'after', projection: { reportSubmissions: 1 } }
  );

  return result;
};
