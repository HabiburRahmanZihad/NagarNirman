"use client";

import React from "react";
// 1. Import 'Variants' type
import { motion, Variants } from "framer-motion";
import {
  Droplets, Lightbulb, Recycle,
  Route, Sprout, Waves, Wrench
} from "lucide-react";

// --- DATA ---
const works = [
  {
    title: "Water Drainage",
    desc: "Smart water drainage system to prevent urban flooding and ensure smooth flow.",
    image: "https://i.postimg.cc/qqrPCn00/Water-Drainage.jpg",
    icon: <Waves className="w-6 h-6" />,
  },
  {
    title: "Street Lighting",
    desc: "Modern energy-efficient lighting to brighten smart cities safely.",
    image: "https://i.postimg.cc/ZKKgtJ5K/Streetlights-Electrical.jpg",
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    title: "Garbage & Sanitation",
    desc: "Clean environment through proper waste management and recycling protocols.",
    image: "https://i.postimg.cc/fLfHpP4r/Garbage-Sanitation.jpg",
    icon: <Recycle className="w-6 h-6" />,
  },
  {
    title: "Road Infrastructure",
    desc: "Strong, durable and smart road development for better connectivity.",
    image: "https://i.postimg.cc/PqmKv75c/Road-Infrastructure.jpg",
    icon: <Route className="w-6 h-6" />,
  },
  {
    title: "Water Supply",
    desc: "Safe and sustainable clean water supply system for urban communities.",
    image: "https://i.postimg.cc/sXJBtkV9/water-suplay.jpg",
    icon: <Droplets className="w-6 h-6" />,
  },
  {
    title: "Smart Traffic",
    desc: "Intelligent road monitoring with modern technology and sustainability.",
    image: "https://i.postimg.cc/xdwyfVDp/Road-Infrastructure.jpg",
    icon: <Route className="w-6 h-6" />,
  },
  {
    title: "Waste Management",
    desc: "Advanced waste sorting and disposal for cleaner and healthier cities.",
    image: "https://i.postimg.cc/nzTzdqk5/waste-management.jpg",
    icon: <Recycle className="w-6 h-6" />,
  },
  {
    title: "Pipeline Systems",
    desc: "Modern underground drainage pipelines for smooth water flow.",
    image: "https://i.postimg.cc/JtCz0K4B/Drainage-Pipeline.jpg",
    icon: <Wrench className="w-6 h-6" />,
  },
];

// --- ANIMATION VARIANTS (Fixed Types) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export default function WhatWeDo() {
  return (
    <div className="container mx-auto">

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
                    <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout className="w-5 h-5 text-[#004d40]" />
            <span className="text-[#555555] text-lg font-medium">
              What We Do
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            Building a Better City
          </h2>
        </motion.div>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {works.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative h-[380px] rounded-4xl overflow-hidden cursor-pointer"
          >
            {/* Image Layer with Zoom Effect */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* linear Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-[#002E2E]/90 via-[#002E2E]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

            {/* Hover Color Flash */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

            {/* Floating Icon (Glassmorphism) */}
            <div className="absolute top-5 right-5 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-accent group-hover:text-[#002E2E] transition-all duration-300 shadow-lg -translate-y-2.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              {item.icon}
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
              <div className="transform transition-transform duration-500 group-hover:-translate-y-2">

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>

                {/* Description (Collapsible) */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                  <div className="overflow-hidden">
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Decorative Line that expands */}
                <div className="w-12 h-1 bg-accent mt-4 rounded-full group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
