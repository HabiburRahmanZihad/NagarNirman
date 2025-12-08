'use client';

import { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { NotificationCenter, FullPageLoading } from '@/components/common';
import { useAuthProtection } from '@/hooks/useRoleProtection';
import { useAuth } from '@/context/AuthContext';
import { LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isLoading, isAuthorized } = useAuthProtection();
  const { user, logout } = useAuth();

  // Show loading state while checking authentication or if not authorized
  if (isLoading || !isAuthorized) {
    return <FullPageLoading text="Checking authorization..." />;
  }

  return (
    <div className="flex min-h-screen bg-base-300">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-linear-to-r from-base-100 to-base-100 border-b-2 border-base-200 px-6 py-4 lg:pl-6 sticky top-0 z-40 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-info hover:text-primary transition-colors duration-300 p-2 hover:bg-base-200 rounded-lg"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title */}
            <div className="flex-1 lg:ml-0 ml-4">
              <div className="flex flex-col">
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
                  NagarNirman Control Center
                </h1>
                <p className="text-xs text-neutral/60 font-semibold mt-1">Empowering communities, solving problems together</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications Center */}
              <NotificationCenter />

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-base-200"></div>

              {/* User Profile Dropdown */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-base-200 transition-all duration-300 group"
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-primary shadow-md group-hover:shadow-lg transition-shadow"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-bold text-info leading-tight">{user.name}</span>
                      <span className="text-xs text-neutral/60 capitalize font-medium">{user.role}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-info transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-base-100 border-2 border-base-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      {/* User Info Section */}
                      <div className="px-4 py-4 bg-linear-to-br from-primary/10 to-primary/5 border-b-2 border-base-200">
                        <div className="flex items-center space-x-3 mb-3">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover border-3 border-primary shadow-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-primary shadow-lg">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-extrabold text-info">{user.name}</p>
                            <p className="text-xs text-neutral/70">{user.email}</p>
                          </div>
                        </div>
                        <div className="inline-block px-3 py-1 bg-primary/20 rounded-lg border border-primary/30">
                          <p className="text-xs font-bold text-primary capitalize">{user.role}</p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link href={`/dashboard/${user.role}/profile`}>
                          <button
                            onClick={() => setProfileOpen(false)}
                            className="w-full text-left px-4 py-3 text-sm text-info font-semibold hover:bg-base-200 hover:text-primary transition-all duration-300 flex items-center space-x-3 group"
                          >
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span>My Profile</span>
                          </button>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t-2 border-base-200 py-2">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-error font-bold hover:bg-error/10 transition-all duration-300 flex items-center space-x-3 group"
                        >
                          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center group-hover:bg-error/20 transition-colors">
                            <LogOut className="w-4 h-4 text-error" />
                          </div>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-base-300 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
