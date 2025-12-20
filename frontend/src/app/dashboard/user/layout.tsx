'use client';

import { FullPageLoading } from '@/components/common';
import { useUserDashboardProtection } from '@/hooks/useRoleProtection';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useUserDashboardProtection();

  // Show loading state while checking authentication or if not authorized
  if (isLoading || !isAuthorized) {
    return <FullPageLoading text="Checking authorization..." />;
  }

  // Only render when authorized
  return <>{children}</>;
}
