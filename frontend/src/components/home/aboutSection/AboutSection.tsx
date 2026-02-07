"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/common/Button";
import { FaPlay, FaChartLine, FaLightbulb, FaThumbsUp, FaUsers, FaTrophy } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";
import CountUp from "react-countup";
import Link from "next/link";

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<"history" | "mission" | "vision">("history");
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [startYearsCount, setStartYearsCount] = useState(false);
  const [startStatsCount, setStartStatsCount] = useState(false);
  const yearsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const yearsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartYearsCount(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartStatsCount(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (yearsRef.current) {
      yearsObserver.observe(yearsRef.current);
    }

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      if (yearsRef.current) {
        yearsObserver.unobserve(yearsRef.current);
      }
      if (statsRef.current) {
        statsObserver.unobserve(statsRef.current);
      }
    };
  }, []);

  const tabs: { id: "history" | "mission" | "vision"; label: string }[] = [
    { id: "history", label: "Our History" },
    { id: "mission", label: "Our Mission" },
    { id: "vision", label: "Our Vision" },
  ];

  const youtubeVideoId = "pt03-JtGeY8?si=CnCJXTBzW8c7uYxJ"; // Replace with your actual YouTube video ID

  const tabContent = {
    history:
      "NagarNirman was founded with a vision to bridge the gap between citizens and civic authorities. We started as a community initiative to address local urban challenges and have grown into a comprehensive platform for sustainable city development.",
    mission:
      "Our mission is to empower citizens to actively participate in urban development by reporting civic issues, connecting with problem solvers, and creating cleaner, safer, and more sustainable communities for everyone.",
    vision:
      "We envision cities where every citizen is an active participant in urban development, where civic issues are resolved efficiently, and where technology bridges the gap between problems and solutions for a sustainable future.",
  };

  const stats = [
    { icon: <FaChartLine className="w-8 h-8" />, value: "98%", label: "Success Rate" },
    { icon: <FaLightbulb className="w-8 h-8" />, value: "565+", label: "Issues Resolved" },
    { icon: <FaThumbsUp className="w-8 h-8" />, value: "36k", label: "Active Citizens" },
    { icon: <FaUsers className="w-8 h-8" />, value: "100+", label: "Problem Solvers" },
  ];

  return (
    <section className="w-full bg-base-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT IMAGES */}
        <div className="relative w-full h-[600px]">
          {/* Main Image with decorative elements */}
          <div className="relative w-full h-full">
            {/* Background decorative dots */}
            <div className="absolute bottom-0 left-0 w-32 h-48 grid grid-cols-4 gap-2 opacity-40 z-0">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-gray-400 rounded-full"></div>
              ))}
            </div>

            {/* Main large image - Left side */}
            <div className="absolute top-0 left-0 w-[58%] h-[70%] rounded-3xl overflow-hidden shadow-2xl z-10">
              <Image
                src="https://res.cloudinary.com/dc3ul4egd/image/upload/v1765708812/Gemini_Generated_Image_dyktqldyktqldykt_lnz63m.png"
                alt="Team working together"
                fill
                className="object-cover"
              />
            </div>

            {/* Years badge - Top Right overlapping main image */}
            <div ref={yearsRef} className="absolute top-16 left-[45%] bg-accent px-8 py-6 rounded-2xl shadow-xl z-20">
              <p className="text-6xl font-bold text-[#003B31] leading-none mb-1 stroke-2 stroke-[#003B31]" style={{ WebkitTextStroke: '2px #003B31', color: 'transparent' }}>
                {startYearsCount && <CountUp end={29} duration={5} />}
                {!startYearsCount && "0"}+
              </p>
              <p className="text-sm font-semibold text-[#003B31] whitespace-nowrap">Years of<br />experience</p>
            </div>

            {/* Organic shaped video thumbnail - Bottom Right */}
            <div className="absolute bottom-0 right-0 w-[62%] h-[58%] z-10">
              {/* Custom organic shape container */}
              <div className="relative w-full h-full">
                {/* SVG clip path for organic shape */}
                <svg className="absolute inset-0 w-0 h-0">
                  <defs>
                    <clipPath id="organic-shape" clipPathUnits="objectBoundingBox">
                      <path d="M 0.1,0 C 0.4,0 0.8,0 1,0.15 C 1,0.4 1,0.7 0.9,0.85 C 0.7,1 0.3,1 0.1,0.9 C 0,0.7 0,0.3 0.1,0 Z" />
                    </clipPath>
                  </defs>
                </svg>

                <div className="relative w-full h-full shadow-2xl" style={{ clipPath: 'url(#organic-shape)' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1588854621349-d2f1d0ba3ece?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Community volunteer"
                    fill
                    className="object-cover"
                  />

                  {/* Decorative orange leaf/plant overlay - bottom left of video */}
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 z-30 pointer-events-none">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-accent/30 rounded-full blur-2xl"></div>
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50,10 Q70,30 80,50 Q70,70 50,90 Q30,70 20,50 Q30,30 50,10" fill="#f2a921" opacity="0.8" />
                        <ellipse cx="45" cy="40" rx="8" ry="15" fill="#f2a921" opacity="0.6" transform="rotate(-30 45 40)" />
                        <ellipse cx="55" cy="60" rx="8" ry="15" fill="#f2a921" opacity="0.6" transform="rotate(30 55 60)" />
                      </svg>
                    </div>
                  </div>

                  {/* Play button overlay with enhanced glass effect */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/30 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoOpen(true)}
                      className="relative w-28 h-28 bg-[#8B7355]/40 backdrop-blur-xl rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-2xl border border-white/50 group"
                    >
                      {/* Enhanced glowing effect */}
                      <div className="absolute inset-0 rounded-full bg-[#C4A57B]/40 blur-2xl group-hover:bg-[#C4A57B]/60 transition-all duration-300 animate-pulse"></div>
                      <div className="absolute inset-0 rounded-full bg-li-to-br from-white/50 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 rounded-full bg-li-to-tr from-transparent via-white/30 to-transparent"></div>
                      <FaPlay className="w-10 h-10 text-white ml-1 relative z-10 drop-shadow-2xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Award Badge - Bottom Left */}
            <div className="absolute bottom-8 left-0 bg-[#003B31] text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-xl z-20 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-accent text-5xl">
                <FaTrophy />
              </div>
              <div>
                <p className="text-xs font-medium">2026 - We are the</p>
                <p className="text-sm font-bold">best award winner</p>
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Video Modal */}
        {isVideoOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsVideoOpen(false)}
          >
            <div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300"
              >
                ×
              </button>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}

        {/* RIGHT CONTENT */}
        {/* RIGHT CONTENT */}
        <div className="w-full">
          <p className="text-primary font-semibold mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 text-base sm:text-lg">
            <BsFillInfoCircleFill className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>About Us</span>
          </p>

          <h2 className="text-[#003B31] text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 sm:mb-8">
            Building Greener Future<br />Together And Protect
          </h2>

          {/* Tabs - Responsive */}
          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 overflow-x-auto pb-2 sm:pb-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`pb-1 sm:pb-2 font-semibold text-sm sm:text-base transition-colors duration-200 whitespace-nowrap ${activeTab === t.id
                  ? "text-[#003B31] border-b-2 sm:border-b-2 border-accent"
                  : "text-gray-500 hover:text-[#003B31]"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
            {tabContent[activeTab]}
          </p>

          <ul className="space-y-2 sm:space-y-3 text-gray-600 mb-6 sm:mb-8">
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">•</span>
              <span className="text-sm sm:text-base">Citizen-driven platform for reporting and resolving civic issues</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">•</span>
              <span className="text-sm sm:text-base">Connect with verified problem solvers in your community</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">•</span>
              <span className="text-sm sm:text-base">Real-time tracking and transparent progress updates</span>
            </li>
          </ul>

          <div className="mt-6 sm:mt-8 flex flex-row  items-start xs:items-center justify-around gap-6 xs:gap-8">

            <Link href="/about" className="w- xs:w-auto">
              <Button
                variant="primary"
                size="md"
                className="w-full xs:w-auto text-sm sm:text-base"
              >
                Explore More
              </Button>
            </Link>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative w-16 h-4 sm:w-20 sm:h-5 md:w-24 md:h-6">
                  <Image
                    src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg"
                    alt="Trustpilot"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                  />
                </div>

                <div className="text-xs sm:text-sm">
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-primary text-sm sm:text-base">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs">Excellent 4.9 out of 5</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="container mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const numericValue = parseInt(stat.value.replace(/[^\d]/g, ''));
          const suffix = stat.value.replace(/[\d]/g, '');

          return (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-4 text-primary group-hover:bg-accent group-hover:text-white transition-all duration-300">
                {stat.icon}
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#003B31] mb-2">
                {startStatsCount && <CountUp end={numericValue} duration={5} separator="," />}
                {!startStatsCount && "0"}
                {suffix}
              </h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
