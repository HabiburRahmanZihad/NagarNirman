"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
    <footer className="relative bg-[#002E2E] text-white py-6 md:pt-12">
      <div className="container mx-auto  py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:mb-12 mb-6 md:px-6">
          {/* About Section */}
          <div className="space-y-4">
            <Link href={PUBLIC_ROUTES.HOME} className="group">
              <div className="flex items-center gap-3 transition-transform duration-300 group-hover:scale-105">
                <div className="bg-accent/60 p-2 rounded-xl shadow-lg  transition-colors duration-300">
                  <Image
                    src="https://i.postimg.cc/VNNxsGXy/favicon.webp"
                    alt="NagarNirman Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-accent group-hover:text-accent transition-colors duration-300">
                  NagarNirman
                </h3>
              </div>
            </Link>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed pt-2 md:pt-4">
              Empowering communities to build cleaner, greener cities through collaborative problem-solving and sustainable development initiatives.
            </p>

            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 hover:bg-primary/20 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                We Are Available!
              </h3>
              <p className="text-sm text-gray-300">
                Mon-Sat: 10:00 AM to 07:30 PM
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 pt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="bg-primary/20 hover:bg-primary border w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 group">
                <FaFacebookF size={20} className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="bg-accent/20 hover:bg-accent w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/50 group">
                <FaXTwitter size={20} className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="bg-primary/20 hover:bg-primary border w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 group">
                <FaInstagram size={20} className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                aria-label="Connect with us on LinkedIn"
                className="bg-accent/20 hover:bg-accent w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/50 group">
                <FaLinkedinIn size={20} className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:pl-12">
            <h3 className="text-xl font-bold mb-6 text-accent flex items-center gap-2">
              <FaLink className="text-lg" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {getQuickLinks().map((link, index) => (
                <li key={index} className="flex items-center group">
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-all duration-300 md:text-base font-medium hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                  <span className="ml-2 opacity-0 text-accent group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    <LucideArrowUpRight size={18} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:pl-8">
            <h3 className="text-xl font-bold mb-6 text-accent flex items-center gap-2">
              <FaBook className="text-lg" />
              <span>Resources</span>
            </h3>
            <ul className="space-y-3">
              {getResources().map((link, index) => (
                <li key={index} className="flex items-center group">
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-all duration-300 md:text-base font-medium hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                  <span className="ml-2 opacity-0 text-primary group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    <LucideArrowUpRight size={18} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch Section */}
          <div className="text-gray-300">
            <h3 className="text-xl font-bold mb-6 text-accent flex items-center gap-2">
              <FaComments className="text-lg" />
              <span>Get in Touch</span>
            </h3>
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3 group">
                <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-accent group-hover:scale-110">
                  <CiLocationOn size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">Address</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 group">
                <div className="bg-accent w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                  <SiMinutemailer size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">Email</h3>
                  <a href="mailto:support@nagarnirman.com" className="text-sm text-gray-300 hover:text-accent transition-colors">
                    support@nagarnirman.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 group">
                <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-accent group-hover:scale-110">
                  <FaPhoneAlt size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">Phone</h3>
                  <a href="tel:+8801950719346" className="text-sm text-gray-300 hover:text-accent transition-colors">
                    +880 1950 719346
                  </a>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  iconPosition="right"
                  className="w-full"
                  onClick={() => window.location.href = '/reports/new'}
                >
                  Report an Issue
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <div className="bg-primary text-sm text-white rounded-2xl shadow-2xl py-5 px-6 hover:bg-accent transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <p className="text-base font-semibold text-center md:text-left">
                  &copy; 2025 NagarNirman. All rights reserved.
                </p>
                <span className="hidden md:inline text-white/60">|</span>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <span className="text-sm font-medium">Aligned with</span>
                  <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">SDG 11</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Link href={PUBLIC_ROUTES.TERMS} className="hover:text-white/80 transition-colors font-medium">
                  Terms & Conditions
                </Link>
                <span className="text-white/60">·</span>
                <Link href={PUBLIC_ROUTES.PRIVACY} className="hover:text-white/80 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </footer>
  );
};

export default Footer;
