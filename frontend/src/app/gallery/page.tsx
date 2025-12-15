'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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

// Problem type icons mapping
const problemTypeIcons: Record<string, string> = {
  'Road Damage': 'M13 10V3L4 14h7v7l9-11h-7z',
  'Water Logging': 'M20 16v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m16 0H4m16 0h4M4 16H0',
  'Garbage': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 011.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  'Electricity': 'M13 10V3L4 14h7v7l9-11h-7z',
  'Sewage': 'M20 16v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m16 0H4m16 0h4M4 16H0',
  'Safety Hazard': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z',
  'Drainage': 'M20 16v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m16 0H4m16 0h4M4 16H0',
  'Public Transport': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  'Street Light': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'Parks & Recreation': 'M12 6v6m0 0v6m0-6h6m-6 0H6',
};

const GalleryPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBodyOverflowHidden, setIsBodyOverflowHidden] = useState(false);

  // Extract unique problem types for filters
  const [filters, setFilters] = useState<string[]>(['All']);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`);

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
      reportsData.forEach((report: Report, reportIndex: number) => {
        if (report.images && report.images.length > 0) {
          report.images.forEach((img: string, imgIndex: number) => {
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
      const problemTypes = reportsData.map((r: Report) => String(r.problemType));
      const uniqueSet = new Set<string>(problemTypes);
      const uniqueTypes: string[] = ['All', ...Array.from(uniqueSet)];
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

  // Fix scroll when component unmounts or lightbox closes
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
    setIsBodyOverflowHidden(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox - FIXED: Properly restore scroll
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedItem(null);
    setIsBodyOverflowHidden(false);
    document.body.style.overflow = 'unset';
  };

  // Navigate lightbox
  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
    }

    setCurrentIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  }, [currentIndex, filteredItems]);

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
  }, [lightboxOpen, navigateLightbox]);

  // Get severity color with proper bg classes
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return {
        bg: 'bg-red-600',
        text: 'text-white',
        border: 'border-red-700',
        glow: 'shadow-lg shadow-red-600/40'
      };
      case 'high': return {
        bg: 'bg-orange-500',
        text: 'text-white',
        border: 'border-orange-600',
        glow: 'shadow-lg shadow-orange-500/40'
      };
      case 'medium': return {
        bg: 'bg-yellow-500',
        text: 'text-white',
        border: 'border-yellow-600',
        glow: 'shadow-lg shadow-yellow-500/40'
      };
      case 'low': return {
        bg: 'bg-green-500',
        text: 'text-white',
        border: 'border-green-600',
        glow: 'shadow-lg shadow-green-500/40'
      };
      default: return {
        bg: 'bg-gray-500',
        text: 'text-white',
        border: 'border-gray-600',
        glow: 'shadow-lg shadow-gray-500/30'
      };
    }
  };

  // Get status color with proper Tailwind classes
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return {
        bg: 'bg-emerald-500',
        text: 'text-white',
        border: 'border-emerald-600'
      };
      case 'In Progress': return {
        bg: 'bg-blue-500',
        text: 'text-white',
        border: 'border-blue-600'
      };
      case 'Pending': return {
        bg: 'bg-amber-500',
        text: 'text-white',
        border: 'border-amber-600'
      };
      default: return {
        bg: 'bg-gray-500',
        text: 'text-white',
        border: 'border-gray-600'
      };
    }
  };

  // Get icon for problem type
  const getProblemTypeIcon = (problemType: string) => {
    return problemTypeIcons[problemType] || 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-4/3 sm:aspect-5/4 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-white py-16 ${isBodyOverflowHidden ? '' : ''}`}>
      <div className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header + filters */}
        <div className="flex flex-col gap-8">
          <div className="space-y-3">
            {/* Subtitle with accent color */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-px bg-[#f2a921]"></div>
              <p className="text-sm font-semibold tracking-wider text-[#004d40]">
                COMMUNITY GALLERY
              </p>
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Main Title with gradient */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
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
              <svg className="w-5 h-5 text-[#004d40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Filter by issue type:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((label) => {
                const active = activeFilter === label;

                return (
                  <button
                    title={`Filter by ${label}`}
                    type="button"
                    aria-label={`Filter by ${label}${active ? ' (selected)' : ''}`}
                    key={label}
                    onClick={() => {
                      setActiveFilter(label);
                      setVisibleCount(12);
                    }}
                    className={[
                      "px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300 flex items-center gap-2",
                      active
                        ? "shadow-lg transform -translate-y-0.5 bg-[#004d40] border-[#004d40] text-white"
                        : "hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 bg-white text-[#004d40] border-gray-200",
                    ].join(" ")}
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

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-red-100">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-red-600">Unable to Load Gallery</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchReports}
              className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 bg-[#004d40]"
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

        {/* Gallery Grid */}
        {!error && visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-gray-100">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">No Photos Available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              No images found for this category. Try selecting a different filter or check back later for new submissions.
            </p>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-6 py-3 rounded-lg font-medium border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 border-[#004d40] text-[#004d40] bg-white"
            >
              Show All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {visibleItems.map((item) => {
              const severityColors = getSeverityColor(item.severity || 'Medium');

              return (
                <div
                  key={item.id}
                  onClick={() => openLightbox(item)}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative aspect-4/3 sm:aspect-5/4 overflow-hidden">
                    {/* Larger Image Display */}
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />

                    {/* FIXED: Always visible gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

                    {/* Additional overlay that shows on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500" />

                    {/* Top Left - Problem Type (Category) with Icon - HIDES ON HOVER */}
                    <div className="absolute top-4 left-4 transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2 z-10">
                      <div
                        className="px-3 py-1.5 rounded-full backdrop-blur-sm border shadow-sm flex items-center gap-2 bg-[#004d40] border-[#004d40] text-white"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getProblemTypeIcon(item.problemType)} />
                        </svg>
                        <span className="text-xs font-semibold tracking-wide">
                          {item.problemType}
                        </span>
                      </div>
                    </div>

                    {/* Top Right - Severity Badge - HIDES ON HOVER */}
                    <div className="absolute top-4 right-4 transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2 z-10">
                      <div className={`px-3 py-1.5 rounded-full border ${severityColors.bg} ${severityColors.text} ${severityColors.border} ${severityColors.glow}`}>
                        <span className="text-xs font-bold tracking-wide flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-white/90"></div>
                          {item.severity || 'Medium'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Content - Always visible with gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:translate-y-4 z-10">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-3 leading-tight line-clamp-2 drop-shadow-lg">
                        {item.title}
                      </h3>

                      {/* Location & Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-white/90 drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          <span className="text-sm font-medium text-white/95 drop-shadow">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-white/90 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-white/95 drop-shadow">{item.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button - Shows only on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
                      <div className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 gap-3 bg-[#f2a921] text-black shadow-[0_20px_40px_rgba(242,169,33,0.3)]"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Full Details
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {hasMore && !error && (
          <div className="flex justify-center pt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 12)}
              className="px-8 py-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 group bg-[#004d40] text-white"
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

        {/* Stats Card */}
        <div className="rounded-2xl p-8 mt-12 bg-slate-50 border border-slate-200">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-6 rounded-full bg-[#004d40]"></div>
                <p className="text-sm font-semibold tracking-wider text-[#004d40]">
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
                  <span className="text-[#004d40]">{thisMonthReports.length}</span>
                  <span className="text-lg text-gray-500">drops</span>
                </div>
                <div className="text-sm font-medium text-gray-900">This Month&apos;s Activity</div>
                <div className="text-sm text-gray-600 mt-1">Curated by {[...new Set(thisMonthReports.map(r => r.location.district))].length} district leads</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold mb-2 flex items-baseline gap-1">
                  <span className="text-[#004d40]">{galleryItems.length}</span>
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
                onClick={() => window.location.href = '/reports'}
                className="px-8 py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap bg-[#f2a921] text-black"
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

      {/* Professional Lightbox - FIXED VERSION */}
      {lightboxOpen && selectedItem && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          />

          {/* Lightbox Container */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Top Bar - FIXED: Simple working close button */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-black/90 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                  <div className="h-4 w-px bg-white/20"></div>
                  <span className="text-sm text-gray-300">
                    {selectedItem.problemType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="p-2 sm:p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                  aria-label="Previous photo"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={() => navigateLightbox('next')}
                  className="p-2 sm:p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                  aria-label="Next photo"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* FIXED: Simple X close button that definitely works */}
                <button
                  onClick={closeLightbox}
                  className="ml-1 sm:ml-2 p-2 sm:p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300"
                  aria-label="Close lightbox"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6">
              {/* Image Section */}
              <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[40vh] sm:min-h-[50vh]">
                <div className="relative w-full h-full max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                  />

                  {/* Navigation Hint */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                    ← Use arrow keys to navigate →
                  </div>
                </div>
              </div>

              {/* Details Panel - FIXED: Increased width */}
              <div className="w-full lg:w-[380px] xl:w-[450px] flex flex-col bg-black/50 rounded-xl p-4 sm:p-5 border border-white/10 max-h-[40vh] lg:max-h-none overflow-y-auto">
                {/* Badges - FIXED: Using inline styles for status badge */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className={`px-4 py-2 rounded-lg font-bold ${getSeverityColor(selectedItem.severity || 'Medium').bg} ${getSeverityColor(selectedItem.severity || 'Medium').text} ${getSeverityColor(selectedItem.severity || 'Medium').glow}`}>
                    {selectedItem.severity || 'Medium'}
                  </div>
                  <div className="px-4 py-2 rounded-lg font-bold text-white border border-teal-700 bg-[#004d40]">
                    {selectedItem.problemType}
                  </div>

                  {/* Status badge using Tailwind classes */}
                  <div
                    className={`px-4 py-2 rounded-lg font-bold border ${getStatusColor(selectedItem.status).bg} ${getStatusColor(selectedItem.status).text} ${getStatusColor(selectedItem.status).border}`}
                  >
                    {selectedItem.status}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  {selectedItem.title}
                </h2>

                {/* Info Grid */}
                <div className="space-y-3 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-[#004d40]">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="text-white font-medium text-sm">{selectedItem.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-[#f2a921]">
                          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Reported On</p>
                          <p className="text-white font-medium text-sm">{selectedItem.fullDate || selectedItem.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedItem.description && (
                    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-3.5 rounded-full bg-[#f2a921]"></div>
                          Issue Description
                        </h3>
                        <div className="max-h-40 overflow-y-auto pr-2">
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {selectedItem.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-3">
                    <button
                      onClick={() => window.open(selectedItem.src, '_blank')}
                      className="flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 text-sm bg-[#004d40] text-white"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      Open Full Size
                    </button>
                    <button
                      onClick={() => window.location.href = '/reports'}
                      className="flex-1 px-4 py-3 rounded-lg font-bold border transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 text-sm border-[#f2a921] text-[#f2a921] bg-transparent"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Report Similar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="px-2 sm:px-4 py-2 sm:py-3 border-t border-white/10 bg-black/80">
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    aria-label={`View photo ${index + 1}: ${item.title}`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setSelectedItem(item);
                    }}
                    className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded overflow-hidden border-2 transition-all relative ${index === currentIndex
                      ? 'border-yellow-500 ring-1 ring-yellow-500 scale-105'
                      : 'border-transparent hover:border-white/50 hover:scale-105'
                      }`}
                  >
                    <Image
                      src={item.src}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
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