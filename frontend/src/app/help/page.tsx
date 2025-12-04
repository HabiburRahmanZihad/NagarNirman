"use client";

import React from 'react';
import { FaQuestionCircle, FaEnvelope, FaPhone } from 'react-icons/fa';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/constants/routes';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <FaQuestionCircle className="text-primary text-6xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-lg text-gray-600">
              We're here to help you make the most of NagarNirman
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How Can We Help You?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors">
                  <h3 className="text-xl font-semibold text-primary mb-3">Report an Issue</h3>
                  <p className="text-gray-600 mb-4">
                    Submit reports about civic problems in your area and help make your community better.
                  </p>
                  <Link href={PUBLIC_ROUTES.REPORT}>
                    <Button variant="primary" size="sm">
                      Start Reporting
                    </Button>
                  </Link>
                </div>

                <div className="bg-accent/5 p-6 rounded-xl border border-accent/20 hover:border-accent/40 transition-colors">
                  <h3 className="text-xl font-semibold text-accent mb-3">Become a Solver</h3>
                  <p className="text-gray-600 mb-4">
                    Join our community of problem solvers and help resolve issues in your area.
                  </p>
                  <Link href="/dashboard/user/join-as-a-Problem-Solver">
                    <Button variant="accent" size="sm">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Questions</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-6 py-3">
                  <h3 className="font-semibold text-gray-900 mb-2">How do I report a civic issue?</h3>
                  <p className="text-gray-600">
                    Click on "Report an Issue" from the navigation menu, fill in the details, add photos, and submit your report.
                  </p>
                </div>
                <div className="border-l-4 border-accent pl-6 py-3">
                  <h3 className="font-semibold text-gray-900 mb-2">How long does it take to resolve issues?</h3>
                  <p className="text-gray-600">
                    Resolution time varies depending on the complexity of the issue. You can track the progress from your dashboard.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6 py-3">
                  <h3 className="font-semibold text-gray-900 mb-2">Can I track my submitted reports?</h3>
                  <p className="text-gray-600">
                    Yes! Visit your dashboard to see all your submitted reports and their current status.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need More Help?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary w-14 h-14 flex items-center justify-center rounded-full">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                    <a href="mailto:support@nagarnirman.com" className="text-primary hover:text-accent transition-colors">
                      support@nagarnirman.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-accent w-14 h-14 flex items-center justify-center rounded-full">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                    <a href="tel:+8801950719346" className="text-primary hover:text-accent transition-colors">
                      +880 1950 719346
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center pt-6">
              <Link href={PUBLIC_ROUTES.FAQ}>
                <Button variant="outline" size="lg">
                  View All FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
