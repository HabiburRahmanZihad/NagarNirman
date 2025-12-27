"use client";

import { useState, useEffect, useMemo } from "react";
import type { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import divisionsData from '@/data/divisionsData.json';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

type Filters = {
  role: string;
  division: string;
  district: string;
  status: string;
};

interface UserFilterBarProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  filters: Filters;
  setFilters?: (filters: Filters) => void;
  onSearch?: (term: string) => void;
  onFilterChange?: ((filters: Filters) => void) | Dispatch<SetStateAction<Filters>>;
  divisions?: string[];
  districts?: string[];
  userDivision?: string | null;
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
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  // Sync localFilters with external filters prop
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const setSearchTerm = externalSetSearchTerm || setInternalSearchTerm;

  // Calculate active filters count (derived)
  const activeFilters = useMemo(() => {
    const values = Object.values(localFilters) as Array<string | undefined>;
    return values.filter((v): v is string => (v ?? "") !== "").length;
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

  const handleFilterChange = (key: keyof Filters, value: string) => {
    let newFilters = { ...localFilters, [key]: value } as Filters;
    // If division changes, reset district
    if (key === 'division') {
      newFilters = { ...newFilters, district: "" };
    }
    setLocalFilters(newFilters);
    if (externalSetFilters) {
      externalSetFilters(newFilters);
    } else if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Get divisions
  const divisions = externalDivisions || divisionsData.map(d => d.division);

  // Get districts based on division selection (use localFilters.division first)
  const selectedDivision = localFilters.division || userDivision || null;
  const districts = externalDistricts
    || (selectedDivision
      ? (divisionsData.find(d => d.division === selectedDivision)?.districts.map(d => d.name) || [])
      : divisionsData.flatMap(d => d.districts.map(dist => dist.name)));
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
    const clearedFilters: Filters = { role: "", division: "", district: "", status: "" };
    setLocalFilters(clearedFilters);
    if (externalSetFilters) {
      externalSetFilters(clearedFilters);
    } else if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
    setSearchTerm("");
  };

  const removeFilter = (key: keyof Filters) => {
    let newFilters = { ...localFilters, [key]: "" } as Filters;
    // If removing division, also clear district
    if (key === 'division') {
      newFilters = { ...newFilters, district: "" };
    }
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
      className="space-y-3 xs:space-y-4"
    >
      <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary p-4 xs:p-5 sm:p-6 lg:p-8 space-y-4 xs:space-y-5 sm:space-y-6">
        {/* Header */}
        <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info mb-4 xs:mb-5 sm:mb-6 flex items-center gap-2 xs:gap-3">
          <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
            <Search className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
          </div>
          Search & Filter Users
        </h2>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3 xs:left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 xs:h-5 xs:w-5 text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 xs:pl-12 pr-3 xs:pr-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl bg-base-200 focus:ring-2 focus:ring-secondary focus:border-secondary text-neutral placeholder:text-neutral/50 font-medium transition-all duration-200 outline-none"
            aria-label="Search users"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
          {/* Role Filter */}
          <div>
            <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">Role</label>
            <select
              value={localFilters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium appearance-none transition-all outline-none"
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

          {/* Division Filter (visible to all; disabled when userDivision is set) */}
          <div>
            <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">Division (Select Division)</label>
            <select
              value={localFilters.division || userDivision || ""}
              onChange={(e) => handleFilterChange('division', e.target.value)}
              className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium appearance-none transition-all"
              aria-label="Filter by division"
              disabled={!isSuperAdmin && Boolean(userDivision)}
            >
              <option value="">All Divisions</option>
              {divisions.map(division => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">District</label>
            <select
              value={localFilters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium appearance-none transition-all"
              aria-label="Filter by district"
              disabled={districts.length === 0}
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs xs:text-sm font-bold text-info mb-2 xs:mb-3 uppercase tracking-wide">Status</label>
            <select
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base border-2 border-accent/20 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary bg-base-200 text-neutral font-medium appearance-none transition-all"
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
            className="flex flex-wrap gap-1.5 xs:gap-2 items-center"
          >
            <span className="text-xs xs:text-sm font-bold text-neutral/70 uppercase">Active Filters:</span>
            {localFilters.role && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm font-bold bg-primary/20 text-primary border border-primary/40"
              >
                👤 {localFilters.role}
                <button
                  onClick={() => removeFilter('role')}
                  className="hover:text-primary/70 transition-colors"
                  aria-label="Remove role filter"
                >
                  <X size={14} className="xs:w-4 xs:h-4" />
                </button>
              </motion.span>
            )}
            {localFilters.division && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm font-bold bg-secondary/20 text-secondary border border-secondary/40"
              >
                🗺️ {localFilters.division}
                <button
                  onClick={() => removeFilter('division')}
                  className="hover:text-secondary/70 transition-colors"
                  aria-label="Remove division filter"
                >
                  <X size={14} className="xs:w-4 xs:h-4" />
                </button>
              </motion.span>
            )}
            {localFilters.district && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm font-bold bg-accent/20 text-accent border border-accent/40"
              >
                📍 {localFilters.district}
                <button
                  onClick={() => removeFilter('district')}
                  className="hover:text-accent/70 transition-colors"
                  aria-label="Remove district filter"
                >
                  <X size={14} className="xs:w-4 xs:h-4" />
                </button>
              </motion.span>
            )}
            {localFilters.status && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm font-bold bg-info/20 text-info border border-info/40"
              >
                {localFilters.status === 'active' ? '🟢' : '🔴'} {localFilters.status}
                <button
                  onClick={() => removeFilter('status')}
                  className="hover:text-info/70 transition-colors"
                  aria-label="Remove status filter"
                >
                  <X size={14} className="xs:w-4 xs:h-4" />
                </button>
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}