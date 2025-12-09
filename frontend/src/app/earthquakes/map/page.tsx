'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  MapPin,
  AlertTriangle,
  Gauge,
  RotateCcw,
  Loader,
  ChevronRight,
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

// Extract country/region from location string
const extractCountry = (location: string): string => {
  const parts = location.split(',').map(p => p.trim());
  return parts[parts.length - 1] || location;
};

// Group earthquakes by country
const groupByCountry = (earthquakes: Earthquake[]) => {
  const countries: { [key: string]: { count: number; maxMagnitude: number; alertLevel: string } } = {};

  earthquakes.forEach((eq) => {
    const country = extractCountry(eq.location);
    if (!countries[country]) {
      countries[country] = { count: 0, maxMagnitude: 0, alertLevel: 'Green' };
    }
    countries[country].count++;
    countries[country].maxMagnitude = Math.max(countries[country].maxMagnitude, eq.magnitude);

    // Update alert level to highest severity
    const alertLevels = { 'Red': 3, 'Orange': 2, 'Yellow': 1, 'Green': 0 };
    if ((alertLevels[eq.alertLevel as keyof typeof alertLevels] || 0) > (alertLevels[countries[country].alertLevel as keyof typeof alertLevels] || 0)) {
      countries[country].alertLevel = eq.alertLevel;
    }
  });

  return countries;
};

