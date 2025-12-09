'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  AlertTriangle,
  Gauge,
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

const getAlertColor = (alertLevel: string) => {
  switch (alertLevel) {
    case 'Green':
      return '#10b981';
    case 'Yellow':
      return '#f59e0b';
    case 'Orange':
      return '#ff8c42';
    case 'Red':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

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

export default function EarthquakeMapPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    loadLeaflet();
    fetchEarthquakes();
  }, []);

  const loadLeaflet = async () => {
    if (typeof window !== 'undefined' && !(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    } else {
      setMapLoaded(true);
    }
  };

  const fetchEarthquakes = async () => {
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

        // Prioritize Bangladesh earthquakes
        const bangladeshEarthquakes = allTransformed.filter(
          (eq) => isBangladeshEarthquake(eq.latitude, eq.longitude)
        );
        const globalEarthquakes = allTransformed.filter(
          (eq) => !isBangladeshEarthquake(eq.latitude, eq.longitude)
        );

        const allEarthquakes = [
          ...bangladeshEarthquakes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
          ...globalEarthquakes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        ].slice(0, 150);

        setEarthquakes(allEarthquakes);
        setLoading(false);
        return;
      }

      throw new Error('Invalid data format');
    } catch (error) {
      console.error('❌ Error fetching from USGS:', error);
      setEarthquakes([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mapLoaded && earthquakes.length > 0 && typeof window !== 'undefined' && (window as any).L) {
      initializeMap();
    }
  }, [mapLoaded, earthquakes]);

  const initializeMap = () => {
    const L = (window as any).L;
    if (!L) return;

    const mapContainer = document.getElementById('earthquake-map') as HTMLElement & { _leaflet_id?: number };
    if (!mapContainer) return;

    // Remove existing map
    if (mapContainer._leaflet_id != null) {
      const existingMap = L.map(mapContainer);
      existingMap.remove();
    }

    // Create new map
    const map = L.map('earthquake-map').setView([23.5, 90.5], 5); // Bangladesh center

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add markers
    earthquakes.forEach((earthquake) => {
      const color = getAlertColor(earthquake.alertLevel);
      const popupContent = `
        <div class="p-2">
          <strong>${earthquake.location}</strong><br/>
          Magnitude: ${earthquake.magnitude}<br/>
          Depth: ${earthquake.depth}km<br/>
          <small>${new Date(earthquake.timestamp).toLocaleString()}</small>
        </div>
      `;

      const marker = L.circleMarker([earthquake.latitude, earthquake.longitude], {
        radius: Math.max(5, earthquake.magnitude * 1.5),
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6,
      }).addTo(map);

      marker.bindPopup(popupContent);
      marker.on('click', () => setSelectedEarthquake(earthquake));
    });
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-bold">Natural Disaster Monitoring</h1>
            <p className="text-white/90 text-lg mt-2">Real-time earthquake detection and analysis for disaster preparedness</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[550px] border-2 border-primary/10 relative">
              <div id="earthquake-map" className="w-full h-full" />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm text-base-content/70">Loading earthquake data...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Quick Stats Card */}
            <div className="card-root">
              <div className="card-svg-trace">
                <svg viewBox="0 0 100 150" preserveAspectRatio="none">
                  <rect x="2" y="2" width="96" height="146" rx="20" className="trace-path" />
                </svg>
              </div>
              <div className="card-inner space-y-5">
                <h3 className="text-xl font-bold text-primary">Quick Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-base-200">
                    <span className="text-sm text-base-content/70">Total Earthquakes</span>
                    <span className="text-2xl font-bold text-primary">{earthquakes.length}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-base-200">
                    <span className="text-sm text-base-content/70">Bangladesh Region</span>
                    <span className="text-2xl font-bold text-success">
                      {earthquakes.filter((e) => isBangladeshEarthquake(e.latitude, e.longitude)).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">Global Coverage</span>
                    <span className="text-2xl font-bold text-info">
                      {earthquakes.filter((e) => !isBangladeshEarthquake(e.latitude, e.longitude)).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Earthquake Details */}
            {selectedEarthquake && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-root">
                <div className="card-svg-trace">
                  <svg viewBox="0 0 100 180" preserveAspectRatio="none">
                    <rect x="2" y="2" width="96" height="176" rx="20" className="trace-path" />
                  </svg>
                </div>
                <div className="card-inner space-y-4">
                  <h3 className="text-lg font-bold text-primary">Event Details</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3 pb-3 border-b border-base-200">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-base-content/70">Location</span>
                        <p className="font-semibold">{selectedEarthquake.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 pb-3 border-b border-base-200">
                      <Gauge className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-base-content/70">Magnitude</span>
                        <p className="font-semibold">{selectedEarthquake.magnitude.toFixed(1)}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-base-content/70">Alert Level</span>
                        <p className="font-semibold uppercase text-error">{selectedEarthquake.alertLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Refresh Button */}
            <button
              onClick={() => {
                setLoading(true);
                fetchEarthquakes();
              }}
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh Data
            </button>
          </motion.div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-base-200/50 py-12 px-4 sm:px-6 lg:px-8 border-t border-base-300">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">About This Data</h2>
            <p className="text-base-content/70 leading-relaxed">
              This monitoring system tracks earthquake activity from the USGS Earthquake Hazards Program. Data is updated in real-time and focuses on events from the past 7 days. Bangladesh region activity is prioritized to help disaster preparedness efforts in the region.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-2xl p-4 border-l-4 border-primary">
                <h4 className="font-semibold text-primary mb-1">Alert Levels</h4>
                <p className="text-sm text-base-content/70">Red: M≥7.0 | Orange: M≥6.0 | Yellow: M≥4.5 | Green: M&lt;4.5</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border-l-4 border-success">
                <h4 className="font-semibold text-success mb-1">Data Source</h4>
                <p className="text-sm text-base-content/70">USGS Earthquake Hazards Program (Free & Open)</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border-l-4 border-info">
                <h4 className="font-semibold text-info mb-1">Update Frequency</h4>
                <p className="text-sm text-base-content/70">Real-time data from past 7 days globally</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Styles for custom cards */}
      <style>{`
        .card-root {
          position: relative;
          --accent-color: var(--color-primary, #003B31);
        }

        .card-svg-trace {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .card-svg-trace svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .trace-path {
          fill: none;
          stroke: var(--accent-color);
          stroke-width: 2.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
          stroke-dasharray: 150;
          stroke-dashoffset: 0;
          animation: borderMove 30s linear infinite;
          opacity: 0.9;
          filter: drop-shadow(0 0 5px var(--accent-color));
        }

        @keyframes borderMove {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1010; }
        }

        .card-root:hover .trace-path {
          animation-duration: 10s;
          opacity: 1;
          filter: drop-shadow(0 0 8px var(--accent-color));
        }

        .card-inner {
          position: relative;
          z-index: 1;
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          height: 100%;
          border: 2px solid var(--accent-color);
          transition: all 0.28s ease;
        }

        .card-inner:hover {
          box-shadow: 0 18px 30px rgba(0,0,0,0.14);
        }
      `}</style>
    </div>
  );
}
