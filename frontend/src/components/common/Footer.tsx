"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CiLocationOn } from "react-icons/ci";
import { SiMinutemailer } from "react-icons/si";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaLink, FaBook, FaComments } from "react-icons/fa";
import { LucideArrowUpRight } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import Button from "./Button";
import { PUBLIC_ROUTES, USER_ROUTES, AUTHORITY_ROUTES, SOLVER_ROUTES, AUTH_ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

const Footer: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  // Check if a route is active
  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  // Role-based Quick Links
  const getQuickLinks = () => {
    if (!user) {
      return [
        { label: "About Us", href: PUBLIC_ROUTES.ABOUT },
        { label: "Our Team", href: PUBLIC_ROUTES.ABOUT_TEAM },
        { label: "Map View", href: PUBLIC_ROUTES.REPORT_MAP },
        { label: "Login", href: AUTH_ROUTES.LOGIN },
        { label: "Register", href: AUTH_ROUTES.REGISTER },
        { label: "FAQ", href: PUBLIC_ROUTES.FAQ },
      ];
    }

    const commonLinks = [
      { label: "About Us", href: PUBLIC_ROUTES.ABOUT },
      { label: "Our Team", href: PUBLIC_ROUTES.ABOUT_TEAM },
      { label: "Map View", href: PUBLIC_ROUTES.REPORT_MAP },
    ];

    if (user.role === 'authority') {
      return [
        ...commonLinks,
        { label: "Dashboard", href: AUTHORITY_ROUTES.DASHBOARD },
        { label: "Applications", href: AUTHORITY_ROUTES.APPLICATIONS },
        { label: "Assign Tasks", href: AUTHORITY_ROUTES.ASSIGN },
      ];
    }

    if (user.role === 'problemSolver') {
      return [
        ...commonLinks,
        { label: "Dashboard", href: SOLVER_ROUTES.DASHBOARD },
        { label: "My Tasks", href: SOLVER_ROUTES.TASKS },
        { label: "Statistics", href: SOLVER_ROUTES.STATISTICS },
      ];
    }

    // Regular user
    return [
      ...commonLinks,
      { label: "Dashboard", href: USER_ROUTES.DASHBOARD },
      { label: "My Reports", href: USER_ROUTES.MY_REPORTS },
      { label: "Report Issue", href: PUBLIC_ROUTES.REPORT },
    ];
  };

  // Role-based Resources
  const getResources = () => {
    if (!user) {
      return [
        { label: "Help Center", href: PUBLIC_ROUTES.HELP },
        { label: "Community Guidelines", href: PUBLIC_ROUTES.GUIDELINES },
        { label: "View Reports", href: PUBLIC_ROUTES.REPORT },
        { label: "Privacy Policy", href: PUBLIC_ROUTES.PRIVACY },
        { label: "Terms of Service", href: PUBLIC_ROUTES.TERMS },
      ];
    }

    const commonResources = [
      { label: "Help Center", href: PUBLIC_ROUTES.HELP },
      { label: "Community Guidelines", href: PUBLIC_ROUTES.GUIDELINES },
      { label: "Privacy Policy", href: PUBLIC_ROUTES.PRIVACY },
      { label: "Terms of Service", href: PUBLIC_ROUTES.TERMS },
    ];

    if (user.role === 'authority') {
      return [
        ...commonResources,
        { label: "Review Applications", href: AUTHORITY_ROUTES.APPLICATIONS },
        { label: "Analytics", href: AUTHORITY_ROUTES.ANALYTICS },
      ];
    }

    if (user.role === 'problemSolver') {
      return [
        ...commonResources,
        { label: "Task History", href: SOLVER_ROUTES.HISTORY },
        { label: "Leaderboard", href: SOLVER_ROUTES.LEADERBOARD },
      ];
    }

    // Regular user
    return [
      ...commonResources,
      { label: "Become a Solver", href: "/dashboard/user/join-as-a-Problem-Solver" },
      { label: "Submit Report", href: "/reports/new" },
    ];
  };

  return (
    <footer className="relative bg-linear-to-br from-gray-900 to-[#004d40] text-white">
      {/* Decorative top shape - Hidden on mobile, shown on medium+ */}
      <div className="w-full absolute -top-10">
        <Image
          src={"/images/footer-shape.webp"}
          alt="footer-shape"
          width={500}
          height={500}
          className="w-fit h-16"
        >
        </Image>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 md:pt-20 pb-26">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 md:mb-12">
          {/* About Section - Full width on mobile, then 2 cols, then 1 of 4 */}
          <div className="sm:col-span-1 space-y-4 sm:space-y-5 md:space-y-6">
            <Link href={PUBLIC_ROUTES.HOME} className="group inline-block">
              <div className="flex items-center gap-3 transition-transform duration-300 group-hover:scale-105">
                <div className="bg-accent/60 p-2 rounded-xl shadow-lg transition-colors duration-300">
                  <Image
                    src="https://i.postimg.cc/VNNxsGXy/favicon.webp"
                    alt="NagarNirman Logo"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent group-hover:text-accent transition-colors duration-300">
                  NagarNirman
                </h3>
              </div>
            </Link>

            <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
              Empowering communities to build cleaner, greener cities through collaborative problem-solving and sustainable development initiatives.
            </p>

            <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 sm:p-4 hover:bg-primary/20 transition-colors duration-300">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-accent mb-1 sm:mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-pulse"></span>
                We Are Available!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Mon-Sat: 10:00 AM to 07:30 PM
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="bg-primary/20 hover:bg-primary border w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 group">
                <FaFacebookF size={14} className="sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="bg-accent/20 hover:bg-accent w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/50 group">
                <FaXTwitter size={14} className="sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="bg-primary/20 hover:bg-primary border w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 group">
                <FaInstagram size={14} className="sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                aria-label="Connect with us on LinkedIn"
                className="bg-accent/20 hover:bg-accent w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/50 group">
                <FaLinkedinIn size={14} className="sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-accent flex items-center gap-2">
              <FaLink className="text-base sm:text-lg" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {getQuickLinks().map((link, index) => (
                <li key={index} className="flex items-center group">
                  <Link
                    href={link.href}
                    className={`text-xs sm:text-sm md:text-base font-medium hover:translate-x-1 transition-all duration-300 ${isActiveRoute(link.href)
                      ? 'text-accent font-semibold'
                      : 'text-gray-300 hover:text-accent'
                      }`}
                  >
                    {link.label}
                  </Link>
                  <span className={`ml-1 sm:ml-2 transition-all duration-300 group-hover:translate-x-1 ${isActiveRoute(link.href)
                    ? 'opacity-100 text-accent'
                    : 'opacity-0 text-accent group-hover:opacity-100'
                    }`}>
                    <LucideArrowUpRight size={14} className="sm:w-4 sm:h-4" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-accent flex items-center gap-2">
              <FaBook className="text-base sm:text-lg" />
              <span>Resources</span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {getResources().map((link, index) => (
                <li key={index} className="flex items-center group">
                  <Link
                    href={link.href}
                    className={`text-xs sm:text-sm md:text-base font-medium hover:translate-x-1 transition-all duration-300 ${isActiveRoute(link.href)
                      ? 'text-accent font-semibold'
                      : 'text-gray-300 hover:text-accent'
                      }`}
                  >
                    {link.label}
                  </Link>
                  <span className={`ml-1 sm:ml-2 transition-all duration-300 group-hover:translate-x-1 ${isActiveRoute(link.href)
                    ? 'opacity-100 text-primary'
                    : 'opacity-0 text-primary group-hover:opacity-100'
                    }`}>
                    <LucideArrowUpRight size={14} className="sm:w-4 sm:h-4" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch Section */}
          <div className="text-gray-300">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-accent flex items-center gap-2">
              <FaComments className="text-base sm:text-lg" />
              <span>Get in Touch</span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3 group">
                <div className="bg-primary w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-accent group-hover:scale-105 flex-shrink-0">
                  <CiLocationOn size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">Address</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-words">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 group">
                <div className="bg-accent w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-primary group-hover:scale-105 flex-shrink-0">
                  <SiMinutemailer size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">Email</h3>
                  <a
                    href="mailto:support@nagarnirman.com"
                    className="text-xs sm:text-sm text-gray-300 hover:text-accent transition-colors break-all inline-block"
                  >
                    support@nagarnirman.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 group">
                <div className="bg-primary w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-accent group-hover:scale-105 flex-shrink-0">
                  <FaPhoneAlt size={14} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">Phone</h3>
                  <a
                    href="tel:+8801950719346"
                    className="text-xs sm:text-sm text-gray-300 hover:text-accent transition-colors break-all inline-block"
                  >
                    +880 1950 719346
                  </a>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="pt-3 sm:pt-4">
                <Button
                  variant="primary"
                  size="sm"
                  iconPosition="right"
                  className="w-full text-xs sm:text-sm md:text-base py-2 sm:py-2.5"
                  onClick={() => window.location.href = '/about'}
                >
                  About NagarNirman
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700/50">

          <div className="bg-primary text-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 hover:bg-accent transition-colors duration-300">
            <div className="flex flex-col sm:flex-col lg:flex-row justify-center lg:justify-between items-center gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4 text-center sm:text-left order-1 md:order-none">
                <p className="text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap">
                  &copy; 2025 NagarNirman. All rights reserved.
                </p>
                <span className="hidden sm:inline text-white/60">|</span>
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                  <span className="text-xs font-medium">Aligned with</span>
                  <span className="bg-white text-primary px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-bold">SDG 11</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <Link href={PUBLIC_ROUTES.TERMS} className="hover:text-white/80 transition-colors font-medium whitespace-nowrap">
                  Terms & Conditions
                </Link>
                <span className="text-white/60">·</span>
                <Link href={PUBLIC_ROUTES.PRIVACY} className="hover:text-white/80 transition-colors font-medium whitespace-nowrap">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;