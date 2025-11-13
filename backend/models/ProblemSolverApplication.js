// Problem Solver Application Model (Native MongoDB)
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// Get problem solver applications collection
export const getProblemSolverApplicationsCollection = () =>
  getDB().collection('problemSolverApplications');

// Create new application
export const createApplication = async (applicationData) => {
  const {
    userId,
    fullName,
    email,
    phone,
    dateOfBirth,
    gender,
    division,
    district,
    address,
    profession,
    organization,
    skills,
    motivation,
    experience,
    profileImage,
    nidOrIdDoc,
  } = applicationData;

  // Validate required fields
  if (!userId || !fullName || !email || !phone || !dateOfBirth || !gender ||
    !division || !district || !address || !profession || !skills ||
    !motivation || !nidOrIdDoc) {
    throw new Error('Please provide all required fields');
  }

  if (!Array.isArray(skills) || skills.length === 0) {
    throw new Error('At least one skill is required');
  }

  if (motivation.length < 50) {
    throw new Error('Motivation must be at least 50 characters');
  }

  // Check if user already has a pending or approved application
  const existingApplication = await getProblemSolverApplicationsCollection().findOne({
    userId: new ObjectId(userId),
    status: { $in: ['pending', 'approved'] }
  });

  if (existingApplication) {
    throw new Error('You already have an application pending or approved');
  }

  // Create application document
  const application = {
    userId: new ObjectId(userId),
    fullName: fullName.trim(),
    email: email.toLowerCase(),
    phone: phone.trim(),
    dateOfBirth: new Date(dateOfBirth),
    gender,
    division,
    district,
    address: address.trim(),
    profession: profession.trim(),
    organization: organization?.trim() || null,
    skills,
    motivation: motivation.trim(),
    experience: experience?.trim() || null,
    profileImage: profileImage || null, // URL from ImgBB
    nidOrIdDoc, // URL from ImgBB
    status: 'pending', // pending, approved, rejected
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
    appliedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await getProblemSolverApplicationsCollection().insertOne(application);
  application._id = result.insertedId;

  return application;
};

// Get application by ID
export const getApplicationById = async (applicationId) => {
  if (!ObjectId.isValid(applicationId)) {
    throw new Error('Invalid application ID');
  }
  return await getProblemSolverApplicationsCollection().findOne({
    _id: new ObjectId(applicationId)
  });
};

// Get application by user ID
export const getApplicationByUserId = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await getProblemSolverApplicationsCollection().findOne({
    userId: new ObjectId(userId)
  });
};

// Get all applications with filters
export const getApplications = async (filters = {}, options = {}) => {
  const {
    status,
    division,
    district,
    userId,
  } = filters;

  const {
    page = 1,
    limit = 10,
    sortBy = 'appliedAt',
    sortOrder = -1,
  } = options;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (division) {
    query.division = division;
  }

  if (district) {
    query.district = district;
  }

  if (userId) {
    query.userId = new ObjectId(userId);
  }

  const skip = (page - 1) * limit;

  const applications = await getProblemSolverApplicationsCollection()
    .find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await getProblemSolverApplicationsCollection().countDocuments(query);

  return {
    applications,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit),
    },
  };
};

// Update application status (approve/reject)
export const updateApplicationStatus = async (applicationId, statusData, reviewerId) => {
  if (!ObjectId.isValid(applicationId)) {
    throw new Error('Invalid application ID');
  }

  const { status, reviewNote } = statusData;

  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Invalid status. Must be "approved" or "rejected"');
  }

  const application = await getApplicationById(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  if (application.status !== 'pending') {
    throw new Error('Only pending applications can be reviewed');
  }

  const updateData = {
    status,
    reviewedBy: new ObjectId(reviewerId),
    reviewedAt: new Date(),
    reviewNote: reviewNote || null,
    updatedAt: new Date(),
  };

  const result = await getProblemSolverApplicationsCollection().updateOne(
    { _id: new ObjectId(applicationId) },
    { $set: updateData }
  );

  if (result.modifiedCount === 0) {
    throw new Error('Failed to update application status');
  }

  return await getApplicationById(applicationId);
};

// Delete application
export const deleteApplication = async (applicationId) => {
  if (!ObjectId.isValid(applicationId)) {
    throw new Error('Invalid application ID');
  }

  const result = await getProblemSolverApplicationsCollection().deleteOne({
    _id: new ObjectId(applicationId)
  });

  if (result.deletedCount === 0) {
    throw new Error('Application not found');
  }

  return true;
};

// Get application statistics
export const getApplicationStatistics = async () => {
  const stats = await getProblemSolverApplicationsCollection().aggregate([
    {
      $facet: {
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ],
        divisionCounts: [
          {
            $group: {
              _id: '$division',
              count: { $sum: 1 }
            }
          }
        ],
        totalApplications: [
          {
            $count: 'total'
          }
        ],
        recentApplications: [
          {
            $sort: { appliedAt: -1 }
          },
          {
            $limit: 5
          },
          {
            $project: {
              fullName: 1,
              division: 1,
              district: 1,
              status: 1,
              appliedAt: 1,
            }
          }
        ]
      }
    }
  ]).toArray();

  return stats[0];
};
