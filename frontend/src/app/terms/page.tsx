"use client";

import React from 'react';
import { FaFileContract } from 'react-icons/fa';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <FaFileContract className="text-primary text-6xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: December 4, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using NagarNirman ("the Platform"), you agree to be bound by these
                Terms of Service ("Terms"). If you do not agree to these Terms, please do not use
                our Platform. We reserve the right to modify these Terms at any time, and your
                continued use constitutes acceptance of such modifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Platform Description</h2>
              <p className="text-gray-700 leading-relaxed">
                NagarNirman is a community-driven platform that connects citizens with problem
                solvers to address civic issues and improve urban living conditions. We facilitate
                the reporting, assignment, and resolution of civic problems while promoting
                community engagement and sustainable urban development.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-primary mb-3">3.1 Registration</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>You must provide accurate and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One person may not maintain multiple accounts</li>
                <li>You are responsible for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3">3.2 Account Security</h3>
              <p className="text-gray-700 leading-relaxed">
                You agree to immediately notify us of any unauthorized use of your account or
                any other breach of security. We will not be liable for any loss or damage arising
                from your failure to comply with these security obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>

              <h3 className="text-xl font-semibold text-accent mb-3">4.1 Acceptable Use</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Submit false, misleading, or fraudulent reports</li>
                <li>Harass, threaten, or harm other users</li>
                <li>Use offensive, discriminatory, or inappropriate language</li>
                <li>Violate any local, national, or international laws</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Interfere with or disrupt the Platform's operation</li>
                <li>Use automated systems to access the Platform without permission</li>
                <li>Collect or store personal data about other users</li>
              </ul>

              <h3 className="text-xl font-semibold text-accent mb-3 mt-6">4.2 Content Guidelines</h3>
              <p className="text-gray-700 leading-relaxed">
                All content you submit must comply with our Community Guidelines. We reserve
                the right to remove any content that violates these Terms or is otherwise
                objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Problem Solver Terms</h2>

              <h3 className="text-xl font-semibold text-primary mb-3">5.1 Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Complete assigned tasks professionally and within agreed timelines</li>
                <li>Provide accurate updates on task progress</li>
                <li>Submit proof of completion with clear documentation</li>
                <li>Maintain professional conduct at all times</li>
                <li>Follow safety regulations and quality standards</li>
                <li>Report any complications or issues immediately</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">5.2 Verification</h3>
              <p className="text-gray-700 leading-relaxed">
                Problem solvers must undergo verification by authorities. We reserve the right
                to approve or reject applications and to revoke solver status at any time for
                violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-accent mb-3">6.1 Platform Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Platform and its original content, features, and functionality are owned by
                NagarNirman and are protected by international copyright, trademark, and other
                intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-accent mb-3">6.2 User Content</h3>
              <p className="text-gray-700 leading-relaxed">
                You retain ownership of content you submit. However, by submitting content, you
                grant us a worldwide, non-exclusive, royalty-free license to use, reproduce,
                modify, and display such content for the purpose of operating and improving the
                Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Your use of the Platform is also governed by our Privacy Policy. Please review
                our Privacy Policy to understand our practices regarding your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE PLATFORM WILL BE ERROR-FREE,
                UNINTERRUPTED, OR FREE FROM HARMFUL COMPONENTS. WE DO NOT GUARANTEE THE QUALITY OR
                TIMING OF ISSUE RESOLUTION.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NAGARNIRMAN SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
                PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA,
                USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time, with or
                without notice, for conduct that we believe violates these Terms or is harmful
                to other users, us, or third parties, or for any other reason at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of
                Bangladesh, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of
                any material changes by posting the updated Terms on this page and updating the
                "Last updated" date. Your continued use of the Platform after such changes
                constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
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

            <section className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
              <p className="text-gray-700 font-medium">
                By using NagarNirman, you acknowledge that you have read, understood, and agree
                to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
