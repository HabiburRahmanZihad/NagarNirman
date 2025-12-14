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
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 md:px-8">
      <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16">
        <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-2 xs:mb-2.5 sm:mb-3">
          <Sprout className="w-4 h-4 xs:w-5 xs:h-5 text-[#3C6E59]" />
          <span className="text-[#555555] text-sm sm:text-base md:text-lg font-medium">         24/7 Support</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary px-2 sm:px-0">
          Emergency Hotline
        </h2>
      </div>

      <div className="relative whitespace-nowrap px-2 sm:px-0">
        {/* Scroll Wrapper */}
        <div className="flex animate-scroll">
          {[...images, ...images].map((src, i) => (
            <div
              key={i}
              className="min-w-[140px] xs:min-w-[160px] sm:min-w-[180px] md:min-w-[200px] h-[80px] xs:h-[100px] sm:h-[110px] md:h-[120px] rounded-xl flex items-center justify-center p-2 xs:p-2.5 sm:p-3 bg-primary mx-2"
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
