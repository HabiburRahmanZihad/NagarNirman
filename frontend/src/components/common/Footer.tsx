"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { SiMinutemailer } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";
import { LucideArrowUpRight } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002E2E] text-white py-6 md:pt-8 ">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:mb-12 mb-6 md:px-30">
          {/* About Section */}
          <div>
            <Link href="/" className="">
              <div className="flex items-center gap-[10px]">
                <Image
                  src="https://i.postimg.cc/VNNxsGXy/favicon.webp"
                  alt="NagarNirman Logo"
                  width={40}
                  height={30}
                  className="object-contain"
                />
                <h3 className="text-2xl md:text-[27px] font-bold text-gray-300">Econest</h3>
              </div>
            </Link>

            <p className="text-sm md:text-[15px] text-gray-300 pt-4">
              Introducing our team of talented and skilled professionals who are
              ready to increase your productivity and bring your business.
            </p>
            <h3 className="text-lg pt-3 md:pt-4 text-gray-300">
              We Are Available !!
            </h3>
            <h5 className="text-sm pt-2 text-gray-300">
              Mon-Sat: 10:00am to 07:30pm
            </h5>
          </div>

          {/* Quick Links */}
          <div className="md:pl-20">
            <h3 className="text-xl font-bold mb-6 text-gray-300">
              <span className="text-xl">🌿</span>Quick Links
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center group">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  About Company
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Our causes
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Investor Presentation
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Pricing Plan
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Meet Our Team
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Contact Us
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
            </ul>
          </div>

          {/* User Resources */}
          <div className="md:pl-12">
            <h3 className="text-xl font-bold mb-6 text-gray-300">
              <span className="text-xl">🌿</span>Our Service
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center group">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Tree Plantatio
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Forest Cleaning
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Plastic Recycling
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Natural Power
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Renewable Energy
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
              <li className="flex items-center group pt-1">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#81d586] transition-colors md:text-[16px]"
                >
                  Water Refine
                </Link>

                <span className="ml-1 opacity-0 text-[#81d586] group-hover:opacity-100 transition-opacity duration-300">
                  <LucideArrowUpRight size={20} />
                </span>
              </li>
            </ul>
          </div>

          {/* Get Started Section */}
          <div className="text-gray-300">
            <h3 className="text-xl font-bold mb-6">
              <span className="text-xl">🌿</span>Get in Touch
            </h3>
            <div className="space-y-2">
              {/* location */}
              <div className="flex items-center gap-3">
                <div className="bg-gray-500 w-10 h-10 flex items-center justify-center rounded-full">
                  <CiLocationOn size={26} className="" />
                </div>
                <div className="">
                  <h3 className="text-lg">Address</h3>
                  <p className="md:text-[16px] text-gray-300">
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
                  <p className="md:text-[16px] text-gray-300">
                    Support@example.com
                  </p>
                </div>
              </div>
              {/* location */}
              <div className="flex items-center gap-3 pt-2 mb-8">
                <div className="bg-gray-500 w-10 h-10 flex items-center justify-center rounded-full">
                  <FaPhoneAlt size={20} className="" />
                </div>
                <div className="">
                  <h3 className="text-lg">Phone</h3>
                  <p className="md:text-[16px] text-gray-300">
                    +880 1950719346
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full py-4 md:py-5 bg-[#2a7d2f] text-sm text-gray-300 rounded-2xl">
          <div className="md:flex justify-around py-2 md:py-0">
            <p className="text-[16px]">
              &copy; 2025 NagarNirman. All rights reserved. | Aligned with SDG
              11
            </p>
            <p className="pt-1 text-[16px]">
              Terms & Condition · Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
