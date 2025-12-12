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

  const currentDateShow = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

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

  const toggleSection = (section: number) => {
    setExpandedSections((prev) => {
      if (prev.includes(section)) {
        return prev.filter((s) => s !== section);
      }
      return [section];
    });
  };

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

  const stats = [
    { number: '12', label: 'Key Sections', desc: 'Comprehensive coverage' },
    { number: '100%', label: 'Transparent', desc: 'Clear & simple language' },
    { number: '24/7', label: 'Support', desc: 'Always here to help' },
    { number: 'Legal', label: 'Protection', desc: 'Your rights matter' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
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
          <div className="absolute inset-0 bg-linear-to-r from-[#004d40]/90 via-[#004d40]/75 to-transparent"></div>
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
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-bold text-[#004d40] mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold text-gray-800 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">{stat.desc}</div>
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
              <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText size={20} className="text-[#004d40]" />
                  Quick Navigation
                </h3>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                        expandedSections.includes(section.id)
                          ? 'bg-linear-to-r from-[#004d40]/10 to-[#00796b]/10 border-l-4 border-[#004d40]'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            expandedSections.includes(section.id)
                              ? 'bg-[#004d40] text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {section.icon}
                        </div>
                        <span className="font-medium text-gray-700 text-sm">
                          {section.title}
                        </span>
                      </div>
                      <div
                        className={`p-1 rounded ${
                          expandedSections.includes(section.id)
                            ? 'bg-[#004d40] text-white'
                            : 'bg-gray-100 text-gray-600'
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

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-linear-to-r from-[#004d40]/5 to-[#00796b]/5 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Need help understanding?
                    </p>
                    <a
                      href="#contact"
                      className="text-[#004d40] font-semibold hover:underline flex items-center gap-2"
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
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Terms Header */}
                <div className="bg-linear-to-r from-[#004d40] to-[#00796b] p-8">
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
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Introduction
                      </h3>
                      <p className="text-gray-600">
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
                        className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
                          expandedSections.includes(section.id)
                            ? 'ring-2 ring-[#004d40]/20'
                            : ''
                        }`}
                      >
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-r from-[#004d40] to-[#00796b] text-white font-bold">
                              {section.id}
                            </div>
                            <div className="text-left">
                              <h3 className="text-lg font-bold text-gray-900">
                                {section.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Click to{' '}
                                {expandedSections.includes(section.id)
                                  ? 'collapse'
                                  : 'expand'}{' '}
                                section
                              </p>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            {expandedSections.includes(section.id) ? (
                              <ChevronUp size={24} />
                            ) : (
                              <ChevronDown size={24} />
                            )}
                          </div>
                        </button>

                        {expandedSections.includes(section.id) && (
                          <div className="p-6 bg-white">
                            <div className="text-gray-700 leading-relaxed">
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

                    {/* Agreement Section */}
                    <div className="mt-12 p-8 bg-linear-to-r from-[#004d40]/5 to-[#00796b]/5 rounded-2xl border border-[#004d40]/20">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <CheckCircle size={24} className="text-[#004d40]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Your Agreement
                          </h3>
                          <p className="text-gray-600 mb-4">
                            By continuing to use NagarNirman, you acknowledge
                            that you have read, understood, and agree to be
                            bound by these Terms of Service.
                          </p>
                          <div className="flex items-center gap-4">
                            <button className="px-8 py-3 bg-linear-to-r from-[#004d40] to-[#00796b] text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                              I Accept Terms
                            </button>
                            <button className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                              Save for Later
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
        className="py-16 bg-linear-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Need Legal Assistance?
            </h2>
            <p className="text-gray-600 text-lg">
              Our legal team is here to help you understand our terms and
              address any concerns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-[#e0f2f1] text-[#004d40] mb-4">
                <Mail size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">General Support</h4>
              <p className="text-gray-600 text-sm mb-4">
                For general questions about terms
              </p>
              <a
                href="mailto:support@nagarnirman.com"
                className="text-[#004d40] font-semibold hover:underline"
              >
                support@nagarnirman.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-[#e0f2f1] text-[#004d40] mb-4">
                <Scale size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Legal Department</h4>
              <p className="text-gray-600 text-sm mb-4">
                For formal legal inquiries
              </p>
              <a
                href="mailto:legal@nagarnirman.com"
                className="text-[#004d40] font-semibold hover:underline"
              >
                legal@nagarnirman.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-[#e0f2f1] text-[#004d40] mb-4">
                <Phone size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Phone Support</h4>
              <p className="text-gray-600 text-sm mb-4">
                Available Monday-Friday, 9AM-6PM
              </p>
              <a
                href="tel:+8801950719346"
                className="text-[#004d40] font-semibold hover:underline"
              >
                +880 1950 719346
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-linear-to-r from-[#004d40] to-[#00796b] py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-gray-100 text-lg mb-8">
              Thousands of citizens and problem solvers are already making
              cities better together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-[#004d40] font-bold rounded-xl hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all">
                Accept & Continue
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                Download PDF Copy
              </button>
            </div>
            <p className="text-gray-200 text-sm mt-8">
              By proceeding, you confirm acceptance of all terms and conditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
