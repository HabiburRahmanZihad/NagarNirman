import express from "express";
import {
  getLeaderboard,
  getLeaderboardFiltered,
  getUserRankWithNearby,
  getDistrictLeaderboard
} from "../controllers/leaderboardController.js";
import { protect } from "../middleware/auth.js";




const router = express.Router();




/**
 * GET /api/leaderboard
 * Get full leaderboard (top 100 problem solvers)
 * Public route
 */
router.get("/", getLeaderboard);




/**
 * GET /api/leaderboard/filtered
 * Get filtered and paginated leaderboard
 * Query params: page, limit, district, division, sortBy
 * Public route
 */
router.get("/filtered", getLeaderboardFiltered);




/**
 * GET /api/leaderboard/rank/:userId
 * Get user's rank and nearby competitors
 * Protected route
 */
router.get("/rank/:userId", protect, getUserRankWithNearby);



/**
 * GET /api/leaderboard/district/:district
 * Get leaderboard for specific district
 * Public route
 */
router.get("/district/:district", getDistrictLeaderboard);



export default router;
