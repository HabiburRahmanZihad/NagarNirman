'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common';
import { PUBLIC_ROUTES } from '@/constants/routes';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6FFF9] to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a7d2f]/5 to-[#aef452]/5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#002E2E] mb-6 animate-fade-in">
              Building Better Cities
              <span className="text-[#2a7d2f]"> Together</span>
            </h1>
            <p className="text-xl text-[#6B7280] leading-relaxed mb-8">
              NagarNirman is a citizen-powered platform transforming how we report,
              track, and resolve public infrastructure issues across Bangladesh.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href={PUBLIC_ROUTES.ABOUT_TEAM}>
                <Button variant="primary" size="lg">
                  Meet Our Team
                </Button>
              </Link>
              <Link href={PUBLIC_ROUTES.REPORT}>
                <Button variant="outline" size="lg">
                  Start Reporting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#2a7d2f]/10 to-transparent hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-[#002E2E] mb-3">Our Mission</h3>
                <p className="text-[#6B7280]">
                  Empowering citizens to actively participate in urban development
                  through transparent, efficient problem reporting and resolution.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#aef452]/10 to-transparent hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">👁️</div>
                <h3 className="text-2xl font-bold text-[#002E2E] mb-3">Our Vision</h3>
                <p className="text-[#6B7280]">
                  Creating sustainable, livable cities where every voice matters
                  and infrastructure issues are resolved promptly.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#f2a921]/10 to-transparent hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-[#002E2E] mb-3">Our Values</h3>
                <p className="text-[#6B7280]">
                  Transparency, accountability, community engagement, and
                  data-driven decision making at the core of everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 bg-[#F6FFF9]">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#002E2E] text-center mb-12">
              The Challenge We're Solving
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-red-500">
                <h3 className="text-2xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                  <span className="text-3xl">⚠️</span> The Problem
                </h3>
                <ul className="space-y-3 text-[#6B7280]">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    Broken roads, damaged streetlights, clogged drains
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    No centralized system to report issues
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    Lack of transparency in issue resolution
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    Citizens feel unheard and disconnected
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#2a7d2f]">
                <h3 className="text-2xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
                  <span className="text-3xl">✅</span> Our Solution
                </h3>
                <ul className="space-y-3 text-[#6B7280]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#2a7d2f] font-bold">•</span>
                    Easy-to-use reporting with photo/location upload
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2a7d2f] font-bold">•</span>
                    Real-time tracking of report status
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2a7d2f] font-bold">•</span>
                    Direct connection between citizens and authorities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2a7d2f] font-bold">•</span>
                    Data-driven insights for better urban planning
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#002E2E] text-center mb-12">
              How It Works
            </h2>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#2a7d2f] via-[#aef452] to-[#2a7d2f] transform -translate-y-1/2" />

              <div className="grid md:grid-cols-4 gap-8 relative">
                {[
                  { icon: '📸', title: 'Report', desc: 'Snap a photo and report the issue with location' },
                  { icon: '📍', title: 'Track', desc: 'Monitor your report status in real-time' },
                  { icon: '🔧', title: 'Resolve', desc: 'Authorities assign and solve the problem' },
                  { icon: '✨', title: 'Impact', desc: 'See the positive change in your community' },
                ].map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#2a7d2f]/20 hover:border-[#2a7d2f] relative z-10">
                      <div className="text-5xl mb-4 text-center">{step.icon}</div>
                      <div className="w-12 h-12 bg-[#2a7d2f] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                        {index + 1}
                      </div>
                      <h4 className="text-xl font-bold text-[#002E2E] mb-2 text-center">{step.title}</h4>
                      <p className="text-[#6B7280] text-center text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-r from-[#2a7d2f] to-[#1e5d22] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="text-5xl font-bold mb-2">10K+</div>
                <div className="text-[#aef452] text-lg">Reports Filed</div>
              </div>
              <div className="p-6">
                <div className="text-5xl font-bold mb-2">7.5K+</div>
                <div className="text-[#aef452] text-lg">Issues Resolved</div>
              </div>
              <div className="p-6">
                <div className="text-5xl font-bold mb-2">64+</div>
                <div className="text-[#aef452] text-lg">Cities Covered</div>
              </div>
              <div className="p-6">
                <div className="text-5xl font-bold mb-2">25K+</div>
                <div className="text-[#aef452] text-lg">Active Citizens</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-16 bg-[#F6FFF9]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#002E2E] mb-6">
              Aligned with UN SDG 11
            </h2>
            <p className="text-xl text-[#6B7280] mb-8">
              Supporting <span className="font-bold text-[#2a7d2f]">Sustainable Cities and Communities</span> through
              citizen engagement and transparent governance.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
              <div className="text-7xl mb-4">🏙️</div>
              <p className="text-[#6B7280] italic">
                "Making cities inclusive, safe, resilient and sustainable"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#002E2E] mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-[#6B7280] mb-8">
              Join thousands of citizens building better cities together.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth/register">
                <Button variant="primary" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href={PUBLIC_ROUTES.ABOUT_TEAM}>
                <Button variant="outline" size="lg">
                  Meet the Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
