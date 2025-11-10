'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6FFF9] to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo/logo.png"
            alt="NagarNirman Logo"
            width={220}
            height={220}
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-[#002E2E] mb-6">
          NagarNirman
        </h1>

        <p className="text-2xl md:text-3xl text-[#81d586] font-semibold mb-4">
          Report. Resolve. Rebuild.
        </p>

        <p className="text-lg text-[#374151] max-w-2xl mx-auto mb-8">
          Empowering citizens to report infrastructure issues and work together
          with authorities to build smarter, cleaner, and more transparent cities across Bangladesh.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/reports/new">
                <Button variant="primary" size="lg">
                  Reports an Issue
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="secondary" size="lg">
                  View All Reports
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/register">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" size="lg">
                  Browse Reports
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[#002E2E] text-center mb-12">
          How NagarNirman Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#81d586] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-bold text-[#002E2E] mb-3">Report Issues</h3>
              <p className="text-[#6B7280]">
                Capture and submit infrastructure problems with photos, location, and details.
              </p>
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#aef452] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-[#002E2E] mb-3">Track Progress</h3>
              <p className="text-[#6B7280]">
                Monitor the status of reported issues from submission to resolution.
              </p>
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f2a921] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-[#002E2E] mb-3">See Results</h3>
              <p className="text-[#6B7280]">
                Celebrate solutions as problem solvers and authorities fix issues.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#002E2E] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#81d586] mb-2">64</p>
              <p className="text-gray-300">Districts Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#81d586] mb-2">1000+</p>
              <p className="text-gray-300">Issues Reported</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#81d586] mb-2">500+</p>
              <p className="text-gray-300">Issues Resolved</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#81d586] mb-2">100+</p>
              <p className="text-gray-300">Problem Solvers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Routes & Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-[#002E2E] text-center mb-12">
          Explore NagarNirman
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Public Routes */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              Public Access
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/reports" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Browse All Reports
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> About NagarNirman
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Contact Us
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Create Account
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Login
                </Link>
              </li>
            </ul>
          </Card>

          {/* Citizen Routes */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              For Citizens
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/user" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reports/new" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Report New Issue
                </Link>
              </li>
              <li>
                <Link href="/dashboard/user/my-reports" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> My Reports
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Apply as Solver
                </Link>
              </li>
              <li>
                <Link href="/dashboard/user/profile" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Profile Settings
                </Link>
              </li>
            </ul>
          </Card>

          {/* Authority Routes */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              For Authorities
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/authority" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Authority Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/authority/reports" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Manage Reports
                </Link>
              </li>
              <li>
                <Link href="/dashboard/authority/assign" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Assign Tasks
                </Link>
              </li>
              <li>
                <Link href="/dashboard/authority/solvers" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Manage Solvers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/authority/analytics" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> View Analytics
                </Link>
              </li>
            </ul>
          </Card>

          {/* Problem Solver Routes */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              For Problem Solvers
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/solver" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Solver Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/solver/tasks" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> My Tasks
                </Link>
              </li>
              <li>
                <Link href="/dashboard/solver/completed" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Completed Tasks
                </Link>
              </li>
              <li>
                <Link href="/dashboard/solver/leaderboard" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/solver/rewards" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> My Rewards
                </Link>
              </li>
            </ul>
          </Card>

          {/* Reports & Tracking */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Reports & Tracking
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/reports" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> All Reports
                </Link>
              </li>
              <li>
                <Link href="/reports?status=pending" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Pending Reports
                </Link>
              </li>
              <li>
                <Link href="/reports?status=inProgress" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> In Progress
                </Link>
              </li>
              <li>
                <Link href="/reports?status=resolved" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Resolved Issues
                </Link>
              </li>
              <li>
                <Link href="/reports/map" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Map View
                </Link>
              </li>
            </ul>
          </Card>

          {/* Help & Support */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              Help & Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> FAQ
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Reporting Guidelines
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#81d586] hover:underline flex items-center gap-2">
                  <span>→</span> Terms of Service
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-[#002E2E] mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-[#374151] mb-8 max-w-2xl mx-auto">
          Join thousands of citizens working together to improve Bangladesh&apos;s infrastructure.
          Your voice matters!
        </p>
        <Link href="/auth/register">
          <Button variant="primary" size="lg">
            Join NagarNirman Today
          </Button>
        </Link>
      </section>
    </div>
  );
}