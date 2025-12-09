'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Globe,
  MapIcon,
  Activity,
  RotateCcw,
  Loader,
} from 'lucide-react';

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
}

const isBangladeshEarthquake = (latitude: number, longitude: number): boolean => {
  return latitude >= 20 && latitude <= 27 && longitude >= 88 && longitude <= 93;
};

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

const transformUSGSData = (usgsFeatures: any[]): Earthquake[] => {
  return usgsFeatures.map((feature) => {
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
    };
  });
};

export default function EarthquakeStatisticsPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    bangladesh: 0,
    global: 0,
    avgMagnitude: 0,
    maxMagnitude: 0,
    minMagnitude: 0,
    avgDepth: 0,
    byAlertLevel: { Red: 0, Orange: 0, Yellow: 0, Green: 0 },
    byIntensity: { Extreme: 0, Violent: 0, 'Very Strong': 0, Strong: 0, Moderate: 0, Light: 0, Weak: 0, 'Not Felt': 0 },
  });

  useEffect(() => {
    fetchAndAnalyze();
  }, []);

  const fetchAndAnalyze = async () => {
    try {
      const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from USGS');
      }

      const data = await response.json();

      if (data.features && Array.isArray(data.features)) {
        const allEarthquakes = transformUSGSData(data.features);
        setEarthquakes(allEarthquakes);

        // Calculate statistics
        const bangladeshEqs = allEarthquakes.filter((eq) => isBangladeshEarthquake(eq.latitude, eq.longitude));
        const globalEqs = allEarthquakes.filter((eq) => !isBangladeshEarthquake(eq.latitude, eq.longitude));

        const magnitudes = allEarthquakes.map((eq) => eq.magnitude);
        const depths = allEarthquakes.map((eq) => eq.depth);

        const byAlertLevel = {
          Red: allEarthquakes.filter((eq) => eq.alertLevel === 'Red').length,
          Orange: allEarthquakes.filter((eq) => eq.alertLevel === 'Orange').length,
          Yellow: allEarthquakes.filter((eq) => eq.alertLevel === 'Yellow').length,
          Green: allEarthquakes.filter((eq) => eq.alertLevel === 'Green').length,
        };

        const byIntensity: any = {};
        ['Extreme', 'Violent', 'Very Strong', 'Strong', 'Moderate', 'Light', 'Weak', 'Not Felt'].forEach((intensity) => {
          byIntensity[intensity] = allEarthquakes.filter((eq) => eq.intensity === intensity).length;
        });

        setStats({
          total: allEarthquakes.length,
          bangladesh: bangladeshEqs.length,
          global: globalEqs.length,
          avgMagnitude: (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(2),
          maxMagnitude: Math.max(...magnitudes),
          minMagnitude: Math.min(...magnitudes),
          avgDepth: (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(1),
          byAlertLevel,
          byIntensity,
        } as any);

        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg p-8 border-2 border-primary/10 hover:border-primary/30 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`p-4 rounded-2xl`} style={{ backgroundColor: `var(--color-${color}, #f3f4f6)` }}>
          <Icon className="w-7 h-7" style={{ color: `var(--color-${color}, #003B31)` }} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-base-content/70 mb-2">{title}</p>
          <p className="text-4xl font-bold text-primary">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-primary animate-spin" />
          <p className="text-base-content/70 text-lg">Analyzing earthquake data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-bold">Earthquake Analytics</h1>
            <p className="text-white/90 text-lg mt-2">Comprehensive statistics and analysis of seismic activity worldwide</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Primary Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard icon={Globe} title="Total Events" value={stats.total} color="primary" />
          <StatCard icon={MapIcon} title="Bangladesh Region" value={stats.bangladesh} color="success" />
          <StatCard icon={TrendingUp} title="Global Coverage" value={stats.global} color="info" />
          <StatCard icon={Activity} title="Avg. Magnitude" value={stats.avgMagnitude} color="warning" />
        </motion.div>

        {/* Magnitude Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-primary/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Magnitude Analysis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-2xl p-6 border-l-4 border-error">
              <p className="text-sm text-base-content/70 mb-2">Maximum Magnitude</p>
              <p className="text-4xl font-bold text-error">{stats.maxMagnitude}</p>
            </div>
            <div className="bg-gradient-to-br from-warning/5 to-warning/10 rounded-2xl p-6 border-l-4 border-warning">
              <p className="text-sm text-base-content/70 mb-2">Average Magnitude</p>
              <p className="text-4xl font-bold text-warning">{stats.avgMagnitude}</p>
            </div>
            <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-6 border-l-4 border-success">
              <p className="text-sm text-base-content/70 mb-2">Minimum Magnitude</p>
              <p className="text-4xl font-bold text-success">{stats.minMagnitude}</p>
            </div>
          </div>
        </motion.div>

        {/* Alert Levels Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-primary/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-error/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Alert Level Distribution</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Red', level: 'Red', count: stats.byAlertLevel.Red, threshold: 'M ≥ 7.0', colors: 'from-error/10 to-error/20 border-error' },
              { label: 'Orange', level: 'Orange', count: stats.byAlertLevel.Orange, threshold: 'M ≥ 6.0', colors: 'from-orange-500/10 to-orange-500/20 border-orange-500' },
              { label: 'Yellow', level: 'Yellow', count: stats.byAlertLevel.Yellow, threshold: 'M ≥ 4.5', colors: 'from-warning/10 to-warning/20 border-warning' },
              { label: 'Green', level: 'Green', count: stats.byAlertLevel.Green, threshold: 'M < 4.5', colors: 'from-success/10 to-success/20 border-success' },
            ].map((item) => (
              <div key={item.level} className={`bg-gradient-to-br ${item.colors} rounded-2xl p-6 border-l-4`}>
                <p className="text-xs font-semibold text-base-content/70 uppercase tracking-wide mb-2">{item.label}</p>
                <p className="text-3xl font-bold mb-2">{item.count}</p>
                <p className="text-xs text-base-content/60">{item.threshold}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Intensity Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-primary/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Intensity Breakdown</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.byIntensity).map(([intensity, count]: [string, any]) => (
              <div key={intensity} className="bg-base-100 border-2 border-primary/20 rounded-2xl p-6 text-center hover:border-primary/40 transition-colors">
                <p className="font-bold text-sm text-primary mb-3">{intensity}</p>
                <p className="text-3xl font-bold text-primary mb-2">{count}</p>
                <p className="text-xs text-base-content/60">Events</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Depth Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-primary/10"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Depth Analysis</h2>
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border-l-4 border-primary mb-6">
            <p className="text-base-content/70 text-sm mb-2">Average Depth of Events</p>
            <p className="text-5xl font-bold text-primary">{stats.avgDepth} <span className="text-2xl">km</span></p>
          </div>
          <div className="bg-base-100 rounded-xl p-4 border-l-4 border-info">
            <p className="text-sm text-base-content/70">
              Earthquake depth significantly impacts damage assessment and disaster response. Shallow earthquakes (depth &lt; 70 km) typically cause more surface damage and pose greater risks to infrastructure and communities.
            </p>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              setLoading(true);
              fetchAndAnalyze();
            }}
            className="px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            Refresh Analytics
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-base-200/50 py-12 px-4 sm:px-6 lg:px-8 border-t border-base-300 mt-16">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-primary">Data Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-2xl p-6 border-l-4 border-primary shadow-sm">
              <h3 className="font-bold text-primary mb-2">Data Source</h3>
              <p className="text-sm text-base-content/70">USGS Earthquake Hazards Program - Real-time seismic monitoring</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-l-4 border-success shadow-sm">
              <h3 className="font-bold text-success mb-2">Bangladesh Priority</h3>
              <p className="text-sm text-base-content/70">Events in Bangladesh region are tracked with priority for disaster preparedness</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-l-4 border-info shadow-sm">
              <h3 className="font-bold text-info mb-2">Update Frequency</h3>
              <p className="text-sm text-base-content/70">Data covers earthquake events from the past 7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
