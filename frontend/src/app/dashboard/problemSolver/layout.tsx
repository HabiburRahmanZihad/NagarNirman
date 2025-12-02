'use client';

import { FullPageLoading } from '@/components/common';
import { useProblemSolverDashboardProtection } from '@/hooks/useRoleProtection';

export default function ProblemSolverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useProblemSolverDashboardProtection();

  // Show loading state while checking authentication or if not authorized
  if (isLoading || !isAuthorized) {
    return <FullPageLoading text="Checking authorization..." />;
  }

  // Only render when authorized
  return <>{children}</>;
}
