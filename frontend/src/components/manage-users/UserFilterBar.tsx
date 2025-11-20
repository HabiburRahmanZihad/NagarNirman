"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Users, MapPin, Shield } from "lucide-react";
import divisionsData from '@/data/divisionsData.json';

interface UserFilterBarProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  filters: {
    role: string;
    division?: string;
    district: string;
    status: string;
  };
  setFilters?: (filters: any) => void;
  onSearch?: (term: string) => void;
  onFilterChange?: (filters: any) => void;
  divisions?: string[];
  districts?: string[];
  userDivision?: string;
  isSuperAdmin?: boolean;
}

export default function UserFilterBar({
  searchTerm: externalSearchTerm,
  setSearchTerm: externalSetSearchTerm,
  onSearch,
  onFilterChange,
  filters,
  setFilters: externalSetFilters,
  divisions: externalDivisions,
  districts: externalDistricts,
  userDivision,
  isSuperAdmin = false
}: UserFilterBarProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [localFilters, setLocalFilters] = useState(filters);
  const [activeFilters, setActiveFilters] = useState(0);

  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const setSearchTerm = externalSetSearchTerm || setInternalSearchTerm;

  // Calculate active filters count
  useEffect(() => {
    const count = Object.values(localFilters).filter(value => value !== "").length;
    setActiveFilters(count);
  }, [localFilters]);

  // Debounce search
  useEffect(() => {
    if (onSearch) {
      const timer = setTimeout(() => {
        onSearch(searchTerm);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, onSearch]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (externalSetFilters) {
      externalSetFilters(newFilters);
    } else if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Get districts and divisions
  const divisions = externalDivisions || divisionsData.map(d => d.division);
  const districts = externalDistricts || (userDivision
    ? (divisionsData.find(d => d.division === userDivision)?.districts.map(d => d.name) || [])
    : []);
  const roles = [
    { value: "user", label: "User" },
    { value: "problemSolver", label: "Problem Solver" },
    { value: "ngo", label: "NGO" },
    { value: "authority", label: "Authority" }
  ];
  const statusOptions = ["active", "inactive"];

  const clearAllFilters = () => {
    const clearedFilters = { role: "", division: "", district: "", status: "" };
    setLocalFilters(clearedFilters);
    if (externalSetFilters) {
      externalSetFilters(clearedFilters);
    } else if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
    setSearchTerm("");
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...localFilters, [key]: "" };
    setLocalFilters(newFilters);
    if (externalSetFilters) {
      externalSetFilters(newFilters);
    } else if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent transition-all duration-200 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
            <Filter size={18} className="text-[#2a7d2f]" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {activeFilters > 0 && (
              <span className="bg-[#2a7d2f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield size={16} className="text-gray-400" />
            </div>
            <select
              value={localFilters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 appearance-none"
              aria-label="Filter by role"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Division Filter (SuperAdmin only) */}
          {isSuperAdmin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <select
                value={localFilters.division || ""}
                onChange={(e) => handleFilterChange('division', e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 appearance-none"
                aria-label="Filter by division"
              >
                <option value="">All Divisions</option>
                {divisions.map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>
          )}

          {/* District Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={16} className="text-gray-400" />
            </div>
            <select
              value={localFilters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 appearance-none"
              aria-label="Filter by district"
            >
              <option value="">{userDivision ? `All Districts in ${userDivision}` : 'All Districts'}</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {activeFilters > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearAllFilters}
              className="flex items-center space-x-1 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
            >
              <X size={16} />
              <span className="text-sm font-medium">Clear All</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFilters > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {localFilters.role && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                Role: {localFilters.role}
                <button
                  onClick={() => removeFilter('role')}
                  className="ml-1 hover:text-blue-600"
                  aria-label="Remove role filter"
                >
                  <X size={12} />
                </button>
              </motion.span>
            )}
            {localFilters.division && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
              >
                Division: {localFilters.division}
                <button
                  onClick={() => removeFilter('division')}
                  className="ml-1 hover:text-indigo-600"
                  aria-label="Remove division filter"
                >
                  <X size={12} />
                </button>
              </motion.span>
            )}
            {localFilters.district && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
              >
                District: {localFilters.district}
                <button
                  onClick={() => removeFilter('district')}
                  className="ml-1 hover:text-green-600"
                  aria-label="Remove district filter"
                >
                  <X size={12} />
                </button>
              </motion.span>
            )}
            {localFilters.status && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
              >
                Status: {localFilters.status}
                <button
                  onClick={() => removeFilter('status')}
                  className="ml-1 hover:text-purple-600"
                  aria-label="Remove status filter"
                >
                  <X size={12} />
                </button>
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}