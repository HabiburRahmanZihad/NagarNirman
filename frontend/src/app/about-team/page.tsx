"use client";

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  BarChart3,
  Building2,
  CheckCircle,
  ClipboardList,
  Code,
  Code2,
  CpuIcon,
  Database,
  GitBranch,
  Github,
  Globe2,
  Heart,
  Key,
  Layers,
  Lightbulb,
  Linkedin,
  Lock,
  Mail, MapPin,
  MessageSquare,
  Palette,
  PieChart,
  Play,
  Rocket,
  Server,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import CountUp from 'react-countup';
import { Typewriter } from 'react-simple-typewriter';

// 3D Tilt Card Component
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { width, height } = rect;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fixed Floating Elements Background - No Math.random on server
const FloatingElements = () => {
  const elements = React.useMemo(() => {
    // Fixed values for consistent server/client rendering
    return [
      { id: 1, x: 10, y: 20, size: 2, delay: 0 },
      { id: 2, x: 30, y: 40, size: 3, delay: 1 },
      { id: 3, x: 50, y: 60, size: 1.5, delay: 2 },
      { id: 4, x: 70, y: 30, size: 2.5, delay: 0.5 },
      { id: 5, x: 20, y: 70, size: 2.2, delay: 1.5 },
      { id: 6, x: 80, y: 10, size: 1.8, delay: 3 },
      { id: 7, x: 40, y: 80, size: 3.2, delay: 2.5 },
      { id: 8, x: 90, y: 50, size: 2.8, delay: 1.2 },
      { id: 9, x: 60, y: 90, size: 1.2, delay: 0.8 },
      { id: 10, x: 15, y: 45, size: 2.7, delay: 3.5 },
    ];
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full bg-linear-to-r from-[#004d40]/20 to-[#f2a921]/20"
          style={{
            width: `${el.size}px`,
            height: `${el.size}px`,
            left: `${el.x}%`,
            top: `${el.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: el.delay,
          }}
        />
      ))}
    </div>
  );
};

// Missing icon component
const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AboutTeamPage = () => {
  // Team Members Data - Added 4th member
  const TEAM_MEMBERS = [
    {
      name: 'Ahmed Rahman',
      role: 'Lead Architect',
      subRole: 'DevOps & System Design',
      bio: 'Orchestrating the entire NagarNirman ecosystem with precision. Specializes in scalable architecture that handles thousands of concurrent civic reports across all 64 districts.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      color: 'from-[#004d40] to-[#00695c]',
      accentColor: '#004d40',
      skills: ['Cloud Architecture', 'API Design', 'System Scaling', 'DevOps'],
      contributions: ['System Infrastructure', 'API Development', 'Deployment Strategy'],
      social: { github: '#', linkedin: '#', twitter: '#' },
      funFact: 'Can troubleshoot server issues in his sleep',
      stats: { commits: 980, projects: 12, coffees: 2340 },
      quote: '"Code is poetry, architecture is the symphony."'
    },
    {
      name: 'Fatima Khan',
      role: 'Data Guardian',
      subRole: 'Backend & Security Lead',
      bio: 'Protects every byte of civic data with military-grade security. Designs robust MongoDB schemas that ensure data integrity while maintaining lightning-fast query performance.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
      color: 'from-[#f2a921] to-[#ffb74d]',
      accentColor: '#f2a921',
      skills: ['MongoDB', 'Data Security', 'Node.js', 'GDPR Compliance'],
      contributions: ['Database Design', 'Security Protocols', 'Data Analytics'],
      social: { github: '#', linkedin: '#', twitter: '#' },
      funFact: 'Perfectionist who notices 1px alignment issues',
      stats: { commits: 856, projects: 10, coffees: 1890 },
      quote: '"Security is not a feature, it\'s a mindset."'
    },
    {
      name: 'Rafi Hassan',
      role: 'Pixel Alchemist',
      subRole: 'UI/UX & Frontend Lead',
      bio: 'Transforms complex civic problems into beautiful, intuitive interfaces. Believes great design should be accessible to everyone, from tech experts to smartphone beginners.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      color: 'from-[#004d40] to-[#f2a921]',
      accentColor: '#00695c',
      skills: ['React/Next.js', 'UI/UX Design', 'Accessibility', 'Performance'],
      contributions: ['User Interface', 'Mobile Design', 'Frontend Architecture'],
      social: { github: '#', linkedin: '#', twitter: '#' },
      funFact: 'Has interviewed over 100 citizens about civic issues',
      stats: { commits: 1120, projects: 15, coffees: 3200 },
      quote: '"Design is not just what it looks like, it\'s how it works."'
    },
    {
      name: 'Sabrina Akter',
      role: 'AI Specialist',
      subRole: 'Machine Learning & NLP Engineer',
      bio: 'Builds intelligent systems that understand and categorize civic reports automatically. Specializes in natural language processing for Bengali text and image recognition for issue classification.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      color: 'from-[#9c27b0] to-[#673ab7]',
      accentColor: '#9c27b0',
      skills: ['Python', 'TensorFlow', 'NLP', 'Computer Vision'],
      contributions: ['AI Classification', 'Report Analysis', 'Predictive Models'],
      social: { github: '#', linkedin: '#', twitter: '#' },
      funFact: 'Can train ML models while binge-watching documentaries',
      stats: { commits: 720, projects: 8, coffees: 1560 },
      quote: '"AI should amplify human potential, not replace it."'
    },
  ];

  // Stats Data
  const PROJECT_STATS = [
    { value: 235000, suffix: '+', label: 'Reports Processed', icon: <FileText className="w-6 h-6" /> },
    { value: 78, suffix: '%', label: 'Resolution Rate', icon: <CheckCircle className="w-6 h-6" /> },
    { value: 64, suffix: '', label: 'Districts Covered', icon: <MapPin className="w-6 h-6" /> },
    { value: 99.9, suffix: '%', label: 'System Uptime', icon: <Server className="w-6 h-6" /> },
  ];

  // Tech Stack Data - Based on actual package.json
  const TECH_STACK = [
    {
      category: 'Frontend Framework',
      technologies: [
        { name: 'Next.js 16', icon: <Globe2 className="w-6 h-6" />, color: 'from-black to-gray-800' },
        { name: 'React 19', icon: <Code className="w-6 h-6" />, color: 'from-cyan-400 to-blue-600' },
        { name: 'TypeScript', icon: <Code className="w-6 h-6" />, color: 'from-blue-600 to-blue-800' },
        { name: 'Tailwind CSS 4', icon: <Palette className="w-6 h-6" />, color: 'from-cyan-500 to-teal-500' },
      ]
    },
    {
      category: 'UI & Animation',
      technologies: [
        { name: 'Framer Motion', icon: <Sparkles className="w-6 h-6" />, color: 'from-pink-500 to-purple-600' },
        { name: 'DaisyUI', icon: <Layers className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600' },
        { name: 'Lucide React', icon: <Lightbulb className="w-6 h-6" />, color: 'from-orange-400 to-red-500' },
        { name: 'Lottie React', icon: <Play className="w-6 h-6" />, color: 'from-green-400 to-emerald-600' },
      ]
    },
    {
      category: 'Backend & Database',
      technologies: [
        { name: 'Node.js', icon: <CpuIcon className="w-6 h-6" />, color: 'from-green-600 to-emerald-700' },
        { name: 'Express.js', icon: <Server className="w-6 h-6" />, color: 'from-gray-600 to-gray-800' },
        { name: 'MongoDB', icon: <Database className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
        { name: 'Nodemailer', icon: <Mail className="w-6 h-6" />, color: 'from-red-400 to-red-600' },
      ]
    },
    {
      category: 'Authentication & Security',
      technologies: [
        { name: 'JWT', icon: <Shield className="w-6 h-6" />, color: 'from-purple-500 to-purple-700' },
        { name: 'Bcrypt.js', icon: <Lock className="w-6 h-6" />, color: 'from-yellow-500 to-orange-600' },
        { name: 'Express Validator', icon: <CheckCircle className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
        { name: 'CORS', icon: <Key className="w-6 h-6" />, color: 'from-gray-500 to-gray-700' },
      ]
    },
    {
      category: 'Maps & Data Visualization',
      technologies: [
        { name: 'React Leaflet', icon: <MapPin className="w-6 h-6" />, color: 'from-green-500 to-teal-600' },
        { name: 'Recharts', icon: <BarChart3 className="w-6 h-6" />, color: 'from-blue-400 to-indigo-600' },
        { name: 'React Hook Form', icon: <ClipboardList className="w-6 h-6" />, color: 'from-pink-400 to-rose-600' },
        { name: 'Swiper', icon: <Layers className="w-6 h-6" />, color: 'from-blue-500 to-purple-600' },
      ]
    },
  ];

  const WORKFLOW_STEPS = [
    { step: '01', title: 'Report Submission', desc: 'Citizens report issues via mobile/web', icon: <MessageSquare className="w-6 h-6" /> },
    { step: '02', title: 'Smart Routing', desc: 'AI categorizes & routes to authorities', icon: <GitBranch className="w-6 h-6" /> },
    { step: '03', title: 'Task Assignment', desc: 'Automatic dispatch to departments', icon: <Target className="w-6 h-6" /> },
    { step: '04', title: 'Progress Tracking', desc: 'Real-time updates & notifications', icon: <TrendingUp className="w-6 h-6" /> },
    { step: '05', title: 'Resolution', desc: 'Issue marked complete with proof', icon: <CheckCircle className="w-6 h-6" /> },
    { step: '06', title: 'Analytics', desc: 'Data insights for urban planning', icon: <PieChart className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white text-gray-900 font-sans overflow-hidden">
      <FloatingElements />

      {/* Hero Section - BOSS LEVEL UI/UX */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Nature Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt="Mountain landscape"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Multi-layer Overlay for depth */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-linear-to-r from-[#004d40]/40 via-transparent to-[#f2a921]/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* Animated Particles/Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 sm:w-32 sm:h-32 border border-white/20 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-32 right-10 w-16 h-16 sm:w-24 sm:h-24 border border-[#f2a921]/30 rotate-45"
          animate={{ rotate: [45, 135, 45], y: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#f2a921] rounded-full"
          animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              {/* Glassmorphism Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 sm:mb-10 shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#f2a921]" />
                </motion.div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-[0.2em] uppercase">
                  Building Tomorrow&apos;s Cities Today
                </span>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </motion.div>

              {/* Main Headline with Staggered Animation */}
              <div className="mb-8 sm:mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tight">
                    <span className="block text-white drop-shadow-2xl">Meet The</span>
                    <span className="block mt-2 sm:mt-4">
                      <span className="relative inline-block">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#f2a921] via-[#ffb74d] to-[#f2a921] drop-shadow-lg">
                          Dreamers
                        </span>
                        <motion.span
                          className="absolute -bottom-2 left-0 right-0 h-1 sm:h-2 bg-linear-to-r from-[#f2a921] via-white to-[#f2a921] rounded-full"
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ delay: 1, duration: 0.8 }}
                        />
                      </span>
                    </span>
                  </h1>
                </motion.div>

                {/* Typewriter with Enhanced Styling */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="w-3 h-3 rounded-full bg-[#f2a921] animate-pulse" />
                    <span className="text-xl sm:text-2xl md:text-3xl font-light text-white/90">
                      <Typewriter
                        words={[
                          "Behind NagarNirman",
                          "Revolutionizing Civic Tech",
                          "Empowering 64 Districts",
                          "Building Smart Cities"
                        ]}
                        loop={true}
                        cursor
                        cursorStyle="_"
                        cursorColor="#f2a921"
                        typeSpeed={60}
                        deleteSpeed={40}
                        delaySpeed={2000}
                      />
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Description with Glassmorphism Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="max-w-3xl mx-auto mb-10 sm:mb-14"
              >
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed font-light px-4">
                  Four passionate students on a mission to transform how Bangladesh
                  tackles urban challenges. We&apos;re not just writing code — we&apos;re
                  <span className="text-[#f2a921] font-semibold"> rewriting the future</span> of civic engagement.
                </p>
              </motion.div>

              {/* CTA Buttons with Premium Styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
              >
                <motion.a
                  href="#team"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-linear-to-r from-[#f2a921] to-[#ffb74d] text-gray-900 rounded-2xl font-bold text-base sm:text-lg shadow-[0_20px_50px_-15px_rgba(242,169,33,0.5)] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    Explore The Team
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: 0, opacity: 0.2 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.a>

                <motion.a
                  href="#tech"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white rounded-2xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 shadow-xl"
                >
                  <span className="flex items-center gap-3">
                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-[#f2a921] transition-colors" />
                    View Tech Stack
                  </span>
                </motion.a>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto"
              >
                {[
                  { value: '4', label: 'Team Members', icon: '👨‍💻' },
                  { value: '64', label: 'Districts', icon: '🗺️' },
                  { value: '235K+', label: 'Reports', icon: '📊' },
                  { value: '99.9%', label: 'Uptime', icon: '⚡' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#f2a921]/30 transition-all duration-300">
                      <span className="text-2xl sm:text-3xl mb-2 block">{stat.icon}</span>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-white/60 font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - Enhanced */}
        <motion.div
          className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs sm:text-sm text-white/60 font-medium tracking-widest uppercase">Scroll to explore</span>
            <div className="w-7 h-12 sm:w-8 sm:h-14 border-2 border-white/30 rounded-full flex justify-center p-2">
              <motion.div
                className="w-1.5 h-3 bg-[#f2a921] rounded-full"
                animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-gray-50 to-transparent" />
      </section>

      {/* Team Section - Hexagon Grid */}
      <section id="team" className="py-12 sm:py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#004d40]/10 to-[#f2a921]/10 border border-[#004d40]/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#f2a921]" />
              <span className="text-sm font-semibold text-[#004d40] tracking-wider uppercase">Meet The Visionaries</span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="text-gray-900">The </span>
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#004d40] via-[#00897b] to-[#f2a921]">
                  Dream Team
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-[#004d40] via-[#f2a921] to-[#004d40] rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto px-4 font-light">
              Four passionate innovators building Bangladesh&apos;s most ambitious civic tech platform
            </p>
          </motion.div>

          {/* Team Grid - Stunning Card Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group"
              >
                <TiltCard className="relative h-full">
                  {/* Animated Glow Effect */}
                  <motion.div
                    className={`absolute -inset-0.5 bg-linear-to-r ${member.color} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700`}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />

                  <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 h-full border border-gray-100">
                    {/* Top Colored Bar */}
                    <div className={`h-2 bg-linear-to-r ${member.color}`} />

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 md:p-8">
                      {/* Header: Image + Info */}
                      <div className="flex gap-4 sm:gap-5 md:gap-6 mb-6">
                        {/* Profile Image Container */}
                        <div className="relative shrink-0">
                          {/* Rotating Border */}
                          <motion.div
                            className={`absolute -inset-1 bg-linear-to-r ${member.color} rounded-2xl opacity-80`}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            style={{ borderRadius: '1rem' }}
                          />
                          {/* Image */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden ring-4 ring-white">
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              unoptimized
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          {/* Status Badge */}
                          <motion.div
                            className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </motion.div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 mb-1 leading-tight">
                                {member.name}
                              </h3>
                              <p className={`text-sm sm:text-base font-bold bg-linear-to-r ${member.color} bg-clip-text text-transparent`}>
                                {member.role}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{member.subRole}</p>
                            </div>
                            {/* Rank Badge */}
                            <motion.div
                              className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br ${member.color} rounded-xl flex items-center justify-center shadow-lg`}
                              whileHover={{ rotate: 12, scale: 1.1 }}
                            >
                              <span className="text-white font-black text-sm sm:text-base">#{index + 1}</span>
                            </motion.div>
                          </div>

                          {/* Mini Stats */}
                          <div className="flex gap-4 mt-3">
                            <div className="text-center">
                              <div className="text-lg sm:text-xl font-black text-gray-900">{member.stats.commits}</div>
                              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Commits</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg sm:text-xl font-black ${index === 0 ? 'text-[#004d40]' : index === 1 ? 'text-[#f2a921]' : index === 2 ? 'text-[#00695c]' : 'text-[#9c27b0]'}`}>{member.stats.projects}</div>
                              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Projects</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg sm:text-xl font-black text-[#f2a921]">{member.stats.coffees}</div>
                              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">☕ Coffees</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quote */}
                      <motion.div
                        className="mb-5 p-3 sm:p-4 rounded-xl bg-gray-50 border-l-4 group-hover:bg-linear-to-r group-hover:from-gray-50 group-hover:to-white transition-all duration-300"
                        style={{ borderLeftColor: member.accentColor }}
                      >
                        <p className="text-sm sm:text-base text-gray-600 italic font-medium">{member.quote}</p>
                      </motion.div>

                      {/* Bio */}
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 line-clamp-3">
                        {member.bio}
                      </p>

                      {/* Skills */}
                      <div className="mb-5">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {member.skills.map((skill, i) => (
                            <motion.span
                              key={i}
                              className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-gray-100 text-gray-700 group-hover:bg-linear-to-r group-hover:from-gray-100 group-hover:to-gray-50 transition-all duration-300"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: member.accentColor,
                                color: 'white'
                              }}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Fun Fact Card */}
                      <motion.div
                        className={`p-3 sm:p-4 rounded-xl bg-linear-to-r from-gray-50 to-white border border-gray-100 mb-5`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-linear-to-br ${member.color} flex items-center justify-center`}>
                            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">Fun Fact</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 pl-8 sm:pl-9">{member.funFact}</p>
                      </motion.div>

                      {/* Footer: Social Links */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex gap-2">
                          {Object.entries(member.social).map(([platform, url], i) => (
                            <motion.a
                              key={i}
                              href={url}
                              className={`p-2 sm:p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-white transition-all duration-300`}
                              whileHover={{
                                y: -3,
                                backgroundColor: member.accentColor,
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {platform === 'github' && <Github className="w-4 h-4 sm:w-5 sm:h-5" />}
                              {platform === 'linkedin' && <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />}
                              {platform === 'twitter' && <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </motion.a>
                          ))}
                        </div>

                        <motion.div
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r ${member.color} text-white text-xs sm:text-sm font-bold shadow-lg`}
                          whileHover={{ scale: 1.05 }}
                        >
                          Core Team
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-12 sm:py-16 md:py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-gray-800">Our </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#004d40] to-[#f2a921]">
                Tech Arsenal
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              The cutting-edge technologies powering NagarNirman&apos;s civic reporting platform
            </p>
          </motion.div>

          <div className="space-y-12">
            {TECH_STACK.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#004d40] to-[#f2a921] rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{category.category}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Modern, scalable, and battle-tested technologies</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {category.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <div className={`absolute inset-0 bg-linear-to-br ${tech.color} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500`} />

                      <div className="relative bg-linear-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-100 group-hover:border-transparent transition-all duration-300 h-full flex flex-col items-center justify-center text-center shadow-sm group-hover:shadow-xl">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-linear-to-br ${tech.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 shadow-lg`}>
                          <div className="text-white">
                            {tech.icon}
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{tech.name}</h4>

                        {/* Usage Description */}
                        <div className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {category.category === 'Frontend' && 'Responsive UI Components'}
                          {category.category === 'Backend & Database' && 'Data Storage & APIs'}
                          {category.category === 'Authentication & Security' && 'Secure User Auth'}
                          {category.category === 'Services & APIs' && 'External Service Integration'}
                          {category.category === 'State & Deployment' && 'State Management & Hosting'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Architecture Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-12 md:mt-16 text-center"
          >
            <div className="bg-linear-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-[#004d40]/10">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#004d40] mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Modern Architecture</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our tech stack follows a modern, scalable architecture with clear separation of concerns, <br></br>
                ensuring maintainability, performance, and the ability to handle thousands of concurrent civic reports.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats - Circular Progress */}
      <section id="impact" className="py-12 sm:py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-linear-to-br from-[#004d40]/5 via-transparent to-[#f2a921]/5" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-gray-900">Numbers That </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#004d40] to-[#f2a921]">
                Matter
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Quantifying our impact on urban governance across Bangladesh
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {PROJECT_STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-100 text-center">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="#004d40"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 0.7 + (index * 0.1) }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-[#004d40]">
                        {stat.icon}
                      </div>
                    </div>
                  </div>

                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      decimals={stat.value === 99.9 ? 1 : 0}
                    />
                    {stat.suffix}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow - Simplified Hover Effects */}
      <section className="py-12 sm:py-16 md:py-24 bg-linear-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-gray-900">Our </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#004d40] to-[#f2a921]">
                Magic Process
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              From report to resolution—how we transform civic complaints into action
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-[#004d40] via-[#f2a921] to-[#004d40] -translate-x-1/2" />

            <div className="space-y-6 sm:space-y-8 md:space-y-12">
              {WORKFLOW_STEPS.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Step Number */}
                  <div className={`absolute lg:static left-4 lg:left-auto top-0 lg:top-auto ${index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'} z-10`}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-linear-to-br from-[#004d40] to-[#f2a921] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                  </div>

                  {/* Content Card with Simplified Hover */}
                  <div className={`w-full lg:w-5/12 ml-16 sm:ml-20 lg:ml-0 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <motion.div
                      whileHover={{
                        scale: 1.02,
                        y: -3,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          duration: 0.3
                        }
                      }}
                      className="group relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300"
                    >
                      {/* Simple Hover Background */}
                      <div className="absolute inset-0 bg-linear-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#004d40]/10 to-[#f2a921]/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:from-[#004d40]/20 group-hover:to-[#f2a921]/20 transition-all duration-300">
                            <div className="text-[#004d40] group-hover:text-[#f2a921] transition-colors duration-300">
                              {step.icon}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#004d40] transition-colors duration-300">
                            {step.title}
                          </h3>
                        </div>

                        <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          {step.desc}
                        </p>

                        {/* Simple Arrow Indicator */}
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-linear-to-br from-[#004d40] to-[#f2a921] rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 top-8 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-4 border-[#f2a921] items-center justify-center z-10 shadow-xl">
                    <div className="w-3 h-3 bg-[#004d40] rounded-full" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Interactive */}
      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#004d40] via-[#00695c] to-[#004d40]" />

        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(242, 169, 33, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block p-1 rounded-xl sm:rounded-2xl bg-linear-to-r from-[#f2a921] to-[#ffb74d] mb-6 sm:mb-8"
            >
              <div className="bg-white rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 py-2 sm:py-3">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#004d40] to-[#f2a921] font-bold text-sm sm:text-base md:text-lg tracking-wider flex items-center gap-2 sm:gap-3">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-[#f2a921]" />
                  JOIN THE REVOLUTION
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 sm:mb-8"
            >
              Help Us Build The
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#f2a921] to-white">
                Future of Cities
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4"
            >
              We&apos;re looking for passionate students, developers, and civic enthusiasts
              to join our mission. Together, we can build smarter, cleaner, and more
              transparent cities across Bangladesh.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.a
                href="mailto:e241024@ugrad.iiuc.ac.bd"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-linear-to-r from-[#f2a921] to-[#ffb74d] text-[#004d40] rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  Apply to Join Our Team
                </span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              <motion.a
                href="/about"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 border-2 border-white/30 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="flex items-center gap-2 sm:gap-3">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                  Support Our Mission
                </span>
              </motion.a>
            </motion.div>

            <motion.div
              className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-white/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-white/60 text-xs sm:text-sm font-mono px-2">
                <span className="hidden sm:inline">Open Roles: Frontend Intern • Backend Developer • UI/UX Designer • Community Manager • AI Engineer</span>
                <span className="sm:hidden">Open Roles: Frontend • Backend • UI/UX • AI</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutTeamPage;