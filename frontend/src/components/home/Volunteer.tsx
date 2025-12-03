"use client";

import React from "react";
import {
  Sprout,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/common/Button";

// --- TEAM DATA ---
const teamMembers = [
  {
    id: 1,
    name: "Joshua Sendu",
    role: "CEO-Founder",
    image: "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg",
  },
  {
    id: 2,
    name: "John Maxwell",
    role: "Team Leader",
    image: "https://img.freepik.com/free-photo/portrait-young-woman-with-natural-make-up_23-2149084945.jpg",
  },
  {
    id: 3,
    name: "Bm Ashik (Moni)",
    role: "Sr. Volunteer",
    image: "https://img.freepik.com/free-photo/close-up-portrait-curly-haired-young-woman-isolated_273609-40305.jpg",
  },
  {
    id: 4,
    name: "Denial Pasha",
    role: "Volunteer",
    image: "https://img.freepik.com/free-photo/handsome-young-man-with-new-stylish-haircut_176420-19637.jpg",
  },
];

export default function TeamSection() {
  return (
    <section className="">
      <div className="container mx-auto">

        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout className="w-5 h-5 text-[#3C6E59]" />
            <span className="text-[#555555] text-lg font-medium tracking-wide">We Are Volunteer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003B31]">
            Together For The Planet
          </h2>
        </div>

        {/* --- TEAM GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {teamMembers.map((member) => (
            // CARD CONTAINER: Added padding (p-3) and background color to create the frame effect
            <div
              key={member.id}
              className="group p-3 rounded-[30px] bg-base-200 hover:shadow-xl transition-all duration-300"
            >
              {/* IMAGE WRAPPER */}
              <div className="relative h-[300px] w-full overflow-hidden rounded-[20px]">
                {/* Main Image with Zoom Effect */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Share Button (Top Right) */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-10 h-10 bg-[#F7CE50] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-transform duration-300 hover:scale-110">
                    <Share2 className="w-4 h-4 text-[#003B31]" />
                  </div>
                </div>

                {/* Social Icons (Vertical Stack below Share button) */}
                <div className="absolute top-16 right-4 z-10 flex flex-col gap-2 items-center">
                  {[Facebook, Twitter, Instagram].map((Icon, i) => (
                    <Link
                      key={i}
                      href="#"
                      className={`
                        w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#555]
                        shadow-sm hover:bg-[#F7CE50] hover:text-[#003B31] transition-all duration-500 ease-out
                        opacity-0 -translate-y-4 invisible
                        group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible
                      `}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* BOTTOM INFO BOX - Now separate with margin-top */}
              <div
                className="mt-3 py-6 text-center rounded-[20px] transition-colors duration-500 bg-white group-hover:bg-[#003B31]"
              >
                <h3
                  className="text-xl font-bold mb-1 text-[#003B31] transition-colors duration-300 group-hover:text-[#F7CE50]"
                >
                  {member.name}
                </h3>
                <p
                  className="text-sm font-medium text-[#777777] transition-colors duration-300 group-hover:text-white"
                >
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOTTOM CTA BAR --- */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-3 px-4 flex flex-col md:flex-row items-center gap-6 border border-gray-100">

            <Link href="/volunteer">
              <Button
                variant="primary"
                size="lg"
                iconPosition="right"
              >
                If you want, you can join us
              </Button>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}