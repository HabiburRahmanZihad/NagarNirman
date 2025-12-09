import express from 'express';
import {
  getAllEarthquakes,
  getRecentEarthquakes,
  getEarthquakeById,
  getEarthquakesByLocation,
  getHighAlertEarthquakes,
  getEarthquakeStats,
  createEarthquake,
  updateEarthquake,
  deleteEarthquake,
  getEarthquakeSeverityDistribution,
  syncUSGSData,
} from '../controllers/earthquakeController.js';

const router = express.Router();

// Public routes
router.get('/', getAllEarthquakes);
router.get('/recent', getRecentEarthquakes);
router.get('/high-alert', getHighAlertEarthquakes);
router.get('/location', getEarthquakesByLocation);
router.get('/stats', getEarthquakeStats);
router.get('/severity-distribution', getEarthquakeSeverityDistribution);
router.get('/sync/usgs', syncUSGSData); // Sync with USGS
router.get('/:id', getEarthquakeById);

// Admin routes
router.post('/', createEarthquake);
router.put('/:id', updateEarthquake);
router.delete('/:id', deleteEarthquake);

export default router;
