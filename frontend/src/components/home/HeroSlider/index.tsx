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

const slides = [
  {
    id: 1,
    smallTitle: "Report. Resolve. Rebuild.",
    mainHeading: "Make your city cleaner, safer, and smarter.",
    paragraph: "Submit issues like broken roads, drainage problems, garbage piles, unsafe streetlights, and more — together we can transform our communities.",
    primaryBtn: "Report an Issue",
    secondaryBtn: "How It Works",
    image: "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: 2,
    smallTitle: "Track Issues Across All 64 Districts",
    mainHeading: "Stay updated with real-time city improvement progress.",
    paragraph: "View reports on the map, monitor district performance, follow issue statuses, and see how fast your city authority is responding.",
    primaryBtn: "Open Dashboard",
    secondaryBtn: "District Stats",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: 3,
    smallTitle: "Become a Verified Problem Solver",
    mainHeading: "Help fix issues, submit proof, and earn rewards.",
    paragraph: "Cleaners, NGOs, and skilled problem solvers can complete tasks, upload proof, earn points, and climb the leaderboard.",
    primaryBtn: "Apply Now",
    secondaryBtn: "Learn More",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgImage: "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
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
    <section className="relative lg:min-h-[700px] overflow-hidden">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30">
        <button
          ref={prevRef}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30">
        <button
          ref={nextRef}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        className="h-screen w-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-0" />
            
            <div className="container mx-auto px-4 h-full flex items-center pt-16 pb-32 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                <div className="text-white z-20">
                  <AnimatePresence mode="wait">
                    {activeIndex === index && (
                      <SlideContent key={slide.id} {...slide} />
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative flex justify-center lg:justify-end">
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
        width={500}
        height={32}
        src="/assets/Subtract.svg" alt="" className="w-full h-25 object-cover" />
      </div>
    </section>
  );
}