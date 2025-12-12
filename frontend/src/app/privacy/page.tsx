// added here a hero section only

"use client";

import Image from 'next/image';
import React, { useMemo } from 'react';
import { FaShieldAlt } from 'react-icons/fa';

export default function PrivacyPage() {
  const currentDateShow = useMemo(() => {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
            alt="Legal background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#004d40]/90 via-[#004d40]/75 to-transparent"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy & Data Protection
            </h1>
            <p className="text-xl text-gray-100 mb-6">
             How we collect, use, secure, and protect your personal information with full transparency and accountability.
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <FaShieldAlt className="text-primary text-6xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: December 4, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                {`NagarNirman ("we," "our," or "us") is committed to protecting your privacy.`}
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our platform. Please read this privacy policy carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-primary mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Name and contact information (email, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Profile information and preferences</li>
                <li>Location data for reported issues</li>
                <li>Photos and descriptions of civic issues</li>
                <li>Communication with us and other users</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Usage data and interaction with the platform</li>
                <li>Geographic location (with your permission)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To provide, maintain, and improve our services</li>
                <li>To process and manage your reports and tasks</li>
                <li>To communicate with you about your account and activities</li>
                <li>To match problem solvers with reported issues</li>
                <li>To ensure platform security and prevent fraud</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To comply with legal obligations</li>
                <li>To send notifications and updates (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>

              <h3 className="text-xl font-semibold text-accent mb-3">4.1 With Other Users</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Certain information is visible to other platform users:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Report locations and issue details are publicly visible on the map</li>
                <li>Your name may be visible to assigned problem solvers</li>
                <li>Problem solver profiles are visible to authorities</li>
              </ul>

              <h3 className="text-xl font-semibold text-accent mb-3 mt-6">4.2 With Authorities</h3>
              <p className="text-gray-700 leading-relaxed">
                We share necessary information with local authorities and verified problem
                solvers to facilitate issue resolution.
              </p>

              <h3 className="text-xl font-semibold text-accent mb-3 mt-6">4.3 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose your information if required by law or in response to valid
                legal processes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to
                protect your personal information. However, no method of transmission over
                the Internet is 100% secure. We use encryption, secure servers, and regular
                security assessments to safeguard your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access and review your personal information</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the
                purposes outlined in this privacy policy, unless a longer retention period is
                required by law. Completed reports may be retained for statistical and archival
                purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{`8. Children's Privacy`}</h2>
              <p className="text-gray-700 leading-relaxed">
                Our platform is not intended for users under the age of 18. We do not knowingly
                collect personal information from children. If you believe we have collected
                information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any
                significant changes by posting the new policy on this page and updating the
                {"Last updated"} date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions or concerns about this privacy policy or our data practices,
                please contact us:
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> <a href="mailto:support@nagarnirman.com" className="text-primary hover:text-accent">support@nagarnirman.com</a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> <a href="tel:+8801950719346" className="text-primary hover:text-accent">+880 1950 719346</a>
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Dhaka, Bangladesh
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
