'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import SlideContent from './SlideContent';
import Decorations from './Decorations';

const slides = [
  {
    id: 1,
    smallTitle: "Report. Resolve. Rebuild.",
    mainHeading: "These Communities Need Your Support",
    paragraph: "Your reports help identify infrastructure issues faster and create sustainable, cleaner communities across Bangladesh.",
    primaryBtn: "Support Us",
    secondaryBtn: "About Us",
    image: "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: 2,
    smallTitle: "Join Our Mission",
    mainHeading: "Be the Change in Your Community",
    paragraph: "Your report helps authorities identify and fix problems faster. Track progress and see real impact in your neighborhood.",
    primaryBtn: "Get Started",
    secondaryBtn: "Learn More",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: 3,
    smallTitle: "Make Your Voice Count",
    mainHeading: "Together We Can Build Better Cities",
    paragraph: "Monitor infrastructure problems, support solutions, and contribute to SDG 11 for sustainable cities and communities.",
    primaryBtn: "Explore Map",
    secondaryBtn: "Join as Solver",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bgImage: "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  }
];

export default function HeroSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />
      
      {/* Navigation arrows - Fixed position */}
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
        modules={[Navigation, Autoplay, EffectFade]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation === 'object') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1000}
        loop={true}
        className="h-screen w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Background Image for each slide */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-0" />
            
            <div className="container mx-auto px-4 h-full flex items-center pt-16 pb-32 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                {/* Left Content */}
                <div className="text-white z-20">
                  <SlideContent {...slide} />
                </div>

                {/* Right Image with Decorations */}
                <div className="relative flex justify-center lg:justify-end">
                  <Decorations imageUrl={slide.image} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Curved bottom shape */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-white rounded-t-[80px] z-10" />
    </section>
  );
}