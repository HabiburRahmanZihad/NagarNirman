// USGS Earthquake Data Service
// Fetches real earthquake data from USGS GeoJSON API (free, no API key required)

/**
 * Map USGS magnitude to alert level
 */
const getAlertLevel = (magnitude) => {
  if (magnitude >= 7.0) return 'Red';
  if (magnitude >= 6.0) return 'Orange';
  if (magnitude >= 4.5) return 'Yellow';
  return 'Green';
};

/**
 * Map magnitude to intensity description
 */
const getIntensity = (magnitude) => {
  if (magnitude >= 8.0) return 'Extreme';
  if (magnitude >= 7.0) return 'Violent';
  if (magnitude >= 6.0) return 'Very Strong';
  if (magnitude >= 5.0) return 'Strong';
  if (magnitude >= 4.0) return 'Moderate';
  if (magnitude >= 3.0) return 'Light';
  if (magnitude >= 2.0) return 'Weak';
  return 'Not Felt';
};

const USGS_API_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1 (degrees)
 * @param {number} lon1 - Longitude of point 1 (degrees)
 * @param {number} lat2 - Latitude of point 2 (degrees)
 * @param {number} lon2 - Longitude of point 2 (degrees)
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

/**
 * Fetch earthquakes from USGS API
 * @param {number} days - Number of days of data to fetch (default: 7)
 * @param {number} minMagnitude - Minimum magnitude to fetch (default: 2.5)
 * @returns {Promise<Array>} Array of earthquake objects
 */
export const fetchUSGSEarthquakes = async (days = 7, minMagnitude = 2.5) => {
  try {
    // Map days to USGS dataset
    let dataset = 'all_week'; // 7 days
    if (days === 1) dataset = 'all_day';
    else if (days === 30) dataset = 'all_month';

    const url = `${USGS_API_BASE}/${dataset}.geojson`;

    console.log(`📡 Fetching earthquake data from USGS API: ${url}`);

    const response = await fetch(url, {
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`USGS API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data.features) {
      console.warn('⚠️ No earthquake features in USGS response');
      return [];
    }

    // Transform USGS data to our format
    const earthquakes = data.features
      .filter((feature) => {
        // Filter by minimum magnitude
        const magnitude = feature.properties.mag;
        return magnitude >= minMagnitude;
      })
      .map((feature) => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;

        return {
          eventId: props.code || `USGS-${props.ids.split(',')[0]}`,
          magnitude: props.mag,
          depth: coords[2], // depth in km
          location: props.place || 'Unknown Location',
          latitude: coords[1],
          longitude: coords[0],
          timestamp: new Date(props.time),
          intensity: getIntensity(props.mag),
          alertLevel: getAlertLevel(props.mag),
          casualties: 0, // USGS doesn't provide casualty data
          affectedAreas: [props.place || 'Unknown'],
          description: `Magnitude ${props.mag} earthquake`,
          reportedDamage: 'No damage data available',
          source: 'USGS Earthquake Hazards Program',
          url: props.url,
          felt: props.felt || 0, // Number of people who reported feeling it
          tsunami: props.tsunami ? 'Yes' : 'No',
          type: props.type,
        };
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by most recent

    console.log(`✅ Successfully fetched ${earthquakes.length} earthquakes from USGS`);
    return earthquakes;
  } catch (error) {
    console.error('❌ Error fetching from USGS API:', error.message);
    throw error;
  }
};

/**
 * Fetch earthquakes by geographic bounds
 * @param {Object} bounds - { minLatitude, maxLatitude, minLongitude, maxLongitude }
 * @returns {Promise<Array>} Array of earthquake objects within bounds
 */
export const fetchUSGSEarthquakesByBounds = async (bounds) => {
  try {
    const { minLatitude, maxLatitude, minLongitude, maxLongitude } = bounds;

    const url =
      `${USGS_API_BASE}/all_week.geojson` +
      `?minlatitude=${minLatitude}&maxlatitude=${maxLatitude}` +
      `&minlongitude=${minLongitude}&maxlongitude=${maxLongitude}`;

    console.log(`📡 Fetching earthquakes by bounds from USGS API`);

    const response = await fetch(url, {
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`USGS API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data.features) {
      console.warn('⚠️ No earthquake features in USGS response');
      return [];
    }

    // Transform USGS data
    const earthquakes = data.features.map((feature) => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;

      return {
        eventId: props.code || `USGS-${props.ids.split(',')[0]}`,
        magnitude: props.mag,
        depth: coords[2],
        location: props.place || 'Unknown Location',
        latitude: coords[1],
        longitude: coords[0],
        timestamp: new Date(props.time),
        intensity: getIntensity(props.mag),
        alertLevel: getAlertLevel(props.mag),
        casualties: 0,
        affectedAreas: [props.place || 'Unknown'],
        description: `Magnitude ${props.mag} earthquake`,
        reportedDamage: 'No damage data available',
        source: 'USGS Earthquake Hazards Program',
        url: props.url,
        felt: props.felt || 0,
        tsunami: props.tsunami ? 'Yes' : 'No',
        type: props.type,
      };
    });

    console.log(`✅ Successfully fetched ${earthquakes.length} earthquakes by bounds`);
    return earthquakes;
  } catch (error) {
    console.error('❌ Error fetching from USGS API by bounds:', error.message);
    throw error;
  }
};

/**
 * Sync USGS earthquakes to database
 * @param {Object} Earthquake - Earthquake model
 * @param {number} days - Days of data to fetch
 * @returns {Promise<Object>} Sync result with counts
 */
export const syncUSGSEarthquakes = async (Earthquake, days = 7) => {
  try {
    console.log(`🔄 Starting USGS earthquake sync for last ${days} days...`);

    // Fetch from USGS
    const usgsEarthquakes = await fetchUSGSEarthquakes(days);

    if (usgsEarthquakes.length === 0) {
      console.warn('⚠️ No earthquakes fetched from USGS');
      return { synced: 0, updated: 0, errors: 0 };
    }

    let synced = 0;
    let updated = 0;
    let errors = 0;

    // Process each earthquake
    for (const eq of usgsEarthquakes) {
      try {
        // Check if earthquake already exists by eventId
        const existing = await Earthquake.findOne({ eventId: eq.eventId });

        if (existing) {
          // Update existing earthquake
          await Earthquake.findByIdAndUpdate(existing._id, eq, { new: true });
          updated++;
        } else {
          // Create new earthquake
          const newEq = new Earthquake(eq);
          await newEq.save();
          synced++;
        }
      } catch (error) {
        console.error(`Error syncing earthquake ${eq.eventId}:`, error.message);
        errors++;
      }
    }

    console.log(`✅ USGS sync complete: ${synced} new, ${updated} updated, ${errors} errors`);
    return { synced, updated, errors, total: usgsEarthquakes.length };
  } catch (error) {
    console.error('❌ Error syncing USGS earthquakes:', error.message);
    throw error;
  }
};
