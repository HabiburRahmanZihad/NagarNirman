'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
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
  const [isMounted, setIsMounted] = useState(false);

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

      // Add styled HTML markers for earthquakes
      let markerCount = 0;
      earthquakes.forEach((earthquake) => {
        try {
          const color = getAlertColor(earthquake.alertLevel);
          const isBD = isBangladeshEarthquake(earthquake.latitude, earthquake.longitude);

          // Create styled HTML marker like map-search
          const markerHtml = `
            <div style="position: relative; width: 28px; height: 28px;">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 14px;
                height: 14px;
                background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
                border: 2px solid white;
                border-radius: 50% 50% 50% 0;
                transform: translate(-50%, -50%) rotate(-45deg);
                box-shadow: 0 2px 10px rgba(0,0,0,0.3), 0 0 0 2px ${color}33;
                cursor: pointer;
                transition: transform 0.3s ease;
              "></div>
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 6px;
                height: 6px;
                background: white;
                border-radius: 50%;
              "></div>
            </div>
          `;

          const markerIcon = L.divIcon({
            className: 'earthquake-marker',
            html: markerHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 28]
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
      {isMounted ? (
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
              {/* Bangladesh Data Card */}
              <div className="card-root">
                <div className="card-svg-trace">
                  <svg viewBox="0 0 100 150" preserveAspectRatio="none">
                    <rect x="2" y="2" width="96" height="146" rx="20" className="trace-path" />
                  </svg>
                </div>
                <div className="card-inner space-y-5">
                  <h3 className="text-xl font-bold text-primary">Bangladesh Data</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-base-200">
                      <span className="text-sm text-base-content/70">Total in Bangladesh</span>
                      <span className="text-2xl font-bold text-primary">
                        {(() => {
                          try {
                            const bd = JSON.parse(sessionStorage.getItem('bangladeshEarthquakes') || '[]');
                            return bd.length;
                          } catch {
                            return 0;
                          }
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-base-200">
                      <span className="text-sm text-base-content/70">Red Alerts (M≥7.0)</span>
                      <span className="text-2xl font-bold text-error">
                        {(() => {
                          try {
                            const bd = JSON.parse(sessionStorage.getItem('bangladeshEarthquakes') || '[]');
                            return bd.filter((e: any) => e.alertLevel === 'Red').length;
                          } catch {
                            return 0;
                          }
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-base-content/70">Global Map Markers</span>
                      <span className="text-2xl font-bold text-info">{earthquakes.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Earthquake Details - Show Bangladesh or Global */}
              {selectedEarthquake && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-root">
                  <div className="card-svg-trace">
                    <svg viewBox="0 0 100 180" preserveAspectRatio="none">
                      <rect x="2" y="2" width="96" height="176" rx="20" className="trace-path" />
                    </svg>
                  </div>
                  <div className="card-inner space-y-4">
                    <h3 className="text-lg font-bold text-primary">
                      {isBangladeshEarthquake(selectedEarthquake.latitude, selectedEarthquake.longitude)
                        ? 'Bangladesh Event'
                        : 'Global Event'}
                    </h3>
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
                      <div className="flex gap-3 pb-3 border-b border-base-200">
                        <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-base-content/70">Alert Level</span>
                          <p className="font-semibold uppercase text-error">{selectedEarthquake.alertLevel}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 text-info flex-shrink-0 mt-0.5">⏱️</div>
                        <div>
                          <span className="text-xs text-base-content/70">Time</span>
                          <p className="font-semibold text-sm">{new Date(selectedEarthquake.timestamp).toLocaleString()}</p>
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
                className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh Data
              </button>
            </motion.div>
          </div>
        </div>
      ) : null}

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
