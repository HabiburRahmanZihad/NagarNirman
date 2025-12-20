'use client';

import { FullPageLoading } from '@/components/common';
import { useSuperAdminDashboardProtection } from '@/hooks/useRoleProtection';

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useSuperAdminDashboardProtection();

  // Show loading state while checking authentication or if not authorized
  if (isLoading || !isAuthorized) {
    return <FullPageLoading text="Checking authorization..." />;
  }

  // Only render when authorized
  return <>{children}</>;
}
