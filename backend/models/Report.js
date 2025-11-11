// Report Model Helper Functions (Native MongoDB)
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// Get reports collection
export const getReportsCollection = () => getDB().collection('reports');

// Validate problem type
export const isValidProblemType = (type) => {
  const validTypes = [
    'road',
    'drainage',
    'street light',
    'waste management',
    'water supply',
    'electricity',
    'public property',
    'other',
  ];
  return validTypes.includes(type);
};

// Validate severity
export const isValidSeverity = (severity) => {
  const validSeverities = ['low', 'medium', 'high', 'urgent'];
  return validSeverities.includes(severity);
};

// Validate status
export const isValidStatus = (status) => {
  const validStatuses = ['pending', 'approved', 'in-progress', 'resolved', 'rejected'];
  return validStatuses.includes(status);
};

// Create new report
export const createReport = async (reportData) => {
  const {
    title,
    description,
    problemType,
    severity,
    location,
    images = [],
    createdBy,
  } = reportData;

  // Validate required fields
  if (!title || !description || !problemType || !severity || !location || !createdBy) {
    throw new Error('Please provide all required fields');
  }

  if (!isValidProblemType(problemType)) {
    throw new Error('Invalid problem type');
  }

  if (!isValidSeverity(severity)) {
    throw new Error('Invalid severity level');
  }

  if (!ObjectId.isValid(createdBy)) {
    throw new Error('Invalid user ID');
  }

  // Create report document
  const report = {
    title: title.trim(),
    description: description.trim(),
    images,
    problemType,
    severity,
    status: 'pending',
    location: {
      address: location.address,
      district: location.district,
      coordinates: location.coordinates || [], // [longitude, latitude]
    },
    upvotes: [],
    comments: [],
    createdBy: new ObjectId(createdBy),
    assignedTo: null,
    history: [
      {
        status: 'pending',
        note: 'Report submitted',
        updatedBy: new ObjectId(createdBy),
        date: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await getReportsCollection().insertOne(report);
  report._id = result.insertedId;

  return report;
};

// Get report by ID
export const getReportById = async (reportId) => {
  if (!ObjectId.isValid(reportId)) {
    throw new Error('Invalid report ID');
  }

  // Use aggregation to populate user details
  const reports = await getReportsCollection()
    .aggregate([
      { $match: { _id: new ObjectId(reportId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByUser',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedToUser',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedBy',
          foreignField: '_id',
          as: 'assignedByUser',
        },
      },
      // Unwind history array to lookup each updatedBy user
      {
        $unwind: {
          path: '$history',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'history.updatedBy',
          foreignField: '_id',
          as: 'history.updatedByUser',
        },
      },
      // Reconstruct history with populated user
      {
        $addFields: {
          history: {
            $cond: {
              if: { $gt: [{ $size: { $ifNull: ['$history.updatedByUser', []] } }, 0] },
              then: {
                status: '$history.status',
                note: '$history.note',
                date: '$history.date',
                updatedBy: {
                  _id: { $arrayElemAt: ['$history.updatedByUser._id', 0] },
                  name: { $arrayElemAt: ['$history.updatedByUser.name', 0] },
                },
              },
              else: '$history',
            },
          },
        },
      },
      // Group back to reconstruct the document
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          description: { $first: '$description' },
          problemType: { $first: '$problemType' },
          severity: { $first: '$severity' },
          status: { $first: '$status' },
          location: { $first: '$location' },
          images: { $first: '$images' },
          upvotes: { $first: '$upvotes' },
          comments: { $first: '$comments' },
          createdBy: { $first: '$createdBy' },
          createdByUser: { $first: '$createdByUser' },
          assignedTo: { $first: '$assignedTo' },
          assignedToUser: { $first: '$assignedToUser' },
          assignedBy: { $first: '$assignedBy' },
          assignedByUser: { $first: '$assignedByUser' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          history: { $push: '$history' },
        },
      },
      {
        $addFields: {
          createdBy: {
            $cond: {
              if: { $gt: [{ $size: '$createdByUser' }, 0] },
              then: {
                _id: { $arrayElemAt: ['$createdByUser._id', 0] },
                name: { $arrayElemAt: ['$createdByUser.name', 0] },
                email: { $arrayElemAt: ['$createdByUser.email', 0] },
                phone: { $arrayElemAt: ['$createdByUser.phone', 0] },
              },
              else: '$createdBy',
            },
          },
          assignedTo: {
            $cond: {
              if: { $gt: [{ $size: '$assignedToUser' }, 0] },
              then: {
                _id: { $arrayElemAt: ['$assignedToUser._id', 0] },
                name: { $arrayElemAt: ['$assignedToUser.name', 0] },
                email: { $arrayElemAt: ['$assignedToUser.email', 0] },
                role: { $arrayElemAt: ['$assignedToUser.role', 0] },
              },
              else: '$assignedTo',
            },
          },
          assignedBy: {
            $cond: {
              if: { $gt: [{ $size: '$assignedByUser' }, 0] },
              then: {
                _id: { $arrayElemAt: ['$assignedByUser._id', 0] },
                name: { $arrayElemAt: ['$assignedByUser.name', 0] },
                email: { $arrayElemAt: ['$assignedByUser.email', 0] },
              },
              else: '$assignedBy',
            },
          },
        },
      },
      // Filter out null/empty history entries
      {
        $addFields: {
          history: {
            $filter: {
              input: '$history',
              as: 'h',
              cond: { $ne: ['$$h', {}] },
            },
          },
        },
      },
      {
        $project: {
          createdByUser: 0,
          assignedToUser: 0,
          assignedByUser: 0,
        },
      },
    ])
    .toArray();

  return reports[0] || null;
};

// Find reports with filters
export const findReports = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;

  const reports = await getReportsCollection()
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await getReportsCollection().countDocuments(filter);

  return {
    reports,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Update report
export const updateReport = async (reportId, updateData) => {
  if (!ObjectId.isValid(reportId)) {
    throw new Error('Invalid report ID');
  }

  updateData.updatedAt = new Date();

  const result = await getReportsCollection().findOneAndUpdate(
    { _id: new ObjectId(reportId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  return result;
};

// Add comment to report
export const addCommentToReport = async (reportId, commentData) => {
  if (!ObjectId.isValid(reportId)) {
    throw new Error('Invalid report ID');
  }

  if (!ObjectId.isValid(commentData.user)) {
    throw new Error('Invalid user ID');
  }

  const comment = {
    _id: new ObjectId(),
    user: new ObjectId(commentData.user),
    comment: commentData.comment,
    date: new Date(),
  };

  const result = await getReportsCollection().findOneAndUpdate(
    { _id: new ObjectId(reportId) },
    {
      $push: { comments: comment },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Add upvote to report
export const toggleReportUpvote = async (reportId, userId) => {
  if (!ObjectId.isValid(reportId) || !ObjectId.isValid(userId)) {
    throw new Error('Invalid ID');
  }

  const userObjectId = new ObjectId(userId);
  const report = await getReportById(reportId);

  if (!report) {
    throw new Error('Report not found');
  }

  // Check if already upvoted
  const hasUpvoted = report.upvotes.some((id) => id.equals(userObjectId));

  if (hasUpvoted) {
    // Remove upvote
    const result = await getReportsCollection().findOneAndUpdate(
      { _id: new ObjectId(reportId) },
      {
        $pull: { upvotes: userObjectId },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    );
    return { report: result, action: 'removed' };
  } else {
    // Add upvote
    const result = await getReportsCollection().findOneAndUpdate(
      { _id: new ObjectId(reportId) },
      {
        $push: { upvotes: userObjectId },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    );
    return { report: result, action: 'added' };
  }
};

// Update report status with history
export const updateReportStatus = async (reportId, status, note, updatedBy) => {
  if (!ObjectId.isValid(reportId) || !ObjectId.isValid(updatedBy)) {
    throw new Error('Invalid ID');
  }

  if (!isValidStatus(status)) {
    throw new Error('Invalid status');
  }

  const historyEntry = {
    status,
    note: note || '',
    updatedBy: new ObjectId(updatedBy),
    date: new Date(),
  };

  const result = await getReportsCollection().findOneAndUpdate(
    { _id: new ObjectId(reportId) },
    {
      $set: { status, updatedAt: new Date() },
      $push: { history: historyEntry },
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Delete report
export const deleteReport = async (reportId) => {
  if (!ObjectId.isValid(reportId)) {
    throw new Error('Invalid report ID');
  }

  const result = await getReportsCollection().deleteOne({
    _id: new ObjectId(reportId),
  });

  return result.deletedCount > 0;
};

// Assign report to user
export const assignReportTo = async (reportId, userId) => {
  if (!ObjectId.isValid(reportId) || !ObjectId.isValid(userId)) {
    throw new Error('Invalid ID');
  }

  const result = await getReportsCollection().findOneAndUpdate(
    { _id: new ObjectId(reportId) },
    {
      $set: {
        assignedTo: new ObjectId(userId),
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};
