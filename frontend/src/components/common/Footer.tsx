'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002E2E] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">NagarNirman</h3>
            <p className="text-sm text-gray-300">
              Report. Resolve. Rebuild. Building smarter, cleaner, and more transparent cities across Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  Browse Reports
                </Link>
              </li>
              <li>
                <Link href="/reports/new" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* User Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">For Users</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/user" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/authority" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  Authority Panel
                </Link>
              </li>
              <li>
                <Link href="/dashboard/solver" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  Problem Solver
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  Become Solver
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-[#81d586] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Get Started</h3>
            <p className="text-sm text-gray-300 mb-4">
              Join us in making Bangladesh&apos;s cities better for everyone.
            </p>
            <div className="space-y-2">
              <Link href="/auth/register" className="block bg-[#81d586] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#67c173] transition-colors text-center">
                Register Now
              </Link>
              <Link href="/auth/login" className="block border border-[#81d586] text-[#81d586] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#81d586] hover:text-white transition-colors text-center">
                Login
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>&copy; {currentYear} NagarNirman. All rights reserved. | Aligned with SDG 11</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
