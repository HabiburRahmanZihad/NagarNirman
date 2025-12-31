'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

type UserRole = 'user' | 'authority' | 'superAdmin' | 'problemSolver';


// Options for useRoleProtection hook
interface UseRoleProtectionOptions {
  allowedRoles: UserRole[];
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * Hook to protect routes based on user roles
 * Redirects to login if not authenticated
 * Redirects to appropriate dashboard if wrong role
 */
export const useRoleProtection = ({
  allowedRoles,
  redirectTo,
  showToast = true,
}: UseRoleProtectionOptions) => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Don't check while loading or if already redirected
    if (isLoading || hasRedirected.current) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      hasRedirected.current = true;
      if (showToast) {
        toast.error('Please login to access this page');
      }
      router.replace('/auth/login');
      return;
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(user.role as UserRole)) {
      hasRedirected.current = true;
      if (showToast) {
        toast.error('You do not have permission to access this page');
      }

      // Redirect to appropriate dashboard based on user's role
      const dashboardPath = redirectTo || getRoleDashboardPath(user.role);
      router.replace(dashboardPath);
      return;
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, redirectTo, router, showToast]);

  return {
    isLoading,
    isAuthorized: isAuthenticated && user && allowedRoles.includes(user.role as UserRole),
    user,
  };
};

/**
 * Get the appropriate dashboard path for a user role
 */
export const getRoleDashboardPath = (role: string): string => {
  switch (role) {
    case 'superAdmin':
      return '/dashboard/superAdmin';
    case 'authority':
      return '/dashboard/authority';
    case 'problemSolver':
      return '/dashboard/problemSolver';
    case 'user':
      return '/dashboard/user';

    default:
      return '/dashboard/user';
  }
};

/**
 * Hook to protect a specific user role's dashboard
 */
export const useUserDashboardProtection = () => {
  return useRoleProtection({ allowedRoles: ['user'] });
};

export const useAuthDashboardProtection = () => {
  return useRoleProtection({ allowedRoles: ['authority'] });
};

export const useSuperAdminDashboardProtection = () => {
  return useRoleProtection({ allowedRoles: ['superAdmin'] });
};

export const useProblemSolverDashboardProtection = () => {
  return useRoleProtection({ allowedRoles: ['problemSolver'] });
};



/**
 * Hook for routes that require authentication but allow multiple roles
 */
export const useAuthProtection = () => {
  return useRoleProtection({
    allowedRoles: ['user', 'authority', 'superAdmin', 'problemSolver'],
  });
};
