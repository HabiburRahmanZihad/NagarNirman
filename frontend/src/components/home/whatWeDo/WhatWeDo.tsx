"use client";

import { useState } from "react";
import { FaRecycle, FaRoad, FaWater, FaLightbulb, FaFaucet, FaScrewdriver } from "react-icons/fa";

const works = [
  {
    title: "Water Drainage",
    desc: "Smart water drainage system to prevent urban flooding and ensure smooth flow.",
    image: "https://i.postimg.cc/qqrPCn00/Water-Drainage.jpg",
    icon: <FaWater />,
  },
  {
    title: "Streetlights Electrical",
    desc: "Modern energy-efficient lighting to brighten smart cities.",
    image: "https://i.postimg.cc/ZKKgtJ5K/Streetlights-Electrical.jpg",
    icon: <FaLightbulb />,
  },
  {
    title: "Garbage Sanitation",
    desc: "Clean environment through proper waste management and recycling.",
    image: "https://i.postimg.cc/fLfHpP4r/Garbage-Sanitation.jpg",
    icon: <FaRecycle />,
  },
  {
    title: "Road Infrastructure",
    desc: "Strong, durable and smart road development for better connectivity.",
    image: "https://i.postimg.cc/PqmKv75c/Road-Infrastructure.jpg",
    icon: <FaRoad />,
  },
  {
    title: "Water Supply",
    desc: "Safe and sustainable clean water supply system for urban communities.",
    image: "https://i.postimg.cc/sXJBtkV9/water-suplay.jpg",
    icon: <FaFaucet />, 
  },
  {
    title: "Smart Road System",
    desc: "Smart road construction with modern technology and sustainability.",
    image: "https://i.postimg.cc/xdwyfVDp/Road-Infrastructure.jpg",
    icon: <FaRoad />,
  },
  {
    title: "Waste Management",
    desc: "Advanced waste management for cleaner and healthier cities.",
    image: "https://i.postimg.cc/nzTzdqk5/waste-management.jpg",
    icon: <FaRecycle />,
  },
  {
    title: "Drainage Pipeline",
    desc: "Modern underground drainage pipelines for smooth water flow.",
    image: "https://i.postimg.cc/JtCz0K4B/Drainage-Pipeline.jpg",
    icon: <FaScrewdriver />, 
  },
  
];

export default function WhatWeDo() {
  const [openModal, setOpenModal] = useState(null);

  return (
    <section className="">
      <div className="py-20 ">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium italic">Our Work</p>
          <h2 className="text-4xl font-bold text-info">What We Are Doing</h2>
          <div className="w-20 h-[2px] bg-primary mx-auto mt-3"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-5">
          {works.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden shadow-lg"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[330px] object-cover transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition"></div>

              {/* Content */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-5 text-white z-10
                opacity-0 group-hover:opacity-100 transition duration-500"
              >
                {/* Inner content move on hover */}
                <div className="transform translate-y-6 group-hover:translate-y-0 transition duration-500">
                  {/* Icon */}
                  <div className="text-3xl text-[--color-secondary] mb-3">
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-200 leading-relaxed mb-3">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
