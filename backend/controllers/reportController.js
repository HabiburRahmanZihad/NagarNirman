// Report Controller
import Report from '../models/Report.js';
import Task from '../models/Task.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
export const getReports = asyncHandler(async (req, res) => {
  const { district, status, category, page = 1, limit = 10, search } = req.query;

  // Build filter object
  const filter = {};
  if (district) filter['location.district'] = district;
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await Report.find(filter)
    .populate('createdBy', 'name email district')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Report.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: reports.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: reports,
  });
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public
export const getReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('createdBy', 'name email district avatar')
    .populate('assignedTo', 'name email role points')
    .populate('comments.user', 'name avatar')
    .populate('history.updatedBy', 'name role');

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
});

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
export const createReport = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    subcategory,
    photoURL,
    location,
    priority,
  } = req.body;

  const report = await Report.create({
    title,
    description,
    category,
    subcategory,
    photoURL,
    location,
    priority: priority || 'medium',
    createdBy: req.user.id,
    history: [{
      status: 'pending',
      updatedBy: req.user.id,
      date: new Date(),
      note: 'Report created',
    }],
  });

  const populatedReport = await Report.findById(report._id)
    .populate('createdBy', 'name email district');

  res.status(201).json({
    success: true,
    message: 'Report created successfully',
    data: populatedReport,
  });
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
export const updateReport = asyncHandler(async (req, res) => {
  let report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  // Check if user is the creator or authority
  if (report.createdBy.toString() !== req.user.id && req.user.role !== 'authority') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this report',
    });
  }

  const { title, description, category, subcategory, photoURL, location, priority } = req.body;

  report = await Report.findByIdAndUpdate(
    req.params.id,
    { title, description, category, subcategory, photoURL, location, priority },
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email district');

  res.status(200).json({
    success: true,
    message: 'Report updated successfully',
    data: report,
  });
});

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
// @access  Private (Authority only)
export const updateReportStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  report.status = status;
  report.history.push({
    status,
    updatedBy: req.user.id,
    date: new Date(),
    note: note || `Status changed to ${status}`,
  });

  await report.save();

  const updatedReport = await Report.findById(report._id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  res.status(200).json({
    success: true,
    message: 'Report status updated successfully',
    data: updatedReport,
  });
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  // Check if user is the creator or authority
  if (report.createdBy.toString() !== req.user.id && req.user.role !== 'authority') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this report',
    });
  }

  await report.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Report deleted successfully',
  });
});

// @desc    Add comment to report
// @route   POST /api/reports/:id/comment
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  report.comments.push({
    user: req.user.id,
    comment,
    date: new Date(),
  });

  await report.save();

  const updatedReport = await Report.findById(report._id)
    .populate('comments.user', 'name avatar');

  res.status(200).json({
    success: true,
    message: 'Comment added successfully',
    data: updatedReport.comments,
  });
});

// @desc    Upvote report
// @route   POST /api/reports/:id/upvote
// @access  Private
export const upvoteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  // Check if user already upvoted
  const alreadyUpvoted = report.upvotedBy.includes(req.user.id);

  if (alreadyUpvoted) {
    // Remove upvote
    report.upvotedBy = report.upvotedBy.filter(
      userId => userId.toString() !== req.user.id
    );
    report.upvotes -= 1;
  } else {
    // Add upvote
    report.upvotedBy.push(req.user.id);
    report.upvotes += 1;
  }

  await report.save();

  res.status(200).json({
    success: true,
    message: alreadyUpvoted ? 'Upvote removed' : 'Report upvoted',
    data: { upvotes: report.upvotes, upvoted: !alreadyUpvoted },
  });
});

// @desc    Get reports by user
// @route   GET /api/reports/user/:userId
// @access  Private
export const getUserReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ createdBy: req.params.userId })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
});
