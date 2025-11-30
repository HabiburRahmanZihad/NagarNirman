"use client";
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
      <h2 className="text-center text-4xl md:text-5xl font-bold mb-10 text-[#003B31]">
        Major Partners
      </h2>
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
