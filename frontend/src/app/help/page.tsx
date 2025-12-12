'use client';

import Button from '@/components/common/Button';
import { PUBLIC_ROUTES } from '@/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

export default function HelpPage() {
  const currentDateShow = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* -------- the hero section placed here => start -------- */}
      <section className="relative overflow-hidden mb-10">
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
              Help
            </h1>
            <p className="text-xl text-gray-100 mb-6">
              Get clear guidance and support for using NagarNirman effectively
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
      <div className="container mx-auto px-4 max-w-4xl mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-5">
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How Can We Help You?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors">
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    Report an Issue
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Submit reports about civic problems in your area and help
                    make your community better.
                  </p>
                  <Link href={PUBLIC_ROUTES.REPORT}>
                    <Button variant="primary" size="sm">
                      Start Reporting
                    </Button>
                  </Link>
                </div>

                <div className="bg-accent/5 p-6 rounded-xl border border-accent/20 hover:border-accent/40 transition-colors">
                  <h3 className="text-xl font-semibold text-accent mb-3">
                    Become a Solver
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Join our community of problem solvers and help resolve
                    issues in your area.
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Common Questions
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-6 py-3">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How do I report a civic issue?
                  </h3>
                  <p className="text-gray-600">
                    {`Click on "Report an Issue" from the navigation menu, fill in`}
                    the details, add photos, and submit your report.
                  </p>
                </div>
                <div className="border-l-4 border-accent pl-6 py-3">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How long does it take to resolve issues?
                  </h3>
                  <p className="text-gray-600">
                    Resolution time varies depending on the complexity of the
                    issue. You can track the progress from your dashboard.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6 py-3">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I track my submitted reports?
                  </h3>
                  <p className="text-gray-600">
                    Yes! Visit your dashboard to see all your submitted reports
                    and their current status.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Need More Help?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary w-14 h-14 flex items-center justify-center rounded-full">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Email Support
                    </h3>
                    <a
                      href="mailto:support@nagarnirman.com"
                      className="text-primary hover:text-accent transition-colors"
                    >
                      support@nagarnirman.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-accent w-14 h-14 flex items-center justify-center rounded-full">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Phone Support
                    </h3>
                    <a
                      href="tel:+8801950719346"
                      className="text-primary hover:text-accent transition-colors"
                    >
                      +880 1950 719346
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center pt-6">
              <Link href={PUBLIC_ROUTES.FAQ}>
                <Button variant="outline" size="lg">
                  <span className='text-primary'>View All FAQs</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
