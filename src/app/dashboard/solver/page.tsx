'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';

export default function SolverDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'problemSolver' && user?.role !== 'ngo'))) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

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
          Problem Solver Dashboard
        </h1>
        <p className="text-[#6B7280]">Manage your assigned tasks and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-[#6B7280] mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-[#002E2E]">0</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-[#6B7280] mb-2">Pending</h3>
          <p className="text-3xl font-bold text-[#f2a921]">0</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-[#6B7280] mb-2">Completed</h3>
          <p className="text-3xl font-bold text-[#81d586]">0</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-[#6B7280] mb-2">Points</h3>
          <p className="text-3xl font-bold text-[#aef452]">{user.points || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-[#002E2E] mb-4">Assigned Tasks</h2>
          <div className="text-center py-8">
            <p className="text-[#6B7280]">No tasks assigned yet</p>
            <p className="text-sm text-[#6B7280] mt-2">
              Check back later for new assignments
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-[#002E2E] mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <p className="text-[#6B7280]">No recent activity</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
