import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

/**
 * Get comprehensive leaderboard data for problem solvers
 * Aggregates data from Users, Tasks, Reports, and Statistics collections
 */
export const getLeaderboard = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const tasksCollection = db.collection("tasks");
    const statisticsCollection = db.collection("statistics");

    // Aggregation pipeline to get leaderboard data
    const leaderboard = await usersCollection
      .aggregate([
        // Filter only problem solvers
        {
          $match: {
            role: "problem_solver",
            status: "active"
          }
        },
        // Lookup statistics data
        {
          $lookup: {
            from: "statistics",
            localField: "_id",
            foreignField: "userId",
            as: "stats"
          }
        },
        // Unwind stats array (convert array to object)
        {
          $unwind: {
            path: "$stats",
            preserveNullAndEmptyArrays: true
          }
        },
        // Lookup tasks to count completed tasks
        {
          $lookup: {
            from: "tasks",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$solver", "$$userId"] },
                  status: "completed"
                }
              },
              {
                $count: "total"
              }
            ],
            as: "completedTasksData"
          }
        },
        // Unwind completed tasks
        {
          $unwind: {
            path: "$completedTasksData",
            preserveNullAndEmptyArrays: true
          }
        },
        // Lookup to get total assigned tasks
        {
          $lookup: {
            from: "tasks",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$solver", "$$userId"] }
                }
              },
              {
                $count: "total"
              }
            ],
            as: "totalTasksData"
          }
        },
        // Unwind total tasks
        {
          $unwind: {
            path: "$totalTasksData",
            preserveNullAndEmptyArrays: true
          }
        },
        // Lookup to get ongoing tasks
        {
          $lookup: {
            from: "tasks",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$solver", "$$userId"] },
                  $or: [
                    { status: "accepted" },
                    { status: "in-progress" }
                  ]
                }
              },
              {
                $count: "total"
              }
            ],
            as: "ongoingTasksData"
          }
        },
        // Unwind ongoing tasks
        {
          $unwind: {
            path: "$ongoingTasksData",
            preserveNullAndEmptyArrays: true
          }
        },
        // Project final structure
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            phone: 1,
            profileImage: 1,
            district: 1,
            division: 1,
            specialization: 1,
            experience: 1,
            points: { $ifNull: ["$stats.points", 0] },
            completedTasks: { $ifNull: ["$completedTasksData.total", 0] },
            totalTasks: { $ifNull: ["$totalTasksData.total", 0] },
            ongoingTasks: { $ifNull: ["$ongoingTasksData.total", 0] },
            totalRating: { $ifNull: ["$stats.totalRating", 0] },
            streak: { $ifNull: ["$stats.streak", 0] },
            level: { $ifNull: ["$stats.level", 1] },
            xp: { $ifNull: ["$stats.xp", 0] },
            xpRequired: { $ifNull: ["$stats.xpRequired", 1000] },
            badges: { $ifNull: ["$stats.badges", []] },
            createdAt: 1,
            updatedAt: 1
          }
        },
        // Sort by points (primary) then by completed tasks (secondary)
        {
          $sort: {
            points: -1,
            completedTasks: -1
          }
        },
        // Add rank field
        {
          $group: {
            _id: null,
            users: { $push: "$$ROOT" }
          }
        },
        {
          $unwind: {
            path: "$users",
            includeArrayIndex: "rank"
          }
        },
        {
          $addFields: {
            "users.rank": { $add: ["$users.rank", 1] }
          }
        },
        {
          $replaceRoot: {
            newRoot: "$users"
          }
        },
        // Limit to top 100 performers
        {
          $limit: 100
        }
      ])
      .toArray();

    // Calculate additional metrics
    const totalSolvers = await usersCollection.countDocuments({
      role: "problem_solver",
      status: "active"
    });

    const topPoints = leaderboard.length > 0 ? leaderboard[0].points : 0;
    const averagePoints =
      leaderboard.reduce((sum, user) => sum + user.points, 0) / (leaderboard.length || 1);

    res.json({
      success: true,
      data: {
        leaderboard,
        metrics: {
          totalSolvers,
          topPoints,
          averagePoints,
          listSize: leaderboard.length
        }
      }
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message
    });
  }
};

/**
 * Get leaderboard data with filters and pagination
 */
