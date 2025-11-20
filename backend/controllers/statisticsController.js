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

/**
 * @desc    Get comprehensive analytics data for dashboard
 * @route   GET /api/statistics/analytics
 * @access  Private (Authority)
 */
export const getAnalytics = async (req, res) => {
  try {
    // Check if user is NGO, Problem Solver, or SuperAdmin
    if (req.user.role !== 'ngo' && req.user.role !== 'problemSolver' && req.user.role !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Statistics are only available for NGO, Problem Solvers, and SuperAdmin.'
      });
    }

    const { division, startDate, endDate } = req.query;
    const db = getDB();

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Build division filter
    const divisionFilter = division && division !== 'all' ? { 'location.division': division } : {};

    const filter = { ...dateFilter, ...divisionFilter };

    // Get all reports with filter
    const reports = await db.collection('reports').find(filter).toArray();
    const tasks = await db.collection('tasks').find({}).toArray();
    const users = await db.collection('users').find({
      role: { $in: ['problemSolver', 'ngo'] },
      approved: true,
      isActive: true
    }).toArray();

    // Calculate basic metrics
    const totalReports = reports.length;
    const completedReports = reports.filter(r => r.status === 'resolved').length;
    const ongoingReports = reports.filter(r => ['approved', 'in-progress'].includes(r.status)).length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const rejectedReports = reports.filter(r => r.status === 'rejected').length;

    // Calculate completion rate
    const completionRate = totalReports > 0
      ? Math.round((completedReports / totalReports) * 100)
      : 0;

    // Calculate average resolution time (in hours)
    let averageResolutionTime = 0;
    const resolvedReports = reports.filter(r => r.status === 'resolved');
    if (resolvedReports.length > 0) {
      const totalTime = resolvedReports.reduce((sum, report) => {
        const created = new Date(report.createdAt);
        const updated = new Date(report.updatedAt);
        const hours = (updated - created) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      averageResolutionTime = Math.round(totalTime / resolvedReports.length);
    }

    // Category statistics
    const categoryStats = reports.reduce((acc, report) => {
      const type = report.problemType || 'other';
      if (!acc[type]) {
        acc[type] = { category: type, count: 0 };
      }
      acc[type].count++;
      return acc;
    }, {});

    // Status statistics
    const statusStats = [
      { status: 'Pending', count: pendingReports, color: '#fbbf24' },
      { status: 'Approved', count: reports.filter(r => r.status === 'approved').length, color: '#06b6d4' },
      { status: 'In Progress', count: reports.filter(r => r.status === 'in-progress').length, color: '#3b82f6' },
      { status: 'Resolved', count: completedReports, color: '#10b981' },
      { status: 'Rejected', count: rejectedReports, color: '#ef4444' }
    ];

    // Monthly statistics (last 12 months)
    const monthlyStats = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthReports = reports.filter(r => {
        const reportDate = new Date(r.createdAt);
        return reportDate >= monthDate && reportDate < nextMonth;
      });

      monthlyStats.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        reports: monthReports.length,
        resolved: monthReports.filter(r => r.status === 'resolved').length,
        pending: monthReports.filter(r => r.status === 'pending').length
      });
    }

    // District statistics
    const districtStats = reports.reduce((acc, report) => {
      const district = report.location?.district || 'Unknown';
      const division = report.location?.division || 'Unknown';

      if (!acc[district]) {
        acc[district] = {
          district,
          division,
          total: 0,
          pending: 0,
          resolved: 0,
          ongoing: 0
        };
      }

      acc[district].total++;
      if (report.status === 'pending') acc[district].pending++;
      if (report.status === 'resolved') acc[district].resolved++;
      if (['approved', 'in-progress'].includes(report.status)) acc[district].ongoing++;

      return acc;
    }, {});

    // Solver performance statistics
    const solverStats = await Promise.all(
      users.map(async (user) => {
        const userTasks = tasks.filter(t => t.assignedTo.toString() === user._id.toString());
        const completedTasks = userTasks.filter(t => t.status === 'completed').length;
        const totalTasks = userTasks.length;

        // Calculate success rate
        const successRate = totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0;

        // Calculate average resolution time
        let avgResolutionTime = 0;
        const completedTasksWithTime = userTasks.filter(t => t.status === 'completed' && t.completedAt);
        if (completedTasksWithTime.length > 0) {
          const totalTime = completedTasksWithTime.reduce((sum, task) => {
            const created = new Date(task.createdAt);
            const completed = new Date(task.completedAt);
            const hours = (completed - created) / (1000 * 60 * 60);
            return sum + hours;
          }, 0);
          avgResolutionTime = Math.round(totalTime / completedTasksWithTime.length);
        }

        return {
          solverId: user._id,
          name: user.name,
          completedTasks,
          totalTasks,
          successRate,
          avgResolutionTime,
          rating: user.rating || 0,
          organization: user.organization || null
        };
      })
    );

    // Sort by completed tasks and take top 10
    const topSolvers = solverStats
      .filter(s => s.totalTasks > 0)
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 10);

    // Response data
    const analyticsData = {
      totalReports,
      completedReports,
      ongoingReports,
      pendingReports,
      averageResolutionTime,
      completionRate,
      categoryStats: Object.values(categoryStats),
      statusStats,
      monthlyStats,
      districtStats: Object.values(districtStats),
      solverPerformance: topSolvers,
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data',
      error: error.message
    });
  }
};

/**
 * @desc    Get SuperAdmin dashboard statistics
 * @route   GET /api/statistics/admin-dashboard
 * @access  Private (SuperAdmin only)
 */
export const getAdminDashboardStats = async (req, res) => {
  try {
    const db = getDB();

    // Get all collections
    const usersCollection = db.collection('users');
    const reportsCollection = db.collection('reports');
    const applicationsCollection = db.collection('problemSolverApplications');

    // Fetch all stats in parallel
    const [
      totalUsers,
      totalReports,
      authorities,
      problemSolvers,
      ngos,
      pendingApplications,
      recentReports
    ] = await Promise.all([
      usersCollection.countDocuments(),
      reportsCollection.countDocuments(),
      usersCollection.countDocuments({ role: 'authority' }),
      usersCollection.countDocuments({ role: 'problemSolver' }),
      usersCollection.countDocuments({ role: 'ngo' }),
      applicationsCollection.countDocuments({ status: 'pending' }),
      reportsCollection.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalReports,
          authorities,
          problemSolvers,
          ngos,
          pendingApplications
        },
        recentReports
      }
    });
  } catch (error) {
    console.error('Error getting admin dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin dashboard statistics',
      error: error.message
    });
  }
};

export default {
  getMapStatistics,
  getAllDivisionStatistics,
  getDivisionDistrictStatistics,
  getCompleteStats,
  getSummaryStatistics,
  getAnalytics,
  getAdminDashboardStats
};
