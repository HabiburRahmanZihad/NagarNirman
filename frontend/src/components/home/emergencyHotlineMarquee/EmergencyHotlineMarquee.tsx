"use client";
import { Sprout } from "lucide-react";
import Image from "next/image";

const images = [
  "https://i.postimg.cc/SQ2SBwDh/download-(14).png",
  "https://i.postimg.cc/x1RnGYTn/download-(13).png",
  "https://i.postimg.cc/KzKbyM7D/download-(12).png",
  "https://i.postimg.cc/zDgNtTGD/download-(11).png",
  "https://i.postimg.cc/x1tVJRtn/download-(10).png",
  "https://i.postimg.cc/rpK3dLd6/download-(9).png",
  "https://i.postimg.cc/CMkyHYc0/download-(8).png",
  "https://i.postimg.cc/J4FbrVW3/download-(7).png",
  "https://i.postimg.cc/V6sS9D81/download-(6).png",
  "https://i.postimg.cc/3rsvVjjw/download-(4).png",
  "https://i.postimg.cc/8z1jgZ71/download-(3).png",
  "https://i.postimg.cc/6QXzKJd6/download-(1).png",
  "https://i.postimg.cc/d0sdnq2C/download.png",
];


export default function EmergencyHotlineMarquee() {
  return (
    <section className="">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sprout className="w-5 h-5 text-[#3C6E59]" />
          <span className="text-[#555555] text-lg font-medium tracking-wide">         24/7 Support</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#003B31]">
          Emergency Hotline
        </h2>
      </div>

      <div className="relative whitespace-nowrap">
        {/* Scroll Wrapper */}
        <div className="flex animate-scroll">
          {[...images, ...images].map((src, i) => (
            <div
              key={i}
              className="min-w-[200px] h-[120px] rounded-xl flex items-center justify-center p-3 bg-primary mx-2"
            >
              <Image
                src={src}
                alt="logo"
                width={200}
                height={120}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: marquee 18s linear infinite;
        }

        @keyframes marquee {
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
