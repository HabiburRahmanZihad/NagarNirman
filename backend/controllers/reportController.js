// Report Controller (Native MongoDB)
import { ObjectId } from 'mongodb';
import {
  createReport,
  getReportById,
  findReports,
  updateReport,
  addCommentToReport,
  toggleReportUpvote,
  updateReportStatus,
  deleteReport,
  assignReportTo,
} from '../models/Report.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { uploadToImgBB, uploadMultipleToImgBB } from '../utils/imageUpload.js';
import { getUserById, checkReportSubmissionLimit, incrementReportSubmission } from '../models/User.js';
import { sendReportStatusEmail } from '../services/emailService.js';

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
export const getReports = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    severity,
    problemType,
    division,
    district,
    search,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (problemType) filter.problemType = problemType;
  if (division) filter['location.division'] = division;
  if (district) filter['location.district'] = district;

  // Add search functionality
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.address': { $regex: search, $options: 'i' } },
      { 'location.district': { $regex: search, $options: 'i' } },
      { problemType: { $regex: search, $options: 'i' } },
    ];
  }

  const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

  const result = await findReports(filter, {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
  });

  res.status(200).json({
    success: true,
    count: result.reports.length,
    pagination: result.pagination,
    data: result.reports,
  });
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public
export const getReport = asyncHandler(async (req, res) => {
  try {
    const report = await getReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
export const createNewReport = asyncHandler(async (req, res) => {
  const { title, description, problemType, severity, location, images } = req.body;

  try {
    // Check user report submission limit
    const limitCheck = await checkReportSubmissionLimit(req.user.id);

    if (!limitCheck.canSubmit) {
      return res.status(429).json({
        success: false,
        message: limitCheck.message,
        limitInfo: limitCheck.limitInfo,
        daysLeft: limitCheck.daysLeft,
      });
    }

    // Debug log
    console.log('=== Report Creation Debug ===');
    console.log('Title:', title);
    console.log('Description:', description?.substring(0, 50));
    console.log('Problem Type:', problemType);
    console.log('Severity:', severity);
    console.log('Location:', location);
    console.log('Images count:', images?.length || 0);
    console.log('User ID:', req.user?.id);
    console.log('===========================');

    // Parse location if it's a string
    let parsedLocation = location;
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (parseError) {
        console.error('Location parse error:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid location data format',
        });
      }
    }

    // Validate required fields
    if (!title || !description || !problemType || !severity || !parsedLocation) {
      console.log('Validation failed:', {
        hasTitle: !!title,
        hasDescription: !!description,
        hasProblemType: !!problemType,
        hasSeverity: !!severity,
        hasLocation: !!parsedLocation
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Upload images to ImgBB using centralized utility
    let imageUrls = [];
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(`Uploading ${images.length} images to ImgBB...`);

      const uploadResults = await uploadMultipleToImgBB(images, `report_${title.substring(0, 20)}`);
      imageUrls = uploadResults.map(result => result.url);

      console.log('Images uploaded successfully to ImgBB:', imageUrls);
    }

    const report = await createReport({
      title,
      description,
      problemType,
      category: req.body.category || problemType, // Save original category
      subcategory: req.body.subcategory || null, // Save subcategory
      severity,
      location: parsedLocation,
      images: imageUrls,
      createdBy: req.user.id,
    });

    // Increment user's report submission count
    await incrementReportSubmission(req.user.id);

    // Return updated limit info
    const updatedLimitCheck = await checkReportSubmissionLimit(req.user.id);

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report,
      limitInfo: updatedLimitCheck,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating report',
      error: error.toString(),
    });
  }
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private (Owner)
export const updateExistingReport = asyncHandler(async (req, res) => {
  try {
    const report = await getReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check if user is owner or superAdmin
    if (report.createdBy.toString() !== req.user.id && req.user.role !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this report',
      });
    }

    const { title, description, images, location } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (images) updateData.images = images;
    if (location) updateData.location = location;

    const updatedReport = await updateReport(req.params.id, updateData);

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: updatedReport,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
// @access  Private (Authority only)
export const changeReportStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Please provide status',
    });
  }

  try {
    const report = await updateReportStatus(req.params.id, status, note || '', req.user.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Send status update email to report creator (non-blocking)
    if (report.createdBy) {
      const creatorId = typeof report.createdBy === 'object' ? report.createdBy._id : report.createdBy;
      getUserById(creatorId.toString()).then(creator => {
        if (creator) {
          sendReportStatusEmail(creator, report, status).catch(err =>
            console.error('Failed to send report status email:', err)
          );
        }
      }).catch(err => console.error('Failed to get report creator:', err));
    }

    res.status(200).json({
      success: true,
      message: 'Report status updated successfully',
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (Owner)
export const removeReport = asyncHandler(async (req, res) => {
  try {
    const report = await getReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check if user is owner or superAdmin
    if (report.createdBy.toString() !== req.user.id && req.user.role !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report',
      });
    }

    await deleteReport(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Add comment to report
// @route   POST /api/reports/:id/comment
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a comment',
    });
  }

  try {
    const report = await addCommentToReport(req.params.id, {
      user: req.user.id,
      comment: comment.trim(),
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Toggle upvote on report
// @route   POST /api/reports/:id/upvote
// @access  Private
export const upvoteReport = asyncHandler(async (req, res) => {
  try {
    const result = await toggleReportUpvote(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: `Upvote ${result.action}`,
      data: result.report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get reports by user
// @route   GET /api/reports/user/:userId
// @access  Private
export const getUserReports = asyncHandler(async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const result = await findReports(
      { createdBy: new ObjectId(req.params.userId) },
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      }
    );

    res.status(200).json({
      success: true,
      count: result.reports.length,
      pagination: result.pagination,
      data: result.reports,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
