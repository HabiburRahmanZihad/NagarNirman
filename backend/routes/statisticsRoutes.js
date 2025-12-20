// Statistics Routes
import express from 'express';
import {
  getMapStatistics,
  getAllDivisionStatistics,
  getDivisionDistrictStatistics,
  getCompleteStats,
  getSummaryStatistics,
  getAnalytics,
  getAdminDashboardStats
} from '../controllers/statisticsController.js';

import { protect, authorize } from '../middleware/auth.js';


const router = express.Router();



// @route   GET /api/statistics/map
// @desc    Get complete map data with all divisions and districts
// @access  Public
router.get('/map', getMapStatistics);


// @route   GET /api/statistics/divisions
// @desc    Get all division-level statistics
// @access  Public
router.get('/divisions', getAllDivisionStatistics);


// @route   GET /api/statistics/divisions/:division/districts
// @desc    Get district statistics for a specific division
// @access  Public
router.get('/divisions/:division/districts', getDivisionDistrictStatistics);


// @route   GET /api/statistics/complete
// @desc    Get complete statistics (all divisions and districts)
// @access  Public
router.get('/complete', getCompleteStats);


// @route   GET /api/statistics/summary
// @desc    Get summary statistics
// @access  Public
router.get('/summary', getSummaryStatistics);


// @route   GET /api/statistics/analytics
// @desc    Get comprehensive analytics data
// @access  Private (Authority)
router.get('/analytics', protect, getAnalytics);


// @route   GET /api/statistics/admin-dashboard
// @desc    Get SuperAdmin dashboard statistics
// @access  Private (SuperAdmin only)
router.get('/admin-dashboard', protect, authorize('superAdmin'), getAdminDashboardStats);


export default router;
