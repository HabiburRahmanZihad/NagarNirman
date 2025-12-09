'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Gauge,
  Clock,
  Users,
  AlertTriangle,
  Building2,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

interface Earthquake {
  _id: string;
  eventId: string;
  magnitude: number;
  depth: number;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  intensity: string;
  alertLevel: string;
  casualties: number;
  affectedAreas: string[];
  description: string;
  reportedDamage: string;
  source: string;
}

const getAlertColor = (alertLevel: string) => {
  switch (alertLevel) {
    case 'Green':
      return 'from-success to-success/80';
    case 'Yellow':
      return 'from-warning to-warning/80';
    case 'Orange':
      return 'from-orange-500 to-orange-600';
    case 'Red':
      return 'from-error to-error/80';
    default:
      return 'from-primary to-primary/80';
  }
};

const getIntensityEmoji = (intensity: string) => {
  const emojiMap: { [key: string]: string } = {
    'Not Felt': '😴',
    'Weak': '😐',
    'Light': '😕',
    'Moderate': '😟',
    'Strong': '😨',
    'Very Strong': '😱',
    'Severe': '🤯',
    'Violent': '💥',
    'Extreme': '🌍',
  };
  return emojiMap[intensity] || '🌍';
};

// Helper functions
const getAlertLevel = (magnitude: number): string => {
  if (magnitude >= 7.0) return 'Red';
  if (magnitude >= 6.0) return 'Orange';
  if (magnitude >= 4.5) return 'Yellow';
  return 'Green';
};

const getIntensity = (magnitude: number): string => {
  if (magnitude >= 8.0) return 'Extreme';
  if (magnitude >= 7.0) return 'Violent';
  if (magnitude >= 6.0) return 'Very Strong';
  if (magnitude >= 5.0) return 'Strong';
  if (magnitude >= 4.0) return 'Moderate';
  if (magnitude >= 3.0) return 'Light';
  if (magnitude >= 2.0) return 'Weak';
  return 'Not Felt';
};

export default function EarthquakeDetailPage() {
  const params = useParams();
  const earthquakeId = params.id as string;
  const [earthquake, setEarthquake] = useState<Earthquake | null>(null);
  const [allEarthquakes, setAllEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarthquakes();
  }, [earthquakeId]);

  const fetchEarthquakes = async () => {
    try {
      // Fetch from USGS API directly
      const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from USGS');
      }

      const data = await response.json();

      if (data.features && Array.isArray(data.features)) {
        // Transform USGS data
        const earthquakes = data.features
          .map((feature: any) => {
            const props = feature.properties;
            const coords = feature.geometry.coordinates;
            const magnitude = props.mag || 0;

            return {
              _id: props.ids?.split(',')[0] || props.code,
              eventId: props.code || `USGS-${props.ids?.split(',')[0] || 'unknown'}`,
              magnitude: magnitude,
              depth: coords[2] || 0,
              location: props.place || 'Unknown Location',
              latitude: coords[1],
              longitude: coords[0],
              timestamp: new Date(props.time).toISOString(),
              intensity: getIntensity(magnitude),
              alertLevel: getAlertLevel(magnitude),
              casualties: 0,
              affectedAreas: [props.place || 'Unknown'],
              description: `Magnitude ${magnitude} earthquake detected`,
              reportedDamage: 'No damage data available',
              source: 'USGS Earthquake Hazards Program',
            };
          })
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setAllEarthquakes(earthquakes);

        // Find the specific earthquake by eventId or index
        const found = earthquakes.find((e) => e.eventId === earthquakeId || e._id === earthquakeId);
        if (found) {
          setEarthquake(found);
        } else if (earthquakes.length > 0) {
          // If not found, use the first (most recent) one
          setEarthquake(earthquakes[0]);
        }

        setLoading(false);
        return;
      }

      throw new Error('Invalid data format');
    } catch (error) {
      console.error('❌ Error fetching from USGS:', error);
      setEarthquake(null);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-spin">
          <Zap className="w-10 h-10 text-primary" />
        </div>
      </div>
    );
  }

  if (!earthquake) {
    return (
      <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/earthquakes">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Earthquakes
            </motion.button>
          </Link>
          <div className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-warning mb-4" />
            <p className="text-xl font-bold text-neutral">Earthquake not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/earthquakes">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Earthquakes
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-linear-to-r ${getAlertColor(earthquake.alertLevel)} text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent`}
        >
          <div className="flex items-start gap-6 mb-6">
            <div className="text-6xl">{getIntensityEmoji(earthquake.intensity)}</div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">{earthquake.location}</h1>
              <p className="text-white/90 text-lg">Event ID: {earthquake.eventId}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-white/80 text-sm font-bold mb-1">Magnitude</p>
              <p className="text-3xl font-extrabold">{earthquake.magnitude.toFixed(1)}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-white/80 text-sm font-bold mb-1">Depth</p>
              <p className="text-3xl font-extrabold">{earthquake.depth} km</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-white/80 text-sm font-bold mb-1">Intensity</p>
              <p className="text-3xl font-extrabold">{earthquake.intensity}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-white/80 text-sm font-bold mb-1">Alert Level</p>
              <p className="text-3xl font-extrabold">{earthquake.alertLevel}</p>
            </div>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Location Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-8 space-y-6"
          >
            <h2 className="text-2xl font-extrabold text-primary">Location Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-secondary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-neutral/70 mb-1">Coordinates</p>
                  <p className="text-lg font-semibold text-info">
                    {earthquake.latitude.toFixed(4)}° N, {earthquake.longitude.toFixed(4)}° E
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Building2 className="w-6 h-6 text-secondary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-neutral/70 mb-1">Location</p>
                  <p className="text-lg font-semibold text-info">{earthquake.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-secondary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-neutral/70 mb-1">Timestamp</p>
                  <p className="text-lg font-semibold text-info">
                    {new Date(earthquake.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Impact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-8 space-y-6"
          >
            <h2 className="text-2xl font-extrabold text-primary">Impact Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Gauge className="w-6 h-6 text-warning shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-neutral/70 mb-1">Reported Damage</p>
                  <p className="text-lg font-semibold text-info">{earthquake.reportedDamage}</p>
                </div>
              </div>

              {earthquake.casualties > 0 && (
                <div className="flex items-start gap-4 bg-error/10 border-2 border-error/20 rounded-xl p-4">
                  <Users className="w-6 h-6 text-error shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-error mb-1">Reported Casualties</p>
                    <p className="text-lg font-extrabold text-error">{earthquake.casualties}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-neutral/70 mb-1">Data Source</p>
                  <p className="text-lg font-semibold text-info">{earthquake.source}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Affected Areas */}
        {earthquake.affectedAreas && earthquake.affectedAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-8"
          >
            <h2 className="text-2xl font-extrabold text-primary mb-6">Affected Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earthquake.affectedAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300"
                >
                  <p className="font-bold text-primary">{area}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Description */}
        {earthquake.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-8"
          >
            <h2 className="text-2xl font-extrabold text-primary mb-6">Description</h2>
            <p className="text-neutral leading-relaxed text-lg">{earthquake.description}</p>
          </motion.div>
        )}

        {/* Safety Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-linear-to-r from-primary via-secondary to-primary/90 text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
        >
          <h2 className="text-2xl font-extrabold mb-6">What to Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">If You're in the Affected Area:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Check for injuries and provide first aid if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Inspect your surroundings for hazards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Stay alert for aftershocks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Follow local authorities' instructions</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Safety Resources:</h3>
              <Link href="/earthquakes/guidelines" className="block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-white text-primary rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                >
                  View Safety Guidelines
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
