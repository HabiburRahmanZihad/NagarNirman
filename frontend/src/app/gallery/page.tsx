'use client';

import { useState, useEffect, useCallback } from 'react';

interface Report {
  _id?: string;
  title: string;
  description: string;
  images: string[];
  problemType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Resolved';
  location: {
    address: string;
    district: string;
  };
  createdAt: string;
}

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  tag: string;
  location: string;
  date: string;
  problemType: string;
  status: string;
  description?: string;
  address?: string;
  severity?: string;
  fullDate?: string;
}

const GalleryPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract unique problem types for filters
  const [filters, setFilters] = useState<string[]>(['All']);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/reports');
      
      if (!response.ok) {
        throw new Error(`Failed to load reports (${response.status})`);
      }
      
      const data = await response.json();
      const reportsData = Array.isArray(data) ? data : 
                         data?.data ? data.data : 
                         data?.reports ? data.reports : [];
      
      setReports(reportsData);
      
      // Convert reports to gallery items
      const items: GalleryItem[] = [];
      reportsData.forEach((report, reportIndex) => {
        if (report.images && report.images.length > 0) {
          report.images.forEach((img, imgIndex) => {
            const date = new Date(report.createdAt);
            items.push({
              id: `${report._id || reportIndex}-${imgIndex}`,
              src: img,
              title: report.title,
              tag: report.status,
              location: report.location.district,
              date: date.toLocaleDateString('en-BD', {
                month: 'short',
                year: 'numeric'
              }),
              problemType: report.problemType,
              status: report.status,
              description: report.description,
              address: report.location.address,
              severity: report.severity,
              fullDate: date.toLocaleDateString('en-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            });
          });
        }
      });
      
      setGalleryItems(items);
      
      // Extract unique problem types for filters
      const uniqueTypes = ['All', ...new Set(reportsData.map(r => r.problemType))];
      setFilters(uniqueTypes);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Filter gallery items
  const filteredItems = activeFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.problemType === activeFilter);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  // Open lightbox
  const openLightbox = (item: GalleryItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id);
    setCurrentIndex(index);
    setSelectedItem(item);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };

  // Navigate lightbox
  const navigateLightbox = (direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
    }
    
    setCurrentIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentIndex]);

  // Get status color with enhanced styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        accent: '#059669'
      };
      case 'In Progress': return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        accent: '#2563eb'
      };
      case 'Pending': return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        accent: '#d97706'
      };
      default: return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        accent: '#6b7280'
      };
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate stats
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthReports = reports.filter(report => {
    const reportDate = new Date(report.createdAt);
    return reportDate.getMonth() === thisMonth && reportDate.getFullYear() === thisYear;
  });

  // Get districts for subtitle
  const uniqueDistricts = [...new Set(reports.map(r => r.location.district))].slice(0, 3);
  const subtitleDistricts = uniqueDistricts.length > 0 
    ? uniqueDistricts.join(', ')
    : 'various districts';

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header + filters - Improved with better typography */}
        <div className="flex flex-col gap-8">
          <div className="space-y-3">
            {/* Subtitle with accent color */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: '#f2a921' }}></div>
              <p className="text-sm font-semibold tracking-wider" style={{ color: '#004d40' }}>
                COMMUNITY GALLERY
              </p>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            
            {/* Main Title with gradient */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Visual Evidence of Civic Action
              </span>
            </h2>
            
            {/* Subtitle with improved text */}
            <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
              Witness the impact through documented evidence from {subtitleDistricts}. 
              Each photo represents a step towards better urban living and community engagement.
            </p>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: '#004d40' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Filter by issue type:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.map((label) => {
                const active = activeFilter === label;
                const statusColors = getStatusColor(label === 'All' ? 'Resolved' : 'Pending');
                
                return (
                  <button
                    type="button"
                    aria-label={`Filter by ${label}`}
                    aria-pressed={active ? "true" : "false"}
                    key={label}
                    onClick={() => {
                      setActiveFilter(label);
                      setVisibleCount(8);
                    }}
                    className={[
                      "px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300 flex items-center gap-2",
                      active
                        ? "shadow-lg transform -translate-y-0.5"
                        : "hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300",
                    ].join(" ")}
                    style={active ? { 
                      backgroundColor: '#004d40',
                      borderColor: '#004d40',
                      color: 'white'
                    } : {
                      backgroundColor: 'white',
                      color: '#004d40',
                      borderColor: '#e5e7eb'
                    }}
                  >
                    {label === 'All' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    )}
                    {label}
                    {active && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error State - Improved */}
        {error && (
          <div className="rounded-2xl border p-8 text-center" style={{ 
            borderColor: '#fee2e2',
            backgroundColor: '#fef2f2' 
          }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#fee2e2' }}>
              <svg className="w-8 h-8" style={{ color: '#dc2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#dc2626' }}>Unable to Load Gallery</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchReports}
              className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
              style={{ backgroundColor: '#004d40' }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </span>
            </button>
          </div>
        )}

        {/* Gallery Grid - Enhanced Card Design */}
        {!error && visibleItems.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center" style={{ 
            borderColor: '#e5e7eb',
            backgroundColor: '#f9fafb' 
          }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#f3f4f6' }}>
              <svg className="w-10 h-10" style={{ color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#111827' }}>No Photos Available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              No images found for this category. Try selecting a different filter or check back later for new submissions.
            </p>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-6 py-3 rounded-lg font-medium border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
              style={{
                borderColor: '#004d40',
                color: '#004d40',
                backgroundColor: 'white'
              }}
            >
              Show All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleItems.map((item) => {
              const statusColors = getStatusColor(item.status);
              
              return (
                <div
                  key={item.id}
                  onClick={() => openLightbox(item)}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Image */}
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
                    
                    {/* Top Info Bar */}
                    <div className="absolute top-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        {/* Status Badge - Improved */}
                        <div 
                          className="px-3 py-1.5 rounded-full backdrop-blur-sm border"
                          style={{ 
                            backgroundColor: `${statusColors.accent}15`,
                            borderColor: `${statusColors.accent}30`,
                            color: statusColors.accent
                          }}
                        >
                          <span className="text-xs font-semibold tracking-wide flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors.accent }}></div>
                            {item.status}
                          </span>
                        </div>
                        
                        {/* Severity Badge - Improved */}
                        <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                          <span className="text-xs font-semibold text-white">
                            {item.severity || 'Medium'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Content - Enhanced */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {/* Issue Type */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider mb-2" 
                          style={{ 
                            backgroundColor: '#f2a921',
                            color: '#000'
                          }}
                        >
                          {item.problemType}
                        </span>
                      </div>
                      
                      {/* Title - Improved Typography */}
                      <h3 className="text-xl font-bold text-white mb-3 leading-tight line-clamp-2 group-hover:line-clamp-3 transition-all">
                        {item.title}
                      </h3>
                      
                      {/* Location & Date - Enhanced */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" style={{ color: '#f2a921' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="text-sm font-medium text-white/90">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" style={{ color: '#f2a921' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-white/90">{item.date}</span>
                        </div>
                      </div>
                      
                      {/* View Button - Enhanced */}
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <div className="inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                          style={{ 
                            backgroundColor: '#004d40',
                            color: 'white'
                          }}
                        >
                          <span className="flex items-center gap-2">
                            View Full Details
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Glow Effect on Hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More - Enhanced */}
        {hasMore && !error && (
          <div className="flex justify-center pt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 8)}
              className="px-8 py-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 group"
              style={{
                backgroundColor: '#004d40',
                color: 'white'
              }}
            >
              <span className="flex items-center gap-3">
                Load More Photos
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
        )}

        {/* Stats Card - Enhanced */}
        <div className="rounded-2xl p-8 mt-12" style={{ 
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0'
        }}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-6 rounded-full" style={{ backgroundColor: '#004d40' }}></div>
                <p className="text-sm font-semibold tracking-wider" style={{ color: '#004d40' }}>
                  TRANSPARENCY IN ACTION
                </p>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Verified Impact, Documented Progress
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every photo is geo-tagged and timestamped by our ward verification teams. 
                This ensures accountability and allows citizens to track real progress in their communities.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold mb-2 flex items-baseline gap-1">
                  <span style={{ color: '#004d40' }}>{thisMonthReports.length}</span>
                  <span className="text-lg text-gray-500">drops</span>
                </div>
                <div className="text-sm font-medium text-gray-900">This Month's Activity</div>
                <div className="text-sm text-gray-600 mt-1">Curated by {new Set(thisMonthReports.map(r => r.location.district)).length} district leads</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold mb-2 flex items-baseline gap-1">
                  <span style={{ color: '#004d40' }}>{galleryItems.length}</span>
                  <span className="text-lg text-gray-500">photos</span>
                </div>
                <div className="text-sm font-medium text-gray-900">Visual Evidence</div>
                <div className="text-sm text-gray-600 mt-1">From {reports.length} verified community reports</div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-gray-900">Have evidence of community work?</h4>
                <p className="text-gray-600">Help us build the most comprehensive civic action gallery in Bangladesh.</p>
              </div>
              <button
                onClick={() => window.location.href = '/report'}
                className="px-8 py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                style={{
                  backgroundColor: '#f2a921',
                  color: '#000'
                }}
              >
                <span className="flex items-center gap-3">
                  Submit Your Evidence
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      {lightboxOpen && selectedItem && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          />
          
          {/* Lightbox Container */}
          <div className="relative z-10 h-full flex flex-col p-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-white font-medium bg-white/10 px-3 py-1.5 rounded-lg">
                  {currentIndex + 1} / {filteredItems.length}
                </span>
                <span className="text-sm text-gray-300">
                  {selectedItem.problemType}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
                  style={{ color: '#f2a921' }}
                  aria-label="Previous photo"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => navigateLightbox('next')}
                  className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
                  style={{ color: '#f2a921' }}
                  aria-label="Next photo"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={closeLightbox}
                  className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white group ml-2"
                  aria-label="Close lightbox"
                >
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
              {/* Image Section */}
              <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 p-4">
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Details Panel - Enhanced */}
              <div className="lg:w-96 flex flex-col bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <div className="space-y-6">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-4 py-2 rounded-lg font-medium ${getStatusColor(selectedItem.status).bg} ${getStatusColor(selectedItem.status).text}`}>
                      {selectedItem.status}
                    </span>
                    <span className="px-4 py-2 rounded-lg font-medium bg-gray-800 text-white">
                      {selectedItem.problemType}
                    </span>
                    <span className={`px-4 py-2 rounded-lg font-medium ${getSeverityColor(selectedItem.severity || 'Medium')}`}>
                      {selectedItem.severity || 'Medium'}
                    </span>
                  </div>

                  {/* Title and Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{selectedItem.title}</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#f2a921' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{selectedItem.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#f2a921' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{selectedItem.fullDate || selectedItem.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedItem.description && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#f2a921' }}></div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Issue Description</h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{selectedItem.description}</p>
                    </div>
                  )}

                  {/* Address */}
                  {selectedItem.address && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#f2a921' }}></div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Exact Location</h4>
                      </div>
                      <p className="text-gray-300">{selectedItem.address}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-6 border-t border-gray-700/50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => window.open(selectedItem.src, '_blank')}
                        className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                        style={{
                          backgroundColor: '#004d40',
                          color: 'white'
                        }}
                      >
                        Open Full Size
                      </button>
                      <button
                        onClick={() => window.location.href = '/report'}
                        className="flex-1 px-6 py-3 rounded-lg font-medium border transition-all duration-300 hover:shadow-lg"
                        style={{
                          borderColor: '#f2a921',
                          color: '#f2a921',
                          backgroundColor: 'transparent'
                        }}
                      >
                        Report Similar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-6">
              <div className="flex gap-3 overflow-x-auto pb-2 px-2">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setSelectedItem(item);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex 
                        ? 'border-teal-500 ring-2 ring-teal-500/30 scale-110' 
                        : 'border-transparent hover:border-white/30 hover:scale-105'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryPage;