'use client';

import { useState, useEffect } from 'react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  Globe,
  MapPin,
  Activity,
  RotateCcw,
  Loader,
  Gauge,
  Zap,
  ChevronRight,
  MapPinIcon,
  Wind,
  Layers,
  Award,
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
}

// Minimal typing for USGS GeoJSON feature used by the client
interface USGSFeature {
  properties?: {
    mag?: number | null;
    ids?: string | null;
    code?: string | null;
    place?: string | null;
    time?: number | null;
  };
  geometry?: {
    coordinates?: [number, number, number];
  };
}

interface StatCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  value: ReactNode;
  subtitle?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

interface Statistics {
  total: number;
  bangladesh: number;
  global: number;
  avgMagnitude: string | number;
  maxMagnitude: number;
  minMagnitude: number;
  avgDepth: string | number;
  maxDepth: number;
  byAlertLevel: { Red: number; Orange: number; Yellow: number; Green: number };
  byIntensity: { [key: string]: number };
  percentageByAlert: { [key: string]: number };
  topLocations: { location: string; count: number }[];
  lastUpdated: string;
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

const transformUSGSData = (usgsFeatures: USGSFeature[]): Earthquake[] => {
  return usgsFeatures.map((feature) => {
    const props = feature.properties ?? {};
    const coords = feature.geometry?.coordinates ?? [0, 0, 0];
    const magnitude = Number(props.mag ?? 0);

    const id = props.ids ? String(props.ids).split(',')[0] : props.code ?? `USGS-unknown`;

    return {
      _id: id,
      eventId: String(props.code ?? `USGS-${id}`),
      magnitude,
      depth: Number(coords[2] ?? 0),
      location: String(props.place ?? 'Unknown Location'),
      latitude: Number(coords[1] ?? 0),
      longitude: Number(coords[0] ?? 0),
      timestamp: new Date(Number(props.time ?? Date.now())).toISOString(),
      intensity: getIntensity(magnitude),
      alertLevel: getAlertLevel(magnitude),
      casualties: 0,
    } as Earthquake;
  });
};

export default function EarthquakeAnalyticsPage() {

  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Statistics>({
    total: 0,
    bangladesh: 0,
    global: 0,
    avgMagnitude: 0,
    maxMagnitude: 0,
    minMagnitude: 0,
    avgDepth: 0,
    maxDepth: 0,
    byAlertLevel: { Red: 0, Orange: 0, Yellow: 0, Green: 0 },
    byIntensity: { Extreme: 0, Violent: 0, 'Very Strong': 0, Strong: 0, Moderate: 0, Light: 0, Weak: 0, 'Not Felt': 0 },
    percentageByAlert: { Red: 0, Orange: 0, Yellow: 0, Green: 0 },
    topLocations: [],
    lastUpdated: new Date().toLocaleString(),
  });

  useEffect(() => {
    fetchAndAnalyze();
  }, []);

  const fetchAndAnalyze = async () => {
    setLoading(true);
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

        // Calculate percentages
        const total = allEarthquakes.length;
        const percentageByAlert = {
          Red: total > 0 ? Number(((byAlertLevel.Red / total) * 100).toFixed(1)) : 0,
          Orange: total > 0 ? Number(((byAlertLevel.Orange / total) * 100).toFixed(1)) : 0,
          Yellow: total > 0 ? Number(((byAlertLevel.Yellow / total) * 100).toFixed(1)) : 0,
          Green: total > 0 ? Number(((byAlertLevel.Green / total) * 100).toFixed(1)) : 0,
        };

        const byIntensity: Record<string, number> = {};
        ['Extreme', 'Violent', 'Very Strong', 'Strong', 'Moderate', 'Light', 'Weak', 'Not Felt'].forEach((intensity) => {
          byIntensity[intensity] = allEarthquakes.filter((eq) => eq.intensity === intensity).length;
        });

        // Get top 5 locations
        const locationCount: { [key: string]: number } = {};
        allEarthquakes.forEach((eq) => {
          locationCount[eq.location] = (locationCount[eq.location] || 0) + 1;
        });
        const topLocations = Object.entries(locationCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([location, count]) => ({ location, count }));

        setStats({
          total: allEarthquakes.length,
          bangladesh: bangladeshEqs.length,
          global: globalEqs.length,
          avgMagnitude: (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(2),
          maxMagnitude: Math.max(...magnitudes),
          minMagnitude: Math.min(...magnitudes),
          avgDepth: (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(1),
          maxDepth: Math.max(...depths),
          byAlertLevel,
          byIntensity,
          percentageByAlert,
          topLocations,
          lastUpdated: new Date().toLocaleString(),
        });

        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }: StatCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`rounded-3xl shadow-lg border-2 p-8 bg-white hover:shadow-xl transition-all duration-300
        ${color === 'primary' ? 'border-primary/10 hover:border-primary/30' : ''}
        ${color === 'success' ? 'border-success/10 hover:border-success/30' : ''}
        ${color === 'warning' ? 'border-warning/10 hover:border-warning/30' : ''}
        ${color === 'error' ? 'border-error/10 hover:border-error/30' : ''}
        ${color === 'info' ? 'border-info/10 hover:border-info/30' : ''}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-4 rounded-2xl
          ${color === 'primary' ? 'bg-primary/10' : ''}
          ${color === 'success' ? 'bg-success/10' : ''}
          ${color === 'warning' ? 'bg-warning/10' : ''}
          ${color === 'error' ? 'bg-error/10' : ''}
          ${color === 'info' ? 'bg-info/10' : ''}
        `}>
          <Icon className={`w-7 h-7
            ${color === 'primary' ? 'text-primary' : ''}
            ${color === 'success' ? 'text-success' : ''}
            ${color === 'warning' ? 'text-warning' : ''}
            ${color === 'error' ? 'text-error' : ''}
            ${color === 'info' ? 'text-info' : ''}
          `} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-base-content/70 mb-2">{title}</p>
          <p className={`text-4xl font-bold
            ${color === 'primary' ? 'text-primary' : ''}
            ${color === 'success' ? 'text-success' : ''}
            ${color === 'warning' ? 'text-warning' : ''}
            ${color === 'error' ? 'text-error' : ''}
            ${color === 'info' ? 'text-info' : ''}
          `}>{value}</p>
          {subtitle && <p className="text-xs text-base-content/50 mt-1">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-primary animate-spin" />
          <p className="text-base-content/70 text-lg font-semibold">Analyzing earthquake data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8 container mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-primary to-secondary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
      >
        <div className="flex items-center gap-4 mb-4">
          <Globe className="w-12 h-12 sm:w-14 sm:h-14" />
          <h1 className="text-4xl sm:text-5xl font-extrabold">Earthquake Analytics</h1>
        </div>
        <p className="text-white/90 text-lg">Comprehensive statistics and seismic analysis worldwide</p>
        <p className="text-white/80 text-sm">Last updated: {stats.lastUpdated}</p>
      </motion.div>

      {/* Quick Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { href: '/earthquakes', label: 'Earthquake List', icon: MapPin },
            { href: '/earthquakes/guidelines', label: 'Safety Guide', icon: AlertTriangle },
          ].map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-white rounded-2xl shadow-lg border-2 border-accent/20 font-bold text-primary hover:shadow-xl transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <link.icon className="w-5 h-5" />
                  <span className="text-lg">{link.label}</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Primary Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <StatCard icon={Globe} title="Total Events" value={stats.total} color="primary" subtitle="Past 7 days" />
          <StatCard icon={MapPin} title="Bangladesh" value={stats.bangladesh} color="success" subtitle={`${((stats.bangladesh / stats.total) * 100).toFixed(1)}% of total`} />
          <StatCard icon={Wind} title="Global" value={stats.global} color="info" subtitle={`${((stats.global / stats.total) * 100).toFixed(1)}% of total`} />
          <StatCard icon={TrendingUp} title="Avg Magnitude" value={stats.avgMagnitude} color="warning" subtitle="All earthquakes" />
          <StatCard icon={Zap} title="Max Magnitude" value={stats.maxMagnitude} color="error" subtitle={`Min: ${stats.minMagnitude}`} />
        </motion.div>

        {/* Magnitude Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 border-2 border-primary/10 hover:border-primary/20 transition-all"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Gauge className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Magnitude Analysis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-br from-error/5 to-error/10 rounded-2xl p-6 border-l-4 border-error">
              <p className="text-sm text-base-content/70 mb-2 font-semibold">Maximum Magnitude</p>
              <p className="text-5xl font-bold text-error">{stats.maxMagnitude}</p>
              <p className="text-xs text-base-content/60 mt-3">Strongest earthquake detected</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-br from-warning/5 to-warning/10 rounded-2xl p-6 border-l-4 border-warning">
              <p className="text-sm text-base-content/70 mb-2 font-semibold">Average Magnitude</p>
              <p className="text-5xl font-bold text-warning">{stats.avgMagnitude}</p>
              <p className="text-xs text-base-content/60 mt-3">Mean of all events</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-br from-success/5 to-success/10 rounded-2xl p-6 border-l-4 border-success">
              <p className="text-sm text-base-content/70 mb-2 font-semibold">Minimum Magnitude</p>
              <p className="text-5xl font-bold text-success">{stats.minMagnitude}</p>
              <p className="text-xs text-base-content/60 mt-3">Weakest earthquake detected</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Depth Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 border-2 border-primary/10 hover:border-primary/20 transition-all"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-info/10 rounded-xl">
              <Layers className="w-6 h-6 text-info" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Depth Analysis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-br from-info/5 to-info/10 rounded-2xl p-6 border-l-4 border-info">
              <p className="text-sm text-base-content/70 mb-2 font-semibold">Average Depth</p>
              <p className="text-5xl font-bold text-info">{stats.avgDepth} <span className="text-2xl">km</span></p>
              <p className="text-xs text-base-content/60 mt-3">Mean depth of earthquakes</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-br from-warning/5 to-warning/10 rounded-2xl p-6 border-l-4 border-warning">
              <p className="text-sm text-base-content/70 mb-2 font-semibold">Maximum Depth</p>
              <p className="text-5xl font-bold text-warning">{stats.maxDepth} <span className="text-2xl">km</span></p>
              <p className="text-xs text-base-content/60 mt-3">Deepest earthquake detected</p>
            </motion.div>
            <div className="bg-base-100 rounded-2xl p-6 border-2 border-primary/20">
              <p className="text-sm text-base-content/70 mb-2 font-semibold">Depth Classification</p>
              <ul className="space-y-2 text-xs text-base-content/60">
                <li>✓ Shallow: &lt; 70 km (More damage)</li>
                <li>✓ Moderate: 70-300 km</li>
                <li>✓ Deep: &gt; 300 km (Less damage)</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Alert Level Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 border-2 border-primary/10 hover:border-primary/20 transition-all"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-error/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Alert Level Distribution</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Red', level: 'Red', count: stats.byAlertLevel.Red, percentage: stats.percentageByAlert.Red, threshold: 'M ≥ 7.0', colors: 'from-error/10 to-error/20 border-error', icon: '🔴' },
              { label: 'Orange', level: 'Orange', count: stats.byAlertLevel.Orange, percentage: stats.percentageByAlert.Orange, threshold: 'M ≥ 6.0', colors: 'from-orange-500/10 to-orange-500/20 border-orange-500', icon: '🟠' },
              { label: 'Yellow', level: 'Yellow', count: stats.byAlertLevel.Yellow, percentage: stats.percentageByAlert.Yellow, threshold: 'M ≥ 4.5', colors: 'from-warning/10 to-warning/20 border-warning', icon: '🟡' },
              { label: 'Green', level: 'Green', count: stats.byAlertLevel.Green, percentage: stats.percentageByAlert.Green, threshold: 'M < 4.5', colors: 'from-success/10 to-success/20 border-success', icon: '🟢' },
            ].map((item) => (
              <motion.div key={item.level} whileHover={{ scale: 1.05 }} className={`bg-linear-to-br ${item.colors} rounded-2xl p-6 border-l-4 hover:shadow-lg transition-all`}>
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-xs font-bold text-base-content/70 uppercase tracking-wide mb-2">{item.label}</p>
                <p className="text-3xl font-bold mb-1">{item.count}</p>
                <p className="text-xs text-base-content/60 font-semibold mb-2">{item.percentage}%</p>
                <p className="text-xs text-base-content/60">{item.threshold}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Intensity Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 border-2 border-primary/10 hover:border-primary/20 transition-all"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Intensity Level Breakdown</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.byIntensity).map(([intensity, count]: [string, number]) => {
              const maxCount = Math.max(...Object.values(stats.byIntensity));
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <motion.div
                  key={intensity}
                  whileHover={{ scale: 1.05 }}
                  className="bg-base-100 border-2 border-primary/20 rounded-2xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <p className="font-bold text-sm text-primary mb-3">{intensity}</p>
                  <p className="text-3xl font-bold text-primary mb-2">{count}</p>
                  <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                    <motion.div
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-linear-to-r from-primary to-secondary h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-base-content/60 mt-3">Events</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Affected Locations */}
        {stats.topLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-8 border-2 border-primary/10 hover:border-primary/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-warning/10 rounded-xl">
                <MapPinIcon className="w-6 h-6 text-warning" />
              </div>
              <h2 className="text-2xl font-bold text-primary">Top 5 Affected Locations</h2>
            </div>
            <div className="space-y-4">
              {stats.topLocations.map((location, index) => (
                <motion.div
                  key={location.location}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-base-100 rounded-xl border-2 border-primary/10 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary text-white font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-primary">{location.location}</p>
                      <p className="text-xs text-base-content/60">{location.count} earthquakes detected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{location.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 border-2 border-primary/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-success/10 rounded-xl">
              <Award className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Key Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border-l-4 border-primary">
              <h3 className="font-bold text-primary mb-2">🌍 Global Distribution</h3>
              <p className="text-sm text-base-content/70">
                {stats.global} earthquakes detected globally ({((stats.global / stats.total) * 100).toFixed(1)}% of total), with {stats.bangladesh} in Bangladesh region.
              </p>
            </div>
            <div className="bg-linear-to-br from-error/5 to-error/10 rounded-2xl p-6 border-l-4 border-error">
              <h3 className="font-bold text-error mb-2">⚠️ Alert Distribution</h3>
              <p className="text-sm text-base-content/70">
                {stats.byAlertLevel.Red} Red alerts ({stats.percentageByAlert.Red}%), {stats.byAlertLevel.Orange} Orange alerts ({stats.percentageByAlert.Orange}%) - Requires immediate attention.
              </p>
            </div>
            <div className="bg-linear-to-br from-warning/5 to-warning/10 rounded-2xl p-6 border-l-4 border-warning">
              <h3 className="font-bold text-warning mb-2">📏 Depth Profile</h3>
              <p className="text-sm text-base-content/70">
                Average depth of {stats.avgDepth}km indicates {parseInt(stats.avgDepth as string) < 70 ? 'shallow earthquakes with higher damage potential' : 'relatively deep events with lower surface impact'}.
              </p>
            </div>
            <div className="bg-linear-to-br from-success/5 to-success/10 rounded-2xl p-6 border-l-4 border-success">
              <h3 className="font-bold text-success mb-2">📊 Data Coverage</h3>
              <p className="text-sm text-base-content/70">
                Data covers the past 7 days with comprehensive USGS monitoring. Most earthquakes are below magnitude 5.0, indicating normal crustal activity.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <div className="flex justify-center pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setLoading(true);
              fetchAndAnalyze();
            }}
            className="px-8 py-4 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-2xl hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Refresh Analytics
          </motion.button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-base-200 py-12 px-4 sm:px-6 lg:px-8 border-t border-base-300 mt-16">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-primary">ℹ️ Data Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 border-l-4 border-primary shadow-sm hover:shadow-lg transition-all">
              <h3 className="font-bold text-primary mb-2">📡 Data Source</h3>
              <p className="text-sm text-base-content/70">USGS Earthquake Hazards Program - Real-time seismic monitoring worldwide</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 border-l-4 border-success shadow-sm hover:shadow-lg transition-all">
              <h3 className="font-bold text-success mb-2">🎯 Bangladesh Priority</h3>
              <p className="text-sm text-base-content/70">Events in Bangladesh region are tracked with priority for disaster preparedness</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 border-l-4 border-info shadow-sm hover:shadow-lg transition-all">
              <h3 className="font-bold text-info mb-2">⏱️ Update Frequency</h3>
              <p className="text-sm text-base-content/70">Data covers all earthquake events from the past 7 days</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
