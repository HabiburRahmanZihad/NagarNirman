'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatRole } from '@/utils/helpers';
import Button from './Button';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo/logo.png"
              alt="NagarNirman Logo"
              width={140}
              height={140}
              className=""
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#374151] hover:text-[#81d586] transition-colors">
              Home
            </Link>

            <Link href="/reports" className="text-[#374151] hover:text-[#81d586] transition-colors">
              Report
            </Link>

            {isAuthenticated && user?.role === 'user' && (
              <>
                <Link href="/dashboard/user" className="text-[#374151] hover:text-[#81d586] transition-colors">
                  Dashboard
                </Link>
                <Link href="/reports/new" className="text-[#374151] hover:text-[#81d586] transition-colors">
                  Report Issue
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'authority' && (
              <>
                <Link href="/dashboard/authority" className="text-[#374151] hover:text-[#81d586] transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/authority/manage" className="text-[#374151] hover:text-[#81d586] transition-colors">
                  Manage
                </Link>
              </>
            )}

            {isAuthenticated && (user?.role === 'problemSolver' || user?.role === 'ngo') && (
              <>
                <Link href="/dashboard/solver" className="text-[#374151] hover:text-[#81d586] transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/solver/tasks" className="text-[#374151] hover:text-[#81d586] transition-colors">
                  My Tasks
                </Link>
              </>
            )}

            <Link href="/about" className="text-[#374151] hover:text-[#81d586] transition-colors">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-[#002E2E]">{user.name}</span>
                  <span className="text-xs text-[#6B7280]">{formatRole(user.role)}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
