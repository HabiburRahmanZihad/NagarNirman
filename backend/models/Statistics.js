// Statistics Model - Comprehensive statistics aggregation
import { getDB } from '../config/db.js';

// Get reports collection
const getReportsCollection = () => getDB().collection('reports');




/**
 * Get comprehensive statistics for all divisions and districts
 * Returns complete breakdown of all report states
 */
export const getCompleteStatistics = async () => {
  try {
    const stats = await getReportsCollection()
      .aggregate([
        {
          $group: {
            _id: {
              division: '$location.division',
              district: '$location.district'
            },
            // Count by status
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
            },

            // Count by severity
            lowSeverity: {
              $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] }
            },
            mediumSeverity: {
              $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] }
            },
            highSeverity: {
              $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
            },
            urgentSeverity: {
              $sum: { $cond: [{ $eq: ['$severity', 'urgent'] }, 1, 0] }
            },

            // Count by problem type
            problemTypes: { $push: '$problemType' },

            // Collect report IDs for reference
            reportIds: { $push: '$_id' },

            // Calculate average time metrics (if createdAt and updatedAt exist)
            avgCreatedAt: { $avg: { $toLong: '$createdAt' } },
            avgUpdatedAt: { $avg: { $toLong: '$updatedAt' } }
          }
        },
        {
          $project: {
            _id: 0,
            division: '$_id.division',
            district: '$_id.district',
            total: 1,

            // Status breakdown
            statusBreakdown: {
              pending: '$pending',
              approved: '$approved',
              inProgress: '$inProgress',
              resolved: '$resolved',
              rejected: '$rejected'
            },

            // Severity breakdown
            severityBreakdown: {
              low: '$lowSeverity',
              medium: '$mediumSeverity',
              high: '$highSeverity',
              urgent: '$urgentSeverity'
            },

            // Problem types count
            problemTypesCount: {
              $reduce: {
                input: '$problemTypes',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: [[
                        {
                          k: '$$this',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]]
                    }
                  ]
                }
              }
            },

            // Calculated metrics
            completionRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $multiply: [{ $divide: ['$resolved', '$total'] }, 100] },
                0
              ]
            },

            activeReports: {
              $add: ['$pending', '$approved', '$inProgress']
            },

            // Priority level based on severity and status
            priorityLevel: {
              $cond: [
                { $gte: ['$urgentSeverity', 1] }, 'urgent',
                {
                  $cond: [
                    { $gte: ['$highSeverity', 1] }, 'high',
                    {
                      $cond: [
                        { $gt: ['$pending', '$resolved'] }, 'medium',
                        'low'
                      ]
                    }
                  ]
                }
              ]
            },

            // Performance indicator
            performanceScore: {
              $cond: [
                { $gt: ['$total', 0] },
                {
                  $subtract: [
                    100,
                    {
                      $multiply: [
                        { $divide: [{ $add: ['$pending', '$rejected'] }, '$total'] },
                        100
                      ]
                    }
                  ]
                },
                0
              ]
            },

            reportCount: { $size: '$reportIds' }
          }
        },
        {
          $sort: { division: 1, district: 1 }
        }
      ])
      .toArray();

    return stats;
  } catch (error) {
    console.error('Error fetching complete statistics:', error);
    throw error;
  }
};




/**
 * Get division-level aggregated statistics
 */
export const getDivisionStatistics = async () => {
  try {
    const stats = await getReportsCollection()
      .aggregate([
        {
          $match: {
            'location.division': { $ne: null, $exists: true }
          }
        },
        {
          $group: {
            _id: '$location.division',
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
            },
            urgentCount: {
              $sum: { $cond: [{ $eq: ['$severity', 'urgent'] }, 1, 0] }
            },
            highCount: {
              $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
            },
            districts: { $addToSet: '$location.district' }
          }
        },
        {
          $project: {
            _id: 0,
            division: '$_id',
            total: 1,
            pending: 1,
            approved: 1,
            inProgress: 1,
            resolved: 1,
            rejected: 1,
            activeReports: { $add: ['$pending', '$approved', '$inProgress'] },
            completionRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $round: [{ $multiply: [{ $divide: ['$resolved', '$total'] }, 100] }, 2] },
                0
              ]
            },
            intensity: '$total',
            trend: {
              $concat: [
                '+',
                {
                  $toString: {
                    $round: [
                      {
                        $cond: [
                          { $gt: ['$total', 0] },
                          { $multiply: [{ $divide: ['$resolved', '$total'] }, 100] },
                          0
                        ]
                      },
                      0
                    ]
                  }
                },
                '%'
              ]
            },
            priorityLevel: {
              $cond: [
                { $gte: ['$urgentCount', 1] }, 'urgent',
                {
                  $cond: [
                    { $gte: ['$highCount', 1] }, 'high',
                    'medium'
                  ]
                }
              ]
            },
            districtCount: { $size: '$districts' },
            districts: 1
          }
        },
        {
          $sort: { total: -1 }
        }
      ])
      .toArray();

    return stats;
  } catch (error) {
    console.error('Error fetching division statistics:', error);
    throw error;
  }
};




