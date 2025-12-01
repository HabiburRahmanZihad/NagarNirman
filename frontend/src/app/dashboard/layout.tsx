'use client';

import { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { NotificationCenter } from '@/components/common/NotificationCenter';
import { useAuthProtection } from '@/hooks/useRoleProtection';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading, isAuthorized } = useAuthProtection();

  // Show loading state while checking authentication or if not authorized
  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a7d2f]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 lg:pl-6 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title - will be set by individual pages */}
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications Center */}
              <NotificationCenter />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
