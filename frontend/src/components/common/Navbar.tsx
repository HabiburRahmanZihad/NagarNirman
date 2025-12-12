"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatRole } from "@/utils/helpers";
import Button from "./Button";
import Image from "next/image";
import { NotificationCenter } from "./NotificationCenter";
import {
  FaUser,
  FaChevronDown,
  FaHome,
  FaTachometerAlt,
  FaFileAlt,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaImages,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { IoGitNetworkSharp } from "react-icons/io5";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === "/";
  const [windowWidth, setWindowWidth] = useState(0);

  // Check screen size and scroll position
  useEffect(() => {
    const checkWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkWidth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isMobile = windowWidth < 1024; // Mobile and Tablet (< 1024px)
  const isDesktop = windowWidth >= 1024; // Desktop (≥ 1024px)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-mobile-toggle]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/about") {
      return pathname === "/about" || pathname === "/about-team";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const getDashboardPath = () => {
    if (user?.role === "superAdmin") return "/dashboard/superAdmin";
    if (user?.role === "authority") return "/dashboard/authority";
    if (user?.role === "problemSolver") return "/dashboard/problemSolver";
    if (user?.role === "user") return "/dashboard/user";
    return "/dashboard";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <FaHome className="w-4 h-4" /> },
    { href: "/map-search", label: "Map Search", icon: <FaMapMarkedAlt className="w-4 h-4" /> },
    { href: "/how-it-works", label: "How It Works", icon: <IoGitNetworkSharp className="w-4 h-4" /> },
    { href: "/reports", label: "All Reports", icon: <FaFileAlt className="w-4 h-4" /> },
    { href: "/earthquakes", label: "Earthquakes", icon: <FaFileAlt className="w-4 h-4" /> },
    // ...(isAuthenticated ? [{
    //   href: getDashboardPath(),
    //   label: "Dashboard",
    //   icon: <FaTachometerAlt className="w-4 h-4" />
    // }] : []),
    {
      href: "/about",
      label: "About",
      icon: <FaInfoCircle className="w-4 h-4" />,
      subLinks: [
        { href: "/about", label: "About Us" },
        { href: "/about-team", label: "Meet the Team" }
      ]
    },
    { href: "/gallery", label: "Gallery", icon: <FaImages className="w-4 h-4" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get navbar background based on page and screen size
  const getNavbarBackground = () => {
    if (isMobile) {
      return "bg-white shadow-sm";
    }
    if (isHomePage && isDesktop) {
      return isScrolled ? "bg-white/80 backdrop-blur-sm" : "bg-transparent";
    }
    return "bg-white shadow-sm";
  };

  // Get link colors with primary color highlight
  const getLinkColor = (href: string) => {
    const active = isActiveLink(href);

    if (active) {
      return isHomePage && isDesktop && !isScrolled
        ? "text-[#004d40] font-semibold bg-white/35"
        : "text-[#004d40] font-semibold bg-gray-100";
    }

    if (isHomePage && isDesktop && !isScrolled) {
      return "text-gray-100 hover:text-white hover:bg-white/20";
    }

    return "text-gray-700 hover:text-[#004d40] hover:bg-gray-50";
  };

  // Get button colors
  const getButtonClass = () => {
    if (isHomePage && isDesktop && !isScrolled) {
      return "bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20";
    }
    return "";
  };

  // Get user menu text color
  const getUserTextColor = () => {
    if (isHomePage && isDesktop && !isScrolled) {
      return "text-white";
    }
    return "text-gray-700";
  };

  // Get user subtext color
  const getUserSubtextColor = () => {
    if (isHomePage && isDesktop && !isScrolled) {
      return "text-gray-300";
    }
    return "text-gray-500";
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${getNavbarBackground()}`}>
      <div className="container mx-auto px-4 lg:px-0">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Fixed for all screens */}
          <Link href="/" className="shrink-0">
            <div className={`relative w-50 h-15 ${isHomePage && isDesktop && !isScrolled ? 'bg-white/35 backdrop-blur-sm rounded-lg p-2' : ''}`}>
              <Image
                src="/logo/logo.png"
                alt="NagarNirman Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links - Centered */}
          {isDesktop && (
            <div className="hidden lg:flex items-center justify-center flex-1">
              {isHomePage && !isScrolled ? (
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 h-15">
                  {navLinks.map((link) => (
                    <div key={link.href} className="relative group">
                      <Link
                        href={link.href}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 min-w-[100px] ${getLinkColor(link.href)}`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                        {link.subLinks && (
                          <FaChevronDown className="w-3 h-3 ml-1" />
                        )}
                      </Link>

                      {/* Submenu for About */}
                      {link.subLinks && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          {link.subLinks.map((subLink) => (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              className={`block px-4 py-3 text-gray-700 hover:text-[#004d40] hover:bg-gray-50/80 font-medium transition-colors ${isActiveLink(subLink.href) ? 'text-[#004d40] font-semibold' : ''}`}
                            >
                              {subLink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  {navLinks.map((link) => (
                    <div key={link.href} className="relative group">
                      <Link
                        href={link.href}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 min-w-[100px] ${isActiveLink(link.href) ? 'text-[#004d40] font-semibold bg-gray-100' : 'text-gray-700 hover:text-[#004d40] hover:bg-gray-50'}`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                        {link.subLinks && (
                          <FaChevronDown className="w-3 h-3 ml-1" />
                        )}
                      </Link>

                      {/* Submenu for About */}
                      {link.subLinks && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          {link.subLinks.map((subLink) => (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              className={`block px-4 py-3 text-gray-700 hover:text-[#004d40] hover:bg-gray-50 font-medium transition-colors ${isActiveLink(subLink.href) ? 'text-[#004d40] font-semibold' : ''}`}
                            >
                              {subLink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Side Components */}
          <div className="flex items-center gap-4">
            {/* Desktop User/Auth Section */}
            {isDesktop && (
              <div className={`flex items-center gap-2 ${isHomePage && !isScrolled ? 'bg-white/30 backdrop-blur-sm rounded-lg px-2 py-1' : ''}`}>
                {isAuthenticated && user ? (
                  <>
                    <NotificationCenter />

                    {/* User Profile with Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/20 transition-colors duration-200 ${getUserTextColor()}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${isHomePage && !isScrolled ? 'bg-white/20 text-white' : 'bg-[#004d40] text-white'}`}>
                          {user.profilePicture ? (
                            <Image
                              src={user.profilePicture}
                              alt={user.name}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <FaUser className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-semibold leading-tight text-primary">
                            {user.name}
                          </span>
                          <span className={`text-xs leading-tight truncate max-w-[120px] ${getUserSubtextColor()}`}>
                            {user.email}
                          </span>
                        </div>
                        <FaChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""} ${getUserSubtextColor()}`}
                        />
                      </button>

                      {/* User Dropdown Menu */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#004d40] rounded-full flex items-center justify-center text-white font-semibold">
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
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">
                                  {user.name}
                                </span>
                                <span className="text-xs text-gray-600 truncate max-w-[150px]">
                                  {user.email}
                                </span>
                                <span className="text-xs text-[#004d40] font-medium mt-1 bg-gray-100 px-2 py-1 rounded">
                                  {formatRole(user.role)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-2">
                            <Link
                              href={getDashboardPath()}
                              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isActiveLink(getDashboardPath()) ? 'text-[#004d40] font-semibold bg-gray-50' : 'text-gray-700 hover:text-[#004d40] hover:bg-gray-50'}`}
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <FaTachometerAlt className="w-4 h-4" />
                              Dashboard
                            </Link>
                            <Link
                              href={`/dashboard/${user.role}/profile`}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#004d40] hover:bg-gray-50 rounded-lg transition-colors"
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
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-10 border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-10 bg-primary hover:bg-accent text-white"
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Mobile & Tablet View (< 1024px): [LOGO] [NOTIFICATION] [HAMBURGER] */}
            {isMobile && (
              <div className="flex items-center gap-4">
                {isAuthenticated && (
                  <NotificationCenter />
                )}

                {/* Hamburger Menu Toggle */}
                <button
                  data-mobile-toggle
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <FaTimes className="w-6 h-6 text-gray-700" />
                  ) : (
                    <FaBars className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Menu (< 1024px) */}
        {isMobile && isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-40"
          >
            <div className="container mx-auto px-4 py-4">
              {/* User Info - Inside hamburger menu */}
              {isAuthenticated && user && (
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-[#004d40] rounded-full flex items-center justify-center text-white font-semibold">
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
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600 truncate">{user.email}</div>
                      <div className="text-xs text-[#004d40] font-medium mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                        {formatRole(user.role)}
                      </div>
                    </div>
                  </div>

                  {/* Quick User Links */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={getDashboardPath()}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${isActiveLink(getDashboardPath()) ? 'bg-[#004d40] text-white' : 'bg-gray-50 hover:bg-[#004d40] hover:text-white'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaTachometerAlt className="w-5 h-5 mb-1" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                    <Link
                      href={`/dashboard/${user.role}/profile`}
                      className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-[#004d40] hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaUser className="w-5 h-5 mb-1" />
                      <span className="text-sm">Profile</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links - Inside hamburger menu */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <div key={link.href} className="mb-1">
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActiveLink(link.href) ? "text-[#004d40] bg-gray-50 font-semibold" : "text-gray-700 hover:text-[#004d40] hover:bg-gray-50"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>

                    {/* Submenu for About */}
                    {link.subLinks && (
                      <div className="ml-8 mt-1 space-y-1">
                        {link.subLinks.map((subLink) => (
                          <Link
                            key={subLink.href}
                            href={subLink.href}
                            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${isActiveLink(subLink.href) ? "text-[#004d40] font-semibold" : "text-gray-600 hover:text-[#004d40]"}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-1 h-1 bg-[#004d40] rounded-full"></div>
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Auth Buttons - Inside hamburger menu */}
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href="/auth/login"
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border font-medium transition-colors ${isActiveLink('/auth/login') ? 'border-[#004d40] text-[#004d40]' : 'border-gray-300 text-gray-700 hover:border-[#004d40] hover:text-[#004d40]'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaUser className="w-4 h-4" />
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${isActiveLink('/auth/register') ? 'bg-[#004d40] text-white' : 'bg-[#004d40] text-white hover:bg-[#004d40]/90'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaUser className="w-4 h-4" />
                      Register
                    </Link>
                  </div>
                )}

                {/* Logout Button - Inside hamburger menu */}
                {isAuthenticated && user && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;