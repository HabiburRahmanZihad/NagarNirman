// app/how-it-works/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaMapMarkerAlt, FaCamera, FaCheckCircle, FaUserCheck, FaBuilding,
  FaUsers, FaRoad, FaLightbulb, FaTint,
  FaTrash, FaTree, FaExclamationTriangle, FaBolt, FaLeaf,
  FaClock, FaUserShield,
  FaEye, FaDatabase,
  FaStar, FaCity,
  FaFileAlt, FaLocationArrow, FaListAlt, FaHistory,
  FaSearch, FaUpload, FaRoute, FaClipboardCheck
} from 'react-icons/fa';
import {
  MdAssignment, MdVerified,
  MdSpeed, MdGroups,
  MdFilterCenterFocus
} from 'react-icons/md';
import { Button } from '@/components/common';

// CountUp Component
// CountUp component update করুন
interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function CountUp({ end, duration = 2000, suffix = '', prefix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const currentRef = countRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start > end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration]);

  return (
    <span ref={countRef} className="text-inherit font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HowItWorksPage() {

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* 1️⃣ Page Intro Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#004d40]/5 to-[#f2a921]/5"></div>
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-[#004d40]/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-40 sm:w-80 h-40 sm:h-80 bg-[#f2a921]/10 rounded-full translate-y-20 sm:translate-y-40 -translate-x-20 sm:-translate-x-40"></div>

        <div className="container relative mx-auto px-4 py-12 sm:py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#004d40]/10 text-[#004d40] text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <FaCity className="mr-2" />
                Civic Engagement Platform
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                How <span className="text-[#004d40]">Nagar</span>
                <span className="text-[#f2a921]">Nirman</span> Works
              </h1>
              <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Transforming civic reporting through a transparent, efficient workflow that connects
                citizens with authorities. From issue discovery to resolution, we ensure every
                concern receives prompt attention and effective action.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  iconPosition="right"
                >
                  Start Reporting
                </Button>
                <button className="group border-2 border-[#004d40] text-[#004d40] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-accent hover:text-white transition-all duration-300 text-sm sm:text-base">
                  <span>Watch Platform Tour</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  <div className="group bg-linear-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-linear-to-br from-[#004d40] to-[#00695c] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:rotate-12 transition-transform">
                      <FaCamera className="text-white text-lg sm:text-2xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2">Report</h3>
                    <p className="text-gray-600 text-[10px] sm:text-sm">Citizens submit issues with photo evidence</p>
                  </div>

                  <div className="group bg-linear-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-linear-to-br from-[#f2a921] to-[#ffb74d] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:rotate-12 transition-transform">
                      <MdVerified className="text-white text-lg sm:text-2xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2">Verify</h3>
                    <p className="text-gray-600 text-[10px] sm:text-sm">Officials validate and prioritize reports</p>
                  </div>

                  <div className="group bg-linear-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-linear-to-br from-[#004d40] to-[#00695c] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:rotate-12 transition-transform">
                      <MdAssignment className="text-white text-lg sm:text-2xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2">Assign</h3>
                    <p className="text-gray-600 text-[10px] sm:text-sm">Route to relevant municipal department</p>
                  </div>

                  <div className="group bg-linear-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-linear-to-br from-[#f2a921] to-[#ffb74d] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:rotate-12 transition-transform">
                      <FaCheckCircle className="text-white text-lg sm:text-2xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2">Resolve</h3>
                    <p className="text-gray-600 text-[10px] sm:text-sm">Issue gets fixed with verification</p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] sm:text-sm text-gray-500 font-medium">Average Resolution Time</div>
                      <div className="text-xl sm:text-3xl font-bold text-[#004d40]">48-72 hours</div>
                    </div>
                    <div className="w-10 h-10 sm:w-16 sm:h-16 bg-linear-to-r from-[#004d40] to-[#f2a921] rounded-full flex items-center justify-center">
                      <MdSpeed className="text-white text-lg sm:text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Step-by-Step Reporting Journey - Original Beautiful Design */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-[#004d40]" />
              <span className="text-[#555555] text-sm sm:text-base lg:text-lg font-medium">
                Step-by-Step Guide
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d40]">
              Your Reporting <span className="font-bold text-[#f2a921]">Journey</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto mt-3 sm:mt-4 px-2">
              Follow these simple steps to report civic issues and track their resolution
            </p>
          </div>

          <div className="relative">
            {/* Desktop timeline */}
            <div className="hidden md:grid md:grid-cols-6 gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="relative group">
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-1/2 w-full h-0.5 bg-linear-to-r from-[#004d40]/20 via-[#f2a921]/20 to-[#004d40]/20 z-0 group-hover:from-[#004d40] group-hover:via-[#f2a921] group-hover:to-[#004d40] transition-all duration-300"></div>
                  )}

                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${index === 0 ? 'bg-[#004d40] group-hover:scale-110 group-hover:shadow-lg' :
                      'bg-white border-2 border-[#004d40]/30 group-hover:border-[#f2a921] group-hover:scale-110 group-hover:shadow-md'
                      }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${index === 0 ? 'bg-white/10' : 'bg-[#004d40]/5 group-hover:bg-[#f2a921]/10'
                        }`}>
                        <step.icon className={`text-xl transition-colors duration-300 ${index === 0 ? 'text-white' : 'text-[#004d40] group-hover:text-[#f2a921]'
                          }`} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#f2a921] rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                        {step.id}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-[#004d40]">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile timeline */}
            <div className="md:hidden space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex gap-3 sm:gap-4 group">
                  <div className="shrink-0 relative">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${index === 0 ? 'bg-[#004d40]' : 'bg-[#004d40]/10 group-hover:bg-[#f2a921]/10'
                      }`}>
                      <step.icon className={`text-lg sm:text-xl transition-colors duration-300 ${index === 0 ? 'text-white' : 'text-[#004d40] group-hover:text-[#f2a921]'
                        }`} />
                      <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-[#f2a921] rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-md">
                        {step.id}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#004d40] transition-colors duration-300 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* 3️⃣ Authority Workflow - Unique and Beautiful Design */}
      <section className="py-10 sm:py-12 lg:py-20 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-[#004d40]" />
              <span className="text-[#555555] text-sm sm:text-base lg:text-lg font-medium">
                Government Process
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d40]">
              Authority <span className="font-bold text-[#f2a921]">Workflow</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto mt-3 sm:mt-4 px-2">
              How municipal departments efficiently handle and resolve citizen reports
            </p>
          </div>

          <div>
            {/* Unique Workflow Process Cards with Connection Lines */}
            <div className="relative">
              {/* Desktop Connection Line */}
              <div className="hidden lg:block absolute top-[120px] left-[10%] right-[10%] h-0.5 bg-linear-to-r from-[#004d40]/30 via-[#f2a921]/30 to-[#004d40]/30 z-1"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative">
                {authoritySteps.map((step, index) => (
                  <div key={step.id} className="relative group z-2">
                    {/* Step Card */}
                    <div className="h-full bg-linear-to-b from-white to-gray-50 rounded-lg p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border border-gray-100">
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#004d40] to-[#00695c] rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-base sm:text-lg">{step.id}</span>
                        </div>
                      </div>

                      {/* Icon Container */}
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all ${step.color === 'primary'
                        ? 'bg-linear-to-br from-[#004d40] to-[#00695c]'
                        : 'bg-linear-to-br from-[#f2a921] to-[#ffb74d]'
                        }`}>
                        <step.icon className="text-2xl sm:text-3xl text-white" />
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <div className="inline-block px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-linear-to-r from-[#004d40]/10 to-[#f2a921]/10 text-[#004d40] text-[10px] sm:text-xs lg:text-sm font-medium mb-2 sm:mb-4">
                          {step.status}
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">{step.title}</h3>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-2 lg:line-clamp-none">{step.description}</p>

                        {/* Duration Badge */}
                        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-full">
                          <FaClock className="text-[#f2a921] mr-1.5 sm:mr-2 text-xs sm:text-sm" />
                          <span className="font-semibold text-[#004d40] text-xs sm:text-sm">{step.duration}</span>
                        </div>

                        {/* Progress Indicator */}
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-center flex-wrap gap-1">
                            <div className="flex items-center">
                              {[...Array(step.progress)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#004d40] rounded-full mx-0.5 sm:mx-1"></div>
                              ))}
                              {[...Array(5 - step.progress)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full mx-0.5 sm:mx-1"></div>
                              ))}
                            </div>
                            <span className="ml-2 text-[10px] sm:text-xs lg:text-sm text-gray-500">{step.progress}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Connector for Mobile/Tablet */}
                    {index < authoritySteps.length - 1 && (
                      <div className="lg:hidden flex justify-center my-4 sm:my-6">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 text-[#f2a921] transform rotate-90 md:rotate-0">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Process Timeline Bar */}
            <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="mb-6 sm:mb-8 hidden lg:block">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#004d40] text-center mb-4">Workflow Progress Timeline</h3>
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-r from-[#004d40] via-[#f2a921] to-[#004d40] opacity-20"></div>
                  <div className="absolute inset-0 flex">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div key={index} className="relative w-1/5">
                        <div className="absolute -top-2 left-0 transform -translate-x-1/2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < 3 ? 'bg-linear-to-br from-[#004d40] to-[#00695c]' : 'bg-gray-300'
                            }`}>
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                        </div>
                        <div className="absolute top-4 left-0 transform -translate-x-1/2 text-sm text-gray-600 font-medium whitespace-nowrap">
                          {authoritySteps[index]?.title.split(' ')[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-8">
                <div className="bg-linear-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#004d40] rounded-lg flex items-center justify-center shrink-0">
                      <MdSpeed className="text-white text-xl sm:text-2xl" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">Average Processing Speed</h4>
                      <p className="text-xl sm:text-2xl font-bold text-[#004d40]">2.3 days</p>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f2a921] rounded-lg flex items-center justify-center shrink-0">
                      <FaClipboardCheck className="text-white text-xl sm:text-2xl" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">Success Rate</h4>
                      <p className="text-xl sm:text-2xl font-bold text-[#004d40]">94%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ Who Uses NagarNirman? */}
      <section className="py-10 sm:py-12 lg:py-20 bg-linear-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-[#004d40]" />
              <span className="text-[#555555] text-sm sm:text-base lg:text-lg font-medium">
                Platform Users
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d40]">
              Who Uses <span className="font-bold text-[#f2a921]">NagarNirman</span>?
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto mt-3 sm:mt-4 px-2">
              A collaborative platform connecting citizens, authorities, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {userPersonas.map((persona) => (
              <div key={persona.id} className="group h-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all ${persona.id === 1 ? 'bg-linear-to-br from-[#004d40] to-[#00695c]' :
                  persona.id === 2 ? 'bg-linear-to-br from-[#f2a921] to-[#ffb74d]' :
                    'bg-linear-to-br from-[#004d40] to-[#f2a921]'
                  }`}>
                  <persona.icon className="text-xl sm:text-2xl lg:text-3xl text-white" />
                </div>

                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-gray-900 mb-2 sm:mb-4">{persona.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 text-center mb-4 sm:mb-6">{persona.description}</p>

                <ul className="space-y-2 sm:space-y-3">
                  {persona.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start sm:items-center text-gray-700 group/feature text-xs sm:text-sm lg:text-base">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#004d40]/10 flex items-center justify-center mr-2 sm:mr-3 shrink-0 group-hover/feature:bg-[#004d40] transition-colors">
                        <FaCheckCircle className="text-[#004d40] text-xs sm:text-sm group-hover/feature:text-white transition-colors" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 text-center">
                  <div className="text-xs sm:text-sm text-gray-500">Active Users</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#004d40]">
                    {persona.id === 1 ? <CountUp end={85000} suffix="+" /> :
                      persona.id === 2 ? <CountUp end={2500} suffix="+" /> :
                        <CountUp end={150} suffix="+" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Common Issues That Can Be Reported */}
      <section className="py-10 sm:py-12 lg:py-20 bg-linear-to-br from-[#004d40]/5 to-[#f2a921]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-[#004d40]" />
              <span className="text-[#555555] text-sm sm:text-base lg:text-lg font-medium">
                Report Categories
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d40]">
              Common <span className="font-bold text-[#f2a921]">Issues</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto mt-3 sm:mt-4 px-2">
              Report any civic issue quickly through our platform
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {issues.map((issue) => (
              <div key={issue.id} className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-500 hover:z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#004d40]/10 to-[#f2a921]/10 flex items-center justify-center mb-3 sm:mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all">
                  <issue.icon className="text-xl sm:text-2xl text-[#004d40] group-hover:text-[#f2a921] transition-colors" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#004d40] transition-colors">
                  {issue.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-base mb-3 sm:mb-4 line-clamp-2">{issue.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-6 pt-3 sm:pt-6 border-t border-gray-200 gap-2">
                  <span className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-1 sm:py-2 bg-linear-to-r from-[#004d40]/10 to-[#f2a921]/10 text-[#004d40] rounded-full">
                    {issue.category}
                  </span>
                  <div className="text-xs font-medium text-gray-500 group-hover:text-[#004d40] transition-colors">
                    Avg. <CountUp end={issue.avgResolution} duration={1500} />h
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ Why This Process Works */}
      <section className="py-10 sm:py-12 lg:py-20 bg-linear-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#004d40]" />
              <span className="text-[#555555] text-sm sm:text-base lg:text-lg font-medium">
                Platform Benefits
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d40]">
              Why Our <span className="font-bold text-[#f2a921]">Process</span> Works
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto mt-3 sm:mt-4 px-2">
              Key benefits that make NagarNirman the most effective civic reporting platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-300">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#004d40]/10 to-[#f2a921]/10 flex items-center justify-center mb-3 sm:mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                  <benefit.icon className="text-2xl sm:text-3xl text-[#004d40] group-hover:text-[#f2a921] transition-colors" />
                </div>
                <h3 className="text-sm sm:text-xl font-bold text-center text-gray-900 mb-2 sm:mb-4 group-hover:text-[#004d40] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center text-xs sm:text-base line-clamp-3">{benefit.description}</p>
                <div className="mt-4 sm:mt-6 flex justify-center">
                  <div className="w-8 sm:w-12 h-1 bg-linear-to-r from-[#004d40] to-[#f2a921] rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-linear-to-r from-[#004d40] to-[#00695c] rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-3 gap-4 sm:gap-12">
              <div className="text-center">
                <div className="text-2xl sm:text-5xl font-bold text-accent mb-2 sm:mb-4">
                  <CountUp end={95} suffix="%" />
                </div>
                <p className="text-green-100 text-xs sm:text-lg">Verified in 24h</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-5xl font-bold text-accent mb-2 sm:mb-4">
                  <CountUp end={85} suffix="%" />
                </div>
                <p className="text-green-100 text-xs sm:text-lg">Resolved in 1 week</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">
                  4.8<FaStar className="inline text-[#f2a921] ml-1 text-lg sm:text-3xl" />
                </div>
                <p className="text-green-100 text-xs sm:text-lg">User rating</p>
              </div>
            </div>

            <div className="mt-6 sm:mt-12 pt-6 sm:pt-12 border-t border-green-400/30 grid grid-cols-3 gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-lg sm:text-3xl font-bold text-accent mb-1 sm:mb-2">
                  <CountUp end={50000} suffix="+" />
                </div>
                <p className="text-green-100 text-xs sm:text-base">Reports</p>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-3xl font-bold text-accent mb-1 sm:mb-2">
                  <CountUp end={120} suffix="+" />
                </div>
                <p className="text-green-100 text-xs sm:text-base">Cities</p>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                <p className="text-green-100 text-xs sm:text-base">Available</p>
              </div>
            </div>
          </div>

        </div>
      </section>


    </div>
  );
}

// Data for steps
const steps = [
  {
    id: 1,
    title: 'Identify the Issue',
    description: 'Spot a civic problem in your area',
    icon: FaSearch
  },
  {
    id: 2,
    title: 'Capture Evidence',
    description: 'Take photos/videos as proof',
    icon: FaCamera
  },
  {
    id: 3,
    title: 'Auto-detect Location',
    description: 'GPS pins exact location',
    icon: FaLocationArrow
  },
  {
    id: 4,
    title: 'Add Details',
    description: 'Describe the issue briefly',
    icon: FaListAlt
  },
  {
    id: 5,
    title: 'Submit Report',
    description: 'Send to authorities instantly',
    icon: FaUpload
  },
  {
    id: 6,
    title: 'Track Live Status',
    description: 'Real-time updates until resolution',
    icon: FaHistory
  }
];

// Data for authority workflow - Updated with unique design
const authoritySteps = [
  {
    id: 1,
    title: 'Report Intake',
    status: 'Digital Receipt',
    duration: 'Instant',
    description: 'Reports received through multiple channels and logged digitally',
    icon: FaUpload,
    color: 'primary',
    progress: 1
  },
  {
    id: 2,
    title: 'Smart Screening',
    status: 'AI Processing',
    duration: '1-2 hours',
    description: 'AI-powered screening for duplicates, priority, and categorization',
    icon: MdFilterCenterFocus,
    color: 'accent',
    progress: 2
  },
  {
    id: 3,
    title: 'Expert Review',
    status: 'Manual Verification',
    duration: '2-4 hours',
    description: 'Municipal experts verify and assign severity levels',
    icon: FaUserCheck,
    color: 'primary',
    progress: 3
  },
  {
    id: 4,
    title: 'Department Dispatch',
    status: 'Smart Routing',
    duration: '1 hour',
    description: 'Automated routing to appropriate department with all details',
    icon: FaRoute,
    color: 'accent',
    progress: 4
  },
  {
    id: 5,
    title: 'Resolution & Closure',
    status: 'Final Approval',
    duration: '24-72 hours',
    description: 'Field work completion with photographic evidence and user feedback',
    icon: FaClipboardCheck,
    color: 'primary',
    progress: 5
  }
];

// Data for user personas
const userPersonas = [
  {
    id: 1,
    title: 'Citizens',
    description: 'Report issues and track resolutions in real-time',
    icon: FaUsers,
    features: [
      'Submit reports with multimedia evidence',
      'Track real-time status updates',
      'Receive resolution notifications',
      'View community reports map'
    ]
  },
  {
    id: 2,
    title: 'Municipal Workers',
    description: 'Receive and resolve reported civic issues efficiently',
    icon: FaBuilding,
    features: [
      'Access assigned reports dashboard',
      'Update work progress in real-time',
      'Upload completion evidence',
      'Coordinate with teams seamlessly'
    ]
  },
  {
    id: 3,
    title: 'Administrators',
    description: 'Monitor, verify, and manage platform operations',
    icon: FaUserShield,
    features: [
      'Verify and prioritize incoming reports',
      'Assign tasks to departments',
      'Monitor resolution analytics',
      'Generate performance reports'
    ]
  }
];

// Data for common issues
const issues = [
  {
    id: 1,
    title: 'Road Damage',
    description: 'Potholes, cracks, and surface deterioration',
    icon: FaRoad,
    category: 'Infrastructure',
    avgResolution: 48
  },
  {
    id: 2,
    title: 'Street Light Failure',
    description: 'Non-functioning or damaged public lighting',
    icon: FaLightbulb,
    category: 'Utilities',
    avgResolution: 24
  },
  {
    id: 3,
    title: 'Water Issues',
    description: 'Leakages, blockages, and water supply problems',
    icon: FaTint,
    category: 'Water',
    avgResolution: 36
  },
  {
    id: 4,
    title: 'Waste Management',
    description: 'Uncollected garbage, overflowing bins',
    icon: FaTrash,
    category: 'Sanitation',
    avgResolution: 12
  },
  {
    id: 5,
    title: 'Parks Maintenance',
    description: 'Public space upkeep and facility issues',
    icon: FaTree,
    category: 'Public Spaces',
    avgResolution: 72
  },
  {
    id: 6,
    title: 'Safety Hazards',
    description: 'Broken infrastructure, exposed wiring',
    icon: FaExclamationTriangle,
    category: 'Safety',
    avgResolution: 6
  },
  {
    id: 7,
    title: 'Power Problems',
    description: 'Outages, fallen cables, transformer issues',
    icon: FaBolt,
    category: 'Electricity',
    avgResolution: 18
  },
  {
    id: 8,
    title: 'Environment',
    description: 'Pollution, illegal dumping, tree damage',
    icon: FaLeaf,
    category: 'Green',
    avgResolution: 96
  }
];

// Data for benefits
const benefits = [
  {
    id: 1,
    title: 'Rapid Response',
    description: '60% faster resolution with streamlined workflows',
    icon: MdSpeed
  },
  {
    id: 2,
    title: 'Complete Transparency',
    description: 'Real-time tracking keeps everyone informed',
    icon: FaEye
  },
  {
    id: 3,
    title: 'Data Intelligence',
    description: 'AI-powered insights for urban planning',
    icon: FaDatabase
  },
  {
    id: 4,
    title: 'Community Power',
    description: 'Collective action for better neighborhoods',
    icon: MdGroups
  }
];