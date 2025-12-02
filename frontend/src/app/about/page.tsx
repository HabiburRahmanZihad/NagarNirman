'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { motion, AnimatePresence, useInView, animate, easeOut } from 'framer-motion';
import {
  Github,
  Linkedin,
  Target,
  Shield,
  Heart,
  ChevronDown,
  Code,
  Database,
  Map,
  Server,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  Building2,
} from 'lucide-react';

// --- HELPER: ANIMATED NUMBER COUNTER ---
const AnimatedCounter = ({ from, to }: { from: number; to: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString();
      },
    });

    return () => controls.stop();
  }, [from, to, inView]);

  return <span ref={ref}>{from}</span>;
};

// --- DATA: TEAM MEMBERS ---
const TEAM_MEMBERS = [
  {
    name: 'Adnan Sami',
    role: 'Full Stack Developer',
    bio: 'Driving the technical vision and architecture. Loves solving complex backend challenges.',
    socials: { linkedin: '#', github: '#' },
  },
  {
    name: 'Farhan Ahmed',
    role: 'Frontend & UI/UX',
    bio: 'Crafting pixel-perfect, accessible interfaces that make reporting issues a breeze.',
    socials: { linkedin: '#', github: '#' },
  },
  {
    name: 'Rafiqul Islam',
    role: 'Backend & DevOps',
    bio: 'Ensuring 99.9% uptime and managing the database that powers our city insights.',
    socials: { linkedin: '#', github: '#' },
  },
];

// --- DATA: TIMELINE ---
const TIMELINE_EVENTS = [
  {
    year: '2024 Q1',
    title: 'The Spark',
    desc: 'The idea was born from a simple pothole that went unfixed for months.',
  },
  {
    year: '2024 Q3',
    title: 'The Prototype',
    desc: 'Our team of 3 built the first MVP during a university hackathon.',
  },
  {
    year: '2025 Q1',
    title: 'Official Launch',
    desc: 'NagarNirman goes live, connecting 64 districts to authorities.',
  },
  {
    year: 'Future',
    title: 'AI Integration',
    desc: 'Planning automated severity detection using Image Recognition.',
  },
];

