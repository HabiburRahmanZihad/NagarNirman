"use client";
import { Sprout } from "lucide-react";
import Image from "next/image";
import React from "react";

const logos = [
  "https://econest-html.netlify.app/econest/assets/img/logo/logo-2.webp",
  "https://econest-html.netlify.app/econest/assets/img/logo/logo-3.webp",
  "https://econest-html.netlify.app/econest/assets/img/logo/logo-4.webp",
  "https://econest-html.netlify.app/econest/assets/img/logo/logo-5.webp",
  "https://econest-html.netlify.app/econest/assets/img/logo/logo-6.webp",
  "https://econest-html.netlify.app/econest/assets/img/logo/logo-7.webp",
];

export default function PartnersMarquee() {
  return (
    <section className="container mx-auto">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sprout className="w-5 h-5 text-[#3C6E59]" />
          <span className="text-[#555555] text-lg font-medium tracking-wide">          Trusted By The Best</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#003B31]">
          Our Major Partners
        </h2>
      </div>
      <div className="relative overflow-hidden whitespace-nowrap">
        {/* Scrolling Wrapper */}
        <div className="flex animate-scroll gap-10">
          {logos.concat(logos).map((src, i) => (
            <div
              key={i}
              className="min-w-[200px] h-[120px] bg-[#003D33] rounded-xl flex items-center justify-center p-6"
            >
              <Image
                src={src}
                alt="logo"
                width={140}
                height={60}
                className="object-contain"
              />
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