export default function EarthquakeMapPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [affectedCountries, setAffectedCountries] = useState<{ [key: string]: { count: number; maxMagnitude: number; alertLevel: string } }>({});

  // Handle component mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    loadLeaflet();
    // Add a small delay to ensure Leaflet loads first
    const timer = setTimeout(() => {
      fetchEarthquakes();
    }, 500);
    return () => clearTimeout(timer);
  }, [isMounted]);

  const loadLeaflet = useCallback(async () => {
    if (typeof window === 'undefined') return;

    if ((window as any).L) {
      setMapLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  const fetchEarthquakes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching earthquake data from USGS...');

      const response = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Data fetched successfully. Features count:', data.features?.length || 0);

      if (data.features && Array.isArray(data.features) && data.features.length > 0) {
        const allTransformed = transformUSGSData(data.features);
        console.log('✅ Transformed data count:', allTransformed.length);

        // Separate Bangladesh and global earthquakes
        const bangladeshEarthquakes = allTransformed.filter((eq) =>
          isBangladeshEarthquake(eq.latitude, eq.longitude)
        );
        const globalEarthquakes = allTransformed
          .slice(0, 150) // Get top 150 globally
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

        console.log('📍 Bangladesh earthquakes:', bangladeshEarthquakes.length);
        console.log('🌍 Global earthquakes for map:', globalEarthquakes.length);

        // Store all earthquakes for map display, but track Bangladesh separately
        setEarthquakes(globalEarthquakes);
        setAffectedCountries(groupByCountry(globalEarthquakes));
        // Store Bangladesh data in sessionStorage for sidebar display
        try {
          sessionStorage.setItem('bangladeshEarthquakes', JSON.stringify(bangladeshEarthquakes));
          console.log('✅ Bangladesh data stored in sessionStorage');
        } catch (storageError) {
          console.warn('⚠️ Could not store in sessionStorage:', storageError);
        }
        setLoading(false);
        return;
      }

      throw new Error(`Invalid data format or empty features: ${data.features?.length || 0} features`);
    } catch (error) {
      console.error('❌ Error fetching from USGS:', error);
      alert(`Error loading earthquake data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setEarthquakes([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isMounted || !mapLoaded || earthquakes.length === 0) return;
    if (typeof window === 'undefined' || !(window as any).L) return;

    initializeMap();
  }, [isMounted, mapLoaded, earthquakes]);

  const initializeMap = useCallback(() => {
    const L = (window as any).L;
    if (!L) {
      console.warn('⚠️ Leaflet library not available');
      return;
    }

    const mapContainer = document.getElementById('earthquake-map') as HTMLElement & {
      _leaflet_id?: number;
    };
    if (!mapContainer) {
      console.warn('⚠️ Map container not found');
      return;
    }

    // Remove existing map instance if it exists
    if (mapContainer._leaflet_id != null) {
      try {
        const existingMap = (L as any).map(mapContainer);
        existingMap.remove();
        console.log('✅ Previous map instance removed');
      } catch (e) {
        console.warn('⚠️ Could not remove old map:', e);
      }
    }

    try {
      // Create new map
      const map = L.map('earthquake-map').setView([23.5, 90.5], 5); // Bangladesh center
      console.log('✅ New map created');

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      console.log('✅ Tile layer added');

      // Inject global styles for animations
      if (!document.getElementById('earthquake-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'earthquake-styles';
        styleElement.textContent = `
          @keyframes pulse-ring {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }

          .earthquake-marker {
            filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.4));
          }
        `;
        document.head.appendChild(styleElement);
        console.log('✅ Earthquake styles injected');
      }

      // Add styled HTML markers for earthquakes
      let markerCount = 0;
      earthquakes.forEach((earthquake) => {
        try {
          const color = getAlertColor(earthquake.alertLevel);
          const isBD = isBangladeshEarthquake(earthquake.latitude, earthquake.longitude);
          const magnitude = earthquake.magnitude;

          // Calculate pin size based on magnitude
          const baseSize = 24;
          const sizeMultiplier = Math.min(magnitude / 5, 2.5);
          const pinSize = Math.max(baseSize, baseSize * sizeMultiplier);

          // Extract location name (first part before comma)
          const locationParts = earthquake.location.split(',');
          const displayLocation = locationParts[0].trim();

          // Create styled HTML marker with label
          const markerHtml = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%;">
              <!-- Main circle with concentric rings -->
              <div style="position: relative; width: ${pinSize + 20}px; height: ${pinSize + 20}px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <!-- Outer glow circle -->
                <div style="
                  position: absolute;
                  width: ${pinSize + 20}px;
                  height: ${pinSize + 20}px;
                  background: ${color}22;
                  border: 3px solid ${color}44;
                  border-radius: 50%;
                  z-index: 1;
                "></div>
                <!-- Middle ring -->
                <div style="
                  position: absolute;
                  width: ${pinSize + 10}px;
                  height: ${pinSize + 10}px;
                  background: ${color}33;
                  border: 2px solid ${color}77;
                  border-radius: 50%;
                  z-index: 2;
                "></div>
                <!-- Main circle with gradient -->
                <div style="
                  position: absolute;
                  width: ${pinSize}px;
                  height: ${pinSize}px;
                  background: linear-gradient(135deg, ${color} 0%, ${color} 100%);
                  border: 4px solid white;
                  border-radius: 50%;
                  box-shadow: 0 0 20px ${color}99, 0 0 8px rgba(0,0,0,0.3), inset 0 0 6px rgba(0,0,0,0.1);
                  z-index: 3;
                "></div>
                <!-- Pulsing animation overlay -->
                <div style="
                  position: absolute;
                  width: ${pinSize}px;
                  height: ${pinSize}px;
                  background: transparent;
                  border: 2px solid ${color};
                  border-radius: 50%;
                  animation: pulse-ring 2s infinite;
                  z-index: 0;
                "></div>
                <!-- Magnitude text in center -->
                <div style="
                  position: absolute;
                  z-index: 4;
                  color: white;
                  font-weight: bold;
                  font-size: ${Math.max(10, pinSize * 0.4)}px;
                  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                  font-family: system-ui;
                  line-height: 1;
                ">${magnitude.toFixed(1)}</div>
              </div>
              <!-- Location label below pin -->
              <div style="
                margin-top: 4px;
                background: white;
                color: ${color};
                padding: 4px 10px;
                border-radius: 14px;
                font-size: 12px;
                font-weight: 700;
                white-space: nowrap;
                border: 2px solid ${color};
                box-shadow: 0 2px 10px rgba(0,0,0,0.25);
                font-family: system-ui, -apple-system, sans-serif;
                letter-spacing: 0.3px;
                flex-shrink: 0;
              ">${displayLocation}</div>
            </div>
          `;

          const markerIcon = L.divIcon({
            className: 'earthquake-marker',
            html: markerHtml,
            iconSize: [pinSize + 20, pinSize + 60],
            iconAnchor: [(pinSize + 20) / 2, pinSize + 20],
            popupAnchor: [0, -(pinSize + 60) / 2]
          });

          const tooltipContent = `
            <div style="
              background: rgba(0, 0, 0, 0.85);
              padding: 12px 14px;
              border-radius: 8px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.3);
              border: 1px solid ${color}66;
              backdrop-filter: blur(10px);
              font-family: system-ui;
              max-width: 250px;
            ">
              <div style="
                font-weight: 600;
                font-size: 13px;
                color: #fff;
                margin-bottom: 6px;
              ">${isBD ? '🇧🇩 ' : '🌍 '}${earthquake.location}</div>
              <div style="
                font-size: 12px;
                color: #e5e7eb;
                display: flex;
                flex-direction: column;
                gap: 4px;
              ">
                <div>📊 Magnitude: <span style="font-weight: 600; color: ${color}">${earthquake.magnitude.toFixed(1)}</span></div>
                <div>📍 Depth: ${earthquake.depth.toFixed(1)}km</div>
                <div>⏱️ ${new Date(earthquake.timestamp).toLocaleString()}</div>
              </div>
            </div>
          `;

          const marker = L.marker([earthquake.latitude, earthquake.longitude], { icon: markerIcon })
            .addTo(map)
            .bindTooltip(tooltipContent, {
              permanent: false,
              direction: 'top',
              offset: [0, -10],
              className: 'earthquake-tooltip',
              opacity: 1
            })
            .on('click', () => setSelectedEarthquake(earthquake));

          markerCount++;
        } catch (markerError) {
          console.warn('⚠️ Error adding marker:', markerError);
        }
      });
      console.log(`✅ Added ${markerCount} markers to map`);

      // Add style for tooltips
      const style = document.createElement('style');
      style.textContent = `
        .earthquake-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .earthquake-tooltip .leaflet-tooltip-content {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
      `;
      document.head.appendChild(style);
    } catch (mapError) {
      console.error('❌ Error initializing map:', mapError);
      alert('Failed to initialize map. Please refresh the page.');
    }
  }, [earthquakes]);

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-primary to-secondary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🌍</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold">Earthquake Map</h1>
          </div>
          <p className="text-white/90 text-lg">See real-time earthquake data visualized on an interactive map.</p>
        </motion.div>

        {/* Quick Navigation */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: '/earthquakes', label: '📋 Earthquake Alerts', icon: '📝' },
              { href: '/earthquakes/guidelines', label: '🛡️ Safety Guidelines', icon: '📚' },
              { href: '/earthquakes/statistics', label: '📊 Statistics', icon: '📈' },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-white rounded-2xl shadow-lg border-2 border-accent/20 font-bold text-primary hover:shadow-xl transition-all duration-300 flex items-center justify-between"
                >
                  <span className="text-lg">{link.label}</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {isMounted ? (
          <div className="c mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Map Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[600px] border-2 border-primary/10 hover:shadow-3xl transition-all duration-300">
                  <div id="earthquake-map" className="w-full h-full" />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <Loader className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-base text-base-content/70 font-semibold">Loading earthquake data...</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Bangladesh Data Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl shadow-lg border-2 border-primary/10 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🇧🇩</div>
                    <h3 className="text-xl font-bold text-primary">Bangladesh Data</h3>
                  </div>
                  <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-br from-primary/5 to-primary/10 rounded-xl p-4 border-l-4 border-primary">
                      <span className="text-xs font-bold text-base-content/70 uppercase">Total in Bangladesh</span>
                      <p className="text-3xl font-extrabold text-primary mt-1">
                        {(() => {
                          try {
                            const bd = JSON.parse(sessionStorage.getItem('bangladeshEarthquakes') || '[]');
                            return bd.length;
                          } catch {
                            return 0;
                          }
                        })()}
                      </p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-br from-error/5 to-error/10 rounded-xl p-4 border-l-4 border-error">
                      <span className="text-xs font-bold text-base-content/70 uppercase">Red Alerts (M≥7.0)</span>
                      <p className="text-3xl font-extrabold text-error mt-1">
                        {(() => {
                          try {
                            const bd = JSON.parse(sessionStorage.getItem('bangladeshEarthquakes') || '[]');
                            return bd.filter((e: any) => e.alertLevel === 'Red').length;
                          } catch {
                            return 0;
                          }
                        })()}
                      </p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-linear-to-br from-info/5 to-info/10 rounded-xl p-4 border-l-4 border-info">
                      <span className="text-xs font-bold text-base-content/70 uppercase">Global Map Markers</span>
                      <p className="text-3xl font-extrabold text-info mt-1">{earthquakes.length}</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Selected Earthquake Details */}
                {selectedEarthquake && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl shadow-lg border-2 border-primary/10 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">
                        {isBangladeshEarthquake(selectedEarthquake.latitude, selectedEarthquake.longitude) ? '🇧🇩' : '🌍'}
                      </div>
                      <h3 className="text-lg font-bold text-primary">
                        {isBangladeshEarthquake(selectedEarthquake.latitude, selectedEarthquake.longitude)
                          ? 'Bangladesh Event'
                          : 'Global Event'}
                      </h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3 pb-3 border-b border-base-200">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-base-content/70 uppercase">Location</span>
                          <p className="font-semibold text-base-content">{selectedEarthquake.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pb-3 border-b border-base-200">
                        <Gauge className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-base-content/70 uppercase">Magnitude</span>
                          <p className="font-semibold text-2xl text-warning">{selectedEarthquake.magnitude.toFixed(1)}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pb-3 border-b border-base-200">
                        <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-base-content/70 uppercase">Alert Level</span>
                          <p className={`font-extrabold uppercase text-lg ${selectedEarthquake.alertLevel === 'Red' ? 'text-error' : selectedEarthquake.alertLevel === 'Orange' ? 'text-orange-500' : selectedEarthquake.alertLevel === 'Yellow' ? 'text-warning' : 'text-success'}`}>
                            {selectedEarthquake.alertLevel}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 text-info flex-shrink-0 mt-0.5">⏱️</div>
                        <div>
                          <span className="text-xs font-bold text-base-content/70 uppercase">Time</span>
                          <p className="font-semibold text-xs text-base-content mt-1">{new Date(selectedEarthquake.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Refresh Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setLoading(true);
                    fetchEarthquakes();
                  }}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-2xl hover:shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-5 h-5" />
                  Refresh Data
                </motion.button>
              </motion.div>
            </div>
          </div>
        ) : null}

        {/* Affected Countries/Regions Section */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-primary/10 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-primary mb-2">🌎 Affected Countries & Regions</h2>
            <p className="text-base-content/70">Regions experiencing earthquake activity in the past 7 days</p>
          </div>

          {Object.keys(affectedCountries).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(affectedCountries)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([country, data]) => {
                  const alertColor = getAlertColor(data.alertLevel);
                  return (
                    <motion.div
                      key={country}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                      style={{ borderLeftColor: alertColor, borderLeftWidth: '6px' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-base-content truncate">{country}</h3>
                          <p className="text-xs text-base-content/60 mt-1">
                            <span
                              className="inline-block w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: alertColor }}
                            ></span>
                            Alert Level: <span style={{ color: alertColor }} className="font-bold">{data.alertLevel}</span>
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-base-content/70">Total Events:</span>
                          <span className="font-bold text-base-content">{data.count}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base-content/70">Max Magnitude:</span>
                          <span className="font-bold" style={{ color: alertColor }}>{data.maxMagnitude.toFixed(1)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-base-content/70 text-lg">Loading affected regions data...</p>
            </div>
          )}
        </div>
        <div className="bg-white border-t border-base-300 py-12 px-4 sm:px-6 lg:px-8">
          <div className="c mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-3xl font-extrabold text-primary mb-4">About This Data</h2>
              <p className="text-base-content/70 leading-relaxed text-lg">
                This monitoring system tracks earthquake activity from the USGS Earthquake Hazards Program. Data is updated in real-time and focuses on events from the past 7 days. Bangladesh region activity is prioritized to help disaster preparedness efforts in the region.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border-2 border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="font-bold text-primary text-lg mb-2">📊 Alert Levels</h4>
                <p className="text-sm text-base-content/70">Red: M≥7.0 | Orange: M≥6.0 | Yellow: M≥4.5 | Green: M&lt;4.5</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-linear-to-br from-success/5 to-success/10 rounded-2xl p-6 border-2 border-success/20 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="font-bold text-success text-lg mb-2">🌐 Data Source</h4>
                <p className="text-sm text-base-content/70">USGS Earthquake Hazards Program (Free & Open)</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-linear-to-br from-info/5 to-info/10 rounded-2xl p-6 border-2 border-info/20 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="font-bold text-info text-lg mb-2">⏱️ Update Frequency</h4>
                <p className="text-sm text-base-content/70">Real-time data from past 7 days globally</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Styles for custom cards */}
        <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .earthquake-marker {
          filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.4));
        }

        .earthquake-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .earthquake-tooltip .leaflet-tooltip-content {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
      `}</style>
      </div>
    </div>
  );
}
