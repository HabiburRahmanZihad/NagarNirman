// User Controller (Native MongoDB)
import { ObjectId } from 'mongodb';
import {
  getUserById,
  findUsers,
  updateUser,
  updateUserApproval,
  getUsersCollection,
} from '../models/User.js';
import { findReports } from '../models/Report.js';
import { findTasks } from '../models/Task.js';
import {
  createApplication,
  getApplicationById,
  getApplicationByUserId,
  getApplications,
  updateApplicationStatus,
} from '../models/ProblemSolverApplication.js';
import { uploadToImgBB, validateImage } from '../utils/imageUpload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Authority, SuperAdmin)
export const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    role,
    division,
    district,
    approved,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (division) filter.division = division;
  if (district) filter.district = district;
  if (approved !== undefined) filter.approved = approved === 'true';

  const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

  // SuperAdmin can get all users without pagination limit
  const options = {
    page: parseInt(page),
    limit: req.user.role === 'superAdmin' ? 1000 : parseInt(limit),
    sort,
  };

  const result = await findUsers(filter, options);

  res.status(200).json({
    success: true,
    count: result.users.length,
    pagination: result.pagination,
    data: result.users,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Apply to become problem solver
// @route   POST /api/users/apply-problem-solver
// @access  Private (User only)
export const applyProblemSolver = asyncHandler(async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Only users with 'user' role can apply
    if (user.role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'Only regular users can apply to become problem solvers',
      });
    }

    const {
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
    } = req.body;

    // Upload images to ImgBB
    let profileImageUrl = null;
    let nidOrIdDocUrl = null;

    try {
      // Upload profile image if provided
      if (profileImage) {
        validateImage(profileImage, 5); // 5MB max
        const profileUpload = await uploadToImgBB(profileImage, `${fullName}_profile`);
        profileImageUrl = profileUpload.url;
      }

      // Upload NID/ID document (required)
      if (!nidOrIdDoc) {
        return res.status(400).json({
          success: false,
          message: 'ID document is required',
        });
      }

      validateImage(nidOrIdDoc, 5); // 5MB max
      const nidUpload = await uploadToImgBB(nidOrIdDoc, `${fullName}_nid`);
      nidOrIdDocUrl = nidUpload.url;

    } catch (uploadError) {
      return res.status(400).json({
        success: false,
        message: `Image upload failed: ${uploadError.message}`,
      });
    }

    // Create application with image URLs
    const application = await createApplication({
      userId: req.user.id,
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
      profileImage: profileImageUrl,
      nidOrIdDoc: nidOrIdDocUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Awaiting approval from authorities.',
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Approve user (problem solver)
// @route   PATCH /api/users/:id/approve
// @access  Private (Authority)
export const approveUser = asyncHandler(async (req, res) => {
  const { approve } = req.body;

  if (approve === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please specify approve status',
    });
  }

  try {
    const user = await updateUserApproval(req.params.id, approve);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${approve ? 'approved' : 'rejected'} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userId = new ObjectId(req.params.id);

    // Get reports created by user
    const reportsResult = await findReports({ createdBy: userId });
    const totalReports = reportsResult.pagination.total;

    // Count reports by status
    const reportsByStatus = {};
    for (const report of reportsResult.reports) {
      reportsByStatus[report.status] = (reportsByStatus[report.status] || 0) + 1;
    }

    // Get tasks assigned to user (if problem solver)
    let tasksStats = null;
    if (user.role === 'problemSolver' || user.role === 'ngo') {
      const tasksResult = await findTasks({ assignedTo: userId });
      const totalTasks = tasksResult.pagination.total;

      const tasksByStatus = {};
      for (const task of tasksResult.tasks) {
        tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;
      }

      tasksStats = {
        total: totalTasks,
        byStatus: tasksByStatus,
      };
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
          approved: user.approved,
        },
        reports: {
          total: totalReports,
          byStatus: reportsByStatus,
        },
        tasks: tasksStats,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const leaderboard = await getUsersCollection()
      .find(
        {
          $or: [{ role: 'problemSolver' }, { role: 'ngo' }],
          approved: true,
        },
        { projection: { password: 0 } }
      )
      .sort({ points: -1 })
      .limit(limit)
      .toArray();

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update user profile (own profile)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, division, district, address, profilePicture } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (division) updateData.division = division;
    if (district) updateData.district = district;
    if (address !== undefined) updateData.address = address;

    // Handle profile picture upload if provided
    if (profilePicture) {
      try {
        // Import the upload function
        const { uploadToImgBB } = await import('../utils/imageUpload.js');

        // Upload to ImgBB
        const uploadResult = await uploadToImgBB(profilePicture, `profile_${userId}`);
        updateData.profilePicture = uploadResult.url;
      } catch (uploadError) {
        console.error('Profile picture upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload profile picture: ' + uploadError.message,
        });
      }
    }

    const updatedUser = await updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update user status (activate/deactivate)
// @route   PATCH /api/users/:id/status
// @access  Private (Authority)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (isActive === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please specify user status',
    });
  }

  try {
    const user = await updateUser(req.params.id, { isActive });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get user's problem solver application
// @route   GET /api/users/my-application
// @access  Private
export const getMyApplication = asyncHandler(async (req, res) => {
  try {
    const application = await getApplicationByUserId(req.user.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get all problem solver applications
// @route   GET /api/users/applications
// @access  Private (Authority)
export const getAllApplications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    division,
    district,
    sortBy = 'appliedAt',
    order = 'desc',
  } = req.query;

  try {
    const filters = {};
    if (status) filters.status = status;
    if (division) filters.division = division;
    if (district) filters.district = district;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder: order === 'desc' ? -1 : 1,
    };

    const result = await getApplications(filters, options);

    res.status(200).json({
      success: true,
      count: result.applications.length,
      pagination: result.pagination,
      data: result.applications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get single application by ID
// @route   GET /api/users/applications/:id
// @access  Private (Authority)
export const getApplicationDetails = asyncHandler(async (req, res) => {
  try {
    const application = await getApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Get user details
    const user = await getUserById(application.userId.toString());

    res.status(200).json({
      success: true,
      data: {
        ...application,
        userInfo: {
          name: user.name,
          currentRole: user.role,
          points: user.points,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Review problem solver application (approve/reject)
// @route   PATCH /api/users/applications/:id/review
// @access  Private (Authority)
export const reviewApplication = asyncHandler(async (req, res) => {
  const { status, reviewNote } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide valid status (approved or rejected)',
    });
  }

  try {
    // Update application status
    const application = await updateApplicationStatus(
      req.params.id,
      { status, reviewNote },
      req.user.id
    );

    // If approved, update user with application data
    if (status === 'approved') {
      const updateData = {
        name: application.fullName, // Update name from application
        role: 'problemSolver',
        approved: true,
        isActive: true, // Ensure user is active
        phone: application.phone,
        organization: application.organization,
        expertise: application.skills, // Map skills to expertise
        profilePicture: application.profileImage || '',
        address: application.address,
        // Keep division and district from application
        division: application.division,
        district: application.district,
      };

      console.log('Updating user with data:', updateData);
      const updatedUser = await updateUser(application.userId.toString(), updateData);
      console.log('User updated successfully:', updatedUser);
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Authority)
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const usersCollection = await getUsersCollection();
    const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get all NGOs and Problem Solvers
// @route   GET /api/users/solvers
// @access  Private (Authority)
export const getSolvers = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      division,
      district,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const filter = {
      role: { $in: ['problemSolver', 'ngo'] },
      approved: true,
      isActive: true,
    };

    if (division) filter.division = division;
    if (district) filter.district = district;

    console.log('getSolvers filter:', filter);

    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const result = await findUsers(filter, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
    });

    console.log(`Found ${result.users.length} solvers`);

    res.status(200).json({
      success: true,
      users: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('getSolvers error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update user role (superAdmin and Authority)
// @route   PATCH /api/users/:id/role
// @access  Private (SuperAdmin, Authority)
export const updateUserRole = asyncHandler(async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Check if requester is superAdmin or authority
    if (req.user.role !== 'superAdmin' && req.user.role !== 'authority') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superAdmin and Authority can change user roles.',
      });
    }

    // Validate role
    const validRoles = ['user', 'authority', 'problemSolver', 'ngo'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
      });
    }

    // Get user to update
    const userToUpdate = await getUserById(userId);
    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent changing superAdmin roles
    if (userToUpdate.role === 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change role of superAdmin users',
      });
    }

    // Update user role
    const usersCollection = await getUsersCollection();
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          role,
          updatedAt: new Date(),
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update user role',
      });
    }

    // Get updated user
    const updatedUser = await getUserById(userId);

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    console.error('updateUserRole error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
