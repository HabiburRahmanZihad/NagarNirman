'use client';

import { Button } from '@/components/common';
import Image from 'next/image';
import { useMemo } from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function GuidelinesPage() {
  const currentDateShow = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <div className="min-h-screen bg-base-300 pb-20">
      {/* -------- the hero section placed here => start -------- */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dfm0bhtyb/image/upload/v1765627352/foc48enu2qo9vf4dcfqt.jpg"
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
              Community Guidelines & Standards
            </h1>
            <p className="text-xl text-gray-100 mb-6">
              Clear rules, responsibilities, and ethical standards to ensure
              safe, accurate, and respectful civic engagement.
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
      {/* -------- the hero section placed here => end -------- */}

      <div className="container mx-auto px-4">
        <div className="bg-base-100 rounded-2xl shadow-lg p-8 md:p-12 border border-base-200">
          <div className="space-y-12">
            {/* Reporting Guidelines - Side by Side Layout */}
            <section>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-info mb-2">
                  📝 Reporting Guidelines
                </h2>
                <div className="h-1 w-24 bg-primary rounded-full"></div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Do Column */}
                <div className="bg-base-300 border border-base-200 rounded-xl p-6 shadow-sm h-full">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <FaCheckCircle className="text-primary text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-info text-lg mb-3">
                        Do:
                      </h3>
                      <ul className="space-y-2.5 text-neutral">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                          <span>Provide accurate and detailed information about the issue</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                          <span>Include clear photos showing the problem</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                          <span>Specify the exact location using our map tool</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                          <span>Select the appropriate category for your report</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                          <span>Be respectful and constructive in your descriptions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                          <span>Follow up on your reports through the dashboard</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Don't Column */}
                <div className="bg-base-300 border border-base-200 rounded-xl p-6 shadow-sm h-full">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-full">
                      <FaExclamationTriangle className="text-accent text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-info text-lg mb-3">
                        {`Don't`}:
                      </h3>
                      <ul className="space-y-2.5 text-neutral">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                          <span>Submit false or misleading reports</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                          <span>Use offensive or inappropriate language</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                          <span>Report private property issues without authorization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                          <span>Duplicate reports for the same issue</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                          <span>Share personal information of others without consent</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                          <span>Use the platform for non-civic related complaints</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Problem Solver Guidelines */}
            <section>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-info mb-2">
                  🛠️ Problem Solver Guidelines
                </h2>
                <div className="h-1 w-24 bg-secondary rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-base-300 border-l-4 border-primary p-6 rounded-r-xl rounded-l-lg shadow-sm">
                  <h3 className="font-semibold text-info text-lg mb-4">
                    Professional Conduct
                  </h3>
                  <ul className="space-y-3 text-neutral">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                      <span>Respond to assigned tasks promptly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                      <span>Maintain professionalism in all interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                      <span>Provide regular updates on task progress</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                      <span>Complete tasks within the agreed timeline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                      <span>Submit proof of completion with clear photos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                      <span>Respect community members and their property</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-base-300 border-l-4 border-secondary p-6 rounded-r-xl rounded-l-lg shadow-sm">
                  <h3 className="font-semibold text-info text-lg mb-4">
                    Quality Standards
                  </h3>
                  <ul className="space-y-3 text-neutral">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                      <span>Follow safety protocols and regulations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                      <span>Use appropriate tools and materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                      <span>Ensure work meets quality standards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                      <span>Clean up work area after completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                      <span>Report any complications or challenges immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                      <span>Be open to feedback and improvements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Code of Conduct */}
            <section>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-info mb-2">
                  ⚖️ Code of Conduct
                </h2>
                <div className="h-1 w-24 bg-primary rounded-full"></div>
              </div>

              <div className="bg-base-300 p-8 rounded-xl border border-base-200 shadow-sm">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                      <span className="text-primary font-bold">R</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-info mb-1">Respect</h4>
                      <p className="text-neutral">
                        Treat all community members with respect and dignity. Discrimination,
                        harassment, or bullying will not be tolerated.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                      <span className="text-primary font-bold">I</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-info mb-1">Integrity</h4>
                      <p className="text-neutral">
                        Be honest and transparent in all your interactions. Report issues
                        accurately and complete tasks with integrity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                      <span className="text-primary font-bold">P</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-info mb-1">Privacy</h4>
                      <p className="text-neutral">
                        Respect the privacy of others. Do not share personal information
                        or photos of individuals without their consent.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                      <span className="text-primary font-bold">C</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-info mb-1">Collaboration</h4>
                      <p className="text-neutral">
                        Work together to build a better community. Support others and
                        share knowledge constructively.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                      <span className="text-primary font-bold">A</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-info mb-1">Accountability</h4>
                      <p className="text-neutral">
                        Take responsibility for your actions and commitments. Follow
                        through on tasks and reports you initiate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Violations and Consequences */}
            <section>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-info mb-2">
                  ⚠️ Violations and Consequences
                </h2>
                <div className="h-1 w-24 bg-accent rounded-full"></div>
              </div>

              <div className="bg-base-300 border border-accent/20 p-8 rounded-xl shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <FaExclamationTriangle className="text-accent text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-info text-lg mb-2">
                      Violations of these guidelines may result in:
                    </h3>
                    <p className="text-neutral">
                      We take guideline violations seriously to maintain a safe and
                      productive community environment.
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-neutral">
                  <li className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-accent font-bold">1</span>
                    </div>
                    <span>Warning notification</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-accent font-bold">2</span>
                    </div>
                    <span>Temporary account suspension</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-accent font-bold">3</span>
                    </div>
                    <span>Removal from problem solver program</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-accent font-bold">4</span>
                    </div>
                    <span>Permanent account termination</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-accent font-bold">5</span>
                    </div>
                    <span>Legal action in cases of serious violations</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-linear-to-br from-base-300 to-primary/5 border border-primary/20 p-10 rounded-2xl text-center shadow-sm">
              <div className="max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-info mb-4">
                  Questions or Concerns?
                </h2>
                <p className="text-neutral mb-8">
                  If you have questions about these guidelines or need to report a
                  violation, please contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button>
                    <a
                      href="mailto:support@nagarnirman.com"

                    >
                      Email Support
                    </a>
                  </Button>

                  <Button>
                    <a
                      href="/contact"
                    >
                      Contact Form
                    </a>
                  </Button>

                </div>
                <p className="text-sm text-neutral mt-6">
                  We typically respond within 24 hours
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}