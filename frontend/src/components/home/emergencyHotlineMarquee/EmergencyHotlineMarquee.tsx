"use client";
import Image from "next/image";
import { LuSiren, LuPhone } from "react-icons/lu";
import { useState } from "react";
import hotlineData from "./emergencyHotlineNumbers.json";

export default function EmergencyHotlineMarquee() {
  const [hovered, setHovered] = useState<number | null>(null);

  // Duplicate the data for smooth scrolling
  const hotlines = [...hotlineData, ...hotlineData];

  return (
    <section className="container mx-auto py-8 sm:py-12 md:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 md:px-8">
      <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16">
        <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-2 xs:mb-2.5 sm:mb-3">
          <LuSiren className="w-6 h-6 xs:w-5 xs:h-5 text-[#3C6E59]" />
          <span className="text-[#555555] text-xs xs:text-sm sm:text-base md:text-lg font-medium tracking-wide">24/7 Support</span>
        </div>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[#003B31]">
          Emergency Hotline
        </h2>
      </div>

      <div className="relative overflow-hidden whitespace-nowrap">
        {/* Scrolling Wrapper */}
        <div className="flex animate-scroll gap-4 xs:gap-6 sm:gap-8 lg:gap-10">
          {hotlines.map((item, i) => (
            <div
              key={i}
              className="relative min-w-[140px] xs:min-w-[160px] sm:min-w-[180px] md:min-w-[200px] h-[80px] xs:h-[100px] sm:h-[110px] md:h-[120px] bg-[#003D33] rounded-xl flex items-center justify-center p-6 group cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <Image
                src={item.image}
                alt={item.label}
                width={120}
                height={60}
                className="object-contain"
              />
              {/* Overlay for call option */}
              {hovered === i && (
                <div className="absolute inset-0 bg-[#003D33] bg-opacity-70 flex flex-col items-center justify-center rounded-xl transition-opacity">
                  <span className="text-white text-lg font-semibold mb-2">{item.label}</span>
                  <a
                    href={`tel:${item.number}`}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-base font-bold shadow-lg transition"
                    onClick={e => e.stopPropagation()}
                  >
                    <LuPhone className="w-5 h-5" /> Call {item.number}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
