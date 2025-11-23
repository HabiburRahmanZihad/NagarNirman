'use client';

import { useSuperAdminDashboardProtection } from '@/hooks/useRoleProtection';

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useSuperAdminDashboardProtection();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a7d2f]"></div>
      </div>
    );
  }

  // Only render children if authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
