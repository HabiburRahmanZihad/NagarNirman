"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import divisionsData from "@/data/divisionsData.json";
import categoryOptions from "@/data/categoryOptions.json";

interface Filters {
  status: string;
  severity: string;
  category: string;
  search: string;
}

interface TaskFilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Assigned" },
  { value: "ongoing", label: "In Progress" },
  { value: "submitted", label: "Submitted" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" }
];

const severityOptions = [
  { value: "all", label: "All Severity" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

// Generate division options from data
const divisionOptions = [
  { value: "all", label: "All Divisions" },
  ...divisionsData.map(div => ({ value: div.division, label: div.division }))
];

// Generate all district options from data
const getAllDistricts = () => {
  const districts: { value: string; label: string }[] = [{ value: "all", label: "All Districts" }];
  divisionsData.forEach(div => {
    div.districts.forEach(dist => {
      districts.push({ value: dist.name, label: dist.name });
    });
  });
  return districts;
};

const districtOptions = getAllDistricts();

// Generate category options based on backend problemType values
const categoryOptionsList = [
  { value: "all", label: "All Categories" },
  { value: "road", label: "Road" },
  { value: "drainage", label: "Drainage" },
  { value: "street light", label: "Street Light" },
  { value: "waste management", label: "Waste Management" },
  { value: "water supply", label: "Water Supply" },
  { value: "electricity", label: "Electricity" },
  { value: "public property", label: "Public Property" },
  { value: "other", label: "Other" }
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
    filters.category !== 'all',
    filters.search !== ''
  ].filter(Boolean).length;



  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white"
              />
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3 flex-wrap">
            <select
              aria-label="Filter tasks by status"
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white min-w-[130px] text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter tasks by severity"
              value={filters.severity}
              onChange={(e) => onFiltersChange({ ...filters, severity: e.target.value })}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white min-w-[120px] text-sm"
            >
              {severityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter tasks by category"
              value={filters.category}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white min-w-[160px] text-sm"
            >
              {categoryOptionsList.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  onFiltersChange({
                    status: 'all',
                    severity: 'all',
                    category: 'all',
                    search: ''
                  });
                  setSearchTerm('');
                }}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors relative text-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filters Tags */}
        {(filters.status !== 'all' || filters.severity !== 'all' || filters.category !== 'all') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 mt-3"
          >
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                Status: {statusOptions.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => onFiltersChange({ ...filters, status: 'all' })}
                  className="ml-1.5 hover:text-green-900"
                  aria-label="Remove status filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.severity !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                Severity: {severityOptions.find(s => s.value === filters.severity)?.label}
                <button
                  onClick={() => onFiltersChange({ ...filters, severity: 'all' })}
                  className="ml-1.5 hover:text-orange-900"
                  aria-label="Remove severity filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-pink-100 text-pink-800 border border-pink-200">
                Category: {categoryOptionsList.find(c => c.value === filters.category)?.label}
                <button
                  onClick={() => onFiltersChange({ ...filters, category: 'all' })}
                  className="ml-1.5 hover:text-pink-900"
                  aria-label="Remove category filter"
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
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Task Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFiltersChange({ ...filters, status: option.value });
                          if (option.value === 'all') setShowMobileFilters(false);
                        }}
                        className={`p-3 rounded-lg border transition-all text-sm ${
                          filters.status === option.value
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Severity Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {severityOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFiltersChange({ ...filters, severity: option.value });
                          if (option.value === 'all') setShowMobileFilters(false);
                        }}
                        className={`p-3 rounded-lg border transition-all text-sm ${
                          filters.severity === option.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Problem Category</label>
                  <select
                    aria-label="Filter tasks by category"
                    value={filters.category}
                    onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white text-sm"
                  >
                    {categoryOptionsList.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    onFiltersChange({
                      status: 'all',
                      severity: 'all',
                      category: 'all',
                      search: ''
                    });
                    setSearchTerm('');
                    setShowMobileFilters(false);
                  }}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}