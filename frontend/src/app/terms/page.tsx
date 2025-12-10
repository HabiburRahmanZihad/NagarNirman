'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TermsPage() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(today);
  }, []);

  const toggleSection = (section: number) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
            alt="Legal background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004d40]/90 via-[#004d40]/75 to-transparent"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-100 mb-6">
              Understand our guidelines and commitments to you
            </p>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 inline-block">
              <p className="text-gray-100">
                <span className="font-semibold">Last Updated:</span> {currentDate || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Stats Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-2">17</div>
              <p className="text-gray-700 font-medium">Comprehensive Sections</p>
              <p className="text-gray-500 text-sm mt-1">Covering all aspects of our service</p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <p className="text-gray-700 font-medium">Transparent</p>
              <p className="text-gray-500 text-sm mt-1">Clear and understandable language</p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-gray-700 font-medium">Support Available</p>
              <p className="text-gray-500 text-sm mt-1">Questions? Contact our team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Terms & Conditions</h2>
            <p className="text-gray-600 text-lg">Review our comprehensive terms organized by category</p>
          </div>

          {/* Grid Layout 3:4 Format */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Categories List */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent p-6">
                  <h3 className="text-xl font-bold text-white">Categories</h3>
                </div>
                <div className="divide-y">
                  {[
                    { num: 1, title: 'Acceptance' },
                    { num: 2, title: 'Platform' },
                    { num: 3, title: 'Accounts' },
                    { num: 4, title: 'Usage' },
                    { num: 5, title: 'Solvers' },
                    { num: 6, title: 'Authority' },
                    { num: 7, title: 'IP Rights' },
                    { num: 8, title: 'Privacy' },
                    { num: 9, title: 'Liability' },
                    { num: 10, title: 'Indemnification' },
                    { num: 11, title: 'Termination' },
                    { num: 12, title: 'Governing Law' },
                  ].map((item) => (
                    <button
                      key={item.num}
                      onClick={() => toggleSection(item.num)}
                      className={`w-full px-4 py-3 text-left font-medium transition-all ${expandedSection === item.num
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.title}</span>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-semibold">
                          {item.num}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Content Area (4 columns worth) */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Section 1 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 1
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-primary px-6 py-4">
                    <h3 className="text-lg font-bold text-white">1. Acceptance of Terms</h3>
                  </div>
                  {expandedSection === 1 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        By accessing or using NagarNirman ("the Platform"), you agree to be bound by these
                        Terms of Service ("Terms"). If you do not agree to these Terms, please do not use
                        our Platform. We reserve the right to modify these Terms at any time, and your
                        continued use constitutes acceptance of such modifications.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 2 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 2
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-accent px-6 py-4">
                    <h3 className="text-lg font-bold text-white">2. Platform Description</h3>
                  </div>
                  {expandedSection === 2 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        NagarNirman is a comprehensive, community-driven platform that connects citizens
                        with qualified problem solvers to address civic issues and improve urban living
                        conditions. We facilitate the transparent reporting, assignment, and resolution of
                        civic problems while promoting community engagement and sustainable urban development.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 3 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 3
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-primary/80 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">3. User Accounts & Registration</h3>
                  </div>
                  {expandedSection === 3 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p className="font-semibold text-gray-900">Registration Requirements</p>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>Provide accurate, complete, and current information during registration</li>
                        <li>Maintain confidentiality of your account credentials</li>
                        <li>Must be at least 18 years old to create an account</li>
                        <li>One person may not maintain multiple accounts without authorization</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Section 4 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 4
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-accent/80 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">4. Acceptable Use Policy</h3>
                  </div>
                  {expandedSection === 4 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p className="font-semibold text-gray-900">Prohibited Conduct</p>
                      <p>You agree NOT to submit false information, harass other users, use offensive language, or violate any laws and regulations.</p>
                    </div>
                  )}
                </div>

                {/* Section 5 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 5
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-primary px-6 py-4">
                    <h3 className="text-lg font-bold text-white">5. Problem Solver Responsibilities</h3>
                  </div>
                  {expandedSection === 5 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p className="font-semibold text-gray-900">Professional Obligations</p>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>Complete assigned tasks professionally and efficiently</li>
                        <li>Provide regular and accurate updates on task progress</li>
                        <li>Follow all applicable safety regulations and quality standards</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Section 6 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 6
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-accent px-6 py-4">
                    <h3 className="text-lg font-bold text-white">6. Authority & Official Access</h3>
                  </div>
                  {expandedSection === 6 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        Verified government authorities have special privileges including access to all
                        reported civic issues in their jurisdiction and ability to assign problem solvers.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 7 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 7
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-primary/80 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">7. Intellectual Property Rights</h3>
                  </div>
                  {expandedSection === 7 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        The Platform and its original content are owned by NagarNirman and protected by
                        international copyright and intellectual property laws.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 8 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 8
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-accent/80 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">8. Privacy & Data Protection</h3>
                  </div>
                  {expandedSection === 8 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        Your use of the Platform is governed by our comprehensive Privacy Policy. We collect
                        and process data in compliance with applicable privacy laws and regulations.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 9 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 9
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-primary px-6 py-4">
                    <h3 className="text-lg font-bold text-white">9. Limitation of Liability</h3>
                  </div>
                  {expandedSection === 9 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We make no guarantees
                        regarding uninterrupted service or error-free operation.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 10 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 10
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-accent px-6 py-4">
                    <h3 className="text-lg font-bold text-white">10. Indemnification</h3>
                  </div>
                  {expandedSection === 10 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        You agree to indemnify and hold harmless NagarNirman from any claims arising from your
                        violation of these Terms or infringement of third-party rights.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 11 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 11
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-primary/80 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">11. Termination & Suspension</h3>
                  </div>
                  {expandedSection === 11 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        We reserve the right to suspend or terminate your account for conduct that violates
                        these Terms or is harmful to other users. You may terminate your account at any time.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 12 */}
                <div
                  className={`rounded-2xl shadow-md overflow-hidden transition-all transform ${expandedSection === 12
                      ? 'ring-2 ring-primary bg-white'
                      : 'bg-white hover:shadow-lg'
                    }`}
                >
                  <div className="bg-accent/80 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">12. Governing Law & Dispute Resolution</h3>
                  </div>
                  {expandedSection === 12 && (
                    <div className="px-6 py-5 text-gray-700 space-y-3">
                      <p>
                        These Terms are governed by the laws of Bangladesh. Any legal action shall be exclusively
                        brought in the courts located in Dhaka, Bangladesh.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Questions or Concerns?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-3">Email Support</p>
                <a href="mailto:support@nagarnirman.com" className="text-gray-900 hover:text-primary text-lg font-semibold break-all">
                  support@nagarnirman.com
                </a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-3">Legal Inquiries</p>
                <a href="mailto:legal@nagarnirman.com" className="text-gray-900 hover:text-primary text-lg font-semibold break-all">
                  legal@nagarnirman.com
                </a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-3">Phone</p>
                <a href="tel:+8801950719346" className="text-gray-900 hover:text-primary text-lg font-semibold">
                  +880 1950 719346
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Button Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Proceed?</h2>
          <p className="text-gray-100 text-lg mb-8 max-w-2xl mx-auto">
            By using NagarNirman, you confirm your acceptance of these Terms of Service. Click below to continue.
          </p>
          <button className="inline-block bg-white hover:bg-gray-100 transition-all px-12 py-4 rounded-lg text-primary font-bold text-lg shadow-lg hover:shadow-xl">
            I Agree to Terms of Service
          </button>
        </div>
      </section>
    </div>
  );
}
