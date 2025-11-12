// Statistics Controller - Handle all statistics-related requests
import {
  getCompleteStatistics,
  getDivisionStatistics,
  getDistrictStatisticsByDivision,
  getCompleteMapData
} from '../models/Statistics.js';
import { getDB } from '../config/db.js';

/**
 * @desc    Get complete map data with all divisions and districts
 * @route   GET /api/statistics/map
 * @access  Public
 */
export const getMapStatistics = async (req, res) => {
  try {
    const data = await getCompleteMapData();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting map statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching map statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get all division-level statistics
 * @route   GET /api/statistics/divisions
 * @access  Public
 */
export const getAllDivisionStatistics = async (req, res) => {
  try {
    const stats = await getDivisionStatistics();

    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    console.error('Error getting division statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching division statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get district statistics for a specific division
 * @route   GET /api/statistics/divisions/:division/districts
 * @access  Public
 */
export const getDivisionDistrictStatistics = async (req, res) => {
  try {
    const { division } = req.params;

    if (!division) {
      return res.status(400).json({
        success: false,
        message: 'Division name is required'
      });
    }

    const stats = await getDistrictStatisticsByDivision(division);

    res.status(200).json({
      success: true,
      division,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    console.error('Error getting district statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching district statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get complete statistics (all divisions and districts)
 * @route   GET /api/statistics/complete
 * @access  Public
 */
export const getCompleteStats = async (req, res) => {
  try {
    const stats = await getCompleteStatistics();

    // Group by division
    const groupedByDivision = stats.reduce((acc, stat) => {
      const division = stat.division || 'Unknown';
      if (!acc[division]) {
        acc[division] = [];
      }
      acc[division].push(stat);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      totalRecords: stats.length,
      divisions: Object.keys(groupedByDivision).length,
      data: groupedByDivision
    });
  } catch (error) {
    console.error('Error getting complete statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complete statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get summary statistics
 * @route   GET /api/statistics/summary
 * @access  Public
 */
export const getSummaryStatistics = async (req, res) => {
  try {
    const reportsCollection = getDB().collection('reports');

    // Get ALL reports statistics (including those without division)
    const [allReportsStats, divisionStats, completeStats] = await Promise.all([
      reportsCollection.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            approved: {
              $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
            },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
            },
            rejected: {
              $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
            }
          }
        }
      ]).toArray(),
      getDivisionStatistics(),
      getCompleteStatistics()
    ]);

    // Extract the aggregate result
    const allStats = allReportsStats[0] || {
      total: 0,
      pending: 0,
      approved: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0
    };

    // Calculate overall statistics using ALL reports
    const summary = {
      totalDivisions: divisionStats.length,
      totalDistricts: completeStats.length,
      totalReports: allStats.total,
      totalPending: allStats.pending,
      totalApproved: allStats.approved,
      totalInProgress: allStats.inProgress,
      totalResolved: allStats.resolved,
      totalRejected: allStats.rejected,
      overallCompletionRate: 0,
      divisions: divisionStats.map(d => ({
        name: d.division,
        total: d.total,
        completionRate: d.completionRate,
        priorityLevel: d.priorityLevel,
        districtCount: d.districtCount
      }))
    };

    // Calculate overall completion rate
    if (summary.totalReports > 0) {
      summary.overallCompletionRate = Math.round(
        (summary.totalResolved / summary.totalReports) * 100
      );
    }

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: summary
    });
  } catch (error) {
    console.error('Error getting summary statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching summary statistics',
      error: error.message
    });
  }
};

export default {
  getMapStatistics,
  getAllDivisionStatistics,
  getDivisionDistrictStatistics,
  getCompleteStats,
  getSummaryStatistics
};
