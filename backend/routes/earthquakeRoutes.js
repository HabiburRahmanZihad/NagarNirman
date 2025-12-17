import express from 'express';
import {
  getAllEarthquakes,
  getRecentEarthquakes,
  getEarthquakeById,
  getEarthquakesByLocation,
  getHighAlertEarthquakes,
  getBangladeshEarthquakes,
  getEarthquakeStats,
  createEarthquake,
  updateEarthquake,
  deleteEarthquake,
  syncUSGSData,
} from '../controllers/earthquakeController.js';
import {
  getUserNotifications,
  getNotificationsByAlertLevel,
  markNotificationsAsRead,
  getNotificationStats,
  cleanupOldNotifications,
} from '../controllers/earthquakeNotificationController.js';




const router = express.Router();




// ========== EARTHQUAKE DATA ROUTES ==========



// Public routes
router.get('/', getAllEarthquakes);
router.get('/recent', getRecentEarthquakes);
router.get('/high-alert', getHighAlertEarthquakes);
router.get('/bangladesh', getBangladeshEarthquakes);
router.get('/location', getEarthquakesByLocation);
router.get('/stats', getEarthquakeStats);
router.get('/sync/usgs', syncUSGSData); // Sync with USGS
router.get('/:id', getEarthquakeById);





// Admin routes - Earthquake management
router.post('/', createEarthquake);
router.put('/:id', updateEarthquake);
router.delete('/:id', deleteEarthquake);




// ========== EARTHQUAKE NOTIFICATION ROUTES ==========
// Get user's earthquake notifications
router.get('/:userId/notifications', getUserNotifications);
router.get('/:userId/notifications/stats', getNotificationStats);
router.get('/:userId/notifications/alert-level/:alertLevel', getNotificationsByAlertLevel);




// Mark notifications as read
router.post('/:userId/notifications/read', markNotificationsAsRead);




// Admin - Cleanup old notifications
router.post('/admin/cleanup-notifications', cleanupOldNotifications);




export default router;
