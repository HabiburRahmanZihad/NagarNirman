'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function UserDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#002E2E] mb-2">
          Welcome, {user.name}!
        </h1>
        <p className="text-[#6B7280]">Manage your reports and track progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-[#002E2E] mb-2">My Reports</h3>
          <p className="text-3xl font-bold text-[#81d586] mb-2">0</p>
          <p className="text-sm text-[#6B7280]">Total issues reported</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-[#002E2E] mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-[#f2a921] mb-2">0</p>
          <p className="text-sm text-[#6B7280]">Issues being resolved</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-[#002E2E] mb-2">Resolved</h3>
          <p className="text-3xl font-bold text-[#aef452] mb-2">0</p>
          <p className="text-sm text-[#6B7280]">Successfully fixed</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-[#002E2E] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/reports/new">
              <Button variant="primary" className="w-full">
                Report New Issue
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="secondary" className="w-full">
                View All Reports
              </Button>
            </Link>
            <Link href="/dashboard/user/my-reports">
              <Button variant="outline" className="w-full">
                My Reports
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-[#002E2E] mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <p className="text-[#6B7280]">No recent activity</p>
            <p className="text-sm text-[#6B7280] mt-2">
              Start by reporting your first issue!
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-[#F6FFF9]">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="text-lg font-semibold text-[#002E2E] mb-2">
                Want to do more?
              </h3>
              <p className="text-[#6B7280] mb-4">
                Apply to become a Problem Solver and help fix issues in your community!
              </p>
              <Link href="/apply">
                <Button variant="accent" size="sm">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
