// app/how-it-works/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FaMapMarkerAlt, FaCamera, FaCheckCircle, FaUserCheck, FaBuilding, 
  FaTools, FaChartLine, FaUsers, FaRoad, FaLightbulb, FaTint, 
  FaTrash, FaTree, FaExclamationTriangle, FaBolt, FaLeaf, 
  FaClock, FaUserShield, FaMapMarkedAlt, FaComments, 
  FaQuestionCircle, FaArrowRight, FaShieldAlt, FaBullhorn,
  FaEye, FaDatabase, FaHandshake, FaMobileAlt, FaSyncAlt,
  FaChevronDown, FaChevronUp, FaStar, FaCity, FaHardHat,
  FaFileAlt, FaLocationArrow, FaListAlt, FaPaperPlane, FaHistory,
  FaSearch, FaUpload, FaRoute, FaWrench, FaClipboardCheck
} from 'react-icons/fa';
import { 
  MdOutlineDescription, MdAssignment, MdUpdate, MdVerified,
  MdLocationOn, MdSpeed, MdSecurity, MdGroups, MdTrendingUp,
  MdFilterCenterFocus, MdEngineering
} from 'react-icons/md';
import { GiProgression, GiReceiveMoney } from 'react-icons/gi';
import { TbProgressCheck } from 'react-icons/tb';

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

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [end, duration]);

  return (
    <span ref={countRef} className="text-4xl font-bold text-[#004d40]">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 1️⃣ Page Intro Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/5 to-[#f2a921]/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#004d40]/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f2a921]/10 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#004d40]/10 text-[#004d40] text-sm font-medium mb-6">
                <FaCity className="mr-2" />
                Civic Engagement Platform
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                How <span className="text-[#004d40]">Nagar</span>
                <span className="text-[#f2a921]">Nirman</span> Works
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transforming civic reporting through a transparent, efficient workflow that connects 
                citizens with authorities. From issue discovery to resolution, we ensure every 
                concern receives prompt attention and effective action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-[#004d40] to-[#00695c] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#004d40]/30 transition-all duration-300 flex items-center justify-center gap-3">
                  <span>Start Reporting</span>
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button className="group border-2 border-[#004d40] text-[#004d40] px-8 py-4 rounded-xl font-semibold hover:bg-[#004d40] hover:text-white transition-all duration-300">
                  <span>Watch Platform Tour</span>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                      <FaCamera className="text-white text-2xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Report</h3>
                    <p className="text-gray-600 text-sm">Citizens submit issues with photo evidence</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#f2a921] to-[#ffb74d] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                      <MdVerified className="text-white text-2xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Verify</h3>
                    <p className="text-gray-600 text-sm">Officials validate and prioritize reports</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                      <MdAssignment className="text-white text-2xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Assign</h3>
                    <p className="text-gray-600 text-sm">Route to relevant municipal department</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#f2a921] to-[#ffb74d] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                      <FaCheckCircle className="text-white text-2xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Resolve</h3>
                    <p className="text-gray-600 text-sm">Issue gets fixed with verification</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Average Resolution Time</div>
                      <div className="text-3xl font-bold text-[#004d40]">48-72 hours</div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-[#004d40] to-[#f2a921] rounded-full flex items-center justify-center">
                      <MdSpeed className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Step-by-Step Reporting Journey - Original Beautiful Design */}
<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-8 md:mb-16">
      <div className="flex items-center justify-center gap-2 mb-3">
        <FaMapMarkerAlt className="w-5 h-5 text-[#004d40]" />
        <span className="text-[#555555] text-lg font-medium">
          Step-by-Step Guide
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-[#004d40]">
        Your Reporting <span className="font-bold text-[#f2a921]">Journey</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
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
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#004d40]/20 via-[#f2a921]/20 to-[#004d40]/20 z-0 group-hover:from-[#004d40] group-hover:via-[#f2a921] group-hover:to-[#004d40] transition-all duration-300"></div>
            )}
            
            <div className="relative z-10">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                index === 0 ? 'bg-[#004d40] group-hover:scale-110 group-hover:shadow-lg' : 
                'bg-white border-2 border-[#004d40]/30 group-hover:border-[#f2a921] group-hover:scale-110 group-hover:shadow-md'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index === 0 ? 'bg-white/10' : 'bg-[#004d40]/5 group-hover:bg-[#f2a921]/10'
                }`}>
                  <step.icon className={`text-xl transition-colors duration-300 ${
                    index === 0 ? 'text-white' : 'text-[#004d40] group-hover:text-[#f2a921]'
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
      <div className="md:hidden space-y-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4 group">
            <div className="flex-shrink-0 relative">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${
                index === 0 ? 'bg-[#004d40]' : 'bg-[#004d40]/10 group-hover:bg-[#f2a921]/10'
              }`}>
                <step.icon className={`text-xl transition-colors duration-300 ${
                  index === 0 ? 'text-white' : 'text-[#004d40] group-hover:text-[#f2a921]'
                }`} />
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#f2a921] rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {step.id}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center transition-colors duration-300 ${
                  index === 0 ? 'bg-[#004d40] text-white' : 'bg-[#004d40]/10 text-[#004d40] group-hover:bg-[#f2a921] group-hover:text-white'
                }`}>
                  {step.id}
                </span>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#004d40] transition-colors duration-300">
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaBuilding className="w-5 h-5 text-[#004d40]" />
              <span className="text-[#555555] text-lg font-medium">
                Government Process
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#004d40]">
              Authority <span className="font-bold text-[#f2a921]">Workflow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              How municipal departments efficiently handle and resolve citizen reports
            </p>
          </div>

          <div>
            {/* Unique Workflow Process Cards with Connection Lines */}
            <div className="relative">
              {/* Curved Connection Lines */}
              <svg className="hidden lg:block absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="workflowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#004d40" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#f2a921" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#004d40" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Connection paths */}
                <path d="M80,180 C200,180 280,180 400,180" stroke="url(#workflowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <path d="M400,180 C520,180 600,180 720,180" stroke="url(#workflowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <path d="M720,180 C840,180 920,180 1040,180" stroke="url(#workflowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <path d="M1040,180 C1160,180 1240,180 1360,180" stroke="url(#workflowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
              </svg>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative">
                {authoritySteps.map((step, index) => (
                  <div key={step.id} className="relative group" style={{ zIndex: 2 }}>
                    {/* Step Card */}
                    <div className="h-full bg-gradient-to-b from-white to-gray-50 rounded-lg p-8 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border border-gray-100">
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">{step.id}</span>
                        </div>
                      </div>
                      
                      {/* Icon Container */}
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all ${
                        step.color === 'primary' 
                          ? 'bg-gradient-to-br from-[#004d40] to-[#00695c]' 
                          : 'bg-gradient-to-br from-[#f2a921] to-[#ffb74d]'
                      }`}>
                        <step.icon className="text-3xl text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="text-center">
                        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#004d40]/10 to-[#f2a921]/10 text-[#004d40] text-sm font-medium mb-4">
                          {step.status}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                        <p className="text-gray-600 mb-6">{step.description}</p>
                        
                        {/* Duration Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-full">
                          <FaClock className="text-[#f2a921] mr-2" />
                          <span className="font-semibold text-[#004d40]">{step.duration}</span>
                        </div>
                        
                        {/* Progress Indicator */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center">
                              {[...Array(step.progress)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-[#004d40] rounded-full mx-1"></div>
                              ))}
                              {[...Array(5 - step.progress)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-gray-300 rounded-full mx-1"></div>
                              ))}
                            </div>
                            <span className="ml-3 text-sm text-gray-500">{step.progress}/5 completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow Connector for Mobile */}
                    {index < authoritySteps.length - 1 && (
                      <div className="lg:hidden flex justify-center my-8">
                        <div className="w-16 h-16 text-[#f2a921] transform rotate-90">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Process Timeline Bar */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-xl">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#004d40] text-center mb-4">Workflow Progress Timeline</h3>
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#004d40] via-[#f2a921] to-[#004d40] opacity-20"></div>
                  <div className="absolute inset-0 flex">
                    {[0, 25, 50, 75, 100].map((percent, index) => (
                      <div key={index} className="relative" style={{ width: `${percent === 0 ? 25 : 25}%` }}>
                        <div className="absolute -top-2 left-0 transform -translate-x-1/2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index < 3 ? 'bg-gradient-to-br from-[#004d40] to-[#00695c]' : 'bg-gray-300'
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
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#004d40] rounded-lg flex items-center justify-center">
                      <MdSpeed className="text-white text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Average Processing Speed</h4>
                      <p className="text-2xl font-bold text-[#004d40]">2.3 days</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f2a921] rounded-lg flex items-center justify-center">
                      <FaClipboardCheck className="text-white text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Success Rate</h4>
                      <p className="text-2xl font-bold text-[#004d40]">94%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ Who Uses NagarNirman? */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaUsers className="w-5 h-5 text-[#004d40]" />
              <span className="text-[#555555] text-lg font-medium">
                Platform Users
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#004d40]">
              Who Uses <span className="font-bold text-[#f2a921]">NagarNirman</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              A collaborative platform connecting citizens, authorities, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userPersonas.map((persona) => (
              <div key={persona.id} className="group h-full bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all ${
                  persona.id === 1 ? 'bg-gradient-to-br from-[#004d40] to-[#00695c]' :
                  persona.id === 2 ? 'bg-gradient-to-br from-[#f2a921] to-[#ffb74d]' :
                  'bg-gradient-to-br from-[#004d40] to-[#f2a921]'
                }`}>
                  <persona.icon className="text-3xl text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">{persona.title}</h3>
                <p className="text-gray-600 text-center mb-6">{persona.description}</p>
                
                <ul className="space-y-3">
                  {persona.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 group/feature">
                      <div className="w-8 h-8 rounded-full bg-[#004d40]/10 flex items-center justify-center mr-3 group-hover/feature:bg-[#004d40] transition-colors">
                        <FaCheckCircle className="text-[#004d40] group-hover/feature:text-white transition-colors" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <div className="text-sm text-gray-500">Active Users</div>
                  <div className="text-2xl font-bold text-[#004d40]">
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
      <section className="py-20 bg-gradient-to-br from-[#004d40]/5 to-[#f2a921]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaFileAlt className="w-5 h-5 text-[#004d40]" />
              <span className="text-[#555555] text-lg font-medium">
                Report Categories
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#004d40]">
              Common <span className="font-bold text-[#f2a921]">Issues</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              Report any civic issue quickly through our platform
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {issues.map((issue) => (
              <div key={issue.id} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-500 hover:z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004d40]/10 to-[#f2a921]/10 flex items-center justify-center mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all">
                  <issue.icon className="text-2xl text-[#004d40] group-hover:text-[#f2a921] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#004d40] transition-colors">
                  {issue.title}
                </h3>
                <p className="text-gray-600 mb-4">{issue.description}</p>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <span className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-[#004d40]/10 to-[#f2a921]/10 text-[#004d40] rounded-full">
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
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaCheckCircle className="w-5 h-5 text-[#004d40]" />
              <span className="text-[#555555] text-lg font-medium">
                Platform Benefits
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#004d40]">
              Why Our <span className="font-bold text-[#f2a921]">Process</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              Key benefits that make NagarNirman the most effective civic reporting platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-300">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#004d40]/10 to-[#f2a921]/10 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                  <benefit.icon className="text-3xl text-[#004d40] group-hover:text-[#f2a921] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-4 group-hover:text-[#004d40] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center">{benefit.description}</p>
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-[#004d40] to-[#f2a921] rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#004d40] to-[#00695c] rounded-3xl p-12 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-4">
                  <CountUp end={95} suffix="%" />
                </div>
                <p className="text-green-100 text-lg">Reports verified within 24 hours</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-4">
                  <CountUp end={85} suffix="%" />
                </div>
                <p className="text-green-100 text-lg">Issues resolved within 1 week</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-4">
                  4.8<FaStar className="inline text-[#f2a921] ml-1" />
                </div>
                <p className="text-green-100 text-lg">User satisfaction rating</p>
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-green-400/30 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  <CountUp end={50000} suffix="+" />
                </div>
                <p className="text-green-100">Reports Filed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  <CountUp end={120} suffix="+" />
                </div>
                <p className="text-green-100">Cities Covered</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <p className="text-green-100">Platform Availability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaQuestionCircle className="w-5 h-5 text-[#004d40]" />
              <span className="text-[#555555] text-lg font-medium">
                Help & Support
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#004d40]">
              Frequently Asked <span className="font-bold text-[#f2a921]">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              Everything you need to know about using NagarNirman
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        openFaq === index 
                          ? 'bg-gradient-to-br from-[#004d40] to-[#00695c]' 
                          : 'bg-gradient-to-br from-gray-100 to-gray-50'
                      } transition-all`}>
                        <FaQuestionCircle className={
                          openFaq === index ? 'text-white' : 'text-[#004d40]'
                        } />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{faq.question}</h3>
                        <div className="text-sm text-[#004d40] font-medium flex items-center gap-2">
                          <span>Click to {openFaq === index ? 'collapse' : 'expand'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                      {openFaq === index ? (
                        <FaChevronUp className="text-[#004d40] text-xl" />
                      ) : (
                        <FaChevronDown className="text-gray-400 text-xl group-hover:text-[#004d40]" />
                      )}
                    </div>
                  </button>
                  
                  {openFaq === index && (
                    <div className="px-8 pb-8">
                      <div className="pl-18">
                        <p className="text-gray-600 text-lg mb-6">{faq.answer}</p>
                        {faq.note && (
                          <div className="bg-gradient-to-r from-[#f2a921]/10 to-[#f2a921]/5 border-l-4 border-[#f2a921] p-6 rounded-r-lg">
                            <div className="flex items-start gap-3">
                              <FaBullhorn className="text-[#f2a921] text-xl mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-800 mb-2">Important Note</p>
                                <p className="text-gray-700">{faq.note}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8️⃣ Call to Action Footer Section */}
      <section className="py-20 bg-gradient-to-br from-[#004d40] via-[#00695c] to-[#004d40]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white mb-8">
              <FaShieldAlt className="mr-2" />
              Trusted by 100,000+ citizens across India
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to transform your city?
            </h2>
            <p className="text-green-100 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our growing community of proactive citizens and municipal authorities 
              working together to build better, cleaner, and more efficient cities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button className="group bg-white text-[#004d40] px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                <span>Start Reporting Now</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="group bg-transparent border-3 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300">
                Schedule a Demo
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  <CountUp end={50000} suffix="+" />
                </div>
                <div className="text-green-100">Reports Filed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  <CountUp end={120} suffix="+" />
                </div>
                <div className="text-green-100">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  <CountUp end={98} suffix="%" />
                </div>
                <div className="text-green-100">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-green-100">Platform Availability</div>
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

// Data for FAQs
const faqs = [
  {
    question: 'How long does report verification take?',
    answer: 'Our verification process typically completes within 24 hours during working days. High-priority safety issues are fast-tracked and verified within 2-4 hours to ensure public safety.',
    note: 'Weekend verification may take up to 48 hours depending on municipal staffing.'
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Absolutely. We use enterprise-grade encryption and comply with all data protection regulations. Your contact details are only shared with authorized municipal personnel for resolution updates.',
    note: 'You can choose to report anonymously for non-critical issues.'
  },
  {
    question: 'How accurate is the auto-location feature?',
    answer: 'Our GPS-based location detection is accurate within 5-10 meters. You can manually adjust the pin on our interactive map if needed, and add landmarks for better identification.',
    note: 'Location accuracy depends on your device\'s GPS signal strength.'
  },
  {
    question: 'Can I track multiple reports simultaneously?',
    answer: 'Yes! Our dashboard provides a comprehensive view of all your reports with color-coded status indicators. You\'ll receive push notifications for every status change.',
    note: 'Enable browser notifications for the best tracking experience.'
  },
  {
    question: 'What happens after I submit a report?',
    answer: 'Your report enters our verification queue, gets assigned to the relevant department, triggers on-ground action, and you receive updates at each milestone until resolution.',
    note: 'You can rate the resolution quality once the issue is marked complete.'
  }
];