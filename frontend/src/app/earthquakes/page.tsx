'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  AlertTriangle,
  Gauge,
  Clock,
  Zap,
  ChevronRight,
  Search,
  Globe,
  Shield,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/common';


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

const getAlertColor = (alertLevel: string) => {
  switch (alertLevel) {
    case 'Green':
      return 'border-success bg-success/5';
    case 'Yellow':
      return 'border-warning bg-warning/5';
    case 'Orange':
      return 'border-orange-500 bg-orange-500/5';
    case 'Red':
      return 'border-error bg-error/5';
    default:
      return 'border-base-300 bg-base-100';
  }
};

const getAlertBadgeColor = (alertLevel: string) => {
  switch (alertLevel) {
    case 'Green':
      return 'bg-success text-white';
    case 'Yellow':
      return 'bg-warning text-white';
    case 'Orange':
      return 'bg-orange-500 text-white';
    case 'Red':
      return 'bg-error text-white';
    default:
      return 'bg-base-300 text-base-content';
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

// Helper functions to transform USGS data
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

// Bangladesh boundaries: approx latitude 20-27, longitude 88-93
const isBangladeshEarthquake = (latitude: number, longitude: number): boolean => {
  return latitude >= 20 && latitude <= 27 && longitude >= 88 && longitude <= 93;
};

// Transform USGS API response to our format
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
      depth: Number(coords[2] ?? 0), // depth in km
      location: String(props.place ?? 'Unknown Location'),
      latitude: Number(coords[1] ?? 0),
      longitude: Number(coords[0] ?? 0),
      timestamp: new Date(Number(props.time ?? Date.now())).toISOString(),
      intensity: getIntensity(magnitude),
      alertLevel: getAlertLevel(magnitude),
      casualties: 0,
      affectedAreas: [String(props.place ?? 'Unknown')],
      description: `Magnitude ${magnitude} earthquake`,
      reportedDamage: 'No damage data available',
      source: 'USGS Earthquake Hazards Program',
    } as Earthquake;
  });
};

export default function EarthquakesPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allEarthquakesData, setAllEarthquakesData] = useState<Earthquake[]>([]);
  const itemsPerPage = 16;

  // Fetch earthquakes from USGS API once on component mount
  useEffect(() => {
    const initialFetch = async () => {
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
          const allTransformed = transformUSGSData(data.features);
          const bangladeshEarthquakes = allTransformed.filter(
            (eq) => isBangladeshEarthquake(eq.latitude, eq.longitude)
          );
          const globalEarthquakes = allTransformed.filter(
            (eq) => !isBangladeshEarthquake(eq.latitude, eq.longitude)
          );

          const sortedEarthquakes = [
            ...bangladeshEarthquakes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
            ...globalEarthquakes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
          ];

          setAllEarthquakesData(sortedEarthquakes);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error fetching from USGS:', error);
        setAllEarthquakesData([]);
        setLoading(false);
      }
    };

    initialFetch();
  }, []);

  // Apply filters and search, and paginate
  useEffect(() => {
    let filtered = allEarthquakesData;

    // Apply alert level filter
    if (filterLevel !== 'All') {
      filtered = filtered.filter((eq) => eq.alertLevel === filterLevel);
    }

    // Apply search term filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (eq) =>
          eq.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.eventId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Paginate
    const total = filtered.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEarthquakes = filtered.slice(startIndex, startIndex + itemsPerPage);

    setEarthquakes(paginatedEarthquakes);
    setTotalPages(Math.ceil(total / itemsPerPage));
  }, [allEarthquakesData, filterLevel, searchTerm, currentPage, itemsPerPage]);

  const filteredEarthquakes = earthquakes;

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8 mb-12">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-primary to-secondary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
        >
          <div className="flex items-center gap-4 mb-4">
            <Globe className="w-12 h-12 sm:w-14 sm:h-14" />
            <h1 className="text-4xl sm:text-5xl font-extrabold">Earthquake Alerts</h1>
          </div>
          <p className="text-white/90 text-lg">Real-time earthquake monitoring and alert system</p>
        </motion.div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { href: '/earthquakes/guidelines', label: 'Safety Guidelines', icon: Shield },
            { href: '/earthquakes/statistics', label: 'Statistics', icon: TrendingUp },
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

        {/* Filter and Search */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-base-300" />
              <input
                type="text"
                placeholder="Search by location or event ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to page 1 when search changes
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-base-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              {['All', 'Green', 'Yellow', 'Orange', 'Red'].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setFilterLevel(level);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 border-2 whitespace-nowrap ${filterLevel === level
                    ? `${getAlertBadgeColor(level)} border-${level === 'All' ? 'primary' : 'current'
                    }`
                    : 'border-base-200 bg-white hover:bg-base-50'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Earthquakes List - Grid Layout */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin">
                <Zap className="w-10 h-10 text-primary" />
              </div>
            </div>
          ) : filteredEarthquakes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-12 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-warning mb-4" />
              <p className="text-xl font-bold text-neutral mb-2">No Earthquakes Found</p>
              <p className="text-neutral/70">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEarthquakes.map((earthquake, index) => (
                <motion.div
                  key={earthquake._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-white flex flex-col ${getAlertColor(
                    earthquake.alertLevel
                  )}`}
                >
                  {/* Alert Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">
                      {getIntensityEmoji(earthquake.intensity)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full font-bold text-xs ${getAlertBadgeColor(
                        earthquake.alertLevel
                      )}`}
                    >
                      {earthquake.alertLevel}
                    </span>
                  </div>

                  {/* Location */}
                  <h3 className="text-lg font-extrabold text-info mb-1 line-clamp-2">
                    {earthquake.location}
                  </h3>
                  <p className="text-xs text-neutral/70 mb-4">
                    Event ID: {earthquake.eventId}
                  </p>

                  {/* Key Metrics */}
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="bg-base-100/50 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral/70 mb-1">
                        <Gauge className="w-3 h-3" />
                        Magnitude
                      </div>
                      <p className="text-xl font-extrabold text-primary">
                        {earthquake.magnitude.toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-base-100/50 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral/70 mb-1">
                        <MapPin className="w-3 h-3" />
                        Depth
                      </div>
                      <p className="text-xl font-extrabold text-secondary">
                        {earthquake.depth} km
                      </p>
                    </div>
                    <div className="bg-base-100/50 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral/70 mb-1">
                        <AlertTriangle className="w-3 h-3" />
                        Intensity
                      </div>
                      <p className="text-sm font-semibold text-info">
                        {earthquake.intensity}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-2 bg-base-100/50 rounded-lg p-2 mb-4 text-xs">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral/70">Time</p>
                      <p className="font-semibold text-info text-xs line-clamp-2">
                        {new Date(earthquake.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link href={`/earthquakes/${earthquake._id}`} className="w-full">
                    <Button variant="primary" fullWidth>
                      View Details
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border-2 border-primary rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
            >
              Previous
            </button>
            <span className="font-bold text-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border-2 border-primary rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
