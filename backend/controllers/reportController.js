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
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (problemType) filter.problemType = problemType;
  if (division) filter['location.division'] = division;
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

// Helper function to upload image to ImgBB
const uploadToImgBB = async (base64Image) => {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error('ImgBB API key not configured');
  }

  // Remove data:image/...;base64, prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const formData = new URLSearchParams();
  formData.append('key', apiKey);
  formData.append('image', base64Data);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to upload image');
  }

  return result.data.url;
};

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
export const createNewReport = asyncHandler(async (req, res) => {
  const { title, description, problemType, severity, location, images } = req.body;

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

  try {
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

    // Upload images to ImgBB
    let imageUrls = [];
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(`Uploading ${images.length} images to ImgBB...`);

      const uploadPromises = images.map(base64Image => uploadToImgBB(base64Image));
      imageUrls = await Promise.all(uploadPromises);

      console.log('Images uploaded successfully:', imageUrls);
    }

    const report = await createReport({
      title,
      description,
      problemType,
      severity,
      location: parsedLocation,
      images: imageUrls,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report,
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
