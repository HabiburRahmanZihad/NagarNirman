"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, X, MapPin, Activity, CheckCircle, Clock, Info, Filter, AlertCircle, Zap } from 'lucide-react';
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
}

const transformDivisionsData = (): Division[] => {
  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#EF4444',
    '#06B6D4'
  ];

  return divisionsDataJson.map((divisionData, index) => ({
    id: divisionData.division.toLowerCase().replace(/\s+/g, '-'),
    name: `${divisionData.division} Division`,
    lat: divisionData.latitude,
    lng: divisionData.longitude,
    color: colors[index % colors.length],
    intensity: 0,
    trend: '+0%',
    districts: divisionData.districts.map((district) => ({
      name: district.name,
      total: 0,
      pending: 0,
      completed: 0,
      priority: 'low' as 'high' | 'medium' | 'low',
      lat: district.latitude,
      lng: district.longitude,
      color: colors[index % colors.length]
    }))
  }));
};

const DIVISIONS_DATA: Division[] = transformDivisionsData();

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
  const shouldShowAllMarkers = searchQuery.length > 0;

  divisions.forEach((division) => {
    const divisionMatchesSearch = division.name.toLowerCase().includes(searchQuery.toLowerCase());
    const districtMatchesSearch = division.districts.some(d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!shouldShowAllMarkers || divisionMatchesSearch || districtMatchesSearch) {
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
            background: linear-linear(135deg, ${division.color} 0%, ${division.color}dd 100%);
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
        .on('click', () => onDivisionClick(division));

      markers.push(divisionMarker);

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

    division.districts.forEach((district) => {
      const districtMatchesSearch = district.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (shouldShowAllMarkers || showDistricts || districtMatchesSearch) {
        if (searchQuery.length > 0 && !districtMatchesSearch && !division.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return;
        }

        const districtMarkerHtml = `
          <div style="position: relative; width: 30px; height: 30px;">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 16px;
              height: 16px;
              background: linear-linear(135deg, ${district.color} 0%, ${district.color}dd 100%);
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
          .on('click', () => onDistrictClick(district, division));

        markers.push(districtMarker);
      }
    });
  });

  return { markers, circles };
};

const DynamicMap: React.FC<DynamicMapProps> = ({
  divisions,
  selectedItem,
  onDivisionClick,
  onDistrictClick,
  isDark,
  searchQuery,
  showDistricts
}) => {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);
  const legendRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      cleanupMap();

      const L = await import('leaflet');

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const container = document.getElementById('map');
      if (!container) return;

      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }

      const mapInstance = L.map('map', {
        zoomControl: false,
        attributionControl: false
      }).setView([23.685, 90.3563], 8);

      mapRef.current = mapInstance;

      const tileLayer = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileLayer, {
        maxZoom: 18,
      }).addTo(mapInstance);

      L.control.zoom({ position: 'bottomleft' }).addTo(mapInstance);

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
    };

    initMap();

    return () => {
      cleanupMap();
    };
  }, [mounted, isDark]);

  useEffect(() => {
    if (!mounted || !mapRef.current || typeof window === 'undefined') return;

    const updateMarkers = async () => {
      const L = await import('leaflet');

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

  if (!mounted) return (
    <div className="w-full h-full bg-linear-to-br from-base-200 to-base-300 animate-pulse" />
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
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterCompletion, setFilterCompletion] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Fetch divisions stats
  useEffect(() => {
    const fetchDivisionsStats = async () => {
      try {
        const response = await statisticsAPI.getCompleteMapData();

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

          setDivisionsData(updatedDivisions);
        }
      } catch (error) {
        console.error('Error fetching divisions stats:', error);
        setDivisionsData(DIVISIONS_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchDivisionsStats();
  }, []);

  // Fetch summary stats
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

        if (response.success && response.data) {
          setSummaryStats({
            total: response.data.totalReports || 0,
            pending: response.data.totalPending || 0,
            inProgress: response.data.totalInProgress || 0,
            completed: response.data.totalResolved || 0,
            completionRate: response.data.overallCompletionRate || 0
          });
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Error fetching summary stats:', error);
      }
    };

    fetchSummaryStats();
    const interval = setInterval(fetchSummaryStats, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredDivisions = useMemo(() => {
    if (!searchQuery) return divisionsData;

    return divisionsData.filter(division =>
      division.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      division.districts.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, divisionsData]);

  // Filter districts in sidebar
  const filteredDistricts = useMemo(() => {
    if (!selectedItem || selectedItem.type === 'district') return [];

    const division = selectedItem.data as Division;
    let filtered = division.districts;

    if (sidebarSearch) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(sidebarSearch.toLowerCase())
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(d => d.priority === filterPriority);
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'pending') {
        filtered = filtered.filter(d => d.pending > 0);
      } else if (filterStatus === 'completed') {
        filtered = filtered.filter(d => d.completed > 0);
      }
    }

    if (filterCompletion > 0) {
      filtered = filtered.filter(d => {
        const completion = d.total > 0 ? (d.completed / d.total) * 100 : 0;
        return completion >= filterCompletion;
      });
    }

    return filtered.sort((a, b) => {
      const aCompletion = a.total > 0 ? (a.completed / a.total) * 100 : 0;
      const bCompletion = b.total > 0 ? (b.completed / b.total) * 100 : 0;
      return bCompletion - aCompletion;
    });
  }, [selectedItem, sidebarSearch, filterPriority, filterStatus, filterCompletion]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowDistricts(false);
    setSelectedItem(null);
  };

  const handleDivisionClick = useCallback(async (division: Division) => {
    setSelectedItem({ type: 'division', data: division });
    setShowDistricts(true);
    setSidebarSearch('');
    setFilterPriority('all');
    setFilterStatus('all');
    setFilterCompletion(0);

    try {
      const divisionName = division.name.replace(' Division', '');
      const response = await statisticsAPI.getDivisionDistricts(divisionName);

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
        setSelectedItem({ type: 'division', data: updatedDivision });

        setDivisionsData(prev => prev.map(d =>
          d.id === division.id ? updatedDivision : d
        ));
      }
    } catch (error) {
      console.error('Error fetching division stats:', error);
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
    setSidebarSearch('');
    setFilterPriority('all');
    setFilterStatus('all');
    setFilterCompletion(0);
    setShowFilters(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error/10 text-error border-error/30';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/30';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'from-success to-info';
    if (completion >= 50) return 'from-warning to-success';
    return 'from-error to-warning';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100 container mx-auto ">
      {/* Header */}
      <header className="z-40 border-b border-base-200/60 bg-base-100/95 backdrop-blur-2xl sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-8">
            {/* Title */}
            <div className="w-full lg:w-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-info">
                Search Your Area
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-lg font-medium text-neutral">
                Bangladesh Municipal Issue Tracking • Real-time Analytics
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full lg:w-auto">
              {[
                { label: "Total", value: summaryStats.total, icon: Activity },
                { label: "Pending", value: summaryStats.pending, icon: Clock },
                { label: "In Progress", value: summaryStats.inProgress, icon: Zap },
                { label: "Resolved", value: summaryStats.completed, icon: CheckCircle },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-base-200 border border-base-300/60 hover:border-primary/30 transition-all duration-500 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-primary" strokeWidth={2.5} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-neutral uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-lg sm:text-3xl font-black text-info mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main View */}
      <div className="relative h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] mb-6 sm:mb-12  sm:mx-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-base-200/60">
        {/* Floating Search - Moved to LEFT */}
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-full max-w-xs sm:max-w-sm z-100 px-0 sm:px-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-secondary/10 to-primary/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-700" />
            <div className="relative bg-base-100/95 backdrop-blur-3xl border border-base-300/80 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
              <Search className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 text-neutral" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search division, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 sm:pl-16 pr-12 sm:pr-16 py-3 sm:py-6 text-sm sm:text-lg font-medium bg-transparent focus:outline-none text-info placeholder:text-neutral/60"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full hover:bg-base-200/60 transition"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="absolute inset-0">
          <DynamicMap
            divisions={filteredDivisions}
            selectedItem={selectedItem}
            onDivisionClick={handleDivisionClick}
            onDistrictClick={handleDistrictClick}
            isDark={isDark}
            searchQuery={searchQuery}
            showDistricts={showDistricts || searchQuery.length > 0}
          />
        </div>

        {/* Sidebar */}
        {selectedItem && (
          <>
            <div
              onClick={handleCloseSidebar}
              className="fixed inset-0 bg-black/40 backdrop-blur-xl z-40 animate-fadeIn"
            />
            {/* Mobile Sidebar */}
            <aside className="md:hidden fixed inset-0 left-0 top-[108px] h-[calc(100vh-108px)] w-80 z-98 bg-base-100/98 backdrop-blur-3xl border-r border-base-300/60 shadow-2xl animate-slideInLeft flex flex-col overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="shrink-0 p-4 sm:p-8 border-b border-base-300/40 bg-linear-to-br from-primary/5 to-secondary/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary to-secondary shadow-lg shrink-0 flex items-center justify-center">
                      <MapPin className="w-6 h-6 sm:w-10 sm:h-10 text-white" strokeWidth={3} />
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white/20 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-3xl font-black text-info tracking-tight truncate">
                        {selectedItem.data.name}
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-neutral mt-1">
                        {selectedItem.type === "division"
                          ? `${(selectedItem.data as Division).districts.length} Districts`
                          : `District • ${(selectedItem.division as Division)?.name.replace(' Division', '')}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseSidebar}
                    className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-base-200/60 hover:bg-base-300/80 transition shrink-0"
                    aria-label="Close sidebar"
                    title="Close sidebar"
                  >
                    <X className="w-4 h-4 sm:w-6 sm:h-6 text-neutral" />
                  </button>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8">
                  {[
                    { label: "Total", value: selectedItem.type === "division" ? (selectedItem.data as Division).districts.reduce((a, d) => a + d.total, 0) : (selectedItem.data as District).total },
                    { label: "Pending", value: selectedItem.type === "division" ? (selectedItem.data as Division).districts.reduce((a, d) => a + d.pending, 0) : (selectedItem.data as District).pending },
                    { label: "Resolved", value: selectedItem.type === "division" ? (selectedItem.data as Division).districts.reduce((a, d) => a + d.completed, 0) : (selectedItem.data as District).completed },
                  ].map((s) => (
                    <div key={s.label} className="p-3 sm:p-5 rounded-lg sm:rounded-2xl bg-base-200/50 border border-base-300/60">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral">{s.label}</p>
                      <p className="text-2xl sm:text-3xl font-black text-info mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Search & Filters */}
              {selectedItem.type === 'division' && (
                <div className="shrink-0 p-4 sm:p-6 border-b border-base-300/40 space-y-3 sm:space-y-4">
                  {/* Search in sidebar */}
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral" strokeWidth={2.5} />
                    <input
                      type="text"
                      placeholder="Filter districts..."
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      className="w-full pl-9 sm:pl-12 pr-4 py-2 sm:py-3 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-base-200 border border-base-300/60 focus:outline-none focus:border-primary/50 text-info placeholder:text-neutral/60"
                      aria-label="Search districts"
                    />
                  </div>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full flex items-center justify-between px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition text-primary font-semibold text-sm sm:text-base"
                    aria-label={showFilters ? "Hide filters" : "Show filters"}
                    title={showFilters ? "Hide filters" : "Show filters"}
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Filters</span>
                    </div>
                    {showFilters ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>

                  {/* Filters */}
                  {showFilters && (
                    <div className="space-y-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-base-200/50 border border-base-300/60">
                      {/* Priority Filter */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral block mb-2">Priority</label>
                        <select
                          value={filterPriority}
                          onChange={(e) => setFilterPriority(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-base-100 border border-base-300/60 focus:outline-none focus:border-primary text-info"
                          aria-label="Filter by priority"
                        >
                          <option value="all">All Priorities</option>
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                        </select>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral block mb-2">Status</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-base-100 border border-base-300/60 focus:outline-none focus:border-primary text-info"
                          aria-label="Filter by status"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending Issues</option>
                          <option value="completed">Completed Issues</option>
                        </select>
                      </div>

                      {/* Completion Filter */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral block mb-2">Min. Completion: {filterCompletion}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={filterCompletion}
                          onChange={(e) => setFilterCompletion(Number(e.target.value))}
                          className="w-full accent-primary"
                          aria-label="Minimum completion percentage"
                        />
                      </div>
                    </div>
                  )}

                  {/* Live Update Indicator */}
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-success/10 border border-success/30">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-semibold text-success">Live • {lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 custom-scrollbar">
                {selectedItem.type === "division" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-info flex items-center gap-3">
                        <div className="w-1 h-6 sm:h-8 bg-primary rounded-full" />
                        Districts ({filteredDistricts.length})
                      </h3>
                    </div>

                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((district) => {
                        const completion = district.total > 0 ? Math.round((district.completed / district.total) * 100) : 0;

                        return (
                          <div
                            key={district.name}
                            onClick={() => handleDistrictClick(district, selectedItem.data as Division)}
                            className="group p-4 sm:p-6 rounded-lg sm:rounded-2xl bg-base-200/50 border border-base-300/60 hover:border-primary/50 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                          >
                            <div className="flex justify-between items-start mb-3 sm:mb-5 gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm sm:text-xl font-bold text-info truncate">{district.name}</h4>
                                <span className={`mt-1 sm:mt-2 inline-block px-2 sm:px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getPriorityColor(district.priority)}`}>
                                  {district.priority}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-2xl sm:text-4xl font-black text-primary">{completion}%</p>
                                <p className="text-xs text-neutral">Resolved</p>
                              </div>
                            </div>

                            {/* Mini Stats */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-5 text-center">
                              {[
                                { label: "Total", value: district.total },
                                { label: "Pending", value: district.pending },
                                { label: "Done", value: district.completed },
                              ].map((st) => (
                                <div key={st.label}>
                                  <p className="text-lg sm:text-2xl font-black text-info">{st.value}</p>
                                  <p className="text-xs text-neutral mt-1">{st.label}</p>
                                </div>
                              ))}
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 sm:h-3 bg-base-300/60 rounded-full overflow-hidden">
                              <div
                                // eslint-disable-next-line
                                className={`h-full rounded-full transition-all duration-1500 ease-out bg-linear-to-r ${getCompletionColor(completion)}`}
                                style={{
                                  width: `${completion}%`
                                }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 sm:p-8 rounded-lg sm:rounded-2xl bg-base-200/50 border border-base-300/60 text-center">
                        <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-neutral/40 mx-auto mb-3" />
                        <p className="text-neutral font-medium text-xs sm:text-sm">No districts match your filters</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 sm:p-8 rounded-lg sm:rounded-2xl bg-linear-to-br from-primary/5 to-secondary/5 border border-primary/20 space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-info">District Insights</h3>

                    {/* Detailed Stats */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-base-100/50">
                        <span className="font-medium text-sm sm:text-base text-neutral">Resolution Rate</span>
                        <span className="font-black text-xl sm:text-3xl text-primary">
                          {((selectedItem.data as District).completed / (selectedItem.data as District).total * 100 || 0).toFixed(0)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-base-100/50">
                        <span className="font-medium text-sm sm:text-base text-neutral">Total Issues</span>
                        <span className="font-black text-xl sm:text-3xl text-info">{(selectedItem.data as District).total}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-base-100/50">
                        <span className="font-medium text-sm sm:text-base text-neutral">Pending</span>
                        <span className="font-black text-xl sm:text-3xl text-warning">{(selectedItem.data as District).pending}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-base-100/50">
                        <span className="font-medium text-sm sm:text-base text-neutral">Resolved</span>
                        <span className="font-black text-xl sm:text-3xl text-success">{(selectedItem.data as District).completed}</span>
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <div className={`p-4 rounded-lg border ${getPriorityColor((selectedItem.data as District).priority)}`}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1">Priority Level</p>
                      <p className="text-lg sm:text-xl font-black capitalize">{(selectedItem.data as District).priority} Priority</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="shrink-0 p-4 sm:p-6 border-t border-base-300/40 bg-base-100/80 backdrop-blur-xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-2xl bg-primary/10 shrink-0">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-info text-xs sm:text-sm">Live Data • Updated Every 15 Minutes</p>
                    <p className="text-xs text-neutral">Powered by Bangladesh Municipal Systems</p>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}
      </div>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slideInRight { animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--p) / 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--p) / 0.5); }
      `}</style>
    </div>
  );
}