export const getLeaderboardFiltered = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const { page = 1, limit = 20, district, division, sortBy = "points" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};

    switch (sortBy) {
      case "streak":
        sortOptions["stats.currentStreak"] = -1;
        break;
      case "completed":
        sortOptions["completedTasksData.total"] = -1;
        break;
      case "rating":
        sortOptions["stats.averageRating"] = -1;
        break;
      default:
        sortOptions["stats.totalPoints"] = -1;
    }

    // Build match stage
    const matchStage = {
      role: "problem_solver",
      status: "active"
    };

    if (district) matchStage.district = district;
    if (division) matchStage.division = division;

    const leaderboard = await usersCollection
      .aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "statistics",
            localField: "_id",
            foreignField: "userId",
            as: "stats"
          }
        },
        {
          $unwind: {
            path: "$stats",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "tasks",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$solver", "$$userId"] },
                  status: "completed"
                }
              },
              { $count: "total" }
            ],
            as: "completedTasksData"
          }
        },
        {
          $unwind: {
            path: "$completedTasksData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "tasks",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$solver", "$$userId"] }
                }
              },
              { $count: "total" }
            ],
            as: "totalTasksData"
          }
        },
        {
          $unwind: {
            path: "$totalTasksData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            profileImage: 1,
            district: 1,
            division: 1,
            points: { $ifNull: ["$stats.points", 0] },
            completedTasks: { $ifNull: ["$completedTasksData.total", 0] },
            totalTasks: { $ifNull: ["$totalTasksData.total", 0] },
            totalRating: { $ifNull: ["$stats.totalRating", 0] },
            streak: { $ifNull: ["$stats.streak", 0] },
            level: { $ifNull: ["$stats.level", 1] },
            xp: { $ifNull: ["$stats.xp", 0] },
            xpRequired: { $ifNull: ["$stats.xpRequired", 1000] },
            badges: { $ifNull: ["$stats.badges", []] }
          }
        },
        { $sort: sortOptions },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ])
      .toArray();

    // Get total count for pagination
    const total = await usersCollection.countDocuments(matchStage);

    res.json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error("Error fetching filtered leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message
    });
  }
};

/**
 * Get user's rank and nearby competitors
 */
export const getUserRankWithNearby = async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    // Get all solvers with points, sorted by points
    const usersCollection = db.collection("users");
    const allSolvers = await usersCollection
      .aggregate([
        {
          $match: {
            role: "problem_solver",
            status: "active"
          }
        },
        {
          $lookup: {
            from: "statistics",
            localField: "_id",
            foreignField: "userId",
            as: "stats"
          }
        },
        {
          $unwind: {
            path: "$stats",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "tasks",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$solver", "$$userId"] },
                  status: "completed"
                }
              },
              { $count: "total" }
            ],
            as: "completedTasksData"
          }
        },
        {
          $unwind: {
            path: "$completedTasksData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            profileImage: 1,
            points: { $ifNull: ["$stats.points", 0] },
            completedTasks: { $ifNull: ["$completedTasksData.total", 0] },
            streak: { $ifNull: ["$stats.streak", 0] },
            level: { $ifNull: ["$stats.level", 1] }
          }
        },
        {
          $sort: { points: -1 }
        }
      ])
      .toArray();

    // Find user's rank
    const userRank = allSolvers.findIndex(
      (solver) => solver._id.toString() === userId
    );

    if (userRank === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found in leaderboard"
      });
    }

    // Get nearby competitors (±5 positions)
    const nearby = allSolvers.slice(Math.max(0, userRank - 5), userRank + 6);

    res.json({
      success: true,
      data: {
        userRank: userRank + 1,
        userInfo: allSolvers[userRank],
        nearby,
        totalSolvers: allSolvers.length
      }
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user rank",
      error: error.message
    });
  }
};

/**
 * Get leaderboard by district
 */
export const getDistrictLeaderboard = async (req, res) => {
  try {
    const db = getDB();
    const { district } = req.params;
    const { limit = 50 } = req.query;

    const usersCollection = db.collection("users");
    const leaderboard = await usersCollection
      .aggregate([
        {
          $match: {
            role: "problem_solver",
            status: "active",
            district: district
          }
        },
        {
          $lookup: {
            from: "statistics",
            localField: "_id",
            foreignField: "userId",
            as: "stats"
          }
        },
        {
          $unwind: {
            path: "$stats",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "tasks",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$solver", "$$userId"] },
                  status: "completed"
                }
              },
              { $count: "total" }
            ],
            as: "completedTasksData"
          }
        },
        {
          $unwind: {
            path: "$completedTasksData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            profileImage: 1,
            district: 1,
            points: { $ifNull: ["$stats.points", 0] },
            completedTasks: { $ifNull: ["$completedTasksData.total", 0] },
            totalRating: { $ifNull: ["$stats.totalRating", 0] },
            streak: { $ifNull: ["$stats.streak", 0] },
            level: { $ifNull: ["$stats.level", 1] }
          }
        },
        { $sort: { points: -1 } },
        { $limit: parseInt(limit) }
      ])
      .toArray();

    res.json({
      success: true,
      data: {
        district,
        leaderboard,
        count: leaderboard.length
      }
    });
  } catch (error) {
    console.error("Error fetching district leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch district leaderboard",
      error: error.message
    });
  }
};
