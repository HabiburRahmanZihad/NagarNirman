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
  FaSearch, FaUpload, FaRoute, FaClipboardCheck,
  FaArrowRight
} from 'react-icons/fa';
import {
  MdAssignment, MdVerified,
  MdSpeed, MdGroups,
  MdFilterCenterFocus
} from 'react-icons/md';

// Custom CSS for animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes float-reverse {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(20px) rotate(-5deg); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 77, 64, 0.3); }
    50% { box-shadow: 0 0 40px rgba(242, 169, 33, 0.5); }
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes border-dance {
    0% { border-color: #004d40; }
    50% { border-color: #f2a921; }
    100% { border-color: #004d40; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-reverse { animation: float-reverse 5s ease-in-out infinite; }
  .animate-float-slow { animation: float 8s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
  .animate-gradient { 
    background-size: 200% 200%;
    animation: gradient-shift 4s ease infinite;
  }
  .animate-border { animation: border-dance 3s ease-in-out infinite; }
  .animate-shimmer { animation: shimmer 2s infinite; }
  .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  .glass-dark {
    background: rgba(0, 77, 64, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .gradient-text {
    background: linear-gradient(135deg, #004d40 0%, #f2a921 50%, #004d40 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 3s linear infinite;
  }
  .card-3d {
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  .card-3d:hover {
    transform: rotateY(5deg) rotateX(5deg);
  }
  .glow-border {
    position: relative;
  }
  .glow-border::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #004d40, #f2a921, #004d40, #f2a921);
    background-size: 400% 400%;
    border-radius: inherit;
    z-index: -1;
    animation: gradient-shift 3s ease infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .glow-border:hover::before {
    opacity: 1;
  }
  .shine-effect {
    position: relative;
    overflow: hidden;
  }
  .shine-effect::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    transform: rotate(30deg);
    animation: shimmer 3s infinite;
  }
`;

// CountUp Component
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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white overflow-hidden">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* 1️⃣ Page Intro Header - STUNNING HERO */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-linear-to-br from-[#004d40]/5 via-white to-[#f2a921]/5"></div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-[10%] w-20 h-20 sm:w-32 sm:h-32 bg-linear-to-br from-[#004d40] to-[#00695c] rounded-3xl animate-float opacity-20 blur-sm"></div>
        <div className="absolute top-40 left-[5%] w-16 h-16 sm:w-24 sm:h-24 bg-linear-to-br from-[#f2a921] to-[#ffb74d] rounded-full animate-float-reverse opacity-30"></div>
        <div className="absolute bottom-32 right-[15%] w-12 h-12 sm:w-20 sm:h-20 bg-[#004d40] rounded-2xl animate-float-slow opacity-15 rotate-45"></div>
        <div className="absolute bottom-20 left-[20%] w-24 h-24 sm:w-40 sm:h-40 border-4 border-[#f2a921]/20 rounded-full animate-float opacity-40"></div>
        <div className="absolute top-1/3 right-[30%] w-8 h-8 bg-[#f2a921] rounded-full animate-pulse opacity-60"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-size-[50px_50px] bg-[linear-gradient(#004d40_1px,transparent_1px),linear-gradient(90deg,#004d40_1px,transparent_1px)]"></div>

        <div className="container relative mx-auto px-4 py-12 sm:py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative z-10">
              {/* Animated Badge */}
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-card text-[#004d40] text-xs sm:text-sm font-semibold mb-6 sm:mb-8 animate-bounce-subtle shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <FaCity className="mr-2" />
                Civic Engagement Platform
                <span className="ml-3 px-2 py-0.5 bg-[#f2a921] text-white text-[10px] rounded-full">NEW</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 sm:mb-8 leading-[1.1]">
                How{' '}
                <span className="relative inline-block">
                  <span className="gradient-text">Nagar</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 4 150 4 198 10" stroke="#f2a921" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-[#f2a921]">Nirman</span>
                <br />
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-600">Works</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-xl">
                Transforming civic reporting through a{' '}
                <span className="text-[#004d40] font-semibold">transparent</span>,{' '}
                <span className="text-[#f2a921] font-semibold">efficient</span> workflow that connects
                citizens with authorities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button className="group relative px-8 py-4 bg-linear-to-r from-[#004d40] to-[#00695c] text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[#004d40]/30 hover:scale-105 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Reporting
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-[#f2a921] to-[#ffb74d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

              </div>

              {/* Trust Badges */}
              <div className="mt-10 sm:mt-14 flex flex-wrap items-center gap-6 sm:gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-white shadow-lg ${i === 1 ? 'bg-[#004d40]' : i === 2 ? 'bg-[#f2a921]' : i === 3 ? 'bg-[#00695c]' : 'bg-[#ffb74d]'
                        }`}></div>
                    ))}
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-bold text-gray-900">85K+</div>
                    <div className="text-xs text-gray-500">Active Users</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-[#f2a921] text-xl" />
                  <span className="font-bold text-gray-900">4.9</span>
                  <span className="text-gray-500 text-sm">(2.5k reviews)</span>
                </div>
              </div>
            </div>

            {/* Hero Cards - Glassmorphism */}
            <div className="relative">
              {/* Glow Effect Behind */}
              <div className="absolute inset-0 bg-linear-to-r from-[#004d40]/20 to-[#f2a921]/20 rounded-[3rem] blur-3xl"></div>

              <div className="relative z-10 glass-card rounded-4xl sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl animate-pulse-glow">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { icon: FaCamera, title: 'Report', desc: 'Submit with photo evidence', color: 'from-[#004d40] to-[#00695c]', delay: '0s' },
                    { icon: MdVerified, title: 'Verify', desc: 'Officials validate reports', color: 'from-[#f2a921] to-[#ffb74d]', delay: '0.1s' },
                    { icon: MdAssignment, title: 'Assign', desc: 'Route to departments', color: 'from-[#004d40] to-[#00695c]', delay: '0.2s' },
                    { icon: FaCheckCircle, title: 'Resolve', desc: 'Issue gets fixed', color: 'from-[#f2a921] to-[#ffb74d]', delay: '0.3s' }
                  ].map((item, idx) => (
                    <div key={idx}
                      className="group relative bg-white/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden glow-border"
                    >
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                      <div className={`relative w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <item.icon className="text-white text-xl sm:text-2xl" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">{item.desc}</p>

                      {/* Step number */}
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats Bar */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Average Resolution</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black gradient-text">48-72</span>
                        <span className="text-lg text-gray-600 font-semibold">hours</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-[#004d40] to-[#f2a921] flex items-center justify-center shadow-xl animate-float">
                      <MdSpeed className="text-white text-3xl sm:text-4xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-400 font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#004d40] rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Step-by-Step Reporting Journey - STUNNING TIMELINE */}
      <section className="py-16 sm:py-24 lg:py-32 bg-linear-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-[5%] w-32 h-32 bg-[#004d40]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-[10%] w-40 h-40 bg-[#f2a921]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header - WOW Effect */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[#004d40] text-sm font-medium mb-6 shadow-lg">
              <FaMapMarkerAlt className="w-4 h-4 animate-bounce" />
              <span>Step-by-Step Guide</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Your Reporting{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Journey</span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-[#f2a921]/20 -skew-x-12"></div>
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to report civic issues and track their resolution
            </p>
          </div>

          <div className="relative">
            {/* Desktop timeline - STUNNING VERSION */}
            <div className="hidden md:block">
              {/* Animated Connection Line */}
              <div className="absolute top-24 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-full bg-linear-to-r from-[#004d40] via-[#f2a921] to-[#004d40] animate-gradient"></div>
              </div>

              <div className="grid md:grid-cols-6 gap-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative group pt-4">
                    {/* Icon Container with Glow */}
                    <div className="relative z-10 flex justify-center mb-6">
                      <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 shadow-xl ${index === 0
                        ? 'bg-linear-to-br from-[#004d40] to-[#00695c] animate-pulse-glow'
                        : 'bg-white border-2 border-gray-200 group-hover:border-[#f2a921] group-hover:shadow-[#f2a921]/30'
                        }`}>
                        <step.icon className={`text-2xl transition-all duration-300 ${index === 0 ? 'text-white' : 'text-[#004d40] group-hover:text-[#f2a921] group-hover:scale-110'
                          }`} />

                        {/* Step Number Badge */}
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-linear-to-br from-[#f2a921] to-[#ffb74d] rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:scale-125 transition-transform">
                          {step.id}
                        </div>

                        {/* Glow Ring on Hover */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-[#f2a921] opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-125 transition-all duration-300"></div>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="text-center glass-card rounded-2xl p-4 opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-xl">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#004d40] transition-colors text-sm lg:text-base">
                        {step.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                        {step.description}
                      </p>
                    </div>

                    {/* Hover Line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#f2a921] rounded-full group-hover:w-16 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile timeline - BEAUTIFUL VERSION */}
            <div className="md:hidden">
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#004d40] via-[#f2a921] to-[#004d40]"></div>

                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div key={step.id} className="relative flex gap-4 sm:gap-6 group">
                      {/* Icon */}
                      <div className="relative z-10 shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${index === 0
                          ? 'bg-linear-to-br from-[#004d40] to-[#00695c]'
                          : 'bg-white border-2 border-gray-200 group-hover:border-[#f2a921]'
                          }`}>
                          <step.icon className={`text-xl ${index === 0 ? 'text-white' : 'text-[#004d40] group-hover:text-[#f2a921]'}`} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#f2a921] rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {step.id}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 glass-card rounded-2xl p-4 group-hover:shadow-lg transition-all">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#004d40] text-sm sm:text-base">
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 3️⃣ Authority Workflow - STUNNING WORKFLOW */}
      <section className="py-16 sm:py-24 lg:py-32 bg-linear-to-br from-[#004d40]/5 via-white to-[#f2a921]/5 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#004d40]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f2a921]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[#004d40] text-sm font-medium mb-6 shadow-lg">
              <FaBuilding className="w-4 h-4" />
              <span>Government Process</span>
              <span className="w-2 h-2 bg-[#f2a921] rounded-full animate-pulse"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Authority{' '}
              <span className="relative">
                <span className="gradient-text">Workflow</span>
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              How municipal departments efficiently handle and resolve citizen reports
            </p>
          </div>

          {/* Workflow Cards */}
          <div className="relative">
            {/* Desktop Connection Line */}
            <div className="hidden lg:block absolute top-32 left-[10%] right-[10%] h-1 rounded-full overflow-hidden">
              <div className="w-full h-full bg-linear-to-r from-[#004d40] via-[#f2a921] to-[#004d40] animate-gradient opacity-30"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
              {authoritySteps.map((step) => (
                <div key={step.id} className="relative group">
                  {/* Main Card */}

                  <div className="h-full  rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-accent/50  bg-white/70 backdrop-blur-md hover:bg-white/80 hover:backdrop-blur-lg cursor-pointer">

                    {/* Step Number - Floating */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-linear-to-br from-[#004d40] to-[#00695c] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <span className="text-white font-black text-lg">{step.id}</span>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto mt-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg ${step.color === 'primary'
                      ? 'bg-linear-to-br from-[#004d40] to-[#00695c]'
                      : 'bg-linear-to-br from-[#f2a921] to-[#ffb74d]'
                      }`}>
                      <step.icon className="text-2xl sm:text-3xl text-white" />
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <div className="inline-block px-3 py-1.5 rounded-full bg-linear-to-r from-[#004d40]/10 to-[#f2a921]/10 text-[#004d40] text-xs font-semibold mb-4">
                        {step.status}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#004d40] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{step.description}</p>

                      {/* Duration */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
                        <FaClock className="text-[#f2a921] text-sm" />
                        <span className="font-semibold text-[#004d40] text-sm">{step.duration}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 rounded-full transition-all duration-300 ${i < step.progress
                                ? 'w-6 bg-linear-to-r from-[#004d40] to-[#f2a921]'
                                : 'w-2 bg-gray-200'
                                }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 sm:mt-16 lg:mt-20 glass-card rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-linear-to-r from-[#004d40]/5 to-transparent rounded-2xl group hover:from-[#004d40]/10 transition-colors">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-[#004d40] to-[#00695c] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MdSpeed className="text-white text-2xl sm:text-3xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">Average Processing Speed</h4>
                  <p className="text-2xl sm:text-3xl font-black gradient-text">2.3 days</p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-linear-to-r from-[#f2a921]/5 to-transparent rounded-2xl group hover:from-[#f2a921]/10 transition-colors">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-[#f2a921] to-[#ffb74d] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FaClipboardCheck className="text-white text-2xl sm:text-3xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">Success Rate</h4>
                  <p className="text-2xl sm:text-3xl font-black gradient-text">94%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ Who Uses NagarNirman? - STUNNING PERSONAS */}
      <section className="py-16 sm:py-24 lg:py-32 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-size-[30px_30px] bg-[radial-gradient(#004d40_1px,transparent_1px)]"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[#004d40] text-sm font-medium mb-6 shadow-lg">
              <FaUsers className="w-4 h-4" />
              <span>Platform Users</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Who Uses{' '}
              <span className="gradient-text">NagarNirman</span>?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              A collaborative platform connecting citizens, authorities, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {userPersonas.map((persona, idx) => (
              <div key={persona.id} className="group relative">
                {/* Card */}
                <div className="h-full glass-card rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/50 overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${idx === 0 ? 'bg-[#004d40]' : idx === 1 ? 'bg-[#f2a921]' : 'bg-linear-to-br from-[#004d40] to-[#f2a921]'
                    }`}></div>

                  {/* Icon */}
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl ${idx === 0 ? 'bg-linear-to-br from-[#004d40] to-[#00695c]' :
                    idx === 1 ? 'bg-linear-to-br from-[#f2a921] to-[#ffb74d]' :
                      'bg-linear-to-br from-[#004d40] via-[#f2a921] to-[#004d40] animate-gradient'
                    }`}>
                    <persona.icon className="text-2xl sm:text-3xl text-white" />

                    {/* Floating Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <FaStar className="text-[#f2a921] text-sm" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-3 group-hover:text-[#004d40] transition-colors">
                    {persona.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 text-center mb-6">
                    {persona.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {persona.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3 text-sm text-gray-600 group/item">
                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#004d40]/10 to-[#f2a921]/10 flex items-center justify-center shrink-0 group-hover/item:from-[#004d40] group-hover/item:to-[#00695c] transition-all duration-300">
                          <FaCheckCircle className="text-[#004d40] text-xs group-hover/item:text-white transition-colors" />
                        </div>
                        <span className="group-hover/item:text-gray-900 transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stats */}
                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <div className="text-xs text-gray-400 mb-1">Active Users</div>
                    <div className="text-2xl sm:text-3xl font-black gradient-text">
                      {persona.id === 1 ? <CountUp end={85000} suffix="+" /> :
                        persona.id === 2 ? <CountUp end={2500} suffix="+" /> :
                          <CountUp end={150} suffix="+" />}
                    </div>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-2/3 h-6 rounded-full blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-50 ${idx === 0 ? 'bg-[#004d40]' : idx === 1 ? 'bg-[#f2a921]' : 'bg-[#004d40]'
                  }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Common Issues - STUNNING GRID */}
      <section className="py-16 sm:py-24 lg:py-32 bg-linear-to-br from-[#004d40]/5 via-transparent to-[#f2a921]/5 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#004d40]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-[#f2a921]/10 rounded-full blur-3xl animate-float-reverse"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[#004d40] text-sm font-medium mb-6 shadow-lg">
              <FaFileAlt className="w-4 h-4" />
              <span>Report Categories</span>
              <span className="px-2 py-0.5 bg-[#f2a921] text-white text-xs rounded-full">8 Types</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Common{' '}
              <span className="relative">
                <span className="gradient-text">Issues</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 4 150 4 198 10" stroke="#004d40" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Report any civic issue quickly through our platform
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {issues.map((issue) => (
              <div key={issue.id} className="group relative">
                <div className="h-full glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 overflow-hidden">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  {/* Icon */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#004d40]/10 to-[#f2a921]/10 flex items-center justify-center mb-4 sm:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:from-[#004d40] group-hover:to-[#00695c]">
                    <issue.icon className="text-xl sm:text-2xl text-[#004d40] group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-[#004d40] transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-2">{issue.description}</p>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 border-t border-gray-100">
                    <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 bg-[#004d40]/10 text-[#004d40] rounded-full">
                      {issue.category}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                      <FaClock className="text-[#f2a921]" />
                      <span className="font-medium">~<CountUp end={issue.avgResolution} duration={1500} />h</span>
                    </div>
                  </div>
                </div>

                {/* Glow on hover */}
                <div className="absolute -inset-1 bg-linear-to-r from-[#004d40] to-[#f2a921] rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ Why This Process Works - STUNNING FINALE */}
      <section className="py-16 sm:py-24 lg:py-32 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[#004d40] text-sm font-medium mb-6 shadow-lg">
              <FaCheckCircle className="w-4 h-4 text-green-500" />
              <span>Platform Benefits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Why Our{' '}
              <span className="gradient-text">Process</span>{' '}
              Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Key benefits that make NagarNirman the most effective civic reporting platform
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-20">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="group relative">
                <div className="h-full glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/50 text-center overflow-hidden">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-linear-to-br from-[#004d40]/5 to-[#f2a921]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Icon */}
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-[#004d40]/10 to-[#f2a921]/10 flex items-center justify-center mb-4 sm:mb-6 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:from-[#004d40] group-hover:to-[#f2a921]">
                    <benefit.icon className="text-2xl sm:text-3xl text-[#004d40] group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-4 group-hover:text-[#004d40] transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">{benefit.description}</p>

                  {/* Animated Line */}
                  <div className="mt-4 sm:mt-6 flex justify-center">
                    <div className="w-8 sm:w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-linear-to-r from-[#004d40] to-[#f2a921] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* STUNNING Stats Section */}
          <div className="relative rounded-4xl sm:rounded-[3rem] overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-linear-to-br from-[#004d40] via-[#00695c] to-[#004d40] animate-gradient"></div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-size-[60px_60px] bg-[radial-gradient(circle_at_20%_50%,white_1px,transparent_1px),radial-gradient(circle_at_80%_50%,white_1px,transparent_1px)]"></div>

            {/* Floating Orbs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-[#f2a921]/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float-reverse"></div>

            <div className="relative p-8 sm:p-12 lg:p-16">
              {/* Main Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
                <div className="text-center group">
                  <div className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                    <CountUp end={95} suffix="%" />
                  </div>
                  <div className="w-12 sm:w-16 h-1 bg-[#f2a921] mx-auto mb-2 sm:mb-3 rounded-full"></div>
                  <p className="text-green-100 text-xs sm:text-base lg:text-lg font-medium">Verified in 24h</p>
                </div>
                <div className="text-center group">
                  <div className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                    <CountUp end={85} suffix="%" />
                  </div>
                  <div className="w-12 sm:w-16 h-1 bg-[#f2a921] mx-auto mb-2 sm:mb-3 rounded-full"></div>
                  <p className="text-green-100 text-xs sm:text-base lg:text-lg font-medium">Resolved in 1 week</p>
                </div>
                <div className="text-center group">
                  <div className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-2 sm:mb-4 flex items-center justify-center gap-1 sm:gap-2 group-hover:scale-110 transition-transform">
                    4.8
                    <FaStar className="text-[#f2a921] text-xl sm:text-3xl lg:text-5xl animate-pulse" />
                  </div>
                  <div className="w-12 sm:w-16 h-1 bg-[#f2a921] mx-auto mb-2 sm:mb-3 rounded-full"></div>
                  <p className="text-green-100 text-xs sm:text-base lg:text-lg font-medium">User Rating</p>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="pt-8 sm:pt-12 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  <div className="text-center glass-dark rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-colors">
                    <div className="text-xl sm:text-3xl lg:text-4xl font-black text-[#f2a921] mb-1 sm:mb-2">
                      <CountUp end={50000} suffix="+" />
                    </div>
                    <p className="text-green-100 text-xs sm:text-sm lg:text-base">Reports Resolved</p>
                  </div>
                  <div className="text-center glass-dark rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-colors">
                    <div className="text-xl sm:text-3xl lg:text-4xl font-black text-[#f2a921] mb-1 sm:mb-2">
                      <CountUp end={120} suffix="+" />
                    </div>
                    <p className="text-green-100 text-xs sm:text-sm lg:text-base">Cities Covered</p>
                  </div>
                  <div className="text-center glass-dark rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-colors">
                    <div className="text-xl sm:text-3xl lg:text-4xl font-black text-white mb-1 sm:mb-2">
                      24/7
                    </div>
                    <p className="text-green-100 text-xs sm:text-sm lg:text-base">Always Available</p>
                  </div>
                </div>
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