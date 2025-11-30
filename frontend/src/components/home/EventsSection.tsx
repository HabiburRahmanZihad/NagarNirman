"use client";

import React from "react";
import { MapPin, Clock, ArrowRight, Sprout, Calendar } from "lucide-react";

// --- EVENT DATA ---
const events = [
  {
    id: 1,
    day: "20",
    month: "March",
    year: "2025",
    title: "Tree Plantation Challenge",
    location: "Jones Street, New York",
    time: "8:30am - 4:00pm",
    joinedCount: "236",
    category: "Tree Plantation",
    image:
      "https://img.freepik.com/free-photo/group-happy-diverse-volunteers-planting-tree-park_1150-13639.jpg",
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
    year: "2025",
    title: "Forest Cleaning Challenge",
    location: "Los Angeles",
    time: "10:30am - 4:00pm",
    joinedCount: "49",
    category: "Forest",
    image:
      "https://img.freepik.com/free-photo/volunteers-collecting-trash-park_1150-13725.jpg",
    avatars: [
      "https://i.pravatar.cc/100?img=33",
      "https://i.pravatar.cc/100?img=32",
      "https://i.pravatar.cc/100?img=31",
    ],
  },
];

export default function EventsSection() {
  return (
    <section className="bg-white py-24 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout className="w-5 h-5 text-[#004d40]" />
            <span className="text-[#555555] text-lg font-medium">
              Upcoming Event
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#004d40]">
            Our Events, Let&apos;s All Participate
          </h2>
        </div>

        {/* --- EVENTS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              // Changed structure: Flex-col allows separate padding for content vs image
              className="flex flex-col bg-white rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* === CONTENT SECTION (With Padding) === */}
              <div className="p-8 pb-0 flex-grow">
                {/* 1. TOP ROW: Date & Avatars */}
                <div className="flex justify-between items-center mb-6">
                  {/* Left: Date Block */}
                  <div className="flex items-center gap-4">
                    <Calendar className="w-10 h-10 text-[#777777] stroke-[1.5]" />
                    <div className="flex items-center gap-2">
                      <span className="text-5xl font-bold text-[#004d40] leading-none">
                        {event.day}
                      </span>
                      <div className="flex flex-col text-sm font-medium text-[#777777] leading-tight">
                        <span className="text-base text-[#333]">
                          {event.month}
                        </span>
                        <span>in {event.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Avatars & Count */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {event.avatars.map((avatar, i) => (
                        <div key={i} className="relative">
                          <img
                            src={avatar}
                            alt="User"
                            className="w-10 h-10 rounded-full border-[2px] border-white object-cover"
                          />
                          {/* Plus Icon on last avatar */}
                          {i === 2 && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center border-[2px] border-white text-white text-[10px] font-bold">
                              +
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="block font-bold text-[#004d40] text-lg leading-none">
                        {event.joinedCount}
                      </span>
                      <span className="text-xs text-[#777777]">
                        Joined People
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. HORIZONTAL DIVIDER */}
                <div className="w-full h-px bg-gray-200 mb-6"></div>

                {/* 3. INFO SECTION */}
                <div className="mb-8">
                  {/* Title */}
                  <h3 className="text-[28px] font-bold text-[#004d40] mb-3 group-hover:text-[#eab308] transition-colors duration-300 leading-tight">
                    {event.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#777777] font-medium text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#777]" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#777]" />
                      {event.time}
                    </div>
                  </div>

                  {/* Button */}
                  <button className="flex items-center gap-3 bg-[#eab308] text-[#004d40] pl-6 pr-2 py-2 rounded-full font-bold text-base transition-all duration-300 hover:bg-[#004d40] hover:text-white group/btn">
                    Join Event
                    <div className="w-10 h-10 bg-[#004d40] rounded-full flex items-center justify-center group-hover/btn:bg-[#eab308] transition-colors duration-300">
                      <ArrowRight className="w-4 h-4 text-white group-hover/btn:text-[#004d40]" />
                    </div>
                  </button>
                </div>
              </div>

              {/* === 4. IMAGE SECTION (Full Width, No Padding) === */}
              {/* This container is a direct child of the card, so it naturally fills the width */}
              <div className="relative h-[280px] w-full mt-auto">
                {/* SHAPE DIVIDER (The Brush Stroke) */}
                {/* Placed absolutely at the top of the image container to blend with the card background */}
                <div className="absolute top-[-1px] left-0 w-full z-10 leading-none">
                  <img
                    src="https://econest-html.netlify.app/econest/assets/img/shapes/shape-3.webp"
                    alt="shape"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* MAIN IMAGE */}
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out"
                />

                {/* GLASSMORPHISM BADGE */}
                <div className="absolute bottom-8 right-8 z-20 group/badge">
                  <div className="bg-black/30 backdrop-blur-md border border-white/20 py-2 px-2 rounded-full flex items-center shadow-lg transition-all duration-500 ease-in-out hover:px-5 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover/badge:bg-[#eab308] transition-colors">
                      <Sprout className="w-4 h-4 text-white" />
                    </div>
                    <div className="max-w-0 overflow-hidden group-hover/badge:max-w-[200px] transition-all duration-500 ease-in-out">
                      <span className="text-white font-medium text-sm whitespace-nowrap pl-3 pr-1">
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
