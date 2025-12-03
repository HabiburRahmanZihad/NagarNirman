"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002E2E] text-white mt-auto py-6 md:pt-8 footer">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <Link href="/" className="shrink-0">
              <Image
                src="/logo/logo.png"
                alt="NagarNirman Logo"
                width={160}
                height={50}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-sm text-gray-300 pt-4">
              Report. Resolve. Rebuild. Building smarter, cleaner, and more
              transparent cities across Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div className="relative">
            <h3 className="text-lg font-bold mb-6">Quick Links<div className="underline"><span></span></div></h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  Browse Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/reports/new"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  Report Issue
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* User Resources */}
          <div className="relative">
            <h3 className="text-lg font-bold mb-6">For Users<div className="underline"><span></span></div></h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard/user"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/authority"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  Authority Panel
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/problemSolver"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  Problem Solver
                </Link>
              </li>
              <li>
                <Link
                  href="/apply"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  Become Solver
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-[#81d586] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started Section */}
          <div className="relative">
            <h3 className="text-lg font-bold mb-6">Get Started<div className="underline"><span></span></div></h3>
            <p className="text-sm text-gray-300 mb-4">
              Join us in making Bangladesh&apos;s cities better for everyone.
            </p>
            <div className="space-y-2">
              
            </div>
          </div>
        </div>

        <div className="border-t w-full border-gray-700 pt-12 text-center text-sm text-gray-300">
          <p>
            &copy; 2025 NagarNirman. All rights reserved. | Aligned with SDG 11
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
