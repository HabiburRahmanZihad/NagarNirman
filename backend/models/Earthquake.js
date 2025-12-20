// Earthquake Model Helper Functions (Native MongoDB)
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// Get earthquakes collection
export const getEarthquakesCollection = () => getDB().collection('earthquakes');



// Create indexes for better performance
export const createEarthquakeIndexes = async () => {
  const collection = getEarthquakesCollection();
  try {
    await collection.createIndex({ eventId: 1 }, { unique: true });
    await collection.createIndex({ timestamp: -1 });
    await collection.createIndex({ magnitude: -1 });
    await collection.createIndex({ alertLevel: 1 });
    await collection.createIndex({ 'coordinates.coordinates': '2dsphere' }); // Geospatial index
    await collection.createIndex({ isActive: 1 });
    // console.log('✅ Earthquake indexes created successfully');
  } catch (error) {
    if (!error.message.includes('already exists')) {
      console.error('Error creating earthquake indexes:', error);
    }
  }
};



// Validate alert level
export const isValidAlertLevel = (level) => {
  const validLevels = ['Red', 'Orange', 'Yellow', 'Green'];
  return validLevels.includes(level);
};




// Calculate alert level from magnitude
export const calculateAlertLevel = (magnitude) => {
  if (magnitude >= 7.0) return 'Red';
  if (magnitude >= 6.0) return 'Orange';
  if (magnitude >= 4.5) return 'Yellow';
  return 'Green';
};




// Calculate intensity from magnitude
export const calculateIntensity = (magnitude) => {
  if (magnitude >= 8.0) return 'Extreme';
  if (magnitude >= 7.0) return 'Violent';
  if (magnitude >= 6.0) return 'Very Strong';
  if (magnitude >= 5.0) return 'Strong';
  if (magnitude >= 4.0) return 'Moderate';
  if (magnitude >= 3.0) return 'Light';
  if (magnitude >= 2.0) return 'Weak';
  return 'Not Felt';
};




// Check if earthquake is in Bangladesh region
export const isBangladeshEarthquake = (latitude, longitude) => {
  return latitude >= 20 && latitude <= 27 && longitude >= 88 && longitude <= 93;
};




// Create new earthquake from USGS data
export const createEarthquake = async (earthquakeData) => {
  const {
    eventId,
    magnitude,
    depth,
    location,
    latitude,
    longitude,
    timestamp,
  } = earthquakeData;

  // Validate required fields
  if (!eventId || magnitude === undefined || depth === undefined || !location || latitude === undefined || longitude === undefined) {
    throw new Error('Missing required earthquake fields');
  }

  // Check if earthquake already exists
  const existing = await getEarthquakesCollection().findOne({ eventId });
  if (existing) {
    return existing; // Return existing instead of duplicate
  }

  const earthquake = {
    eventId: eventId.trim(),
    magnitude: parseFloat(magnitude),
    depth: parseFloat(depth),
    location: location.trim(),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    coordinates: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)], // GeoJSON format: [lon, lat]
    },
    timestamp: new Date(timestamp),
    alertLevel: calculateAlertLevel(magnitude),
    intensity: calculateIntensity(magnitude),
    isBangladesh: isBangladeshEarthquake(latitude, longitude),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await getEarthquakesCollection().insertOne(earthquake);
  return { ...earthquake, _id: result.insertedId };
};




// Get all earthquakes
export const getAllEarthquakes = async (filter = {}, options = {}) => {
  const { sort = { timestamp: -1 }, limit = 100, skip = 0 } = options;

  const defaultFilter = { isActive: true, ...filter };

  return await getEarthquakesCollection()
    .find(defaultFilter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
};




// Get recent earthquakes (past 7 days)
export const getRecentEarthquakes = async (daysBack = 7, limit = 50) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  return await getEarthquakesCollection()
    .find({
      isActive: true,
      timestamp: { $gte: startDate },
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
};



// Get earthquake by ID
export const getEarthquakeById = async (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid earthquake ID');
  }

  return await getEarthquakesCollection().findOne({ _id: new ObjectId(id) });
};




// Get earthquakes by location (geospatial query)
export const getEarthquakesByLocation = async (longitude, latitude, maxDistance = 100000) => {
  // maxDistance in meters (default: 100km)
  return await getEarthquakesCollection()
    .find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    })
    .toArray();
};



// Get high alert earthquakes (Red/Orange)
export const getHighAlertEarthquakes = async (daysBack = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  return await getEarthquakesCollection()
    .find({
      isActive: true,
      alertLevel: { $in: ['Red', 'Orange'] },
      timestamp: { $gte: startDate },
    })
    .sort({ magnitude: -1 })
    .toArray();
};



// Get Bangladesh earthquakes
export const getBangladeshEarthquakes = async (limit = 50) => {
  return await getEarthquakesCollection()
    .find({ isActive: true, isBangladesh: true })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
};



// Get earthquake statistics
export const getEarthquakeStats = async () => {
  const collection = getEarthquakesCollection();

  const stats = await collection
    .aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgMagnitude: { $avg: '$magnitude' },
          maxMagnitude: { $max: '$magnitude' },
          minMagnitude: { $min: '$magnitude' },
          avgDepth: { $avg: '$depth' },
        },
      },
    ])
    .toArray();

  const alertLevelDistribution = await collection
    .aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$alertLevel', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  const bangladeshCount = await collection.countDocuments({
    isActive: true,
    isBangladesh: true,
  });

  return {
    overall: stats[0] || { total: 0 },
    byAlertLevel: Object.fromEntries(
      alertLevelDistribution.map((item) => [item._id, item.count])
    ),
    bangladeshCount,
  };
};



// Update earthquake
export const updateEarthquake = async (id, updates) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid earthquake ID');
  }

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  };

  // Recalculate alert level if magnitude changed
  if (updates.magnitude !== undefined) {
    updateData.alertLevel = calculateAlertLevel(updates.magnitude);
    updateData.intensity = calculateIntensity(updates.magnitude);
  }

  const result = await getEarthquakesCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  return result.value;
};



// Delete earthquake (soft delete)
export const deleteEarthquake = async (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid earthquake ID');
  }

  const result = await getEarthquakesCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { isActive: false, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  return result.value;
};



// Get earthquake count
export const getEarthquakeCount = async (filter = {}) => {
  return await getEarthquakesCollection().countDocuments({ isActive: true, ...filter });
};



// Clear old earthquakes (older than X days)
export const clearOldEarthquakes = async (daysOld = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await getEarthquakesCollection().deleteMany({
    timestamp: { $lt: cutoffDate },
    isActive: false,
  });

  return result.deletedCount;
};



export default {
  getEarthquakesCollection,
  createEarthquakeIndexes,
  calculateAlertLevel,
  calculateIntensity,
  isBangladeshEarthquake,
  createEarthquake,
  getAllEarthquakes,
  getRecentEarthquakes,
  getEarthquakeById,
  getEarthquakesByLocation,
  getHighAlertEarthquakes,
  getBangladeshEarthquakes,
  getEarthquakeStats,
  updateEarthquake,
  deleteEarthquake,
  getEarthquakeCount,
  clearOldEarthquakes,
};
