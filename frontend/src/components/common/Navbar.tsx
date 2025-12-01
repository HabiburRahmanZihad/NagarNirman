"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatRole } from "@/utils/helpers";
import Button from "./Button";
import Image from "next/image";
import { NotificationCenter } from "./NotificationCenter";
import { FaBell, FaUser, FaChevronDown } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getDashboardPath = () => {
    if (user?.role === "superAdmin") return "/dashboard/superAdmin";
    if (user?.role === "authority") return "/dashboard/authority";
    if (user?.role === "problemSolver") return "/dashboard/problemSolver";
    if (user?.role === "user") return "/dashboard/user";
    return "/dashboard";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-0 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo/logo.png"
              alt="NagarNirman Logo"
              width={160}
              height={50}
              className="w-auto h-15 object-contain"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium transition-colors duration-200 ${isActiveLink("/")
                  ? "text-[#2a7d2f] font-semibold"
                  : "text-[#374151] hover:text-[#81d586]"
                }`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <Link
                href={getDashboardPath()}
                className={`font-medium transition-colors duration-200 ${isActiveLink("/dashboard")
                    ? "text-[#2a7d2f] font-semibold"
                    : "text-[#374151] hover:text-[#81d586]"
                  }`}
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/reports"
              className={`font-medium transition-colors duration-200 ${isActiveLink("/reports")
                  ? "text-[#2a7d2f] font-semibold"
                  : "text-[#374151] hover:text-[#81d586]"
                }`}
            >
              All Reports
            </Link>

            <Link
              href="/map-search"
              className={`font-medium transition-colors duration-200 ${isActiveLink("/map-search")
                  ? "text-[#2a7d2f] font-semibold"
                  : "text-[#374151] hover:text-[#81d586]"
                }`}
            >
              Map Search
            </Link>

            <div className="relative group">
              <Link
                href="/about"
                className={`font-medium transition-colors duration-200 ${isActiveLink("/about")
                    ? "text-[#2a7d2f] font-semibold"
                    : "text-[#374151] hover:text-[#81d586]"
                  }`}
              >
                About
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                <Link
                  href="/about"
                  className="block px-4 py-3 text-[#374151] hover:bg-[#F6FFF9] hover:text-[#2a7d2f] rounded-t-lg font-medium transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/about-team"
                  className="block px-4 py-3 text-[#374151] hover:bg-[#F6FFF9] hover:text-[#2a7d2f] rounded-b-lg font-medium transition-colors"
                >
                  Meet the Team
                </Link>
              </div>
            </div>

            <Link
              href="/gallery"
              className={`font-medium transition-colors duration-200 ${isActiveLink("/gallery")
                  ? "text-[#2a7d2f] font-semibold"
                  : "text-[#374151] hover:text-[#81d586]"
                }`}
            >
              Gallery
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <NotificationCenter />

                {/* User Profile with Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#81d586] rounded-full flex items-center justify-center text-white font-semibold">
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <FaUser className="w-5 h-5" />
                        )}
                      </div>
                      <div className="hidden md:flex flex-col items-start text-left">
                        <span className="text-sm font-semibold text-[#002E2E] leading-tight">
                          {user.name}
                        </span>
                        <span className="text-xs text-[#6B7280] leading-tight">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <FaChevronDown
                      className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#81d586] rounded-full flex items-center justify-center text-white font-semibold">
                            {user.profilePicture ? (
                              <Image
                                src={user.profilePicture}
                                alt={user.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <FaUser className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#002E2E]">
                              {user.name}
                            </span>
                            <span className="text-xs text-[#6B7280]">
                              {user.email}
                            </span>
                            <span className="text-xs text-[#81d586] font-medium mt-1">
                              {formatRole(user.role)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          href={getDashboardPath()}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-[#374151] hover:bg-[#F6FFF9] hover:text-[#2a7d2f] rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUser className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={`/dashboard/${user.role}/profile`}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-[#374151] hover:bg-[#F6FFF9] hover:text-[#2a7d2f] rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUser className="w-4 h-4" />
                          My Profile
                        </Link>
                      </div>

                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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