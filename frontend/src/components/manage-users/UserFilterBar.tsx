"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Users, MapPin, Shield } from "lucide-react";
import divisionsData from '@/data/divisionsData.json';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

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
  userDivision?: any;
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
    { value: "user", label: "👤 User" },
    { value: "problemSolver", label: "💡 Problem Solver" },
    { value: "authority", label: "👑 Authority" }
  ];
  const statusOptions = [
    { value: "active", label: "🟢 Active" },
    { value: "inactive", label: "🔴 Inactive" }
  ];

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="rounded-3xl shadow-xl border-t-4 border-secondary p-8 space-y-6">
        {/* Header */}
        <h2 className="text-2xl font-extrabold text-info mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
            <Search className="w-6 h-6" />
          </div>
          Search & Filter Users
        </h2>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border-2 border-accent/20 rounded-xl bg-base-200 focus:ring-2 focus:ring-secondary focus:border-secondary text-neutral placeholder:text-neutral/50 font-medium transition-all duration-200"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Role Filter */}
          <div>
            <label className="block text-sm font-bold text-info mb-2 uppercase tracking-wide">Role</label>
            <select
              value={localFilters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium appearance-none transition-all"
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
            <div>
              <label className="block text-sm font-bold text-info mb-2 uppercase tracking-wide">Division</label>
              <select
                value={localFilters.division || ""}
                onChange={(e) => handleFilterChange('division', e.target.value)}
                className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium appearance-none transition-all"
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
          <div>
            <label className="block text-sm font-bold text-info mb-2 uppercase tracking-wide">District</label>
            <select
              value={localFilters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium appearance-none transition-all"
              aria-label="Filter by district"
            >
              <option value="">{userDivision ? `All Districts` : 'All Districts'}</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-bold text-info mb-2 uppercase tracking-wide">Status</label>
            <select
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium appearance-none transition-all"
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Button */}
        {activeFilters > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="text-neutral hover:text-primary border border-neutral/20"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </Card>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFilters > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 items-center"
          >
            <span className="text-sm font-bold text-neutral/70 uppercase">Active Filters:</span>
            {localFilters.role && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-primary/20 text-primary border border-primary/40"
              >
                👤 {localFilters.role}
                <button
                  onClick={() => removeFilter('role')}
                  className="hover:text-primary/70 transition-colors"
                  aria-label="Remove role filter"
                >
                  <X size={16} />
                </button>
              </motion.span>
            )}
            {localFilters.division && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-secondary/20 text-secondary border border-secondary/40"
              >
                🗺️ {localFilters.division}
                <button
                  onClick={() => removeFilter('division')}
                  className="hover:text-secondary/70 transition-colors"
                  aria-label="Remove division filter"
                >
                  <X size={16} />
                </button>
              </motion.span>
            )}
            {localFilters.district && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-accent/20 text-accent border border-accent/40"
              >
                📍 {localFilters.district}
                <button
                  onClick={() => removeFilter('district')}
                  className="hover:text-accent/70 transition-colors"
                  aria-label="Remove district filter"
                >
                  <X size={16} />
                </button>
              </motion.span>
            )}
            {localFilters.status && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-info/20 text-info border border-info/40"
              >
                {localFilters.status === 'active' ? '🟢' : '🔴'} {localFilters.status}
                <button
                  onClick={() => removeFilter('status')}
                  className="hover:text-info/70 transition-colors"
                  aria-label="Remove status filter"
                >
                  <X size={16} />
                </button>
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}