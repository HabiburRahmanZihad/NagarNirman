"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { SiMinutemailer } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002E2E] text-white py-6 md:pt-8 footer mt-20">
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
            <h3 className="text-lg pt-2 text-gray-300">We Are Available !!</h3>
            <h5 className="text-sm pt-2 text-gray-300">
              Mon-Sat: 10:00am to 07:30pm
            </h5>
          </div>

          {/* Quick Links */}
          <div className="relative">
            <h3 className="text-lg font-bold mb-6 ">
              Quick Links
              <div className="underline w-[26%]">
                <span></span>
              </div>
            </h3>
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
            <h3 className="text-lg font-bold mb-6">
              For Users
              <div className="underline w-[21%]">
                <span></span>
              </div>
            </h3>
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
          <div className="relative text-gray-300">
            <h3 className="text-lg font-bold mb-6">
              Get in Touch
              <div className="underline w-[29%]">
                <span></span>
              </div>
            </h3>
            <div className="space-y-2">
              {/* location */}
              <div className="flex items-center gap-3">
                <div className="bg-gray-500 w-10 h-10 flex items-center justify-center rounded-full">
                  <CiLocationOn size={26} className="" />
                </div>
                <div className="">
                  <h3 className="text-lg">Address</h3>
                  <p className="text-sm text-gray-300">
                    Kalabagan Lake, Savar, Dhaka
                  </p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-gray-500 w-10 h-10 flex items-center justify-center rounded-full">
                  <SiMinutemailer size={26} className="" />
                </div>
                <div className="">
                  <h3 className="text-lg">Email</h3>
                  <p className="text-sm text-gray-300">Support@example.com</p>
                </div>
              </div>
              {/* location */}
              <div className="flex items-center gap-3 pt-2 mb-8">
                <div className="bg-gray-500 w-10 h-10 flex items-center justify-center rounded-full">
                  <FaPhoneAlt size={20} className="" />
                </div>
                <div className="">
                  <h3 className="text-lg">Phone</h3>
                  <p className="text-sm text-gray-300">+880 1950719346</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full py-4 md:py-5 bg-[#2a7d2f] text-sm text-gray-300 rounded-2xl">
          <div className="md:flex justify-around py-2 md:py-0">
            <p>
              &copy; 2025 NagarNirman. All rights reserved. | Aligned with SDG
              11
            </p>
            <p className="pt-1">Terms & Condition · Privacy Policy</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
