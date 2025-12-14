"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, X, MapPin, Activity, CheckCircle, Clock, Info, TrendingUp, BarChart3, Users, AlertCircle } from 'lucide-react';
import divisionsDataJson from '@/data/divisionsData.json';
import { statisticsAPI } from '@/utils/api';
import 'leaflet/dist/leaflet.css';

// Type definitions
interface District {
  name: string;
  total: number;
  pending: number;
  completed: number;
  priority: 'high' | 'medium' | 'low';
  lat: number;
  lng: number;
  color: string;
}

interface Division {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  intensity: number;
  trend: string;
  districts: District[];
}

interface SelectedItem {
  type: 'division' | 'district';
  data: Division | District;
  division?: Division;
}

interface DynamicMapProps {
  divisions: Division[];
  selectedItem: SelectedItem | null;
  onDivisionClick: (division: Division) => void;
  onDistrictClick: (district: District, division: Division) => void;
  isDark: boolean;
  searchQuery: string;
  showDistricts: boolean;
  onInvalidSearch?: () => void;
}

// Transform JSON data to match Division structure
const transformDivisionsData = (): Division[] => {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#EF4444', // Red
    '#06B6D4'  // Cyan
  ];

  return divisionsDataJson.map((divisionData, index) => ({
    id: divisionData.division.toLowerCase().replace(/\s+/g, '-'),
    name: `${divisionData.division} Division`,
    lat: divisionData.latitude,
    lng: divisionData.longitude,
    color: colors[index % colors.length],
    intensity: 0, // Will be calculated from reports
    trend: '+0%',
    districts: divisionData.districts.map((district) => ({
      name: district.name,
      total: 0, // Will be populated from actual report data
      pending: 0,
      completed: 0,
      priority: 'low' as 'high' | 'medium' | 'low',
      lat: district.latitude,
      lng: district.longitude,
      color: colors[index % colors.length]
    }))
  }));
};

// Enhanced data structure with district coordinates
const DIVISIONS_DATA: Division[] = transformDivisionsData();

