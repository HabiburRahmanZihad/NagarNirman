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
              className="w-auto h-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#374151] hover:text-[#81d586] transition-colors">
              Home
            </Link>

            {isAuthenticated && (
              <Link
                href={
                  user?.role === 'user' ? '/dashboard/user' :
                  user?.role === 'authority' ? '/dashboard/authority' :
                  user?.role === 'problemSolver' || user?.role === 'ngo' ? '/dashboard/problemSolver' :
                  '/dashboard'
                }
                className="text-[#374151] hover:text-[#81d586] transition-colors"
              >
                Dashboard
              </Link>
            )}

            <Link href="/reports" className="text-[#374151] hover:text-[#81d586] transition-colors">
              All Reports
            </Link>

            <Link href="/map-search" className="text-[#374151] hover:text-[#81d586] transition-colors">
              Map Search
            </Link>

            <div className="relative group">
              <Link href="/about" className="text-[#374151] hover:text-[#81d586] transition-colors">
                About
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/about" className="block px-4 py-2 text-[#374151] hover:bg-[#F6FFF9] hover:text-[#2a7d2f] rounded-t-lg">
                  About Us
                </Link>
                <Link href="/about-team" className="block px-4 py-2 text-[#374151] hover:bg-[#F6FFF9] hover:text-[#2a7d2f] rounded-b-lg">
                  Meet the Team
                </Link>
              </div>
            </div>
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
