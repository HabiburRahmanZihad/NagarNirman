'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import {
  Github, Linkedin, Mail,
  Terminal, Cpu, Globe, GitBranch,
  ShieldCheck, Database, Zap, Layers,
  MousePointer2, Code2, Server
} from 'lucide-react';

// --- COMPONENT: 3D TILT CARD ---
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ transformStyle: "preserve-3d", rotateX: mouseY, rotateY: mouseX }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- DATA ---
const TEAM_MEMBERS = [
  {
    name: 'Ahmed Rahman',
    role: 'The Architect',
    subRole: 'Project Lead & DevOps',
    bio: 'Orchestrating the chaos. Ahmed bridges complex backend logic with user-centric product strategy.',
    avatar: '👨‍💼',
    tech: [<Terminal key="1" className="w-4 h-4" />, <ShieldCheck key="2" className="w-4 h-4" />],
    social: { github: '#', linkedin: '#' },
  },
  {
    name: 'Fatima Khan',
    role: 'The Engine',
    subRole: 'Backend & DB Architect',
    bio: 'Data integrity is her obsession. She ensures our MongoDB clusters scale efficiently and securely.',
    avatar: '👩‍💻',
    tech: [<Database key="1" className="w-4 h-4" />, <Cpu key="2" className="w-4 h-4" />],
    social: { github: '#', linkedin: '#' },
  },
  {
    name: 'Rafi Hassan',
    role: 'The Artist',
    subRole: 'Frontend & UI/UX',
    bio: 'Pixel perfectionist. Rafi crafts accessible interfaces using ShadCN that feel like magic.',
    avatar: '👨‍🎨',
    tech: [<Globe key="1" className="w-4 h-4" />, <Zap key="2" className="w-4 h-4" />],
    social: { github: '#', linkedin: '#' },
  },
];