/**
 * Get district-level statistics for a specific division
 */
export const getDistrictStatisticsByDivision = async (divisionName) => {
  try {
    const stats = await getReportsCollection()
      .aggregate([
        {
          $match: {
            'location.division': { $regex: new RegExp(divisionName, 'i') }
          }
        },
        {
          $group: {
            _id: '$location.district',
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
            },
            urgentCount: {
              $sum: { $cond: [{ $eq: ['$severity', 'urgent'] }, 1, 0] }
            },
            highCount: {
              $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
            },
            problemTypes: { $push: '$problemType' }
          }
        },
        {
          $project: {
            _id: 0,
            district: '$_id',
            total: 1,
            statusBreakdown: {
              pending: '$pending',
              approved: '$approved',
              inProgress: '$inProgress',
              resolved: '$resolved',
              rejected: '$rejected'
            },
            pending: 1,
            inProgress: 1,
            completed: '$resolved',
            rejected: 1,
            activeReports: { $add: ['$pending', '$approved', '$inProgress'] },
            completionRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $round: [{ $multiply: [{ $divide: ['$resolved', '$total'] }, 100] }, 2] },
                0
              ]
            },
            priority: {
              $cond: [
                { $gte: ['$urgentCount', 1] }, 'high',
                {
                  $cond: [
                    { $gte: ['$highCount', 1] }, 'high',
                    {
                      $cond: [
                        { $gte: ['$pending', '$resolved'] }, 'medium',
                        'low'
                      ]
                    }
                  ]
                }
              ]
            },
            problemTypes: 1
          }
        },
        {
          $sort: { total: -1 }
        }
      ])
      .toArray();

    return stats;
  } catch (error) {
    console.error('Error fetching district statistics:', error);
    throw error;
  }
};



/**
 * Get complete map data with all statistics
 */
export const getCompleteMapData = async () => {
  try {
    // Get all statistics and total count from database
    const [completeStats, divisionStats, totalCount] = await Promise.all([
      getCompleteStatistics(),
      getDivisionStatistics(),
      getReportsCollection().countDocuments() // Get actual total count
    ]);

    // Structure data by division
    const mapData = {};

    divisionStats.forEach(division => {
      if (!division.division) return;

      // Get districts for this division
      const districts = completeStats
        .filter(stat => stat.division === division.division)
        .map(districtStat => ({
          name: districtStat.district,
          total: districtStat.total,
          pending: districtStat.statusBreakdown.pending,
          approved: districtStat.statusBreakdown.approved,
          inProgress: districtStat.statusBreakdown.inProgress,
          completed: districtStat.statusBreakdown.resolved,
          resolved: districtStat.statusBreakdown.resolved,
          rejected: districtStat.statusBreakdown.rejected,
          activeReports: districtStat.activeReports,
          completionRate: districtStat.completionRate,
          priority: districtStat.priorityLevel,
          severityBreakdown: districtStat.severityBreakdown,
          problemTypes: districtStat.problemTypesCount,
          performanceScore: districtStat.performanceScore
        }));

      mapData[division.division] = {
        division: division.division,
        total: division.total,
        pending: division.pending,
        approved: division.approved,
        inProgress: division.inProgress,
        resolved: division.resolved,
        rejected: division.rejected,
        activeReports: division.activeReports,
        completionRate: division.completionRate,
        intensity: division.intensity,
        trend: division.trend,
        priorityLevel: division.priorityLevel,
        districtCount: division.districtCount,
        districts: districts
      };
    });

    return {
      success: true,
      timestamp: new Date().toISOString(),
      totalDivisions: Object.keys(mapData).length,
      totalDistricts: completeStats.length,
      totalReports: totalCount, // Use actual database count instead of aggregated sum
      data: mapData
    };
  } catch (error) {
    console.error('Error fetching complete map data:', error);
    throw error;
  }
};




export default {
  getCompleteStatistics,
  getDivisionStatistics,
  getDistrictStatisticsByDivision,
  getCompleteMapData
};
