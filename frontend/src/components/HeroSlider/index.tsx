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
    smallTitle: "How You Could Help!!",
    mainHeading: "These kids need your love and support",
    paragraph: "Your contribution can help provide education, food, shelter and a brighter future for vulnerable children.",
    primaryBtn: "Support Us",
    secondaryBtn: "About Us",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    smallTitle: "Join Our Mission",
    mainHeading: "Together we can change their tomorrow",
    paragraph: "Be part of a movement that empowers communities with health support, nutrition, and safe shelter.",
    primaryBtn: "Donate Now",
    secondaryBtn: "Our Work",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    smallTitle: "You Can Make a Difference",
    mainHeading: "Your kindness creates real impact",
    paragraph: "Even the smallest donation helps improve the lives of kids struggling with poverty and uncertainty.",
    primaryBtn: "Get Involved",
    secondaryBtn: "Contact Us",
    image: "https://images.unsplash.com/photo-1491895200221-4c8c2f064826?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

export default function HeroSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen overflow-hidden">
      {/* Background with dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      {/* Navigation arrows */}
      <div className="container mx-auto px-4 relative z-20">
        <button
          ref={prevRef}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          ref={nextRef}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
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
            <div className="container mx-auto px-4 h-full flex items-center pt-20 pb-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
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
      <div className="absolute bottom-0 left-0 w-full h-32 bg-white rounded-t-[100px] z-10" />
    </section>
  );
}