const AboutTeamPage = () => {
  return (
    // Main container uses your base-200 (light gray) for contrast against white cards
    <div className="min-h-screen bg-base-200 text-[#002E2E] font-sans selection:bg-[#aef452] selection:text-[#002E2E] overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-base-300">
        {/* Abstract Gradient Blobs using your Primary (#2a7d2f) and Secondary (#aef452) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#aef452] opacity-30 blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2a7d2f] opacity-10 blur-[100px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a7d2f]/20 bg-white text-[#2a7d2f] text-xs font-bold tracking-wider mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a7d2f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2a7d2f]"></span>
              </span>
              v1.0 ENGINEERING TEAM
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 text-[#002E2E]">
              Small Team. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a7d2f] via-[#2a7d2f] to-[#aef452]">
                Massive Impact.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              We are a trio of students combining engineering, design, and data to solve Bangladesh's urban infrastructure challenges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- TEAM CARDS: BENTO GRID --- */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {TEAM_MEMBERS.map((member, index) => (
              <TiltCard key={index} className="group relative h-full">
                {/* Hover Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2a7d2f] to-[#aef452] rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition duration-500" />

                {/* Card Interior - bg-base-100 (White) */}
                <div className="relative h-full bg-base-100 border border-gray-200 rounded-[2rem] p-8 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl transition-all">

                  {/* Decorative Number - NOW VISIBLE (Darker Gray) */}
                  <span className="absolute -top-4 -right-2 text-[8rem] font-bold text-gray-100 pointer-events-none select-none z-0">
                    0{index + 1}
                  </span>

                  {/* Header */}
                  <div className="relative z-10 flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2a7d2f] to-[#aef452] p-1 shadow-lg">
                      <div className="w-full h-full bg-white rounded-[12px] flex items-center justify-center text-4xl">
                        {member.avatar}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {member.tech.map((icon, i) => (
                        <div key={i} className="p-2.5 rounded-full bg-gray-50 border border-gray-200 text-[#6B7280]">
                          {icon}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-auto">
                    <h3 className="text-3xl font-bold text-[#002E2E] mb-1">{member.name}</h3>
                    <p className="text-sm font-bold uppercase tracking-widest text-[#2a7d2f] mb-4">
                      {member.role}
                    </p>
                    <p className="text-[#6B7280] font-medium text-sm leading-relaxed mb-6 border-l-4 border-[#aef452] pl-4">
                      {member.bio}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-[#6B7280] font-bold tracking-wider">{member.subRole}</span>
                    <div className="flex gap-3">
                      <Link href={member.social.github || "#"} className="text-[#6B7280] hover:text-[#2a7d2f] transition-colors"><Github className="w-5 h-5"/></Link>
                      <Link href={member.social.linkedin || "#"} className="text-[#6B7280] hover:text-[#0077b5] transition-colors"><Linkedin className="w-5 h-5"/></Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- WORKFLOW / ARCHITECTURE --- */}
      <section className="py-24 bg-base-100 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002E2E] mb-4">The Workflow Engine</h2>
            <p className="text-[#6B7280] text-lg">How 3 people manage an entire city&apos;s data.</p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Diagram Placement */}
             <div className="mb-12 flex justify-center opacity-90 hover:opacity-100 transition-opacity">
                             </div>

            <div className="grid md:grid-cols-3 gap-6 items-center relative">
              {/* Animated Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2 z-0 bg-gray-100 overflow-hidden rounded-full">
                <motion.div
                   className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#2a7d2f] to-transparent"
                   animate={{ x: ["-100%", "400%"] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Step 1 */}
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white border-2 border-[#2a7d2f] p-8 rounded-2xl relative z-10 text-center shadow-xl">
                <div className="w-12 h-12 bg-[#2a7d2f]/10 text-[#2a7d2f] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#002E2E] text-lg">Frontend UI</h3>
                <p className="text-xs text-[#6B7280] mt-2 font-mono">React • Tailwind</p>
                <div className="mt-4 text-xs bg-[#2a7d2f] text-white font-bold py-1 px-3 rounded-full inline-block">
                  Rafi captures input
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white border-2 border-[#aef452] p-8 rounded-2xl relative z-10 text-center shadow-xl">
                <div className="w-12 h-12 bg-[#aef452]/20 text-[#002E2E] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#002E2E] text-lg">DevOps Core</h3>
                <p className="text-xs text-[#6B7280] mt-2 font-mono">CI/CD • Vercel</p>
                <div className="mt-4 text-xs bg-[#aef452] text-[#002E2E] font-bold py-1 px-3 rounded-full inline-block">
                  Ahmed deploys it
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white border-2 border-[#f2a921] p-8 rounded-2xl relative z-10 text-center shadow-xl">
                <div className="w-12 h-12 bg-[#f2a921]/20 text-[#f2a921] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#002E2E] text-lg">Backend API</h3>
                <p className="text-xs text-[#6B7280] mt-2 font-mono">Node • Mongo</p>
                <div className="mt-4 text-xs bg-[#f2a921] text-white font-bold py-1 px-3 rounded-full inline-block">
                  Fatima secures data
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FUN STATS: BENTO STYLE --- */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {/* Stat 1 */}
            <div className="col-span-1 bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between hover:border-[#2a7d2f] transition-colors group shadow-sm">
              <GitBranch className="w-6 h-6 text-[#6B7280] group-hover:text-[#2a7d2f] mb-4 transition-colors" />
              <div>
                <div className="text-3xl font-mono font-bold text-[#002E2E]">1,240+</div>
                <div className="text-xs text-[#6B7280] font-bold uppercase tracking-widest mt-1">Commits</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="col-span-1 bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between hover:border-[#f2a921] transition-colors group shadow-sm">
              <Server className="w-6 h-6 text-[#6B7280] group-hover:text-[#f2a921] mb-4 transition-colors" />
              <div>
                <div className="text-3xl font-mono font-bold text-[#002E2E]">100%</div>
                <div className="text-xs text-[#6B7280] font-bold uppercase tracking-widest mt-1">Free & Open</div>
              </div>
            </div>

            {/* Stat 3 (Large) - FIXED VISIBILITY */}
            <div className="col-span-2 bg-[#002E2E] p-6 rounded-2xl flex items-center justify-between relative overflow-hidden shadow-xl text-white">
               <div className="absolute -right-10 -bottom-10 opacity-10"><Code2 className="w-40 h-40 text-white"/></div>
               <div className="relative z-10">
                 <div className="text-sm text-[#aef452] font-mono mb-2">SYSTEM HEALTH</div>
                 <div className="text-4xl font-bold">99.9% Uptime</div>
               </div>
               <div className="h-4 w-4 bg-[#aef452] rounded-full animate-pulse relative z-10 mr-4 shadow-[0_0_15px_#aef452]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- JOIN TEAM CTA (Corrected Colors) --- */}
      <section className="py-24 text-center bg-base-100 relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#2a7d2f]/10 rounded-full opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#aef452]/20 rounded-full opacity-50" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#2a7d2f] to-[#aef452] mb-8">
            <div className="bg-white rounded-full px-6 py-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002E2E] to-[#2a7d2f] font-bold tracking-widest text-xs uppercase flex items-center gap-2">
                <MousePointer2 className="w-4 h-4 text-[#002E2E]" /> We are Hiring
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#002E2E] mb-6">
            Want to join our team?
          </h2>
          <p className="text-xl text-[#6B7280] max-w-xl mx-auto mb-10">
            We are always looking for passionate students to help us build a cleaner, smarter Bangladesh.
          </p>

          <div className="flex flex-col items-center gap-6">
            <a href="mailto:e241024@ugrad.iiuc.ac.bd">
              {/* Primary Button using DaisyUI standard or hardcoded styles */}
              <Button size="lg" className="bg-[#2a7d2f] hover:bg-[#aef452] hover:text-[#002E2E] text-white font-bold h-16 px-12 rounded-full text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                <Mail className="w-6 h-6" />
                Apply via Email
              </Button>
            </a>
            <p className="text-sm text-[#6B7280] font-mono bg-base-200 px-4 py-2 rounded-lg border border-gray-200">
              e241024@ugrad.iiuc.ac.bd
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutTeamPage;