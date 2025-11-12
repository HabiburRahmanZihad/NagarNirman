// Statistics Routes
import express from 'express';
import {
  getMapStatistics,
  getAllDivisionStatistics,
  getDivisionDistrictStatistics,
  getCompleteStats,
  getSummaryStatistics
} from '../controllers/statisticsController.js';

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

export default router;
