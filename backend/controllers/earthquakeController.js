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
  getEarthquakeCount,
  createEarthquakeIndexes,
  calculateAlertLevel,
} from '../models/Earthquake.js';
import { fetchUSGSEarthquakes } from '../services/usgsService.js';
import { createEarthquakeNotifications } from '../services/earthquakeNotificationService.js';

// Get all earthquakes
export const getAllEarthquakesController = async (req, res) => {
  try {
    const { page = 1, limit = 20, magnitude, alertLevel, sortBy = 'timestamp' } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (magnitude) filter.magnitude = { $gte: parseFloat(magnitude) };
    if (alertLevel) filter.alertLevel = alertLevel;

    const options = {
      sort: sortBy === 'magnitude' ? { magnitude: -1 } : { timestamp: -1 },
      limit: parseInt(limit),
      skip: parseInt(skip),
    };

    const earthquakes = await getAllEarthquakes(filter, options);
    const total = await getEarthquakeCount(filter);

    res.status(200).json({
      success: true,
      data: earthquakes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      source: 'USGS Earthquake Hazards Program',
    });
  } catch (error) {
    console.error('Error fetching earthquakes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earthquakes',
      error: error.message,
    });
  }
};

// Get recent earthquakes
export const getRecentEarthquakesController = async (req, res) => {
  try {
    const { limit = 20, days = 7 } = req.query;

    // First try database
    let earthquakes = await getRecentEarthquakes(parseInt(days), parseInt(limit));

    // If database is empty, fetch from USGS and save
    if (earthquakes.length === 0) {
      console.log('📡 Database empty, fetching from USGS...');
      const usgsData = await fetchUSGSEarthquakes('7days', 2.5);

      for (const eq of usgsData.slice(0, 50)) {
        try {
          await createEarthquake(eq);
        } catch (err) {
          // Skip duplicates
          if (!err.message.includes('already exists')) {
            console.error('Error saving earthquake:', err.message);
          }
        }
      }

      earthquakes = await getRecentEarthquakes(parseInt(days), parseInt(limit));
    }

    res.status(200).json({
      success: true,
      data: earthquakes,
      count: earthquakes.length,
      timeFrame: `Last ${days} day(s)`,
      source: 'USGS Earthquake Hazards Program',
    });
  } catch (error) {
    console.error('Error fetching recent earthquakes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent earthquakes',
      error: error.message,
    });
  }
};

// Get earthquake by ID
export const getEarthquakeByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const earthquake = await getEarthquakeById(id);

    if (!earthquake) {
      return res.status(404).json({
        success: false,
        message: 'Earthquake not found',
      });
    }

    res.status(200).json({
      success: true,
      data: earthquake,
      source: 'USGS Earthquake Hazards Program',
    });
  } catch (error) {
    console.error('Error fetching earthquake:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earthquake',
      error: error.message,
    });
  }
};

// Get earthquakes by location (geospatial)
export const getEarthquakesByLocationController = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 100 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    // maxDistance in km, convert to meters
    const earthquakes = await getEarthquakesByLocation(
      parseFloat(longitude),
      parseFloat(latitude),
      parseInt(maxDistance) * 1000
    );

    res.status(200).json({
      success: true,
      data: earthquakes,
      count: earthquakes.length,
      location: { latitude, longitude, maxDistance: `${maxDistance}km` },
    });
  } catch (error) {
    console.error('Error fetching earthquakes by location:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earthquakes by location',
      error: error.message,
    });
  }
};

// Get high alert earthquakes
export const getHighAlertEarthquakesController = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const earthquakes = await getHighAlertEarthquakes(parseInt(days));

    res.status(200).json({
      success: true,
      data: earthquakes,
      count: earthquakes.length,
      alertLevels: ['Red', 'Orange'],
    });
  } catch (error) {
    console.error('Error fetching high alert earthquakes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching high alert earthquakes',
      error: error.message,
    });
  }
};