// Helper function to add markers to map
const addMarkersToMap = (
  L: any,
  mapInstance: any,
  divisions: Division[],
  isDark: boolean,
  searchQuery: string,
  showDistricts: boolean,
  onDivisionClick: (division: Division) => void,
  onDistrictClick: (district: District, division: Division) => void
) => {
  const markers: any[] = [];
  const circles: any[] = [];

  // Always show all divisions and districts when there's a search query
  const shouldShowAllMarkers = searchQuery.length > 0;

  divisions.forEach((division) => {
    const divisionMatchesSearch = division.name.toLowerCase().includes(searchQuery.toLowerCase());
    const districtMatchesSearch = division.districts.some(d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Show division if it matches search OR if there's no search query
    if (!shouldShowAllMarkers || divisionMatchesSearch || districtMatchesSearch) {
      // Enhanced division marker with multiple pulse rings
      const divisionMarkerHtml = `
        <div style="position: relative; width: 40px; height: 40px;">
          <div class="pulse-ring" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${division.color};
            opacity: 0.4;
            animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          "></div>
          <div class="pulse-ring-2" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${division.color};
            opacity: 0.3;
            animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) 0.5s infinite;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, ${division.color} 0%, ${division.color}dd 100%);
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 0 4px ${division.color}33;
            cursor: pointer;
            transition: transform 0.3s ease;
          "></div>
          <style>
            @keyframes pulse-ring {
              0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.6; }
              100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
          </style>
        </div>
      `;

      const divisionIcon = L.divIcon({
        className: 'division-marker',
        html: divisionMarkerHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const divisionMarker = L.marker([division.lat, division.lng], { icon: divisionIcon })
        .addTo(mapInstance)
        .bindTooltip(`
          <div style="
            background: ${isDark ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
            padding: 12px 16px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            border: none;
            backdrop-filter: blur(10px);
            font-family: system-ui;
          ">
            <div style="
              font-weight: 700;
              font-size: 14px;
              color: ${isDark ? '#fff' : '#111827'};
              margin-bottom: 6px;
              letter-spacing: -0.02em;
            ">${division.name}</div>
            <div style="
              font-size: 11px;
              color: ${isDark ? '#9CA3AF' : '#6B7280'};
              display: flex;
              align-items: center;
              gap: 6px;
            ">
              <span style="
                width: 8px;
                height: 8px;
                background: ${division.color};
                border-radius: 50%;
                display: inline-block;
              "></span>
              ${division.districts.length} Districts • ${division.intensity} Reports
            </div>
            <div style="
              font-size: 10px;
              color: ${isDark ? '#6B7280' : '#9CA3AF'};
              margin-top: 4px;
            ">
              Total: ${division.districts.reduce((a, d) => a + d.total, 0)} •
              Resolved: ${division.districts.reduce((a, d) => a + d.completed, 0)}
            </div>
          </div>
        `, {
          permanent: false,
          direction: 'top',
          offset: [0, -10],
          className: 'custom-tooltip',
          opacity: 1
        })
        .on('click', () => onDivisionClick(division));

      markers.push(divisionMarker);

      // Ambient glow circle for divisions
      const circle = L.circle([division.lat, division.lng], {
        color: division.color,
        fillColor: division.color,
        fillOpacity: division.intensity / 400,
        radius: division.intensity * 800,
        stroke: false,
        className: 'ambient-circle'
      }).addTo(mapInstance);

      circles.push(circle);
    }

    // Show districts if they match search OR if showDistricts is true OR if there's a search query
    division.districts.forEach((district) => {
      const districtMatchesSearch = district.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (shouldShowAllMarkers || showDistricts || districtMatchesSearch) {
        // Only show district if it matches search when there's a search query
        if (searchQuery.length > 0 && !districtMatchesSearch && !division.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return;
        }

        // District marker with different styling
        const districtMarkerHtml = `
          <div style="position: relative; width: 30px; height: 30px;">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 16px;
              height: 16px;
              background: linear-gradient(135deg, ${district.color} 0%, ${district.color}dd 100%);
              border: 2px solid white;
              border-radius: 50% 50% 50% 0;
              transform: translate(-50%, -50%) rotate(-45deg);
              box-shadow: 0 2px 10px rgba(0,0,0,0.3), 0 0 0 2px ${district.color}33;
              cursor: pointer;
              transition: transform 0.3s ease;
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `;

        const districtIcon = L.divIcon({
          className: 'district-marker',
          html: districtMarkerHtml,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        });

        const districtMarker = L.marker([district.lat, district.lng], { icon: districtIcon })
          .addTo(mapInstance)
          .bindTooltip(`
            <div style="
              background: ${isDark ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
              padding: 10px 12px;
              border-radius: 8px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.2);
              border: none;
              backdrop-filter: blur(10px);
              font-family: system-ui;
            ">
              <div style="
                font-weight: 600;
                font-size: 12px;
                color: ${isDark ? '#fff' : '#111827'};
                margin-bottom: 4px;
              ">${district.name}</div>
              <div style="
                font-size: 10px;
                color: ${isDark ? '#9CA3AF' : '#6B7280'};
                display: flex;
                align-items: center;
                gap: 4px;
              ">
                <span style="
                  width: 6px;
                  height: 6px;
                  background: ${district.color};
                  border-radius: 50%;
                  display: inline-block;
                "></span>
                ${district.total} Reports • ${district.priority} Priority
              </div>
              <div style="
                font-size: 9px;
                color: ${isDark ? '#6B7280' : '#9CA3AF'};
                margin-top: 3px;
              ">
                Resolved: ${district.completed} • Pending: ${district.pending}
              </div>
            </div>
          `, {
            permanent: false,
            direction: 'top',
            offset: [0, -15],
            className: 'custom-tooltip',
            opacity: 1
          })
          .on('click', () => onDistrictClick(district, division));

        markers.push(districtMarker);
      }
    });
  });

  return { markers, circles };
};

// Dynamic Leaflet component with proper instance management
const DynamicMap: React.FC<DynamicMapProps> = ({
  divisions,
  selectedItem,
  onDivisionClick,
  onDistrictClick,
  isDark,
  searchQuery,
  showDistricts,
  onInvalidSearch
}) => {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);
  const legendRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup function
  const cleanupMap = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        if (marker && mapRef.current) {
          marker.remove();
        }
      });
      markersRef.current = [];
    }

    if (circlesRef.current.length > 0) {
      circlesRef.current.forEach((circle) => {
        if (circle && mapRef.current) {
          circle.remove();
        }
      });
      circlesRef.current = [];
    }

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const initMap = async () => {
      // Clean up any existing map first
      cleanupMap();

      const L = await import('leaflet');

      // Fix for default markers - using any to bypass TypeScript checks
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const container = document.getElementById('map');
      if (!container) return;

      // Check if container already has a map
      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }

      const mapInstance = L.map('map', {
        zoomControl: false,
        attributionControl: false
      }).setView([23.685, 90.3563], 8);

      mapRef.current = mapInstance;

      const tileLayer = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileLayer, {
        maxZoom: 18,
      }).addTo(mapInstance);

      // Custom zoom control
      L.control.zoom({ position: 'bottomleft' }).addTo(mapInstance);

      // Add markers to the map
      const { markers, circles } = addMarkersToMap(
        L,
        mapInstance,
        divisions,
        isDark,
        searchQuery,
        showDistricts,
        onDivisionClick,
        onDistrictClick
      );

      markersRef.current = markers;
      circlesRef.current = circles;

      // Enhanced legend with glassmorphism
      const legend = new L.Control({ position: 'bottomright' });
      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.cssText = `
          background: ${isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          backdrop-filter: blur(20px) saturate(180%);
          padding: 16px 20px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
          font-family: system-ui;
          min-width: 200px;
          max-height: 500px;
          overflow-y: auto;
        `;
        const totalMapped = divisions.reduce((sum, d) => sum + d.intensity, 0);
        div.innerHTML = `
          <h4 style="
            margin: 0 0 8px 0;
            font-weight: 700;
            font-size: 13px;
            color: ${isDark ? '#F9FAFB' : '#111827'};
            letter-spacing: -0.01em;
            text-transform: uppercase;
            font-size: 11px;
            opacity: 0.7;
          ">Division Status</h4>
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin-bottom: 12px;
            background: ${isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
            border-radius: 8px;
            border: 1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'};
          ">
            <span style="
              font-size: 12px;
              font-weight: 600;
              color: ${isDark ? '#93C5FD' : '#3B82F6'};
            ">Mapped Reports</span>
            <span style="
              font-size: 14px;
              font-weight: 700;
              color: ${isDark ? '#F9FAFB' : '#111827'};
              background: ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'};
              padding: 3px 10px;
              border-radius: 6px;
            ">${totalMapped}</span>
          </div>
          ${divisions
            .sort((a, b) => b.intensity - a.intensity) // Sort by highest reports
            .map(d => {
              // Calculate priority level based on intensity
              let priorityLabel = 'Low';
              let priorityColor = d.color;
              if (d.intensity >= 10) {
                priorityLabel = 'Urgent';
                priorityColor = '#EF4444'; // Red
              } else if (d.intensity >= 5) {
                priorityLabel = 'High';
                priorityColor = '#F59E0B'; // Orange
              } else if (d.intensity >= 3) {
                priorityLabel = 'Medium';
                priorityColor = '#10B981'; // Green
              }

              return `
                <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin: 8px 0;
                  padding: 6px 0;
                  border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                ">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="
                      width: 10px;
                      height: 10px;
                      background: ${d.color};
                      border-radius: 50%;
                      box-shadow: 0 0 10px ${d.color}77;
                    "></div>
                    <span style="
                      font-size: 12px;
                      font-weight: 500;
                      color: ${isDark ? '#E5E7EB' : '#374151'};
                    ">${d.name.replace(' Division', '')}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="
                      font-size: 11px;
                      font-weight: 600;
                      color: ${priorityColor};
                      background: ${priorityColor}22;
                      padding: 2px 8px;
                      border-radius: 6px;
                    ">${priorityLabel}</span>
                    <span style="
                      font-size: 12px;
                      font-weight: 700;
                      color: ${isDark ? '#F9FAFB' : '#111827'};
                      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
                      padding: 2px 8px;
                      border-radius: 6px;
                    ">${d.intensity}</span>
                  </div>
                </div>
              `;
            }).join('')}
        `;
        return div;
      };
      legend.addTo(mapInstance);
      legendRef.current = legend;
    };

    initMap();

    return () => {
      if (legendRef.current && mapRef.current) {
        mapRef.current.removeControl(legendRef.current);
        legendRef.current = null;
      }
      cleanupMap();
    };
  }, [mounted, isDark]); // Only depend on mounted and isDark

  // Separate effect to update legend when divisions data changes
  useEffect(() => {
    if (!mounted || !mapRef.current || !legendRef.current || typeof window === 'undefined') return;

    const updateLegend = async () => {
      const L = await import('leaflet');

      // Remove old legend
      if (legendRef.current) {
        mapRef.current.removeControl(legendRef.current);
      }

      // Create new legend with updated data
      const legend = new L.Control({ position: 'bottomright' });
      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.cssText = `
          background: ${isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          backdrop-filter: blur(20px) saturate(180%);
          padding: 16px 20px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
          font-family: system-ui;
          min-width: 200px;
          max-height: 500px;
          overflow-y: auto;
        `;
        const totalMapped = divisions.reduce((sum, d) => sum + d.intensity, 0);
        div.innerHTML = `
          <h4 style="
            margin: 0 0 8px 0;
            font-weight: 700;
            font-size: 13px;
            color: ${isDark ? '#F9FAFB' : '#111827'};
            letter-spacing: -0.01em;
            text-transform: uppercase;
            font-size: 11px;
            opacity: 0.7;
          ">Division Status</h4>
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin-bottom: 12px;
            background: ${isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
            border-radius: 8px;
            border: 1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'};
          ">
            <span style="
              font-size: 12px;
              font-weight: 600;
              color: ${isDark ? '#93C5FD' : '#3B82F6'};
            ">Mapped Reports</span>
            <span style="
              font-size: 14px;
              font-weight: 700;
              color: ${isDark ? '#F9FAFB' : '#111827'};
              background: ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'};
              padding: 3px 10px;
              border-radius: 6px;
            ">${totalMapped}</span>
          </div>
          ${divisions
            .sort((a, b) => b.intensity - a.intensity) // Sort by highest reports
            .map(d => {
              // Calculate priority level based on intensity
              let priorityLabel = 'Low';
              let priorityColor = d.color;
              if (d.intensity >= 10) {
                priorityLabel = 'Urgent';
                priorityColor = '#EF4444'; // Red
              } else if (d.intensity >= 5) {
                priorityLabel = 'High';
                priorityColor = '#F59E0B'; // Orange
              } else if (d.intensity >= 3) {
                priorityLabel = 'Medium';
                priorityColor = '#10B981'; // Green
              }

              return `
                <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin: 8px 0;
                  padding: 6px 0;
                  border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                ">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="
                      width: 10px;
                      height: 10px;
                      background: ${d.color};
                      border-radius: 50%;
                      box-shadow: 0 0 10px ${d.color}77;
                    "></div>
                    <span style="
                      font-size: 12px;
                      font-weight: 500;
                      color: ${isDark ? '#E5E7EB' : '#374151'};
                    ">${d.name.replace(' Division', '')}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="
                      font-size: 11px;
                      font-weight: 600;
                      color: ${priorityColor};
                      background: ${priorityColor}22;
                      padding: 2px 8px;
                      border-radius: 6px;
                    ">${priorityLabel}</span>
                    <span style="
                      font-size: 12px;
                      font-weight: 700;
                      color: ${isDark ? '#F9FAFB' : '#111827'};
                      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
                      padding: 2px 8px;
                      border-radius: 6px;
                    ">${d.intensity}</span>
                  </div>
                </div>
              `;
            }).join('')}
        `;
        return div;
      };
      legend.addTo(mapRef.current);
      legendRef.current = legend;
    };

    updateLegend();
  }, [divisions, isDark, mounted]);

  // Separate effect for markers and search query
  useEffect(() => {
    if (!mounted || !mapRef.current || typeof window === 'undefined') return;

    const updateMarkers = async () => {
      const L = await import('leaflet');

      // Clear existing markers and circles
      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => {
          if (marker && mapRef.current) {
            marker.remove();
          }
        });
        markersRef.current = [];
      }

      if (circlesRef.current.length > 0) {
        circlesRef.current.forEach((circle) => {
          if (circle && mapRef.current) {
            circle.remove();
          }
        });
        circlesRef.current = [];
      }

      // Add updated markers
      const { markers, circles } = addMarkersToMap(
        L,
        mapRef.current,
        divisions,
        isDark,
        searchQuery,
        showDistricts,
        onDivisionClick,
        onDistrictClick
      );

      markersRef.current = markers;
      circlesRef.current = circles;
    };

    updateMarkers();
  }, [divisions, searchQuery, showDistricts, onDivisionClick, onDistrictClick, mounted, isDark]);

  // Fly to selected item
  useEffect(() => {
    if (mapRef.current && selectedItem) {
      const zoomLevel = selectedItem.type === 'district' ? 12 : 10;
      const data = selectedItem.data as any;
      mapRef.current.flyTo([data.lat, data.lng], zoomLevel, {
        duration: 1.8,
        easeLinearity: 0.25
      });
    }
  }, [selectedItem]);

  // Search fly to - Improved search functionality with validation
  useEffect(() => {
    if (mapRef.current && searchQuery) {
      // Find matching division or district
      let matchedItem: SelectedItem | null = null;
      let targetZoom = 9;

      // First try to find exact district match
      for (const division of divisions) {
        for (const district of division.districts) {
          if (district.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            matchedItem = { type: 'district', data: district, division };
            targetZoom = 12;
            break;
          }
        }

        if (matchedItem) break;

        // If no district found, try division
        if (division.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          matchedItem = { type: 'division', data: division };
          targetZoom = 10;
          break;
        }
      }

      if (matchedItem) {
        const data = matchedItem.data as Division | District;
        mapRef.current.flyTo([data.lat, data.lng], targetZoom, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      } else if (searchQuery.trim() && onInvalidSearch) {
        // If no match found and search query is not empty, call invalid search callback
        // But don't zoom the map
        onInvalidSearch();
      }
    }
  }, [searchQuery, divisions, onInvalidSearch]);

  if (!mounted) return (
    <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 animate-pulse" />
  );

  return <div id="map" className="w-full h-full z-0" />;
};

