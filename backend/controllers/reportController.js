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
import { getUserById } from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

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
    district,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (problemType) filter.problemType = problemType;
  if (district) filter['location.district'] = district;

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
    const report = await createReport({
      title,
      description,
      problemType,
      severity,
      location,
      images: images || [],
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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

    // Check if user is owner
    if (report.createdBy.toString() !== req.user.id) {
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

    // Check if user is owner
    if (report.createdBy.toString() !== req.user.id) {
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
