'use client';

import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import SlideContent from './SlideContent';
import Decorations from './Decorations';
import Image from 'next/image';
import { div } from 'framer-motion/client';

const slides = [
  {
    id: 1,
    smallTitle: "Report. Resolve. Rebuild.",
    mainHeading: "Make your city cleaner, safer, and smarter.",
    paragraph: "Submit issues like broken roads, drainage problems, garbage piles, unsafe streetlights, and more — together we can transform our communities.",
    primaryBtn: "Report an Issue",
    secondaryBtn: "How It Works",
    image: "https://images.unsplash.com/photo-1605972643561-8bac9eec3ddc?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgImage: "https://images.unsplash.com/photo-1585831781094-c8124c24b26e?q=80&w=1719&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    smallTitle: "Track Issues Across All 64 Districts",
    mainHeading: "Stay updated with real-time city improvement progress.",
    paragraph: "View reports on the map, monitor district performance, follow issue statuses, and see how fast your city authority is responding.",
    primaryBtn: "Open Dashboard",
    secondaryBtn: "District Stats",
    image: "https://images.unsplash.com/photo-1615275937978-87a29ea4fd03?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgImage: "https://images.unsplash.com/photo-1667069254957-bf6961fd3fb5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 3,
    smallTitle: "Become a Verified Problem Solver",
    mainHeading: "Help fix issues, submit proof, and earn rewards.",
    paragraph: "Cleaners, NGOs, and skilled problem solvers can complete tasks, upload proof, earn points, and climb the leaderboard.",
    primaryBtn: "Apply Now",
    secondaryBtn: "Learn More",
    image: "https://images.unsplash.com/photo-1610560875826-af5b05a96cfa?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgImage: "https://images.unsplash.com/photo-1583794018021-c841442da0e3?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

export default function HeroSlider() {
  const swiperRef = useRef<any>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;

      if (typeof swiper.params.navigation === 'object') {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
      }

      swiper.navigation.init();
      swiper.navigation.update();

      swiper.on('slideChange', () => {
        setActiveIndex(swiper.realIndex);
      });
    }
  }, []);

  return (
    <section className="lg:h-[700px] relative overflow-hidden">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30">
        <button
          ref={prevRef}
          className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30">
        <button
          ref={nextRef}
          className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay, EffectFade]}
        navigation={false}
        effect="fade"
        fadeEffect={{ crossFade: false }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1000}
        loop={true}
        className="h-full w-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative lg:pt-30 lg:pb-50 md:pt-20 md:pb-40 pt-5 pb-40">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40 z-0" />

            <div className="container mx-auto px-4 lg:px-0 h-full flex items-center justify-center lg:justify-center py-8 lg:py-0 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full">
                <div className="text-white z-20 order-2 lg:order-1 text-center lg:text-left">
                  <AnimatePresence mode="wait">
                    {activeIndex === index && (
                      <div className='flex items-center lg:justify-start justify-center'>
                        <SlideContent key={slide.id} {...slide} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                  <Decorations imageUrl={slide.image} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom shape from SVG */}
      <div className="slider-bottom-shape absolute bottom-0 left-0 w-full z-10">
        <Image
          width={1440}
          height={100}
          src="/assets/Subtract.svg"
          alt=""
          className="w-full h-20 lg:h-25 object-cover"
        />
      </div>
    </section>
  );
}