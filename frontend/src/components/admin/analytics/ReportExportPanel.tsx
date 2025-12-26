'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Filter, FileText, Table, Info } from 'lucide-react';
import { ExportFilters } from './types';
import { generateCSV, generatePDF } from './api';
import toast from 'react-hot-toast';


const divisions = ['All Divisions', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];
const districts = ['All Districts', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh', 'Comilla', 'Noakhali'];

interface ReportExportPanelProps {
  onExport?: () => void;
}

export default function ReportExportPanel({ onExport }: ReportExportPanelProps) {
  const [filters, setFilters] = useState<ExportFilters>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    division: 'All Divisions',
    district: 'All Districts'
  });
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);

  const handleExportCSV = async () => {
    setExporting('csv');
    try {
      const csvData = generateCSV(filters);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nagarnirman-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully!');
      onExport?.();
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('Failed to export CSV');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setExporting('pdf');
    try {
      const pdfBlob = await generatePDF(filters);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nagarnirman-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF exported successfully!');
      onExport?.();
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-linear-to-r from-[#2a7d2f] to-[#3a9d40] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Download className="w-6 h-6 text-[#2a7d2f]" />
          Export Analytics Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <input
              placeholder='s'
              type="date"
              value={filters.startDate.toISOString().split('T')[0]}
              onChange={(e) => setFilters({ ...filters, startDate: new Date(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              End Date
            </label>
            <input
              placeholder='a'
              type="date"
              value={filters.endDate.toISOString().split('T')[0]}
              onChange={(e) => setFilters({ ...filters, endDate: new Date(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Division
            </label>
            <select
              title='a'
              value={filters.division}
              onChange={(e) => setFilters({ ...filters, division: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent transition-all"
            >
              {divisions.map(division => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              District
            </label>
            <select
              title='a'
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a7d2f] focus:border-transparent transition-all"
            >
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            disabled={exporting !== null}
            className="flex items-center gap-3 px-6 py-3 bg-[#2a7d2f] text-white rounded-xl font-medium shadow-lg hover:bg-[#3a9d40] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center"
          >
            {exporting === 'csv' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Table className="w-5 h-5" />
            )}
            {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            disabled={exporting !== null}
            className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center"
          >
            {exporting === 'pdf' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <FileText className="w-5 h-5" />
            )}
            {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </motion.button>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Info className="w-4 h-4" />
            <span>Exports include: Analytics data, charts, problem solver performance, and district-wise breakdown</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}