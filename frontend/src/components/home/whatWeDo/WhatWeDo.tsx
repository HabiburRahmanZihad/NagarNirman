"use client";

import { useState } from "react";
import { FaRecycle, FaRoad, FaWater, FaLightbulb } from "react-icons/fa";

const works = [
  {
    title: "Water Drainage",
    desc: "Smart water drainage system to prevent urban flooding and ensure smooth flow.",
    details:
      "We design advanced drainage systems that reduce flooding risk and improve urban water management.",
    image: "https://i.postimg.cc/qqrPCn00/Water-Drainage.jpg",
    icon: <FaWater />,
  },
  {
    title: "Streetlights Electrical",
    desc: "Modern energy-efficient lighting to brighten smart cities.",
    details:
      "Our smart streetlights use low energy while ensuring maximum brightness and durability.",
    image: "https://i.postimg.cc/ZKKgtJ5K/Streetlights-Electrical.jpg",
    icon: <FaLightbulb />,
  },
  {
    title: "Garbage Sanitation",
    desc: "Clean environment through proper waste management and recycling.",
    details:
      "We implement sustainable waste systems for cleaner, greener and healthier environments.",
    image: "https://i.postimg.cc/fLfHpP4r/Garbage-Sanitation.jpg",
    icon: <FaRecycle />,
  },
  {
    title: "Road Infrastructure",
    desc: "Strong, durable and smart road development for better connectivity.",
    details:
      "We build durable road networks ensuring safety, connectivity and long-term performance.",
    image: "https://i.postimg.cc/PqmKv75c/Road-Infrastructure.jpg",
    icon: <FaRoad />,
  },
];

export default function WhatWeDo() {
  const [openModal, setOpenModal] = useState(null);

  return (
    <section className="py-20 bg-base-200">
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
              className="w-full h-[330px] object-cover transition-transform duration-700 group-hover:translate-y-[-50px]"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition"></div>

            {/* Content */}
            <div
              className="absolute inset-0 flex flex-col justify-end p-5 text-white z-10
                            opacity-0 group-hover:opacity-100 transition duration-500"
            >
              {/* Icon */}
              <div className="text-3xl text-[--color-secondary] mb-2">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-1">{item.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-200 leading-relaxed mb-3">
                {item.desc}
              </p>

              {/* Details Button */}
              <button
                onClick={() => setOpenModal(item)}
                className="self-start bottom-6 left-3 px-6 py-[4px] rounded-full bg-white text-black text-[10px] font-medium shadow hover:bg-gray-100 transition"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Modal ===== */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpenModal(null)}
              className="absolute top-3 right-3 text-gray-600 text-xl hover:text-black"
            >
              ✕
            </button>

            {/* Modal Content */}
            <img
              src={openModal.image}
              alt={openModal.title}
              className="rounded-lg w-full h-56 object-cover"
            />

            <h3 className="text-2xl font-semibold text-info mt-4">
              {openModal.title}
            </h3>

            <p className="text-neutral mt-2 text-sm leading-relaxed">
              {openModal.details}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
