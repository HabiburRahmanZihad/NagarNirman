// Navigation and route constants for easy reference

export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  REPORT: '/report',
  REPORT_MAP: '/report/map',
  HELP: '/help',
  FAQ: '/faq',
  GUIDELINES: '/guidelines',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
} as const;

export const USER_ROUTES = {
  DASHBOARD: '/dashboard/user',
  PROFILE: '/dashboard/user/profile',
  MY_REPORTS: '/dashboard/user/my-report',
  NOTIFICATIONS: '/dashboard/user/notifications',
  APPLY: '/apply',
} as const;

export const AUTHORITY_ROUTES = {
  DASHBOARD: '/dashboard/authority',
  OVERVIEW: '/dashboard/authority/overview',
  PROFILE: '/dashboard/authority/profile',
  REPORTS: '/dashboard/authority/report',
  REPORTS_PENDING: '/dashboard/authority/report/pending',
  REPORTS_IN_PROGRESS: '/dashboard/authority/report/in-progress',
  REPORTS_RESOLVED: '/dashboard/authority/report/resolved',
  ASSIGN: '/dashboard/authority/assign',
  TASKS: '/dashboard/authority/tasks',
  SOLVERS: '/dashboard/authority/solvers',
  APPLICATIONS: '/dashboard/authority/applications',
  USERS: '/dashboard/authority/users',
  ANALYTICS: '/dashboard/authority/analytics',
  EXPORT: '/dashboard/authority/reports/export',
} as const;

export const SOLVER_ROUTES = {
  DASHBOARD: '/dashboard/solver',
  PROFILE: '/dashboard/solver/profile',
  TASKS: '/dashboard/solver/tasks',
  TASKS_PENDING: '/dashboard/solver/tasks/pending',
  TASKS_IN_PROGRESS: '/dashboard/solver/tasks/in-progress',
  COMPLETED: '/dashboard/solver/completed',
  LEADERBOARD: '/dashboard/solver/leaderboard',
  REWARDS: '/dashboard/solver/rewards',
  STATISTICS: '/dashboard/solver/statistics',
  HISTORY: '/dashboard/solver/history',
} as const;

export const REPORT_ROUTES = {
  LIST: '/report',
  NEW: '/report/new',
  DETAIL: (id: string) => `/report/${id}`,
  EDIT: (id: string) => `/report/${id}/edit`,
  // Filtered routes
  BY_STATUS: (status: string) => `/report?status=${status}`,
  BY_DISTRICT: (district: string) => `/report?district=${district}`,
  BY_CATEGORY: (category: string) => `/report?category=${category}`,
} as const;

// All routes combined
export const ROUTES = {
  ...PUBLIC_ROUTES,
  AUTH: AUTH_ROUTES,
  USER: USER_ROUTES,
  AUTHORITY: AUTHORITY_ROUTES,
  SOLVER: SOLVER_ROUTES,
  REPORT: REPORT_ROUTES,
} as const;

// Helper function to check if a route requires authentication
export const requiresAuth = (path: string): boolean => {
  return path.startsWith('/dashboard') || path === '/report/new' || path === '/apply';
};

// Helper function to get role-specific dashboard route
export const getDashboardRoute = (role: string): string => {
  switch (role) {
    case 'authority':
      return AUTHORITY_ROUTES.DASHBOARD;
    case 'problemSolver':
    case 'ngo':
      return SOLVER_ROUTES.DASHBOARD;
    default:
      return USER_ROUTES.DASHBOARD;
  }
};
