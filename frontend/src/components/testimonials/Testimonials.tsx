"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { FaPlay, FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

type Testimonial = {
  id: number;
  name: string;
  subName: string;
  role: string;
  rating: number;
  text: string;
  image: string;
  videoId: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Penelope Miller",
    subName: "(Arjun)",
    role: "Sr. Volunteer",
    rating: 5.0,
    text:
      "I was very impressed 😊 involves providing of advice and guidance on energy-related for matters. Understand the advantages hiring professionals to design and maintain your garden. 🧑‍🌾",
    image: "https://i.postimg.cc/BZDJMRqn/thumb-10.webp",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: 2,
    name: "Samuel Green",
    subName: "(Sam)",
    role: "Volunteer",
    rating: 4.9,
    text:
      "An amazing experience from start to finish! They handled everything with care, precision, and genuine kindness. Every interaction felt meaningful and professional.",
    image: "https://i.postimg.cc/NjNtKc4h/thumb-10-3.webp",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: 3,
    name: "Ava Johnson",
    subName: "(Ava)",
    role: "Coordinator",
    rating: 4.8,
    text:
      "Exceptional quality and heartfelt support! Their guidance was clear, practical, and delivered with remarkable patience. What stood out most was the personal care.",
    image: "https://i.postimg.cc/D0Kk9y2m/thumb-10-2.webp",
    videoId: "dQw4w9WgXcQ",
  },
];

export default function Testimonials() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");

  const openVideo = (videoId: string) => {
    setCurrentVideoId(videoId);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    setCurrentVideoId("");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = isVideoOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

  return (
    <section className="w-full bg-linear-to-b from-gray-50 to-white py-20 px-0 md:px-10 lg:px-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[600px]">
          {/* LEFT SECTION */}
          <div className="space-y-8 order-2 lg:order-1 px-4 md:px-0">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-green-700 text-lg">★</span>
                <span className="text-gray-600 font-medium">Testimonials</span>
              </div>

              <h2 className="text-[#0b4f46] font-extrabold text-5xl md:text-6xl leading-tight">
                Why They Believe
              </h2>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-4xl shadow-lg flex-shrink-0">
                  ❝❞
                </div>
                <h2 className="text-[#0b4f46] font-extrabold text-5xl md:text-6xl leading-tight">
                  In Us
                </h2>
              </div>
            </div>

            <p className="text-gray-600 max-w-lg leading-relaxed text-lg">
              Join thousands of satisfied volunteers and problem solvers who trust NagarNirman to make a real difference in our communities. We focus on practical support, training, and sustainable impact — so every volunteer feels empowered.
            </p>

            {/* extra info row: stats, rating, short quote */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-[#0b4f46]">99%</span>
                <span className="text-gray-600 font-medium">Positive Reviews</span>
              </div>

              <div className="h-12 w-px bg-gray-300 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-white text-xl">
                  ★
                </div>
                <div>
                  <div className="text-[#0b4f46] font-semibold">5.0 Rating</div>
                  <div className="text-sm text-gray-500">based on <span className="font-medium text-gray-700">4,821</span> reviews</div>
                </div>
              </div>
            </div>

            {/* feature bullets */}
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="mt-1 text-green-700">✔</div>
                <div>
                  <div className="font-medium text-gray-800">Verified Volunteers</div>
                  <div className="text-sm text-gray-500">ID checked & trained</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1 text-green-700">✔</div>
                <div>
                  <div className="font-medium text-gray-800">Impact Driven</div>
                  <div className="text-sm text-gray-500">Measurable community outcomes</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1 text-green-700">✔</div>
                <div>
                  <div className="font-medium text-gray-800">Local Support</div>
                  <div className="text-sm text-gray-500">Teams active in 12+ districts</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1 text-green-700">✔</div>
                <div>
                  <div className="font-medium text-gray-800">Flexible Roles</div>
                  <div className="text-sm text-gray-500">Short & long-term opportunities</div>
                </div>
              </li>
            </ul>

            {/* highlighted quote */}
            <blockquote className="mt-4 border-l-4 border-[#055a4d] pl-4 text-gray-700 italic max-w-lg">
              “NagarNirman changed how I approach community work — practical training, friendly mentors, and real results.” — <span className="font-semibold">R. Hasan</span>
            </blockquote>



          </div>


          {/* RIGHT SECTION - SLIDER */}
          <div className="relative h-[650px] w-full order-1 lg:order-2 flex items-center justify-center py-10 px-0 md:px-0">
            <Swiper
              modules={[Autoplay, EffectCoverflow, Pagination]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 12,
                stretch: 80,
                depth: 300,
                modifier: 1.2,
                slideShadows: false,
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 1,
              }}
              loop={true}
              speed={1000}
              className="testimonial-swiper w-full h-full max-w-[520px] mx-auto rounded-3xl"
              style={{
                "--swiper-pagination-bullet-inactive-color": "#cbd5e1",
                "--swiper-pagination-bullet-inactive-opacity": "0.4",
                "--swiper-pagination-bullet-size": "10px",
                "--swiper-pagination-bullet-horizontal-gap": "8px",
              } as any}
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t.id} className="!w-[440px] h-auto flex items-center justify-center">
                  {({ isActive }) => (
                    <div className={`w-full h-full rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${isActive
                      ? "bg-linear-to-br from-[#004D40] to-[#00695C] scale-100 shadow-[0_30px_80px_-15px_rgba(0,77,64,0.8)]"
                      : "bg-linear-to-br from-[#004D40]/70 to-[#00695C]/70 scale-85 shadow-[0_10px_25px_-8px_rgba(0,77,64,0.3)]"
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Image Section */}
                        <div className="relative h-[68%] w-full overflow-hidden">
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            className="object-cover h-full transition-transform duration-700 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-[#004D40]/70 via-[#004D40]/30 to-transparent" />

                          {/* Floating Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center group">
                            <button
                              title="Play Video"
                              onClick={() => openVideo(t.videoId)}
                              className="relative w-20 h-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-500 hover:scale-125 hover:bg-white/40 border-2 border-white/40 shadow-2xl group-hover:shadow-[0_0_35px_rgba(255,255,255,0.5)]"
                            >
                              <FaPlay className="w-7 h-7 text-white drop-shadow-2xl ml-1.5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            </button>
                          </div>

                          {/* Rating Badge - Top Right */}
                          <div className="absolute top-4 right-8 z-12">
                            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3.5 py-2 rounded-full border border-white/40 shadow-lg hover:bg-white/30 transition-all duration-300">
                              <span className="text-yellow-300 text-sm font-bold">★</span>
                              <span className="text-white font-bold text-sm">{t.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6 flex flex-col justify-between relative bg-linear-to-b from-[#004D40] to-[#003835]">
                          {/* Quote Icon */}
                          <div className="absolute -top-5 left-8 z-10">
                            <div className="w-12 h-12 bg-accent shadow-lg rounded-full flex items-center justify-center border-2 border-[#004D40] hover:scale-110 transition-transform duration-300">
                              <FaQuoteLeft className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          {/* Testimonial Text */}
                          <div className="mt-4 flex-1 flex items-center p-4">
                            <p className="text-white/95 leading-relaxed text-sm">
                              {t.text}
                            </p>
                          </div>

                          {/* Author Info */}
                          <div className="mt-4 p-4 border-t border-white/15">
                            <h4 className="text-white text-base font-bold leading-tight">
                              {t.name}{" "}
                              <span className="text-white/60 font-normal text-sm">{t.subName}</span>
                            </h4>
                            <p className="text-white/70 text-xs mt-1 font-medium">{t.role}</p>
                          </div>

                          {/* Decorative corner element */}
                          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20 pointer-events-none">
                            <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-white rounded-tl-[60px]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300"
              aria-label="Close modal"
            >
              ×
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* INLINE CSS */}
      <style jsx>{`
        /* Swiper customization */
        .testimonial-swiper {
          padding: 40px 0 80px 0 !important;
        }

        .swiper-slide {
          transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        .swiper-slide > div {
          will-change: transform, opacity, filter;
        }

        /* Pagination bullets */
        .swiper-pagination {
          bottom: -40px !important;
        }

        .swiper-pagination-bullet {
          background: #cbd5e1 !important;
          opacity: 0.4 !important;
          width: 10px !important;
          height: 10px !important;
          margin: 0 4px !important;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        .swiper-pagination-bullet-active {
          background: #f2a921 !important;
          opacity: 1 !important;
          width: 30px !important;
          border-radius: 5px !important;
        }

        /* Animations */
        @keyframes fade-in {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(6px);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translate(-50%, -50%);
          }
          to {
            opacity: 1;
            transform: scale(1) translate(0, 0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Smooth hover effects */
        .swiper-slide img {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Glow effect enhancement */
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
            filter: blur(8px);
          }
          50% {
            opacity: 0.9;
            filter: blur(12px);
          }
        }

        .animate-pulse-glow {
          animation: glow-pulse 2.5s ease-in-out infinite;
        }

        /* Smooth transitions for cards */
        .swiper-3d .swiper-slide-shadow-left,
        .swiper-3d .swiper-slide-shadow-right {
          background: none !important;
        }
      `}</style>
    </section>
  );
}