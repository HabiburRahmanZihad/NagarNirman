'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Filter,
  Grid3X3,
  Check,
  AlertTriangle,
  Camera,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Plus,
  Zap,
  Trash2,
  Droplets,
  AlertCircle,
  Bus,
  Lightbulb,
  Trees,
  ArrowDown,
  FileText,
  Clock
} from 'lucide-react';

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

// Problem type icons mapping using Lucide React components
const problemTypeIconMap: Record<string, React.ReactNode> = {
  'Road Damage': <Zap className="w-full h-full" />,
  'Water Logging': <Droplets className="w-full h-full" />,
  'Garbage': <Trash2 className="w-full h-full" />,
  'Electricity': <Zap className="w-full h-full" />,
  'Sewage': <Droplets className="w-full h-full" />,
  'Safety Hazard': <AlertTriangle className="w-full h-full" />,
  'Drainage': <Droplets className="w-full h-full" />,
  'Public Transport': <Bus className="w-full h-full" />,
  'Street Light': <Lightbulb className="w-full h-full" />,
  'Parks & Recreation': <Trees className="w-full h-full" />,
};

// Get icon component for problem type
const getProblemTypeIcon = (problemType: string) => {
  return problemTypeIconMap[problemType] || <AlertCircle className="w-full h-full" />;
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

  // Touch gesture refs for mobile swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const minSwipeDistance = 50;

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

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        navigateLightbox('next');
      } else {
        navigateLightbox('prev');
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(prev => {
          const newIndex = prev === 0 ? filteredItems.length - 1 : prev - 1;
          setSelectedItem(filteredItems[newIndex]);
          return newIndex;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(prev => {
          const newIndex = prev === filteredItems.length - 1 ? 0 : prev + 1;
          setSelectedItem(filteredItems[newIndex]);
          return newIndex;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, filteredItems]);

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
    <section className={`min-h-screen bg-base-100 py-8 sm:py-12 ${isBodyOverflowHidden ? '' : ''}`}>
      <div className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">

        {/* Header - Earthquake Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-primary to-secondary text-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 border-t-4 border-accent"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Camera className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">Community Gallery</h1>
              </div>
              <p className="text-white/90 text-base sm:text-lg max-w-2xl">
                Visual evidence of civic action from {subtitleDistricts}. Each photo represents verified progress in our communities.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[100px] text-center">
                <p className="text-2xl sm:text-3xl font-extrabold">{galleryItems.length}</p>
                <p className="text-xs sm:text-sm text-white/80 font-medium">Photos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[100px] text-center">
                <p className="text-2xl sm:text-3xl font-extrabold">{reports.length}</p>
                <p className="text-xs sm:text-sm text-white/80 font-medium">Reports</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[100px] text-center">
                <p className="text-2xl sm:text-3xl font-extrabold">{[...new Set(reports.map(r => r.location.district))].length}</p>
                <p className="text-xs sm:text-sm text-white/80 font-medium">Districts</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Section - Earthquake Style */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2 text-neutral">
              <Filter className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold">Filter by issue type:</span>
            </div>

            <div className="flex flex-wrap gap-2 flex-1">
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
                    className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 border-2 whitespace-nowrap text-sm ${active
                      ? 'bg-primary text-white border-primary shadow-lg'
                      : 'border-base-200 bg-white hover:bg-base-50 text-neutral'
                      }`}
                  >
                    {label === 'All' && <Grid3X3 className="w-4 h-4 inline mr-1.5" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 bg-red-100">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-red-600">Unable to Load Gallery</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchReports}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation bg-[#004d40]"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                Try Again
              </span>
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        {!error && visibleItems.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 sm:p-10 text-center">

            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-6 bg-gray-100">
              <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">No Photos Available</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md mx-auto">
              No images found for this category. Try selecting a different filter or check back later for new submissions.
            </p>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium border transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation border-[#004d40] text-[#004d40] bg-white"
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
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 active:scale-[0.98] touch-manipulation"
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
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2 z-10">
                      <div
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border shadow-sm flex items-center gap-1.5 sm:gap-2 bg-[#004d40] border-[#004d40] text-white"
                      >
                        <span className="w-3 h-3 sm:w-3.5 sm:h-3.5">
                          {getProblemTypeIcon(item.problemType)}
                        </span>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide">
                          {item.problemType}
                        </span>
                      </div>
                    </div>

                    {/* Top Right - Severity Badge - HIDES ON HOVER */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2 z-10">
                      <div className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border ${severityColors.bg} ${severityColors.text} ${severityColors.border} ${severityColors.glow}`}>
                        <span className="text-[10px] sm:text-xs font-bold tracking-wide flex items-center gap-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/90"></div>
                          {item.severity || 'Medium'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Content - Always visible with gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:translate-y-4 z-10">
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 leading-tight line-clamp-2 drop-shadow-lg">
                        {item.title}
                      </h3>

                      {/* Location & Date */}
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 drop-shadow" />
                          <span className="font-medium text-white/95 drop-shadow">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 drop-shadow" />
                          <span className="font-medium text-white/95 drop-shadow">{item.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button - Shows only on hover (desktop) */}
                    <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
                      <div className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 hover:scale-105 gap-2 sm:gap-3 bg-[#f2a921] text-black shadow-[0_20px_40px_rgba(242,169,33,0.3)]"
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        View Full Details
                      </div>
                    </div>

                    {/* Mobile tap indicator */}
                    <div className="absolute bottom-3 right-3 sm:hidden z-20">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
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
          <div className="flex justify-center pt-6 sm:pt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 12)}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-xl active:scale-95 touch-manipulation group bg-[#004d40] text-white"
            >
              <span className="flex items-center gap-2 sm:gap-3">
                Load More Photos
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>
        )}

        {/* Stats Cards - Earthquake Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* This Month Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral/70 uppercase">This Month</p>
                <p className="text-2xl font-extrabold text-primary">{thisMonthReports.length}</p>
              </div>
            </div>
            <p className="text-sm text-neutral/70">{[...new Set(thisMonthReports.map(r => r.location.district))].length} districts active</p>
          </motion.div>

          {/* Total Photos Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral/70 uppercase">Total Photos</p>
                <p className="text-2xl font-extrabold text-secondary">{galleryItems.length}</p>
              </div>
            </div>
            <p className="text-sm text-neutral/70">From {reports.length} verified reports</p>
          </motion.div>

          {/* Resolved Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-success/30 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral/70 uppercase">Resolved</p>
                <p className="text-2xl font-extrabold text-success">{reports.filter(r => r.status === 'Resolved').length}</p>
              </div>
            </div>
            <p className="text-sm text-neutral/70">Issues successfully fixed</p>
          </motion.div>

          {/* In Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-info/30 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-info flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral/70 uppercase">In Progress</p>
                <p className="text-2xl font-extrabold text-info">{reports.filter(r => r.status === 'In Progress').length}</p>
              </div>
            </div>
            <p className="text-sm text-neutral/70">Being addressed now</p>
          </motion.div>
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-6 sm:p-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral">Have evidence of community work?</h3>
              <p className="text-neutral/70">Help us build the most comprehensive civic action gallery in Bangladesh.</p>
            </div>
            <button
              onClick={() => window.location.href = '/reports'}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl active:scale-95 touch-manipulation whitespace-nowrap bg-accent text-white flex items-center justify-center gap-2 sm:gap-3"
            >
              <Plus className="w-5 h-5" />
              Submit Your Evidence
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Professional Lightbox - Mobile Optimized */}
      {lightboxOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 pt-16 sm:pt-20"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/80 sm:bg-black/50 backdrop-blur-md"
            onClick={closeLightbox}
          />

          {/* Lightbox Container */}
          <div
            className="relative z-10 h-full flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar - Mobile Optimized */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4 bg-black/90 border-b border-white/10">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-sm sm:text-base text-white font-medium">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                  <div className="hidden sm:block h-4 w-px bg-white/20"></div>
                  <span className="hidden sm:block text-sm text-gray-300">
                    {selectedItem.problemType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => navigateLightbox('prev')}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  className="p-2.5 sm:p-3 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 touch-manipulation"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#f2a921]" />
                </button>

                <button
                  onClick={() => navigateLightbox('next')}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  className="p-2.5 sm:p-3 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 touch-manipulation"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#f2a921]" />
                </button>

                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="ml-1.5 sm:ml-2 p-2.5 sm:p-3 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all duration-200 touch-manipulation"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Main Content - Mobile Optimized Layout */}
            <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-6 p-3 sm:p-4 md:p-6 overflow-hidden">
              {/* Image Section */}
              <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[35vh] sm:min-h-[45vh] relative">
                <div className="relative w-full h-full max-h-[45vh] sm:max-h-[55vh] lg:max-h-[70vh] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                  />

                  {/* Mobile & Tablet navigation bar */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 lg:hidden">
                    <div className="bg-black/60 text-white text-xs sm:text-sm rounded-full backdrop-blur-sm flex items-center">
                      <button
                        onClick={() => navigateLightbox('prev')}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        className="p-2.5 sm:p-3 hover:bg-white/20 active:bg-white/30 rounded-l-full transition-colors touch-manipulation"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#f2a921]" />
                      </button>
                      <span className="px-2 sm:px-3">Swipe to navigate</span>
                      <button
                        onClick={() => navigateLightbox('next')}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        className="p-2.5 sm:p-3 hover:bg-white/20 active:bg-white/30 rounded-r-full transition-colors touch-manipulation"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#f2a921]" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop navigation hint */}
                  <div className="hidden lg:block absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <ChevronLeft className="w-4 h-4" />
                      Use arrow keys to navigate
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Panel - Mobile Optimized */}
              <div className="w-full lg:w-[340px] xl:w-[400px] flex flex-col bg-black/50 rounded-xl p-3 sm:p-4 lg:p-5 border border-white/10 max-h-[35vh] lg:max-h-none overflow-y-auto">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold ${getSeverityColor(selectedItem.severity || 'Medium').bg} ${getSeverityColor(selectedItem.severity || 'Medium').text} ${getSeverityColor(selectedItem.severity || 'Medium').glow}`}>
                    {selectedItem.severity || 'Medium'}
                  </div>
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold text-white border border-teal-700 bg-[#004d40]">
                    {selectedItem.problemType}
                  </div>

                  {/* Status badge */}
                  <div
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border ${getStatusColor(selectedItem.status).bg} ${getStatusColor(selectedItem.status).text} ${getStatusColor(selectedItem.status).border}`}
                  >
                    {selectedItem.status}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
                  {selectedItem.title}
                </h2>

                {/* Info Grid */}
                <div className="space-y-2 sm:space-y-3 lg:space-y-5">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white/5 p-2.5 sm:p-4 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-[#004d40]">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-gray-400">Location</p>
                          <p className="text-white font-medium text-xs sm:text-sm truncate">{selectedItem.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-2.5 sm:p-4 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-[#f2a921]">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-gray-400">Reported</p>
                          <p className="text-white font-medium text-xs sm:text-sm truncate">{selectedItem.fullDate || selectedItem.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedItem.description && (
                    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 sm:mb-2 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f2a921]" />
                          Issue Description
                        </h3>
                        <div className="max-h-24 sm:max-h-40 overflow-y-auto pr-2">
                          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {selectedItem.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-row gap-2 pt-2 sm:pt-3">
                    <button
                      onClick={() => window.open(selectedItem.src, '_blank')}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:shadow-lg active:scale-95 touch-manipulation flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm bg-[#004d40] text-white"
                    >
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Open</span> Full Size
                    </button>
                    <button
                      onClick={() => window.location.href = '/reports'}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-bold border transition-all duration-200 hover:shadow-lg active:scale-95 touch-manipulation flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm border-[#f2a921] text-[#f2a921] bg-transparent"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Report Similar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip - Mobile Optimized */}
            <div className="px-2 sm:px-4 py-2 sm:py-3 border-t border-white/10 bg-black/90 safe-area-bottom">
              <div className="flex gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    aria-label={`View photo ${index + 1}: ${item.title}`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setSelectedItem(item);
                    }}
                    className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md overflow-hidden border-2 transition-all relative active:scale-95 touch-manipulation ${index === currentIndex
                      ? 'border-[#f2a921] ring-1 ring-[#f2a921] scale-105'
                      : 'border-transparent hover:border-white/50 active:border-white/70'
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