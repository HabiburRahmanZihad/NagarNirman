'use client';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Mail,
  Phone,
  Scale,
  Shield,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';

export default function TermsPage() {
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});


  // Format current date
  const currentDateShow = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);


  // Scroll to section function
  const scrollToSection = (sectionId: number) => {
    if (expandedSections.includes(sectionId) && expandedSections.length === 1) {
      setExpandedSections([]);
      return;
    }
    setExpandedSections([sectionId]);
    setTimeout(() => {
      const element = sectionRefs.current[sectionId];
      if (element) {
        const yOffset = -100;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };


  // Toggle section expansion
  const toggleSection = (section: number) => {
    setExpandedSections((prev) => {
      if (prev.includes(section)) {
        return prev.filter((s) => s !== section);
      }
      return [section];
    });
  };


  // Terms sections data
  const sections = [
    {
      id: 1,
      title: 'Acceptance of Terms',
      icon: <CheckCircle size={20} />,
      content:
        'By accessing or using NagarNirman ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform. We reserve the right to modify these Terms at any time, and your continued use constitutes acceptance of such modifications.',
    },
    {
      id: 2,
      title: 'Platform Description',
      icon: <FileText size={20} />,
      content:
        'NagarNirman is a comprehensive, community-driven platform that connects citizens with qualified problem solvers to address civic issues and improve urban living conditions. We facilitate the transparent reporting, assignment, and resolution of civic problems while promoting community engagement and sustainable urban development.',
    },
    {
      id: 3,
      title: 'User Accounts & Registration',
      icon: <Users size={20} />,
      content:
        'Provide accurate, complete, and current information during registration. Maintain confidentiality of your account credentials. Must be at least 18 years old to create an account. One person may not maintain multiple accounts without authorization.',
    },
    {
      id: 4,
      title: 'Acceptable Use Policy',
      icon: <Shield size={20} />,
      content:
        'You agree NOT to submit false information, harass other users, use offensive language, or violate any laws and regulations. All content must comply with community guidelines and respect other users.',
    },
    {
      id: 5,
      title: 'Problem Solver Responsibilities',
      icon: <Users size={20} />,
      content:
        'Complete assigned tasks professionally and efficiently. Provide regular and accurate updates on task progress. Follow all applicable safety regulations and quality standards. Maintain appropriate insurance coverage.',
    },
    {
      id: 6,
      title: 'Authority & Official Access',
      icon: <Scale size={20} />,
      content:
        'Verified government authorities have special privileges including access to all reported civic issues in their jurisdiction and ability to assign problem solvers. Official accounts must undergo verification process.',
    },
    {
      id: 7,
      title: 'Intellectual Property Rights',
      icon: <FileText size={20} />,
      content:
        'The Platform and its original content are owned by NagarNirman and protected by international copyright and intellectual property laws. Users retain rights to their submitted content while granting us license to use it.',
    },
    {
      id: 8,
      title: 'Privacy & Data Protection',
      icon: <Shield size={20} />,
      content:
        'Your use of the Platform is governed by our comprehensive Privacy Policy. We collect and process data in compliance with applicable privacy laws and regulations. We implement industry-standard security measures.',
    },
    {
      id: 9,
      title: 'Limitation of Liability',
      icon: <Scale size={20} />,
      content:
        'THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We make no guarantees regarding uninterrupted service or error-free operation. Liability is limited to the maximum extent permitted by law.',
    },
    {
      id: 10,
      title: 'Indemnification',
      icon: <Shield size={20} />,
      content:
        'You agree to indemnify and hold harmless NagarNirman from any claims arising from your violation of these Terms or infringement of third-party rights. This includes legal fees and damages.',
    },
    {
      id: 11,
      title: 'Termination & Suspension',
      icon: <Clock size={20} />,
      content:
        'We reserve the right to suspend or terminate your account for conduct that violates these Terms or is harmful to other users. You may terminate your account at any time through account settings.',
    },
    {
      id: 12,
      title: 'Governing Law & Dispute Resolution',
      icon: <Scale size={20} />,
      content:
        'These Terms are governed by the laws of Bangladesh. Any legal action shall be exclusively brought in the courts located in Dhaka, Bangladesh. We encourage informal resolution first.',
    },
  ];


  // Quick stats data
  const stats = [
    { number: '12', label: 'Key Sections', desc: 'Comprehensive coverage' },
    { number: '100%', label: 'Transparent', desc: 'Clear & simple language' },
    { number: '24/7', label: 'Support', desc: 'Always here to help' },
    { number: 'Legal', label: 'Protection', desc: 'Your rights matter' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-base-300 to-base-100">
      {/* Modern Header */}
      <section className="relative overflow-hidden mb-10">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80"
            alt="Legal documents background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/75 to-transparent"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-100 mb-6">
              Please read these terms carefully before using NagarNirman. These
              terms outline your rights, responsibilities, and the rules
              governing your use of our civic engagement platform.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 inline-block">
              <p className="text-gray-100">
                <span className="font-semibold">Last Updated:</span>{' '}
                {currentDateShow || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold text-info mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-neutral">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Navigation - Sticky */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 bg-base-100 rounded-2xl shadow-sm border border-base-200 p-6">
                <h3 className="text-lg font-bold text-info mb-6 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  Quick Navigation
                </h3>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${expandedSections.includes(section.id)
                        ? 'bg-linear-to-r from-primary/10 to-secondary/10 border-l-4 border-primary'
                        : 'hover:bg-base-200 border-l-4 border-transparent'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${expandedSections.includes(section.id)
                            ? 'bg-primary text-white'
                            : 'bg-base-200 text-neutral'
                            }`}
                        >
                          {section.icon}
                        </div>
                        <span className="font-medium text-info text-sm">
                          {section.title}
                        </span>
                      </div>
                      <div
                        className={`p-1 rounded ${expandedSections.includes(section.id)
                          ? 'bg-primary text-white'
                          : 'bg-base-200 text-neutral'
                          }`}
                      >
                        {expandedSections.includes(section.id) ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-base-200">
                  <div className="bg-linear-to-r from-primary/5 to-secondary/5 rounded-xl p-4">
                    <p className="text-sm text-neutral mb-2">
                      Need help understanding?
                    </p>
                    <a
                      href="#contact"
                      className="text-primary font-semibold hover:underline flex items-center gap-2"
                    >
                      <Mail size={16} />
                      Contact our legal team
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-3/4">
              <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden">
                {/* Terms Header */}
                <div className="bg-linear-to-r from-primary to-info p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Terms of Service Agreement
                      </h2>
                      <p className="text-gray-100">
                        Effective from {currentDateShow}
                      </p>
                    </div>
                    <div className="hidden md:block bg-white/20 p-3 rounded-xl">
                      <Shield size={32} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Terms Content */}
                <div className="p-8">
                  <div className="prose prose-lg max-w-none space-y-8">
                    <div className="mb-10">
                      <h3 className="text-xl font-bold text-info mb-4">
                        Introduction
                      </h3>
                      <p className="text-neutral">
                        Welcome to NagarNirman. These Terms of Service govern
                        your use of our platform and services. By accessing or
                        using NagarNirman, you agree to be bound by these terms.
                      </p>
                    </div>

                    {sections.map((section) => (
                      <div
                        key={section.id}
                        id={`section-${section.id}`}
                        ref={(el) => {
                          sectionRefs.current[section.id] = el;
                        }}
                        className={`border border-base-200 rounded-2xl overflow-hidden transition-all duration-300 ${expandedSections.includes(section.id)
                          ? 'ring-2 ring-primary/20'
                          : ''
                          }`}
                      >
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-6 bg-base-200 hover:bg-base-300 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-r from-primary to-info text-white font-bold">
                              {section.id}
                            </div>
                            <div className="text-left">
                              <h3 className="text-lg font-bold text-info">
                                {section.title}
                              </h3>
                              <p className="text-sm text-neutral mt-1">
                                Click to{' '}
                                {expandedSections.includes(section.id)
                                  ? 'collapse'
                                  : 'expand'}{' '}
                                section
                              </p>
                            </div>
                          </div>
                          <div className="text-neutral">
                            {expandedSections.includes(section.id) ? (
                              <ChevronUp size={24} />
                            ) : (
                              <ChevronDown size={24} />
                            )}
                          </div>
                        </button>

                        {expandedSections.includes(section.id) && (
                          <div className="p-6 bg-base-100">
                            <div className="text-neutral leading-relaxed">
                              {section.content}
                            </div>
                            {section.id === 3 && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-sm text-blue-800 font-medium">
                                  💡 Tip: Always use a strong, unique password
                                  and enable two-factor authentication when
                                  available.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 bg-linear-to-b from-base-100 to-base-300"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-info mb-4">
              Need Legal Assistance?
            </h2>
            <p className="text-neutral text-lg">
              Our legal team is here to help you understand our terms and
              address any concerns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <Mail size={24} />
              </div>
              <h4 className="font-bold text-info mb-2">General Support</h4>
              <p className="text-neutral text-sm mb-4">
                For general questions about terms
              </p>
              <a
                href="mailto:support@nagarnirman.com"
                className="text-primary font-semibold hover:underline"
              >
                support@nagarnirman.com
              </a>
            </div>

            <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <Scale size={24} />
              </div>
              <h4 className="font-bold text-info mb-2">Legal Department</h4>
              <p className="text-neutral text-sm mb-4">
                For formal legal inquiries
              </p>
              <a
                href="mailto:legal@nagarnirman.com"
                className="text-primary font-semibold hover:underline"
              >
                legal@nagarnirman.com
              </a>
            </div>

            <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <Phone size={24} />
              </div>
              <h4 className="font-bold text-info mb-2">Phone Support</h4>
              <p className="text-neutral text-sm mb-4">
                Available Monday-Friday, 9AM-6PM
              </p>
              <a
                href="tel:+8801950******"
                className="text-primary font-semibold hover:underline"
              >
                +880 1950 ******
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}