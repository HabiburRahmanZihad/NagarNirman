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
  Smartphone, Cloud, Lock, Wifi
} from 'lucide-react';
import CountUp from 'react-countup';

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

// Floating Elements Background
const FloatingElements = () => {
  const elements = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
  }));

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
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: el.delay,
          }}
        />
      ))}
    </div>
  );
};

const AboutTeamPage = () => {
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
      funFact: 'Can deploy a full-stack app in under 10 minutes'
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
      funFact: 'Has never lost a single user data record'
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
      funFact: 'Dreams in CSS animations'
    },
  ];

  const PROJECT_STATS = [
    { value: 235000, suffix: '+', label: 'Reports Processed', icon: <FileText className="w-6 h-6" /> },
    { value: 78, suffix: '%', label: 'Resolution Rate', icon: <CheckCircle className="w-6 h-6" /> },
    { value: 64, suffix: '', label: 'Districts Covered', icon: <MapPin className="w-6 h-6" /> },
    { value: 99.9, suffix: '%', label: 'System Uptime', icon: <Server className="w-6 h-6" /> },
  ];

  const TECH_STACK = [
    { icon: <Smartphone className="w-8 h-8" />, name: 'React Native', color: 'from-blue-400 to-cyan-400' },
    { icon: <Globe2 className="w-8 h-8" />, name: 'Next.js', color: 'from-black to-gray-800' },
    { icon: <Database className="w-8 h-8" />, name: 'MongoDB', color: 'from-green-500 to-emerald-500' },
    { icon: <Cloud className="w-8 h-8" />, name: 'Cloudinary', color: 'from-yellow-500 to-orange-500' },
    { icon: <Lock className="w-8 h-8" />, name: 'Auth.js', color: 'from-red-500 to-pink-500' },
    { icon: <Wifi className="w-8 h-8" />, name: 'Socket.io', color: 'from-purple-500 to-indigo-500' },
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

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/5 via-transparent to-[#f2a921]/5" />
        
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0, 77, 64, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(242, 169, 33, 0.1) 0%, transparent 50%)`,
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
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-[#004d40]/20 mb-8 shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-5 h-5 text-[#f2a921]" />
                <span className="text-sm font-semibold text-[#004d40] tracking-wider">THE BUILDERS OF CHANGE</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="block">We Build</span>
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004d40] via-[#004d40] to-[#f2a921]">
                    Smarter Cities
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#004d40] to-[#f2a921] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                  />
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                Three students transforming urban governance through technology. 
                Building NagarNirman—a platform that makes civic reporting 
                <span className="font-semibold text-[#004d40]"> seamless, transparent, and impactful.</span>
              </p>
              
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
                    Meet The Team
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#f2a921] to-[#ffb74d]"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
                
                <motion.a
                  href="#impact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 border-2 border-[#004d40] text-[#004d40] rounded-full font-semibold hover:bg-[#004d40] hover:text-white transition-all duration-300"
                >
                  See Our Impact
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
          <div className="w-6 h-10 border-2 border-[#004d40]/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gradient-to-b from-[#004d40] to-[#f2a921] rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
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

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

                  {/* Bio */}
                  <div className="relative z-10 mb-8">
                    <p className="text-gray-600 leading-relaxed mb-6">{member.bio}</p>
                    
                    {/* Fun Fact */}
                    <div className="bg-gradient-to-r from-[#004d40]/5 to-[#f2a921]/5 rounded-xl p-4 border border-[#004d40]/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-[#f2a921]" />
                        <span className="text-sm font-semibold text-[#004d40]">Fun Fact</span>
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
                        Contributor
                      </motion.div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack - Animated Grid */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
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
                Tech Arsenal
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technologies powering Bangladesh&apos;s smartest civic platform
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {TECH_STACK.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-500`} />
                
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-300 h-full flex flex-col items-center justify-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <div className="text-white">
                      {tech.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-center">{tech.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

      {/* Workflow - Animated Timeline */}
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

          <div className="relative max-w-6xl mx-auto">
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

                  {/* Content Card */}
                  <div className={`w-full lg:w-5/12 ml-20 lg:ml-0 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#004d40]/10 to-[#f2a921]/10 rounded-xl flex items-center justify-center">
                          <div className="text-[#004d40]">
                            {step.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-600">{step.desc}</p>
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
                Open Roles: Frontend Intern • Backend Developer • UI/UX Designer • Community Manager
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

// Missing icon component
const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default AboutTeamPage;