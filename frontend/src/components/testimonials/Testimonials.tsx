"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/autoplay";

import { Autoplay } from "swiper/modules";

const testimonials = [
  {
    id: 1,
    name: "Penelope Miller",
    subName: "(Arjun)",
    role: "Sr. Volunteer",
    rating: 5.0,
    text: "I was genuinely impressed 😍. Their dedication, clarity, and expertise truly exceeded my expectations. The guidance I received was not only helpful but also deeply thoughtful.",
    image: "https://i.postimg.cc/BZDJMRqn/thumb-10.webp",
  },
  {
    id: 2,
    name: "Samuel Green",
    subName: "(Sam)",
    role: "Volunteer",
    rating: 4.9,
    text: "An amazing experience from start to finish! They handled everything with care, precision, and genuine kindness. Every interaction felt meaningful and professional..",
    image: "https://i.postimg.cc/NjNtKc4h/thumb-10-3.webp",
  },
  {
    id: 3,
    name: "Ava Johnson",
    subName: "(Ava)",
    role: "Coordinator",
    rating: 4.8,
    text: "Exceptional quality and heartfelt support! Their guidance was clear, practical, and delivered with remarkable patience. What stood out most was the personal care.",
    image: "https://i.postimg.cc/D0Kk9y2m/thumb-10-2.webp",
  },
];

export default function Testimonials() {
  return (
    <section className="container mx-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-sm text-secondary">
            <span className="text-secondary">★</span>
            <span className="text-neutral">Testimonials</span>
          </div>

          <h2 className="text-info font-extrabold text-4xl md:text-5xl leading-tight">
            Why They Believe <br />
            <span className="inline-flex items-center gap-3">
              <span className="bg-primary text-base-100 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                ❝❞
              </span>
              In Us
            </span>
          </h2>

          <p className="text-neutral max-w-xl">
            Likely to then a dental prosthetic is added then dental prosthetic occaecat laborum.
          </p>

          <div className="flex items-center gap-6 mt-6">
            <div className="text-4xl font-extrabold text-info">99%</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-white">
                ★
              </div>
              <div className="text-info font-semibold">Positive Reviews</div>
            </div>
          </div>

          <button className="mt-6 inline-flex items-center gap-3 border border-base-200 px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition">
            <span className="p-2 rounded-full bg-accent/30">●</span>
            <span className="text-info font-medium">Write your honest review →</span>
          </button>
        </div>

        {/* RIGHT SIDE - Custom Cards Effect Auto Slide */}
        <div className="relative overflow-visible">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 2200,
              disableOnInteraction: false,
            }}
            speed={800}
            className="max-w-[760px] mx-auto"
            style={{ width: "100%", height: "420px" }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="relative transform transition-all duration-300 hover:-rotate-1 hover:scale-[1.02] rounded-2xl bg-primary text-base-100 p-6 md:p-8 shadow-xl min-h-[420px] flex items-stretch gap-6">

                  {/* IMAGE */}
                  <div className="w-[46%] flex-shrink-0">
                    <div className="rounded-xl overflow-hidden bg-white">
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TEXT */}
                  <div className="w-[50%] flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/10 w-max mb-4">
                        <span className="text-sm">Rating</span>
                        <span className="text-accent font-semibold">
                          ★ {t.rating.toFixed(1)}
                        </span>
                      </div>

                      <p className="text-base text-white/90 leading-7 mb-6">
                        {t.text}
                      </p>
                    </div>

                    <div>
                      <div className="text-white font-bold text-lg">
                        {t.name}
                        <span className="text-white/70 font-normal text-sm"> {t.subName}</span>
                      </div>
                      <div className="text-white/80 text-sm mt-1">{t.role}</div>
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* DECORATION */}
          <div className="hidden md:block pointer-events-none">
            <div className="absolute -left-8 top-8 w-[360px] h-[260px] rounded-2xl bg-base-200 opacity-60 translate-x-[-40px]" />
            <div className="absolute -left-4 top-20 w-[360px] h-[260px] rounded-2xl bg-base-300 opacity-50 translate-x-[-20px]" />
          </div>
        </div>

      </div>
    </section>
  );
}
