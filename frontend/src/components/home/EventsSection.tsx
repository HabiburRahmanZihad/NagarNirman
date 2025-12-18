"use client";

import React from "react";
import { MapPin, Clock, ArrowRight, Sprout, Calendar } from "lucide-react";
import Button from "@/components/common/Button";
import Image from "next/image";
import { MdEventNote } from "react-icons/md";

// --- EVENT DATA ---
const events = [
  {
    id: 1,
    day: "20",
    month: "March",
    year: "2026",
    title: "Tree Plantation Challenge",
    location: "Jones Street, New York",
    time: "8:30am - 4:00pm",
    joinedCount: "236",
    category: "Tree Plantation",
    image:
      "https://res.cloudinary.com/dc3ul4egd/image/upload/v1765705440/nasim-uddin-ZozuoeZ1eL4-unsplash_skq4ug.jpg",
    avatars: [
      "https://i.pravatar.cc/100?img=11",
      "https://i.pravatar.cc/100?img=12",
      "https://i.pravatar.cc/100?img=13",
    ],
  },
  {
    id: 2,
    day: "28",
    month: "February",
    year: "2026",
    title: "Forest Cleaning Challenge",
    location: "Los Angeles",
    time: "10:30am - 4:00pm",
    joinedCount: "49",
    category: "Forest",
    image:
      "https://images.unsplash.com/photo-1713931750497-1428b117158b?q=80&w=1569&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    avatars: [
      "https://i.pravatar.cc/100?img=33",
      "https://i.pravatar.cc/100?img=32",
      "https://i.pravatar.cc/100?img=31",
    ],
  },
  {
    id: 3,
    day: "12",
    month: "April",
    year: "2026",
    title: "City Drain Cleanup Drive",
    location: "Mirpur 10, Dhaka",
    time: "9:00am - 1:00pm",
    joinedCount: "184",
    category: "Drainage & Sanitation",
    image:
      "https://images.unsplash.com/photo-1706640254392-4648f5aac0d6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    avatars: [
      "https://i.pravatar.cc/100?img=44",
      "https://i.pravatar.cc/100?img=45",
      "https://i.pravatar.cc/100?img=46",
    ],
  },
];

export default function EventsSection() {
  return (
    <section className=" px-4 sm:px-6 md:px-8 lg:px-10 font-sans">
      <div className="container mx-auto">
        {/* --- HEADER --- */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <MdEventNote className="w-8 h-8 sm:w-5 sm:h-5 text-[#004d40]" />
            <span className="text-[#555555] text-sm sm:text-base md:text-lg font-medium">
              Upcoming Event
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary px-2 sm:px-0">
            Our Events, Let&apos;s All Participate
          </h2>
        </div>

        {/* --- EVENTS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sm:border-2 sm:border-[#F7CE50] group overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300"
            >
              {/* === CONTENT SECTION === */}
              <div className="p-5 sm:p-6 md:p-8 pb-0 flex-grow">
                {/* 1. TOP ROW: Date & Avatars */}
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  {/* Left: Date Block */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Calendar className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-[#777777] stroke-[1.5] flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <span className="text-3xl xs:text-4xl sm:text-5xl font-bold text-[#004d40] leading-none">
                        {event.day}
                      </span>
                      <div className="flex flex-col text-xs sm:text-sm font-medium text-[#777777] leading-tight">
                        <span className="text-sm sm:text-base text-[#333]">
                          {event.month}
                        </span>
                        <span>in {event.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Avatars & Count */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex -space-x-2 xs:-space-x-3">
                      {event.avatars.map((avatar, i) => (
                        <div key={i} className="relative">
                          <img
                            src={avatar}
                            alt="User"
                            className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full border-[2px] border-white object-cover"
                            loading="lazy"
                          />
                          {/* Plus Icon on last avatar */}
                          {i === 2 && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center border-[2px] border-white text-white text-[8px] xs:text-[10px] font-bold">
                              +
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="block font-bold text-[#004d40] text-base xs:text-lg leading-none">
                        {event.joinedCount}
                      </span>
                      <span className="text-xs text-[#777777] whitespace-nowrap">
                        Joined People
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. HORIZONTAL DIVIDER */}
                <div className="w-full h-px bg-gray-200 mb-4 sm:mb-6"></div>

                {/* 3. INFO SECTION */}
                <div className="mb-6 sm:mb-8">
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#004d40] mb-2 sm:mb-3 group-hover:text-[#eab308] transition-colors duration-300 leading-tight">
                    {event.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex flex-col xs:flex-row xs:flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-[#777777] font-medium text-xs sm:text-sm mb-4 sm:mb-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#777]" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#777]" />
                      {event.time}
                    </div>
                  </div>

                  {/* Button */}
                  <a
                    href="https://www.facebook.com/nagarnirnanbangladesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full xs:w-auto text-xs sm:text-sm"
                    >
                      Join Event
                    </Button>
                  </a>
                </div>
              </div>

              {/* === IMAGE SECTION === */}
              <div className="relative h-[200px] xs:h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] w-full mt-auto overflow-hidden">
                {/* SHAPE DIVIDER */}
                <div className="absolute -top-px left-0 w-full z-10 leading-none pointer-events-none">
                  <div className="relative w-full h-4 sm:h-6 md:h-8">
                    <Image
                      src="https://econest-html.netlify.app/econest/assets/img/shapes/shape-3.webp"
                      alt="shape"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                </div>

                {/* MAIN IMAGE */}
                <div className="relative w-full h-full">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>

                {/* GLASSMORPHISM BADGE */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-20 group/badge">
                  <div className="bg-black/30 backdrop-blur-md border border-white/20 py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-full flex items-center shadow-lg transition-all duration-500 ease-in-out hover:px-3 sm:hover:px-4 md:hover:px-5 cursor-pointer active:scale-95">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover/badge:bg-[#eab308] transition-colors">
                      <Sprout className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <div className="max-w-0 overflow-hidden group-hover/badge:max-w-[120px] sm:group-hover/badge:max-w-[160px] md:group-hover/badge:max-w-[200px] transition-all duration-500 ease-in-out">
                      <span className="text-white font-medium text-xs sm:text-sm whitespace-nowrap pl-2 sm:pl-3 pr-1">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}