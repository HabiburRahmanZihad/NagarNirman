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
  FaChevronDown, FaChevronUp, FaStar, FaCity, FaHardHat
} from 'react-icons/fa';
import { 
  MdOutlineDescription, MdAssignment, MdUpdate, MdVerified,
  MdLocationOn, MdSpeed, MdSecurity, MdGroups, MdTrendingUp
} from 'react-icons/md';
import { GiProgression } from 'react-icons/gi';

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
          const increment = end / (duration / 16); // 60fps
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
        {/* Background decorative elements */}
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

      {/* 2️⃣ Step-by-Step Reporting Journey */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your <span className="text-[#004d40]">Reporting</span> Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to report civic issues and track their resolution in real-time
            </p>
          </div>

          <div className="relative">
            {/* Desktop timeline */}
            <div className="hidden lg:block">
              <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#004d40]/20 via-[#f2a921]/20 to-[#004d40]/20"></div>
              
              <div className="grid grid-cols-6 gap-8 relative">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative group">
                    {/* Connecting line dots */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-[#004d40] rounded-full group-hover:scale-150 group-hover:border-[#f2a921] transition-all z-20"></div>
                    
                    <div className="text-center pt-12">
                      <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 ${
                        index === 0 ? 'bg-gradient-to-br from-[#004d40] to-[#00695c]' : 'bg-white border-4 border-gray-100'
                      } shadow-xl group-hover:shadow-2xl`}>
                        <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                          index === 0 ? 'bg-white/20' : 'bg-gradient-to-br from-gray-50 to-white'
                        }`}>
                          <step.icon className={`text-3xl ${
                            index === 0 ? 'text-white' : 'text-[#004d40] group-hover:text-[#f2a921]'
                          } transition-colors`} />
                        </div>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#f2a921] to-[#ffb74d] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {step.id}
                        </div>
                      </div>
                      
                      <div className="px-2">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#004d40] transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile timeline */}
            <div className="lg:hidden space-y-8">
              {steps.map((step) => (
                <div key={step.id} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                          <step.icon className="text-2xl text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#f2a921] to-[#ffb74d] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {step.id}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ Authority Workflow */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-[#004d40]">Authority</span> Workflow Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How municipal departments efficiently handle and resolve citizen reports
            </p>
          </div>

          <div className="">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {authoritySteps.map((step, index) => (
                <div key={step.id} className="relative group">
                  {/* Connector lines for desktop */}
                  {index < authoritySteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-8 w-8 h-0.5 bg-gradient-to-r from-[#004d40]/30 to-[#f2a921]/30 group-hover:from-[#004d40] group-hover:to-[#f2a921] transition-all"></div>
                  )}
                  
                  <div className="h-full bg-gradient-to-b from-white to-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all ${
                      step.color === 'primary' ? 'bg-gradient-to-br from-[#004d40] to-[#00695c]' :
                      'bg-gradient-to-br from-[#f2a921] to-[#ffb74d]'
                    }`}>
                      <step.icon className="text-2xl text-white" />
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#004d40]/10 to-[#f2a921]/10 text-[#004d40] text-sm font-medium mb-4">
                        {step.status}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500 font-medium">Avg. Duration</div>
                        <div className="text-lg font-bold text-[#004d40]">{step.duration}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ Who Uses NagarNirman? */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Who Uses <span className="text-[#004d40]">Nagar</span>
              <span className="text-[#f2a921]">Nirman</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collaborative platform connecting citizens, authorities, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userPersonas.map((persona) => (
              <div key={persona.id} className="group h-full bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all ${
                  persona.id === 1 ? 'bg-gradient-to-br from-[#004d40] to-[#00695c]' :
                  persona.id === 2 ? 'bg-gradient-to-br from-[#f2a921] to-[#ffb74d]' :
                  'bg-gradient-to-br from-purple-500 to-purple-600'
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common <span className="text-[#004d40]">Issues</span> You Can Report
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Our <span className="text-[#004d40]">Process</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-[#004d40]">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
    icon: FaMapMarkerAlt
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
    icon: MdLocationOn
  },
  {
    id: 4,
    title: 'Add Details',
    description: 'Describe the issue briefly',
    icon: MdOutlineDescription
  },
  {
    id: 5,
    title: 'Submit Report',
    description: 'Send to authorities instantly',
    icon: FaCheckCircle
  },
  {
    id: 6,
    title: 'Track Live Status',
    description: 'Real-time updates until resolution',
    icon: GiProgression
  }
];

// Data for authority workflow
const authoritySteps = [
  {
    id: 1,
    title: 'Verification',
    status: 'Quality Check',
    duration: '1-24 hours',
    description: 'Municipal officer reviews report validity and priority',
    icon: FaUserCheck,
    color: 'primary'
  },
  {
    id: 2,
    title: 'Department Assignment',
    status: 'Routing',
    duration: '2-4 hours',
    description: 'Report routed to appropriate civic department',
    icon: FaBuilding,
    color: 'accent'
  },
  {
    id: 3,
    title: 'Field Assessment',
    status: 'On-ground',
    duration: '6-12 hours',
    description: 'Site inspection and solution planning',
    icon: FaHardHat,
    color: 'primary'
  },
  {
    id: 4,
    title: 'Action & Updates',
    status: 'Implementation',
    duration: '1-3 days',
    description: 'Work execution with regular progress updates',
    icon: FaSyncAlt,
    color: 'accent'
  },
  {
    id: 5,
    title: 'Resolution',
    status: 'Completion',
    duration: 'Final',
    description: 'Issue marked resolved after verification',
    icon: FaComments,
    color: 'primary'
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