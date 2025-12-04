"use client";

import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
            <p className="text-lg text-gray-600">
              Building a better community together through collaboration and respect
            </p>
          </div>

          <div className="space-y-10">
            {/* Reporting Guidelines */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span>📝</span> Reporting Guidelines
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg">
                  <FaCheckCircle className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Do:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Provide accurate and detailed information about the issue</li>
                      <li>• Include clear photos showing the problem</li>
                      <li>• Specify the exact location using our map tool</li>
                      <li>• Select the appropriate category for your report</li>
                      <li>• Be respectful and constructive in your descriptions</li>
                      <li>• Follow up on your reports through the dashboard</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-red-50 p-4 rounded-lg">
                  <FaExclamationTriangle className="text-red-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Don't:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Submit false or misleading reports</li>
                      <li>• Use offensive or inappropriate language</li>
                      <li>• Report private property issues without authorization</li>
                      <li>• Duplicate reports for the same issue</li>
                      <li>• Share personal information of others without consent</li>
                      <li>• Use the platform for non-civic related complaints</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Problem Solver Guidelines */}
            <section>
              <h2 className="text-2xl font-bold text-accent mb-6 flex items-center gap-3">
                <span>🛠️</span> Problem Solver Guidelines
              </h2>

              <div className="space-y-4">
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Professional Conduct</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Respond to assigned tasks promptly</li>
                    <li>• Maintain professionalism in all interactions</li>
                    <li>• Provide regular updates on task progress</li>
                    <li>• Complete tasks within the agreed timeline</li>
                    <li>• Submit proof of completion with clear photos</li>
                    <li>• Respect community members and their property</li>
                  </ul>
                </div>

                <div className="bg-accent/5 border-l-4 border-accent p-6 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Quality Standards</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Follow safety protocols and regulations</li>
                    <li>• Use appropriate tools and materials</li>
                    <li>• Ensure work meets quality standards</li>
                    <li>• Clean up work area after completion</li>
                    <li>• Report any complications or challenges immediately</li>
                    <li>• Be open to feedback and improvements</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Code of Conduct */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span>⚖️</span> Code of Conduct
              </h2>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Respect:</strong> Treat all community members with respect and dignity.
                    Discrimination, harassment, or bullying will not be tolerated.
                  </p>
                  <p>
                    <strong>Integrity:</strong> Be honest and transparent in all your interactions.
                    Report issues accurately and complete tasks with integrity.
                  </p>
                  <p>
                    <strong>Privacy:</strong> Respect the privacy of others. Do not share personal
                    information or photos of individuals without their consent.
                  </p>
                  <p>
                    <strong>Collaboration:</strong> Work together to build a better community.
                    Support others and share knowledge constructively.
                  </p>
                  <p>
                    <strong>Accountability:</strong> Take responsibility for your actions and
                    commitments. Follow through on tasks and reports you initiate.
                  </p>
                </div>
              </div>
            </section>

            {/* Violations and Consequences */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span>⚠️</span> Violations and Consequences
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                <p className="text-gray-700 mb-4">
                  Violations of these guidelines may result in:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Warning notification</li>
                  <li>• Temporary account suspension</li>
                  <li>• Removal from problem solver program</li>
                  <li>• Permanent account termination</li>
                  <li>• Legal action in cases of serious violations</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="text-center bg-primary/5 border border-primary/20 p-8 rounded-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Questions or Concerns?
              </h2>
              <p className="text-gray-600 mb-4">
                If you have questions about these guidelines or need to report a violation,
                please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@nagarnirman.com"
                  className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-accent transition-colors duration-300 inline-block"
                >
                  Email Support
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
