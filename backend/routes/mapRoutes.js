// Map Routes
import express from 'express';
import {
  getDivisionsStats,
  getDivisionStats,
  getDistrictStats,
} from '../controllers/mapController.js';

const router = express.Router();

// Get all divisions with statistics
router.get('/divisions', getDivisionsStats);



// Get statistics for a specific division
router.get('/divisions/:division', getDivisionStats);



// Get statistics for a specific district
router.get('/districts/:district', getDistrictStats);



export default router;