// --- DATA: FAQS ---
const FAQS = [
  {
    question: 'Is NagarNirman connected to the government?',
    answer:
      'We act as a bridge. While we are an independent platform, we provide dashboards for city officials to view and act on reports submitted by citizens.',
  },
  {
    question: 'Is it free to use?',
    answer: 'Yes! Reporting issues and tracking them is 100% free for all citizens.',
  },
  {
    question: 'How do I earn points?',
    answer:
      'You earn Karma Points for every verified report and when your report gets resolved. Top contributors appear on our leaderboard.',
  },
  {
    question: 'Can I remain anonymous?',
    answer:
      'Yes, you can choose to submit reports anonymously, though creating an account helps you track progress.',
  },
];

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden text-[#002E2E]">

      {/* --- HERO SECTION --- */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-[#F6FFF9]">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#aef452] opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2a7d2f] opacity-5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white border border-[#aef452] text-[#2a7d2f] text-sm font-semibold tracking-wide mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a7d2f] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2a7d2f]" />
              </span>
              Built for Bangladesh 🇧🇩
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              We are building the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2a7d2f] to-[#aef452]">
                Operating System
              </span>{' '}
              for Cities.
            </h1>

            <p className="text-xl text-[#6B7280] leading-relaxed mb-10 max-w-2xl mx-auto">
              NagarNirman transforms the chaos of urban issues into organized, actionable data. We
              are a small team with a massive vision.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href={PUBLIC_ROUTES.REPORT}>
                <Button variant="primary" size="lg">
                  Start Reporting Now
                </Button>
              </Link>
              <Link href={PUBLIC_ROUTES.ABOUT_TEAM}>
                <Button variant="outline" size="lg">
                  Meet the Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- INFORMATIONAL STATS STRIP (NEW) --- */}
      <section className="py-12 bg-[#002E2E] text-white -mt-1 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl font-bold text-[#aef452] mb-1">
                <AnimatedCounter from={0} to={12450} />+
              </div>
              <div className="text-sm text-white/70 uppercase tracking-widest">Reports Filed</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-4xl font-bold text-[#aef452] mb-1">
                <AnimatedCounter from={0} to={64} />
              </div>
              <div className="text-sm text-white/70 uppercase tracking-widest">Districts</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-4xl font-bold text-[#aef452] mb-1">
                <AnimatedCounter from={0} to={89} />%
              </div>
              <div className="text-sm text-white/70 uppercase tracking-widest">Resolution Rate</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="text-4xl font-bold text-[#aef452] mb-1">
                24/7
              </div>
              <div className="text-sm text-white/70 uppercase tracking-widest">System Uptime</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- MISSION & VISUAL DEMO --- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Bridging the Gap
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We realized that the biggest barrier to fixing a broken road or a leaking pipe
                wasn&apos;t lack of resources—it was <strong>lack of data</strong>.
              </p>

              {/* Informatic Process Flow */}
              <div className="space-y-6 mt-8">
                <div className="flex gap-4 group">
                  <div className="shrink-0 w-12 h-12 bg-[#F6FFF9] rounded-full flex items-center justify-center border border-[#aef452] group-hover:bg-[#2a7d2f] transition-colors duration-300">
                    <Map className="w-5 h-5 text-[#2a7d2f] group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#002E2E]">1. Report</h3>
                    <p className="text-sm text-gray-500">Citizen snaps a photo. AI detects location & category.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="shrink-0 w-12 h-12 bg-[#F6FFF9] rounded-full flex items-center justify-center border border-[#f2a921] group-hover:bg-[#f2a921] transition-colors duration-300">
                    <Server className="w-5 h-5 text-[#f2a921] group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#002E2E]">2. Verify & Assign</h3>
                    <p className="text-sm text-gray-500">System filters spam and auto-assigns to the nearest Ward Councillor.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="shrink-0 w-12 h-12 bg-[#F6FFF9] rounded-full flex items-center justify-center border border-[#2a7d2f] group-hover:bg-[#2a7d2f] transition-colors duration-300">
                    <CheckCircle2 className="w-5 h-5 text-[#2a7d2f] group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#002E2E]">3. Resolve</h3>
                    <p className="text-sm text-gray-500">Authority fixes issue. Citizen gets a notification and points.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual Abstract Animation (Simulated App UI) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square bg-[#F6FFF9] rounded-[3rem] p-8 relative overflow-hidden border border-[#e6f4e7]">

                {/* Card 1: The Problem (Fades Out) */}
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 0, y: -20 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="absolute top-1/4 left-10 right-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform -rotate-2 z-10"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">🚨</div>
                    <div>
                      <div className="font-bold text-[#002E2E]">Pothole Reported</div>
                      <div className="text-xs text-gray-400">Mirpur 10 • Just now</div>
                    </div>
                  </div>
                  <div className="h-20 bg-gray-100 rounded-lg w-full animate-pulse" />
                </motion.div>

                {/* Card 2: The Solution (Slides In) */}
                <motion.div
                  initial={{ opacity: 0, y: 50, rotate: 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 2 }}
                  transition={{ delay: 2.5, duration: 0.5, type: "spring" }}
                  className="absolute top-1/3 left-10 right-10 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 z-20"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#e6f4e7] flex items-center justify-center text-[#2a7d2f]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-[#2a7d2f]">Issue Resolved</div>
                      <div className="text-xs text-gray-500">Dhaka North • 2h ago</div>
                    </div>
                  </div>
                  {/* Progress Bar Animation */}
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-4">
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ delay: 3, duration: 1 }}
                      className="h-full bg-[#aef452]"
                    />
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-400">Status: Completed</p>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className="py-24 bg-[#F6FFF9]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">From Idea to Reality</h2>
            <p className="text-gray-600">The timeline of how NagarNirman came to be.</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical Line with Draw Animation */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-[#2a7d2f]/30 transform md:-translate-x-1/2"
            />

            <div className="space-y-12">
              {TIMELINE_EVENTS.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                >
                  {/* Content Box */}
                  <div className="flex-1 ml-12 md:ml-0">
                    <div
                      className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                        }`}
                    >
                      <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#f2a921]/10 text-[#f2a921] text-xs font-bold mb-2">
                        <Calendar className="w-3 h-3" /> {event.year}
                      </span>
                      <h3 className="text-xl font-bold text-[#002E2E] mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm">{event.desc}</p>
                    </div>
                  </div>

                  {/* Dot on Line */}
                  <div className="absolute left-[11px] md:left-1/2 top-6 w-5 h-5 rounded-full bg-[#2a7d2f] border-4 border-[#F6FFF9] transform md:-translate-x-1/2 z-10 shadow-md">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-full h-full rounded-full bg-[#2a7d2f]"
                    />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TECH STACK STRIP (Interactive) --- */}
      <section className="py-16 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10">
            Powered by Modern Technology
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {[
              { icon: <Code className="w-10 h-10" />, name: "Next.js", color: "text-black", desc: "Fast & SEO Ready" },
              { icon: <Database className="w-10 h-10" />, name: "MongoDB", color: "text-green-600", desc: "Scalable Data" },
              { icon: <Zap className="w-10 h-10" />, name: "Tailwind", color: "text-cyan-500", desc: "Rapid UI" },
              { icon: <Map className="w-10 h-10" />, name: "Leaflet", color: "text-blue-500", desc: "Open Mapping" },
            ].map((tech, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="group flex flex-col items-center gap-2 cursor-default"
              >
                <div className={`${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <span className="font-bold text-[#002E2E]">{tech.name}</span>
                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute mt-16 bg-white px-2 py-1 shadow-md rounded border">
                  {tech.desc}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
            <p className="text-gray-600">Everything you need to know about the platform.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-lg text-[#002E2E]">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-[#002E2E] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2a7d2f] opacity-20 rounded-full blur-[100px]" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to make an impact?</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join thousands of other citizens who are actively rebuilding their communities, one
            report at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button className="bg-[#aef452] hover:bg-[#9de045] text-[#002E2E] font-bold h-14 px-8 rounded-full text-lg border-none flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;