'use client';

import { useUserDashboardProtection } from '@/hooks/useRoleProtection';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useUserDashboardProtection();

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
