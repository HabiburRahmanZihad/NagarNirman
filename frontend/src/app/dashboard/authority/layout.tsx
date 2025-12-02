'use client';

import { FullPageLoading } from '@/components/common';
import { useAuthDashboardProtection } from '@/hooks/useRoleProtection';

export default function AuthorityDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useAuthDashboardProtection();

  // Show loading state while checking authentication or if not authorized
  if (isLoading || !isAuthorized) {
    return <FullPageLoading text="Checking authorization..." />;
  }

  // Only render when authorized
  return <>{children}</>;
}
