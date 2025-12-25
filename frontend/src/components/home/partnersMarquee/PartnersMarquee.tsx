"use client";
import Image from "next/image";
import { FaHandHoldingHand } from "react-icons/fa6";

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
    <section className="container mx-auto py-8 sm:py-12 md:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 md:px-8">
      <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16">
        <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-2 xs:mb-2.5 sm:mb-3">
          <FaHandHoldingHand className="w-6 h-6 xs:w-5 xs:h-5 text-[#3C6E59]" />
          <span className="text-[#555555] text-xs xs:text-sm sm:text-base md:text-lg font-medium tracking-wide">Trusted By The Best</span>
        </div>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[#003B31]">
          Our Major Partners
        </h2>
      </div>
      <div className="relative overflow-hidden whitespace-nowrap">
        {/* Scrolling Wrapper */}
        <div className="flex animate-scroll gap-4 xs:gap-6 sm:gap-8 lg:gap-10">
          {logos.concat(logos).map((src, i) => (
            <div
              key={i}
              className="min-w-[140px] xs:min-w-[160px] sm:min-w-[180px] md:min-w-[200px] h-20 xs:h-[100px] sm:h-[110px] md:h-[120px] bg-[#003D33] rounded-xl flex items-center justify-center p-6"
            >
              <Image
                src={src}
                alt="logo"
                width={120}
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
