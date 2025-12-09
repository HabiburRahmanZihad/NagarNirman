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
try {
  const { page = 1, limit = 10, magnitude, alertLevel, sortBy = '-timestamp', useCache = true } = req.query;
  const skip = (page - 1) * limit;

  let earthquakes = [];

  // If useCache is false or first time, fetch from USGS
  if (useCache === 'false') {
    console.log('📡 Fetching fresh data from USGS API...');
    const usgsData = await fetchUSGSEarthquakes(7, magnitude || 2.5);
    earthquakes = usgsData;

    // Optionally save to database for faster future access
    try {
      for (const eq of usgsData) {
        const exists = await Earthquake.findOne({ eventId: eq.eventId });
        if (!exists) {
          await Earthquake.create(eq);
        }
      }
    } catch (err) {
      console.warn('Could not save to database, continuing with memory data:', err.message);
    }
  } else {
    // Try to get from database first
    const filter = { isActive: true };
    if (magnitude) {
      filter.magnitude = { $gte: magnitude };
    }
    if (alertLevel) {
      filter.alertLevel = alertLevel;
    }

    earthquakes = await Earthquake.find(filter).sort(sortBy).limit(1000);

    // If database is empty, fetch from USGS
    if (earthquakes.length === 0) {
      console.log('📡 Database empty, fetching from USGS API...');
      const usgsData = await fetchUSGSEarthquakes(7, magnitude || 2.5);
      earthquakes = usgsData;

      // Save to database
      try {
        for (const eq of usgsData) {
          const exists = await Earthquake.findOne({ eventId: eq.eventId });
          if (!exists) {
            await Earthquake.create(eq);
          }
        }
      } catch (err) {
        console.warn('Could not save to database, continuing with memory data:', err.message);
      }
    }
  }

  // Apply filtering
  let filtered = earthquakes;
  if (magnitude) {
    filtered = filtered.filter((e) => e.magnitude >= magnitude);
  }
  if (alertLevel) {
    filtered = filtered.filter((e) => e.alertLevel === alertLevel);
  }

  // Sort
  if (sortBy === '-timestamp') {
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortBy === 'magnitude') {
    filtered.sort((a, b) => a.magnitude - b.magnitude);
  } else if (sortBy === '-magnitude') {
    filtered.sort((a, b) => b.magnitude - a.magnitude);
  }

  // Paginate
  const total = filtered.length;
  const paginatedEarthquakes = filtered.slice(skip, skip + parseInt(limit));

  res.status(200).json({
    success: true,
    data: paginatedEarthquakes,
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

// Get recent earthquakes - fetches real data from USGS
export const getRecentEarthquakes = async (req, res) => {
  try {
    const { limit = 20, days = 1 } = req.query;

    // Fetch from USGS for recent real data
    const usgsEarthquakes = await fetchUSGSEarthquakes(days, 2.5);

    // Get most recent earthquakes
    const recent = usgsEarthquakes.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: recent,
      count: recent.length,
      source: 'USGS Earthquake Hazards Program',
      timeFrame: `Last ${days} day(s)`,
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
export const getEarthquakeById = async (req, res) => {
  try {
    const { id } = req.params;

    // First try to find in database
    let earthquake = await Earthquake.findById(id);

    // If not found in database, try to fetch from USGS and search
    if (!earthquake) {
      const usgsEarthquakes = await fetchUSGSEarthquakes(30, 1.0); // 30 days, all magnitudes
      earthquake = usgsEarthquakes.find((e) => e.eventId === id);

      if (!earthquake) {
        return res.status(404).json({
          success: false,
          message: 'Earthquake not found',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: earthquake,
      source: earthquake.source || 'USGS Earthquake Hazards Program',
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

// Get earthquakes by location (within radius)
export const getEarthquakesByLocation = async (req, res) => {
  try {
    const { latitude, longitude, radius = 100 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    // Radius in meters (convert km to meters)
    const radiusInMeters = radius * 1000;

    const earthquakes = await Earthquake.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radiusInMeters,
        },
      },
    }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: earthquakes,
      count: earthquakes.length,
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
export const getHighAlertEarthquakes = async (req, res) => {
  try {
    const earthquakes = await Earthquake.find({
      isActive: true,
      alertLevel: { $in: ['Orange', 'Red'] },
    })
      .sort({ magnitude: -1, timestamp: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: earthquakes,
      count: earthquakes.count,
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

// Get earthquake statistics
export const getEarthquakeStats = async (req, res) => {
  try {
    const stats = await Earthquake.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalEarthquakes: { $sum: 1 },
          averageMagnitude: { $avg: '$magnitude' },
          maxMagnitude: { $max: '$magnitude' },
          minMagnitude: { $min: '$magnitude' },
          totalCasualties: { $sum: '$casualties' },
        },
      },
    ]);

    const alertStats = await Earthquake.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$alertLevel',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {},
      alertStats,
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
export const createEarthquake = async (req, res) => {
  try {
    const {
      eventId,
      magnitude,
      depth,
      location,
      latitude,
      longitude,
      timestamp,
      intensity,
      description,
      affectedAreas,
      reportedDamage,
      casualties,
      alertLevel,
    } = req.body;

    // Validate required fields
    if (!eventId || !magnitude || !depth || !location || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if earthquake already exists
    const existingEarthquake = await Earthquake.findOne({ eventId });
    if (existingEarthquake) {
      return res.status(400).json({
        success: false,
        message: 'Earthquake with this event ID already exists',
      });
    }

    const earthquake = new Earthquake({
      eventId,
      magnitude,
      depth,
      location,
      latitude,
      longitude,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      timestamp: timestamp || new Date(),
      intensity,
      description,
      affectedAreas,
      reportedDamage,
      casualties,
      alertLevel,
    });

    await earthquake.save();

    res.status(201).json({
      success: true,
      message: 'Earthquake created successfully',
      data: earthquake,
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
export const updateEarthquake = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If latitude/longitude updated, update coordinates
    if (updateData.latitude !== undefined && updateData.longitude !== undefined) {
      updateData.coordinates = {
        type: 'Point',
        coordinates: [updateData.longitude, updateData.latitude],
      };
    }

    const earthquake = await Earthquake.findByIdAndUpdate(id, updateData, { new: true });

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

// Admin: Delete earthquake (soft delete)
export const deleteEarthquake = async (req, res) => {
  try {
    const { id } = req.params;

    const earthquake = await Earthquake.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

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

// Get earthquake severity distribution (for statistics)
export const getEarthquakeSeverityDistribution = async (req, res) => {
  try {
    const distribution = await Earthquake.aggregate([
      { $match: { isActive: true } },
      {
        $bucket: {
          groupBy: '$magnitude',
          boundaries: [0, 2, 4, 5, 6, 7, 8, 10],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            earthquakes: { $push: '$$ROOT' },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    console.error('Error fetching severity distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching severity distribution',
      error: error.message,
    });
  }
};

// Sync earthquakes with USGS data
export const syncUSGSData = async (req, res) => {
  try {
    console.log('🔄 Starting USGS data sync...');
    const { days = 7 } = req.query;

    const usgsEarthquakes = await fetchUSGSEarthquakes(parseInt(days), 2.5);

    if (usgsEarthquakes.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new earthquakes to sync',
        synced: 0,
      });
    }

    let synced = 0;
    let updated = 0;

    // Save or update earthquakes in database
    for (const eq of usgsEarthquakes) {
      try {
        const exists = await Earthquake.findOne({ eventId: eq.eventId });
        if (exists) {
          await Earthquake.findByIdAndUpdate(exists._id, eq);
          updated++;
        } else {
          await Earthquake.create(eq);
          synced++;
        }
      } catch (err) {
        console.error(`Error syncing ${eq.eventId}:`, err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'USGS data synced successfully',
      synced,
      updated,
      total: usgsEarthquakes.length,
      source: 'USGS Earthquake Hazards Program',
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
