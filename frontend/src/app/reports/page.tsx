'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#002E2E] border-l-4 border-[#81d586] pl-4 mb-2">
            All Reports
          </h1>
          <p className="text-[#6B7280] border-l-4 border-[#81d586] pl-4">Browse and search infrastructure issues across Bangladesh</p>
        </div>
        <Link href="/report/new">
          <Button variant="primary">
            Report New Issue
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="district-filter" className="block text-sm font-medium text-[#002E2E] mb-2">
              District
            </label>
            <select
              id="district-filter"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81d586]"
            >
              <option value="">All Districts</option>
              <option value="dhaka">Dhaka</option>
              <option value="chittagong">Chittagong</option>
            </select>
          </div>

          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-[#002E2E] mb-2">
              Status
            </label>
            <select
              id="status-filter"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81d586]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-[#002E2E] mb-2">
              Category
            </label>
            <select
              id="category-filter"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81d586]"
            >
              <option value="">All Categories</option>
              <option value="road">Road & Infrastructure</option>
              <option value="garbage">Garbage & Sanitation</option>
              <option value="lighting">Lighting & Electrical</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reports Grid */}
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-[#002E2E] mb-2">No Reports Yet</h3>
        <p className="text-[#6B7280] mb-6">
          Be the first to report an infrastructure issue in your area
        </p>
        <Link href="/report/new">
          <Button variant="primary">
            Create First Report
          </Button>
        </Link>
      </div>
    </div>
  );
}