export default function MapSearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [isDark] = useState<boolean>(false);
  const [showDistricts, setShowDistricts] = useState<boolean>(false);
  const [divisionsData, setDivisionsData] = useState<Division[]>(DIVISIONS_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [divisionStats, setDivisionStats] = useState<any>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  // Fetch all divisions stats on mount using comprehensive statistics API
  useEffect(() => {
    const fetchDivisionsStats = async () => {
      try {
        const response = await statisticsAPI.getCompleteMapData();
        console.log('📊 Complete Map Data Response:', response);

        if (response.success && response.data) {
          const updatedDivisions = DIVISIONS_DATA.map(division => {
            const divisionName = division.name.replace(' Division', '');
            const stats = response.data[divisionName];

            if (stats) {
              const updatedDistricts = division.districts.map(district => {
                const districtStats = stats.districts?.find((d: any) =>
                  d.name.toLowerCase() === district.name.toLowerCase()
                );

                if (districtStats) {
                  return {
                    ...district,
                    total: districtStats.total || 0,
                    pending: districtStats.pending || 0,
                    completed: districtStats.completed || 0,
                    priority: districtStats.priority || 'low' as 'high' | 'medium' | 'low'
                  };
                }
                return district;
              });

              return {
                ...division,
                intensity: stats.total || 0,
                trend: stats.trend || '+0%',
                districts: updatedDistricts
              };
            }
            return division;
          });

          console.log('✅ Updated Divisions Data:', updatedDivisions);
          setDivisionsData(updatedDivisions);
        }
      } catch (error) {
        console.error('❌ Error fetching divisions stats:', error);
        setDivisionsData(DIVISIONS_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchDivisionsStats();
  }, []);

  const filteredDivisions = useMemo(() => {
    if (!searchQuery) return divisionsData;

    return divisionsData.filter(division =>
      division.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      division.districts.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, divisionsData]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowDistricts(false);
    setSelectedItem(null);
    setDivisionStats(null);
    setShowAlert(false);
  };

  const handleInvalidSearch = useCallback(() => {
    setAlertMessage(`"${searchQuery}" - এই নামে কোন বিভাগ বা জেলা পাওয়া যায়নি।`);
    setShowAlert(true);
    // Clear selected item and close sidebar for invalid search
    setSelectedItem(null);
    setShowDistricts(false);
    setDivisionStats(null);
    setTimeout(() => setShowAlert(false), 5000);
  }, [searchQuery]);

  const handleDivisionClick = useCallback(async (division: Division) => {
    setSelectedItem({ type: 'division', data: division });
    setShowDistricts(true);

    try {
      const divisionName = division.name.replace(' Division', '');
      const response = await statisticsAPI.getDivisionDistricts(divisionName);

      console.log(`📍 Division Click - ${divisionName}:`, response);

      if (response.success && response.data && response.data.length > 0) {
        const updatedDivision: Division = {
          ...division,
          districts: division.districts.map(district => {
            const stats = response.data.find((s: any) =>
              district.name.toLowerCase() === s.district?.toLowerCase()
            );
            if (stats) {
              return {
                ...district,
                total: stats.total || 0,
                pending: stats.pending || 0,
                completed: stats.completed || 0,
                priority: stats.priority || 'low' as 'high' | 'medium' | 'low',
              };
            }
            return {
              ...district,
              total: 0,
              pending: 0,
              completed: 0,
              priority: 'low' as 'high' | 'medium' | 'low',
            };
          })
        };
        setDivisionStats(updatedDivision);
        setSelectedItem({ type: 'division', data: updatedDivision });

        setDivisionsData(prev => prev.map(d =>
          d.id === division.id ? updatedDivision : d
        ));
      } else {
        const updatedDivision: Division = {
          ...division,
          districts: division.districts.map(district => ({
            ...district,
            total: 0,
            pending: 0,
            completed: 0,
            priority: 'low' as 'high' | 'medium' | 'low',
          }))
        };
        setSelectedItem({ type: 'division', data: updatedDivision });
      }
    } catch (error) {
      console.error('Error fetching division stats:', error);
      const updatedDivision: Division = {
        ...division,
        districts: division.districts.map(district => ({
          ...district,
          total: 0,
          pending: 0,
          completed: 0,
          priority: 'low' as 'high' | 'medium' | 'low',
        }))
      };
      setSelectedItem({ type: 'division', data: updatedDivision });
    }
  }, []);

  const handleDistrictClick = useCallback((district: District, division: Division) => {
    const updatedDistrict: District = {
      ...district,
      total: district.total || 0,
      pending: district.pending || 0,
      completed: district.completed || 0,
      priority: district.priority || 'low',
    };
    setSelectedItem({ type: 'district', data: updatedDistrict, division });
  }, []);

  const handleCloseSidebar = () => {
    setSelectedItem(null);
    setShowDistricts(false);
    setDivisionStats(null);
  };

  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchSummaryStats = async () => {
      try {
        const response = await statisticsAPI.getSummary();
        console.log('📈 Summary Stats Response:', response);

        if (response.success && response.data) {
          setSummaryStats({
            total: response.data.totalReports || 0,
            pending: response.data.totalPending || 0,
            inProgress: response.data.totalInProgress || 0,
            completed: response.data.totalResolved || 0,
            completionRate: response.data.overallCompletionRate || 0
          });
        }
      } catch (error) {
        console.error('❌ Error fetching summary stats:', error);
      }
    };

    fetchSummaryStats();
  }, []);

  const getSearchedLocationData = (query: string): SelectedItem | null => {
    if (!query.trim()) return null;

    const existingMatch = DIVISIONS_DATA.find(division =>
      division.name.toLowerCase().includes(query.toLowerCase()) ||
      division.districts.some(d => d.name.toLowerCase().includes(query.toLowerCase()))
    );

    if (existingMatch) return null;

    const dummyDivision: Division = {
      id: query.toLowerCase().replace(/\s+/g, '-'),
      name: query,
      lat: 23.685,
      lng: 90.3563,
      color: '#6B7280',
      intensity: 0,
      trend: '+0%',
      districts: [
        {
          name: query,
          total: 0,
          pending: 0,
          completed: 0,
          priority: 'low',
          lat: 23.685,
          lng: 90.3563,
          color: '#6B7280'
        }
      ]
    };

    return {
      type: 'division',
      data: dummyDivision
    };
  };

  const searchedLocationData = useMemo(() => {
    return getSearchedLocationData(searchQuery);
  }, [searchQuery]);

  const displayItem = selectedItem || searchedLocationData;

  return (
    <div className={`container mx-auto min-h-screen transition-all duration-500 px-4 ${isDark
        ? 'bg-linear-to-br from-gray-950 via-gray-900 to-gray-950'
        : ''
      }`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" />
      </div>

      <header
        className={`bg-primary relative backdrop-blur-xl ${isDark
            ? ' border-gray-800/50'
            : ''
          } border-t-8 border-accent px-4 md:px-8 py-5 shadow-lg rounded-xl my-5`}
      >
        <div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-5xl font-extrabold text-white mb-2">
                  Search your area
                </h1>
                <p className="text-accent text-lg">
                  Bangladesh Municipal Issue Tracking & Analytics
                </p>
              </div>
            </div>

            <div className="lg:w-[800px] grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              {[
                {
                  label: 'Total Reports',
                  value: summaryStats.total,
                  icon: BarChart3,
                  color: 'from-blue-500 to-blue-600',
                  bgDark: 'bg-blue-500/10',
                  bgLight: 'bg-blue-50'
                },
                {
                  label: 'Pending',
                  value: summaryStats.pending,
                  icon: Clock,
                  color: 'from-orange-500 to-amber-500',
                  bgDark: 'bg-orange-500/10',
                  bgLight: 'bg-orange-50'
                },
                {
                  label: 'In Progress',
                  value: summaryStats.inProgress,
                  icon: Activity,
                  color: 'from-yellow-500 to-orange-500',
                  bgDark: 'bg-yellow-500/10',
                  bgLight: 'bg-yellow-50'
                },
                {
                  label: 'Resolved',
                  value: summaryStats.completed,
                  icon: CheckCircle,
                  color: 'from-green-500 to-emerald-600',
                  bgDark: 'bg-green-500/10',
                  bgLight: 'bg-green-50'
                }
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`${isDark ? stat.bgDark : stat.bgLight
                    } backdrop-blur-sm rounded-xl p-3 border ${isDark ? 'border-gray-800/50' : 'border-gray-200/50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-4 h-4 bg-linear-to-r ${stat.color} bg-clip-text`} strokeWidth={2.5} />
                    <div className={`w-2 h-2 rounded-full bg-linear-to-r ${stat.color}`} />
                  </div>
                  <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {stat.label}
                  </p>
                  <p className={`text-xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="relative h-[calc(100vh-140px)] mb-10">
        {showAlert && (
          <div className="absolute top-24 right-4 md:right-8 left-4 md:left-auto md:w-[420px] z-[1001] animate-in slide-in-from-top duration-300">
            <div className={`p-4 rounded-xl backdrop-blur-xl ${isDark
                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                : 'bg-red-50 border-red-200 text-red-700'
              } border shadow-lg`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-red-500/20' : 'bg-red-100'
                  }`}>
                  <AlertCircle className={`w-4 h-4 ${isDark ? 'text-red-300' : 'text-red-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{alertMessage}</p>
                  <p className="text-xs opacity-80 mt-1">
                    দয়া করে সঠিক বিভাগ বা জেলার নাম লিখুন
                  </p>
                </div>
                <button
                  onClick={() => setShowAlert(false)}
                  className={`p-1 rounded-lg ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-100'
                    }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-6 right-4 md:right-8 left-4 md:left-auto md:w-[420px] z-[1000] flex gap-3">
          <div className={`flex-1 relative backdrop-blur-xl ${isDark
              ? 'bg-gray-900/90 border-gray-700/50'
              : 'bg-white/90 border-gray-200/50'
            } rounded-2xl shadow-2xl border`}>
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search divisions or districts (e.g., Narayanganj, Dhaka)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${isDark
                  ? 'bg-transparent text-white placeholder-gray-500'
                  : 'bg-transparent text-gray-900 placeholder-gray-400'
                } font-medium`}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                title="Clear search"
                aria-label="Clear search"
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg ${isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  } transition-all`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full h-full">
          <DynamicMap
            divisions={filteredDivisions}
            selectedItem={selectedItem}
            onDivisionClick={handleDivisionClick}
            onDistrictClick={handleDistrictClick}
            isDark={isDark}
            searchQuery={searchQuery}
            showDistricts={showDistricts || searchQuery.length > 0}
            onInvalidSearch={handleInvalidSearch}
          />
        </div>

        {displayItem && (
          <>
            <div
              onClick={handleCloseSidebar}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[999]"
            />

            <div
              className={`absolute top-0 left-0 w-full md:w-[460px] h-full ${isDark
                  ? 'bg-linear-to-b from-gray-900/98 via-gray-900/95 to-gray-950/98'
                  : 'bg-linear-to-b from-white/98 via-white/95 to-gray-50/98'
                } backdrop-blur-2xl shadow-2xl z-[1000] overflow-hidden flex flex-col border-r ${isDark ? 'border-gray-800/50' : 'border-gray-200/50'
                }`}
            >
              <div className="relative p-6 pb-8">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${displayItem.type === 'district'
                        ? (displayItem.division as Division)?.color || '#6B7280'
                        : (displayItem.data as Division).color
                      }44 0%, transparent 100%)`
                  }}
                />

                <div className="relative flex justify-between items-start mb-6 bg-white px-2 py-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${displayItem.type === 'district'
                            ? (displayItem.division as Division)?.color || '#6B7280'
                            : (displayItem.data as Division).color
                          } 0%, ${displayItem.type === 'district'
                            ? (displayItem.division as Division)?.color || '#6B7280'
                            : (displayItem.data as Division).color
                          }dd 100%)`
                      }}
                    >
                      <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        {displayItem.data.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {displayItem.type === 'division'
                            ? `${(displayItem.data as Division).districts.length} Districts`
                            : `District of ${(displayItem.division as Division)?.name || 'Unknown'}`
                          }
                        </span>
                        <span className="text-gray-400">•</span>
                        <span
                          className="text-sm font-semibold flex items-center gap-1"
                          style={{
                            color: displayItem.type === 'district'
                              ? (displayItem.division as Division)?.color || '#6B7280'
                              : (displayItem.data as Division).color
                          }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {displayItem.type === 'division'
                            ? (displayItem.data as Division).trend
                            : '+0%'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseSidebar}
                    title="Close sidebar"
                    aria-label="Close sidebar"
                    className={`p-2.5 rounded-xl ${isDark
                        ? 'hover:bg-gray-800/80 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      } transition-all`}
                  >
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="relative grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Total',
                      value: displayItem.type === 'division'
                        ? (displayItem.data as Division).districts.reduce((a, d) => a + d.total, 0)
                        : (displayItem.data as District).total,
                      icon: BarChart3,
                      gradient: 'from-blue-500 to-blue-600',
                      bgDark: 'bg-blue-500/10',
                      bgLight: 'bg-blue-50'
                    },
                    {
                      label: 'Pending',
                      value: displayItem.type === 'division'
                        ? (displayItem.data as Division).districts.reduce((a, d) => a + d.pending, 0)
                        : (displayItem.data as District).pending,
                      icon: Clock,
                      gradient: 'from-orange-500 to-amber-500',
                      bgDark: 'bg-orange-500/10',
                      bgLight: 'bg-orange-50'
                    },
                    {
                      label: 'Resolved',
                      value: displayItem.type === 'division'
                        ? (displayItem.data as Division).districts.reduce((a, d) => a + d.completed, 0)
                        : (displayItem.data as District).completed,
                      icon: CheckCircle,
                      gradient: 'from-green-500 to-emerald-600',
                      bgDark: 'bg-green-500/10',
                      bgLight: 'bg-green-50'
                    }
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`p-3 text-center rounded-xl ${isDark ? stat.bgDark : stat.bgLight
                        } border ${isDark ? 'border-gray-800/50' : 'border-gray-200/30'
                        } backdrop-blur-sm`}
                    >
                      <stat.icon className={`mx-auto w-4 h-4 mb-2 bg-linear-to-r ${stat.gradient} bg-clip-text`} strokeWidth={2.5} />
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {stat.label}
                      </p>
                      <p className={`text-2xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {displayItem.type === 'division' ? (
                <>
                  <div className={`px-6 pb-3 border-b ${isDark ? 'border-gray-800/50' : 'border-gray-200/50'
                    }`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        District Overview
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                          {(displayItem.data as Division).districts.length} Locations
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
                    {(displayItem.data as Division).districts.map((district, index) => {
                      const completionPercent = district.total > 0
                        ? Math.round((district.completed / district.total) * 100)
                        : 0;
                      const priorityColors = {
                        high: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
                        medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20' },
                        low: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' }
                      };
                      const priority = priorityColors[district.priority] || priorityColors.low;

                      return (
                        <div
                          key={district.name}
                          className={`group relative p-5 rounded-2xl border ${isDark
                              ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80'
                              : 'bg-white/80 border-gray-200/50 hover:bg-white'
                            } backdrop-blur-sm transition-all cursor-pointer overflow-hidden`}
                          onClick={() => handleDistrictClick(district, displayItem.data as Division)}
                        >
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
                            style={{
                              background: `linear-gradient(135deg, ${(displayItem.data as Division).color} 0%, transparent 100%)`
                            }}
                          />

                          <div className="relative">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                  {district.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-md font-medium uppercase ${priority.bg} ${priority.text} ${priority.border} border`}>
                                    {district.priority} Priority
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                  Completion
                                </div>
                                <div className="text-2xl font-bold" style={{ color: (displayItem.data as Division).color }}>
                                  {completionPercent}%
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'
                                }`}>
                                <Activity className={`w-4 h-4 mx-auto mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`} strokeWidth={2.5} />
                                <div className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'
                                  }`}>
                                  Total
                                </div>
                                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                  {district.total}
                                </div>
                              </div>
                              <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'
                                }`}>
                                <Clock className={`w-4 h-4 mx-auto mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'
                                  }`} strokeWidth={2.5} />
                                <div className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'
                                  }`}>
                                  Pending
                                </div>
                                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                  {district.pending}
                                </div>
                              </div>
                              <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'
                                }`}>
                                <CheckCircle className={`w-4 h-4 mx-auto mb-1 ${isDark ? 'text-green-400' : 'text-green-600'
                                  }`} strokeWidth={2.5} />
                                <div className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'
                                  }`}>
                                  Done
                                </div>
                                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                  {district.completed}
                                </div>
                              </div>
                            </div>

                            <div className={`relative w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-900/50' : 'bg-gray-200'
                              }`}>
                              <div
                                className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                                style={{
                                  width: `${completionPercent}%`,
                                  background: `linear-gradient(90deg, ${(displayItem.data as Division).color} 0%, ${(displayItem.data as Division).color}cc 100%)`
                                }}
                              />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                Click to view details
                              </span>
                              <button
                                className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${isDark
                                    ? 'text-blue-400 hover:bg-blue-500/10'
                                    : 'text-blue-600 hover:bg-blue-50'
                                  }`}
                                style={{ color: (displayItem.data as Division).color }}
                              >
                                View Map
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                  <div className={`p-6 rounded-2xl border ${isDark
                      ? 'bg-gray-800/50 border-gray-700/50'
                      : 'bg-white/80 border-gray-200/50'
                    } backdrop-blur-sm`}
                  >
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                      District Performance
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Report Resolution Rate
                        </span>
                        <span className="font-bold" style={{ color: (displayItem.division as Division)?.color || '#6B7280' }}>
                          {(displayItem.data as District).total > 0
                            ? Math.round(((displayItem.data as District).completed / (displayItem.data as District).total) * 100)
                            : 0}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Average Resolution Time
                        </span>
                        <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {(displayItem.data as District).total > 0 ? '3.2 days' : 'No data'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Citizen Satisfaction
                        </span>
                        <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {(displayItem.data as District).total > 0 ? '87%' : 'No data'}
                        </span>
                      </div>
                    </div>

                    {(displayItem.data as District).total > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-700/50">
                        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          Recent Activities
                        </h4>
                        <div className="space-y-2">
                          {['Road repair completed', 'New complaint registered', 'Water supply issue resolved']
                            .map((activity, i) => (
                              <div key={i} className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: (displayItem.division as Division)?.color || '#6B7280' }}
                                />
                                {activity}
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={`p-5 border-t ${isDark ? 'border-gray-800/50 bg-gray-900/50' : 'border-gray-200/50 bg-gray-50/50'
                } backdrop-blur-sm`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                    }`}>
                    <Info className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'
                      }`} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                      {displayItem.type === 'division' ? 'Division Overview' : 'District Insights'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                      {displayItem.type === 'division'
                        ? 'Click on any district to view detailed performance metrics and recent activities.'
                        : 'Real-time data synced with municipal reporting systems. Updated every 15 minutes.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(75, 85, 99, 0.8)' : 'rgba(156, 163, 175, 0.8)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(107, 114, 128, 1)'};
        }
        .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip:before {
          display: none !important;
        }
      `}</style>
    </div>
  );
}