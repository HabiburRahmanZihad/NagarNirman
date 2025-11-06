import { STORAGE_KEYS } from '@/constants';

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
  return null;
};

// Format date to readable string
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get status badge color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'inProgress':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get role badge color
export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'user':
      return 'bg-blue-100 text-blue-800';
    case 'authority':
      return 'bg-purple-100 text-purple-800';
    case 'problemSolver':
      return 'bg-green-100 text-green-800';
    case 'ngo':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format role name
export const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    user: 'Citizen',
    authority: 'City Authority',
    problemSolver: 'Problem Solver',
    ngo: 'NGO',
  };
  return roleMap[role] || role;
};

// Format status name
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    completed: 'Completed',
  };
  return statusMap[status] || status;
};