// Get Bangladesh earthquakes
export const getBangladeshEarthquakesController = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const earthquakes = await getBangladeshEarthquakes(parseInt(limit));

    res.status(200).json({
      success: true,
      data: earthquakes,
      count: earthquakes.length,
      region: 'Bangladesh',
    });
  } catch (error) {
    console.error('Error fetching Bangladesh earthquakes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Bangladesh earthquakes',
      error: error.message,
    });
  }
};

// Get earthquake statistics
export const getEarthquakeStatsController = async (req, res) => {
  try {
    const stats = await getEarthquakeStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching earthquake stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earthquake stats',
      error: error.message,
    });
  }
};

// Admin: Create earthquake
export const createEarthquakeController = async (req, res) => {
  try {
    const earthquake = await createEarthquake(req.body);

    // Create notifications for affected users
    const notificationResult = await createEarthquakeNotifications(earthquake);

    res.status(201).json({
      success: true,
      message: 'Earthquake created successfully',
      data: earthquake,
      notifications: notificationResult,
    });
  } catch (error) {
    console.error('Error creating earthquake:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating earthquake',
      error: error.message,
    });
  }
};

// Admin: Update earthquake
export const updateEarthquakeController = async (req, res) => {
  try {
    const { id } = req.params;

    const earthquake = await updateEarthquake(id, req.body);

    if (!earthquake) {
      return res.status(404).json({
        success: false,
        message: 'Earthquake not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Earthquake updated successfully',
      data: earthquake,
    });
  } catch (error) {
    console.error('Error updating earthquake:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating earthquake',
      error: error.message,
    });
  }
};

// Admin: Delete earthquake
export const deleteEarthquakeController = async (req, res) => {
  try {
    const { id } = req.params;

    const earthquake = await deleteEarthquake(id);

    if (!earthquake) {
      return res.status(404).json({
        success: false,
        message: 'Earthquake not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Earthquake deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting earthquake:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting earthquake',
      error: error.message,
    });
  }
};

// Sync with USGS
export const syncUSGSDataController = async (req, res) => {
  try {
    console.log('🔄 Starting USGS data sync...');

    // Create indexes first
    await createEarthquakeIndexes();

    // Fetch from USGS
    const usgsData = await fetchUSGSEarthquakes('7days', 2.5);

    if (usgsData.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new earthquakes from USGS',
        synced: 0,
        updated: 0,
      });
    }

    let synced = 0;
    let updated = 0;
    let notificationsSent = 0;

    // Save/update earthquakes
    for (const eq of usgsData) {
      try {
        const existing = await getEarthquakeById(eq.eventId);

        if (existing) {
          await updateEarthquake(existing._id, eq);
          updated++;
        } else {
          const newEq = await createEarthquake(eq);
          synced++;

          // Create notifications for new high-alert earthquakes
          if (newEq.alertLevel === 'Red' || newEq.alertLevel === 'Orange') {
            const notifResult = await createEarthquakeNotifications(newEq);
            notificationsSent += notifResult.notified || 0;
          }
        }
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.error(`Error syncing ${eq.eventId}:`, err.message);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'USGS data synced successfully',
      synced,
      updated,
      total: usgsData.length,
      notificationsSent,
      source: 'USGS Earthquake Hazards Program',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error syncing USGS data:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing USGS data',
      error: error.message,
    });
  }
};

// Export with consistent naming
export {
  getAllEarthquakesController as getAllEarthquakes,
  getRecentEarthquakesController as getRecentEarthquakes,
  getEarthquakeByIdController as getEarthquakeById,
  getEarthquakesByLocationController as getEarthquakesByLocation,
  getHighAlertEarthquakesController as getHighAlertEarthquakes,
  getEarthquakeStatsController as getEarthquakeStats,
  createEarthquakeController as createEarthquake,
  updateEarthquakeController as updateEarthquake,
  deleteEarthquakeController as deleteEarthquake,
  syncUSGSDataController as syncUSGSData,
  getBangladeshEarthquakesController as getBangladeshEarthquakes,
};
