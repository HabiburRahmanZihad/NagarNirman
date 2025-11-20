"use client";

import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Filters {
  status: string;
  severity: string;
  district: string;
  search: string;
}

interface TaskFilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const statusOptions = [
  { value: "all", label: "All Missions", icon: "🎯", color: "bg-gray-500" },
  { value: "pending", label: "Ready", icon: "⏳", color: "bg-yellow-500" },
  { value: "ongoing", label: "In Progress", icon: "🚀", color: "bg-blue-500" },
  { value: "completed", label: "Completed", icon: "✅", color: "bg-green-500" }
];

const severityOptions = [
  { value: "all", label: "All Levels", emoji: "📊" },
  { value: "low", label: "Low", emoji: "💚" },
  { value: "medium", label: "Medium", emoji: "💛" },
  { value: "high", label: "High", emoji: "❤️" }
];

const districtOptions = [
  { value: "all", label: "All Districts", emoji: "🗺️" },
  { value: "Gazipur", label: "Gazipur", emoji: "🏢" },
  { value: "Mirpur", label: "Mirpur", emoji: "🏘️" },
  { value: "Uttara", label: "Uttara", emoji: "✈️" }
];

export default function TaskFilterBar({ filters, onFiltersChange }: TaskFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchTerm });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const activeFiltersCount = [
    filters.status !== 'all',
    filters.severity !== 'all',
    filters.district !== 'all',
    filters.search !== ''
  ].filter(Boolean).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search missions by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white min-w-[160px]"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.severity}
              onChange={(e) => onFiltersChange({ ...filters, severity: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white min-w-[140px]"
            >
              {severityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.district}
              onChange={(e) => onFiltersChange({ ...filters, district: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white min-w-[150px]"
            >
              {districtOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors relative"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filters Tags */}
        {(filters.status !== 'all' || filters.severity !== 'all' || filters.district !== 'all') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
                Status: {statusOptions.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => onFiltersChange({ ...filters, status: 'all' })}
                  className="ml-2 hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.severity !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                Level: {severityOptions.find(s => s.value === filters.severity)?.label}
                <button
                  onClick={() => onFiltersChange({ ...filters, severity: 'all' })}
                  className="ml-2 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.district !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200">
                Area: {districtOptions.find(d => d.value === filters.district)?.label}
                <button
                  onClick={() => onFiltersChange({ ...filters, district: 'all' })}
                  className="ml-2 hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mission Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => onFiltersChange({ ...filters, status: option.value })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          filters.status === option.value
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {severityOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => onFiltersChange({ ...filters, severity: option.value })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          filters.severity === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <div className="grid grid-cols-2 gap-2">
                    {districtOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => onFiltersChange({ ...filters, district: option.value })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          filters.district === option.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}