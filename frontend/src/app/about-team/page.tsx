'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common';
import { PUBLIC_ROUTES } from '@/constants/routes';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  skills: string[];
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const AboutTeamPage = () => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Ahmed Rahman',
      role: 'Project Lead & Full Stack Developer',
      bio: 'Passionate about civic tech and sustainable urban development. Leading the vision of NagarNirman.',
      avatar: '👨‍💼',
      skills: ['Leadership', 'Full Stack', 'Product Strategy', 'UX Design'],
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
      },
    },
    {
      name: 'Fatima Khan',
      role: 'Backend Architect',
      bio: 'Expert in scalable systems and database design. Ensuring our platform handles millions of reports.',
      avatar: '👩‍💻',
      skills: ['Node.js', 'MongoDB', 'API Design', 'System Architecture'],
      social: {
        github: '#',
        linkedin: '#',
      },
    },
    {
      name: 'Rafi Hassan',
      role: 'Frontend Developer',
      bio: 'Creating beautiful, accessible user experiences. Focused on making reporting effortless.',
      avatar: '👨‍🎨',
      skills: ['React', 'Next.js', 'TypeScript', 'UI/UX'],
      social: {
        github: '#',
        linkedin: '#',
      },
    },
    {
      name: 'Nadia Islam',
      role: 'Community Manager',
      bio: 'Building bridges between citizens and authorities. Ensuring every voice is heard.',
      avatar: '👩‍🏫',
      skills: ['Community Building', 'Communication', 'Outreach', 'Training'],
      social: {
        linkedin: '#',
        twitter: '#',
      },
    },
    {
      name: 'Karim Ahmed',
      role: 'Data Analyst',
      bio: 'Turning reports into insights. Helping cities make data-driven infrastructure decisions.',
      avatar: '👨‍🔬',
      skills: ['Data Analysis', 'Visualization', 'Python', 'Statistics'],
      social: {
        github: '#',
        linkedin: '#',
      },
    },
    {
      name: 'Sadia Rahman',
      role: 'QA & Testing Lead',
      bio: 'Ensuring quality and reliability. Testing every feature to perfection.',
      avatar: '👩‍🔧',
      skills: ['QA Testing', 'Automation', 'Bug Tracking', 'User Testing'],
      social: {
        linkedin: '#',
      },
    },
  ];

  const advisors = [
    {
      name: 'Dr. Habibur Rahman',
      role: 'Technical Advisor',
      avatar: '👨‍🏫',
      expertise: 'Urban Planning & Smart Cities',
    },
    {
      name: 'Prof. Ayesha Begum',
      role: 'Research Advisor',
      avatar: '👩‍🔬',
      expertise: 'Public Policy & Governance',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-[#F6FFF9]">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-r from-[#2a7d2f] to-[#1e5d22] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#aef452] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#f2a921] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Meet the Dream Team 🌟
            </h1>
            <p className="text-xl text-[#aef452] leading-relaxed mb-8">
              Passionate individuals working together to transform urban infrastructure
              management in Bangladesh
            </p>
            <Link href={PUBLIC_ROUTES.ABOUT}>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#2a7d2f]">
                ← Back to About
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🤝', label: 'Collaboration' },
                { icon: '💡', label: 'Innovation' },
                { icon: '🎯', label: 'Excellence' },
                { icon: '❤️', label: 'Community First' },
              ].map((value, index) => (
                <div key={index} className="p-4">
                  <div className="text-4xl mb-2">{value.icon}</div>
                  <div className="font-semibold text-[#002E2E]">{value.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#002E2E] mb-4">
                Core Team Members
              </h2>
              <p className="text-xl text-[#6B7280]">
                The brilliant minds behind NagarNirman
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#2a7d2f] group"
                >
                  {/* Card Header */}
                  <div className="bg-linear-to-br from-[#2a7d2f]/10 to-[#aef452]/10 p-8 text-center relative">
                    <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform">
                      {member.avatar}
                    </div>
                    <h3 className="text-2xl font-bold text-[#002E2E] mb-2">
                      {member.name}
                    </h3>
                    <p className="text-[#2a7d2f] font-semibold mb-4">
                      {member.role}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-[#6B7280] mb-4 text-sm leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-[#F6FFF9] text-[#2a7d2f] text-xs font-semibold rounded-full border border-[#2a7d2f]/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    {member.social && (
                      <div className="flex gap-3 justify-center pt-4 border-t border-gray-100">
                        {member.social.github && (
                          <a
                            href={member.social.github}
                            className="text-2xl hover:text-[#2a7d2f] transition-colors"
                            aria-label="GitHub"
                          >
                            💻
                          </a>
                        )}
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            className="text-2xl hover:text-[#2a7d2f] transition-colors"
                            aria-label="LinkedIn"
                          >
                            💼
                          </a>
                        )}
                        {member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            className="text-2xl hover:text-[#2a7d2f] transition-colors"
                            aria-label="Twitter"
                          >
                            🐦
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#002E2E] mb-4">
                Advisory Board
              </h2>
              <p className="text-xl text-[#6B7280]">
                Guided by experts in urban development and public policy
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {advisors.map((advisor, index) => (
                <div
                  key={index}
                  className="bg-linear-to-br from-[#F6FFF9] to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-[#2a7d2f]/20"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-6xl">{advisor.avatar}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#002E2E] mb-1">
                        {advisor.name}
                      </h3>
                      <p className="text-[#2a7d2f] font-semibold mb-2">
                        {advisor.role}
                      </p>
                      <p className="text-[#6B7280] text-sm">
                        {advisor.expertise}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-linear-to-br from-[#F6FFF9] to-[#aef452]/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#002E2E] mb-6">
              Want to Join Our Team? 🚀
            </h2>
            <p className="text-xl text-[#6B7280] mb-8">
              We're always looking for passionate individuals who want to make a real
              impact on urban infrastructure and community development.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="primary" size="lg">
                View Open Positions
              </Button>
              <Link href={PUBLIC_ROUTES.CONTACT}>
                <Button variant="outline" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Culture */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#002E2E] text-center mb-12">
              Our Team Culture
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🌱',
                  title: 'Growth Mindset',
                  desc: 'Continuous learning and development opportunities for everyone',
                },
                {
                  icon: '🎨',
                  title: 'Creative Freedom',
                  desc: 'Space to experiment, innovate, and bring your ideas to life',
                },
                {
                  icon: '⚖️',
                  title: 'Work-Life Balance',
                  desc: 'Flexible hours and remote work options for all team members',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-linear-to-br from-[#F6FFF9] to-white shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[#002E2E] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#6B7280]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-linear-to-r from-[#2a7d2f] to-[#1e5d22] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Together, We Build Better Cities! 🏙️
            </h2>
            <p className="text-xl text-[#aef452] mb-8">
              Join our community and be part of the urban transformation
            </p>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#2a7d2f]">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutTeamPage;
