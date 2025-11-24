'use client';

import { useProblemSolverDashboardProtection } from '@/hooks/useRoleProtection';

export default function ProblemSolverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useProblemSolverDashboardProtection();

  // Show loading state while checking authentication or if not authorized
  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a7d2f]"></div>
      </div>
    );
  }

  // Only render when authorized
  return <>{children}</>;
}
