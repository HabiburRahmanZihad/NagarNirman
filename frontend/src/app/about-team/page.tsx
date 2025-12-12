"use client";

import React from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import {
  Github, Linkedin, Mail, MapPin,
  Terminal, Cpu, Globe, GitBranch,
  ShieldCheck, Database, Zap, Users,
  Code2, Server, TrendingUp, CheckCircle,
  Award, Target, Clock, Star, Eye,
  Sparkles, Rocket, Lightbulb, Heart,
  Building2, Shield, Leaf, Globe2,
  MessageSquare, PieChart, BarChart3,
  Smartphone, Cloud, Lock, Wifi,
  Layers, Key, Upload, Bell,
  Code, Palette, CpuIcon, BarChart
} from 'lucide-react';
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
    const width = rect.width;
    const height = rect.height;
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
    const fixedValues = [
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
    return fixedValues;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full bg-gradient-to-r from-[#004d40]/20 to-[#f2a921]/20"
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
      avatar: '👨‍💻',
      color: 'from-[#004d40] to-[#00695c]',
      skills: ['Cloud Architecture', 'API Design', 'System Scaling', 'DevOps'],
      contributions: ['System Infrastructure', 'API Development', 'Deployment Strategy'],
      social: { github: '#', linkedin: '#', email: '#' },
      funFact: 'Can troubleshoot server issues in his sleep',
      stats: { commits: 980, projects: 12 }
    },
    {
      name: 'Fatima Khan',
      role: 'Data Guardian',
      subRole: 'Backend & Security Lead',
      bio: 'Protects every byte of civic data with military-grade security. Designs robust MongoDB schemas that ensure data integrity while maintaining lightning-fast query performance.',
      avatar: '🛡️',
      color: 'from-[#f2a921] to-[#ffb74d]',
      skills: ['MongoDB', 'Data Security', 'Node.js', 'GDPR Compliance'],
      contributions: ['Database Design', 'Security Protocols', 'Data Analytics'],
      social: { github: '#', linkedin: '#', email: '#' },
      funFact: 'Perfectionist who notices 1px alignment issues',
      stats: { commits: 980, projects: 12 }
    },
    {
      name: 'Rafi Hassan',
      role: 'Pixel Alchemist',
      subRole: 'UI/UX & Frontend Lead',
      bio: 'Transforms complex civic problems into beautiful, intuitive interfaces. Believes great design should be accessible to everyone, from tech experts to smartphone beginners.',
      avatar: '🎨',
      color: 'from-[#004d40] to-[#f2a921]',
      skills: ['React/Next.js', 'UI/UX Design', 'Accessibility', 'Performance'],
      contributions: ['User Interface', 'Mobile Design', 'Frontend Architecture'],
      social: { github: '#', linkedin: '#', email: '#' },
      funFact: 'Has interviewed over 100 citizens about civic issues',
      stats: { commits: 980, projects: 12 }
    },
    {
      name: 'Sabrina Akter',
      role: 'AI Specialist',
      subRole: 'Machine Learning & NLP Engineer',
      bio: 'Builds intelligent systems that understand and categorize civic reports automatically. Specializes in natural language processing for Bengali text and image recognition for issue classification.',
      avatar: '🤖',
      color: 'from-[#9c27b0] to-[#673ab7]',
      skills: ['Python', 'TensorFlow', 'NLP', 'Computer Vision'],
      contributions: ['AI Classification', 'Report Analysis', 'Predictive Models'],
      social: { github: '#', linkedin: '#', email: '#' },
      funFact: 'Can train ML models while binge-watching documentaries',
      stats: { commits: 720, projects: 8 }
    },
  ];

  // Stats Data
  const PROJECT_STATS = [
    { value: 235000, suffix: '+', label: 'Reports Processed', icon: <FileText className="w-6 h-6" /> },
    { value: 78, suffix: '%', label: 'Resolution Rate', icon: <CheckCircle className="w-6 h-6" /> },
    { value: 64, suffix: '', label: 'Districts Covered', icon: <MapPin className="w-6 h-6" /> },
    { value: 99.9, suffix: '%', label: 'System Uptime', icon: <Server className="w-6 h-6" /> },
  ];

  // Tech Stack Data
  const TECH_STACK = [
    { 
      category: 'Frontend',
      technologies: [
        { name: 'Next.js', icon: <Globe2 className="w-6 h-6" />, color: 'from-black to-gray-800' },
        { name: 'TypeScript', icon: <Code className="w-6 h-6" />, color: 'from-blue-600 to-blue-800' },
        { name: 'Tailwind CSS', icon: <Palette className="w-6 h-6" />, color: 'from-cyan-500 to-teal-500' },
        { name: 'ShadCN/UI', icon: <Layers className="w-6 h-6" />, color: 'from-gray-700 to-gray-900' },
      ]
    },
    { 
      category: 'Backend & Database',
      technologies: [
        { name: 'Node.js', icon: <CpuIcon className="w-6 h-6" />, color: 'from-green-600 to-emerald-700' },
        { name: 'Express.js', icon: <Server className="w-6 h-6" />, color: 'from-gray-600 to-gray-800' },
        { name: 'MongoDB', icon: <Database className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
        { name: 'Mongoose', icon: <Database className="w-6 h-6" />, color: 'from-red-500 to-red-700' },
      ]
    },
    { 
      category: 'Authentication & Security',
      technologies: [
        { name: 'NextAuth.js', icon: <Key className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
        { name: 'JWT', icon: <Shield className="w-6 h-6" />, color: 'from-purple-500 to-purple-700' },
        { name: 'Firebase Auth', icon: <Lock className="w-6 h-6" />, color: 'from-yellow-500 to-orange-600' },
      ]
    },
    { 
      category: 'Services & APIs',
      technologies: [
        { name: 'Mapbox/Leaflet', icon: <MapPin className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
        { name: 'Cloudinary', icon: <Cloud className="w-6 h-6" />, color: 'from-yellow-400 to-orange-500' },
        { name: 'Multer', icon: <Upload className="w-6 h-6" />, color: 'from-gray-500 to-gray-700' },
        { name: 'Nodemailer', icon: <Mail className="w-6 h-6" />, color: 'from-red-400 to-red-600' },
      ]
    },
    { 
      category: 'State & Deployment',
      technologies: [
        { name: 'Context API', icon: <BarChart3 className="w-6 h-6" />, color: 'from-purple-400 to-purple-600' },
        { name: 'Redux Toolkit', icon: <GitBranch className="w-6 h-6" />, color: 'from-violet-500 to-violet-700' },
        { name: 'Vercel', icon: <Globe className="w-6 h-6" />, color: 'from-black to-gray-800' },
        { name: 'Render/Heroku', icon: <Server className="w-6 h-6" />, color: 'from-pink-500 to-rose-600' },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 font-sans overflow-hidden">
      <FloatingElements />

      {/* Hero Section with Fixed Typewriter */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#004d40] to-transparent opacity-10" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#f2a921] to-transparent opacity-10" />
          
          {/* Animated Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#004d40]/20 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-transparent to-[#f2a921]/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-[#004d40]/20 mb-8 shadow-lg"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-5 h-5 text-[#f2a921]" />
                <span className="text-sm font-semibold text-[#004d40] tracking-wider">
                  BUILDING THE FUTURE OF URBAN GOVERNANCE
                </span>
              </motion.div>
              
              {/* Main Title with Fixed Typewriter */}
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
                  <span className="block text-gray-800 mb-6">Meet The Team</span>
                  <div className="relative">
                    <div className="relative inline-block">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004d40] via-[#00695c] to-[#f2a921]">
                        <Typewriter
                          words={[
                            "Behind NagarNirman",
                            "Building Better Cities",
                            "Pioneering Civic Tech",
                            "Empowering Citizens"
                          ]}
                          loop={true}
                          cursor
                          cursorStyle="|"
                          cursorColor="#f2a921"
                          typeSpeed={70}
                          deleteSpeed={50}
                          delaySpeed={1500}
                        />
                      </span>
                    </div>
                    {/* Animated Bar - Now placed correctly under typewriter text */}
                    <motion.div
                      className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-[#004d40] via-[#f2a921] to-[#004d40] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '256px' }}
                      transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </h1>
              </div>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                Four passionate students revolutionizing how Bangladesh addresses urban challenges. 
                We combine cutting-edge technology with deep civic engagement to build 
                <span className="font-semibold text-[#004d40]"> smarter, more responsive cities.</span>
              </p>
              
              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.a
                  href="#team"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#004d40] to-[#00695c] text-white rounded-full font-semibold shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    Meet Our Team
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#f2a921] to-[#ffb74d]"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
                
                <motion.a
                  href="#tech"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 border-2 border-[#004d40] text-[#004d40] rounded-full font-semibold hover:bg-[#004d40] hover:text-white transition-all duration-300 shadow-lg"
                >
                  <span className="flex items-center gap-3">
                    <Code2 className="w-5 h-5" />
                    Our Tech Stack
                  </span>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Scroll</span>
            <div className="w-6 h-10 border-2 border-[#004d40]/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-gradient-to-b from-[#004d40] to-[#f2a921] rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Team Section - Hexagon Grid */}
      <section id="team" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">The </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004d40] to-[#f2a921]">
                Dream Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the passionate students behind Bangladesh&apos;s most innovative civic tech platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <TiltCard key={index} className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#004d40] via-[#f2a921] to-[#004d40] rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition duration-500" />
                
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 group-hover:shadow-3xl transition-all duration-300 h-full overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#004d40]/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                  
                  {/* Member Header */}
                  <div className="relative z-10 flex items-start gap-6 mb-8">
                    <div className="relative">
                      <div className={`w-24 h-24 bg-gradient-to-br ${member.color} rounded-2xl p-1.5 shadow-2xl`}>
                        <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-5xl">
                          {member.avatar}
                        </div>
                      </div>
                      <motion.div
                        className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#f2a921] to-[#ffb74d] rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-sm font-bold text-white">#{index + 1}</span>
                      </motion.div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-sm font-semibold text-[#004d40] mb-2">{member.role}</p>
                      <p className="text-xs text-gray-500 font-medium">{member.subRole}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="relative z-10 mb-6">
                    <div className="flex justify-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#004d40]">{member.stats.commits}+</div>
                        <div className="text-xs text-gray-500">Commits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#f2a921]">{member.stats.projects}</div>
                        <div className="text-xs text-gray-500">Projects</div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="relative z-10 mb-8">
                    <p className="text-gray-600 leading-relaxed mb-6">{member.bio}</p>
                    
                    {/* Fun Fact */}
                    <div className="bg-gradient-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-xl p-4 border border-[#004d40]/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-[#f2a921]" />
                        <span className="text-sm font-semibold text-[#004d40]">Developer Trivia</span>
                      </div>
                      <p className="text-sm text-gray-600">{member.funFact}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="relative z-10 mb-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, i) => (
                        <motion.span
                          key={i}
                          className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-white text-gray-700 text-xs font-semibold rounded-full border border-gray-200 shadow-sm"
                          whileHover={{ scale: 1.05, backgroundColor: '#004d40', color: 'white' }}
                          transition={{ duration: 0.2 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="relative z-10 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        {['github', 'linkedin', 'email'].map((platform, i) => (
                          <motion.a
                            key={i}
                            href={member.social[platform as keyof typeof member.social]}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:shadow-lg transition-all duration-300"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {platform === 'github' && <Github className="w-5 h-5" />}
                            {platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                            {platform === 'email' && <Mail className="w-5 h-5" />}
                          </motion.a>
                        ))}
                      </div>
                      
                      <motion.div
                        className="text-xs text-gray-400 font-medium px-3 py-1.5 rounded-full bg-gray-50"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-[#004d40] font-bold">Core </span>
                        <span className='text-accent'>
                          Contributor
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gray-800">Our </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004d40] to-[#f2a921]">
                Tech Arsenal
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#004d40] to-[#f2a921] rounded-xl flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                    <p className="text-gray-500">Modern, scalable, and battle-tested technologies</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {category.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500`} />
                      
                      <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 group-hover:border-transparent transition-all duration-300 h-full flex flex-col items-center justify-center text-center shadow-sm group-hover:shadow-xl">
                        <div className={`w-16 h-16 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
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
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-2xl p-8 border border-[#004d40]/10">
              <Building2 className="w-12 h-12 text-[#004d40] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Architecture</h3>
              <p className="text-gray-600">
                Our tech stack follows a modern, scalable architecture with clear separation of concerns, <br></br> 
                ensuring maintainability, performance, and the ability to handle thousands of concurrent civic reports.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats - Circular Progress */}
      <section id="impact" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/5 via-transparent to-[#f2a921]/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Numbers That </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004d40] to-[#f2a921]">
                Matter
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quantifying our impact on urban governance across Bangladesh
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {PROJECT_STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
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
                  
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    <CountUp 
                      end={stat.value} 
                      duration={2.5} 
                      separator=","
                      decimals={stat.value === 99.9 ? 1 : 0}
                    />
                    {stat.suffix}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow - Simplified Hover Effects */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Our </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004d40] to-[#f2a921]">
                Magic Process
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From report to resolution—how we transform civic complaints into action
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#004d40] via-[#f2a921] to-[#004d40] -translate-x-1/2" />
            
            <div className="space-y-12">
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
                    <div className="w-16 h-16 bg-gradient-to-br from-[#004d40] to-[#f2a921] rounded-2xl flex items-center justify-center shadow-2xl">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                  </div>

                  {/* Content Card with Simplified Hover */}
                  <div className={`w-full lg:w-5/12 ml-20 lg:ml-0 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
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
                      <div className="absolute inset-0 bg-gradient-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#004d40]/10 to-[#f2a921]/10 rounded-xl flex items-center justify-center group-hover:from-[#004d40]/20 group-hover:to-[#f2a921]/20 transition-all duration-300">
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
                          <div className="w-8 h-8 bg-gradient-to-br from-[#004d40] to-[#f2a921] rounded-full flex items-center justify-center shadow-lg">
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
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004d40] via-[#00695c] to-[#004d40]" />
        
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
              className="inline-block p-1 rounded-2xl bg-gradient-to-r from-[#f2a921] to-[#ffb74d] mb-8"
            >
              <div className="bg-white rounded-xl px-8 py-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004d40] to-[#f2a921] font-bold text-lg tracking-wider flex items-center gap-3">
                  <Rocket className="w-5 h-5 text-[#f2a921]" />
                  JOIN THE REVOLUTION
                </span>
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-8"
            >
              Help Us Build The
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f2a921] to-white">
                Future of Cities
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed"
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
                className="group relative px-10 py-5 bg-gradient-to-r from-[#f2a921] to-[#ffb74d] text-[#004d40] rounded-2xl font-bold text-lg shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Mail className="w-6 h-6" />
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
                className="group px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  Support Our Mission
                </span>
              </motion.a>
            </motion.div>
            
            <motion.div
              className="mt-16 pt-8 border-t border-white/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-white/60 text-sm font-mono">
                Open Roles: Frontend Intern • Backend Developer • UI/UX Designer • Community Manager • AI Engineer
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutTeamPage;