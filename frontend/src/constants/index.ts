// Constants for NagarNirman

export const COLORS = {
  primary: '#81d586',
  secondary: '#aef452',
  accent: '#f2a921',
  neutral: '#6B7280',
  bg1: '#FFFFFF',
  bg2: '#F3F4F6',
  bg3: '#F6FFF9',
  textHeading: '#002E2E',
  textBody: '#374151',
} as const;

export const PROBLEM_TYPES = [
  {
    value: 'road_infrastructure',
    label: 'Road & Infrastructure',
    subcategories: ['Broken roads', 'Potholes', 'Damaged footpaths', 'Blocked drains']
  },
  {
    value: 'lighting_electrical',
    label: 'Lighting & Electrical',
    subcategories: ['Faulty streetlights', 'Exposed wires', 'Broken traffic signals']
  },
  {
    value: 'garbage_sanitation',
    label: 'Garbage & Sanitation',
    subcategories: ['Overflowing bins', 'Illegal dumping', 'Unremoved waste', 'Dirty spaces']
  },
  {
    value: 'water_supply',
    label: 'Water Supply & Leakage',
    subcategories: ['Pipe leaks', 'Low pressure', 'Unrepaired tanks']
  },
  {
    value: 'public_facilities',
    label: 'Public Facilities',
    subcategories: ['Damaged benches', 'Broken playgrounds', 'Public toilet issues']
  },
  {
    value: 'environmental',
    label: 'Environmental Hazards',
    subcategories: ['Waterlogging', 'Air pollution', 'Noise pollution']
  },
  {
    value: 'safety',
    label: 'Safety Issues',
    subcategories: ['Unmarked construction', 'Unsafe crossings', 'Broken fences']
  },
  {
    value: 'health_hygiene',
    label: 'Health & Hygiene',
    subcategories: ['Mosquito breeding', 'Unclean markets']
  },
  {
    value: 'transport',
    label: 'Transport',
    subcategories: ['Broken bus stops', 'Unmaintained cycle lanes', 'Inaccessible walkways']
  },
  {
    value: 'other',
    label: 'Other',
    subcategories: []
  }
] as const;

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  ME: `${API_BASE_URL}/api/auth/me`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,

  // Users
  APPLY_PROBLEM_SOLVER: `${API_BASE_URL}/api/users/apply-problem-solver`,
  USERS: `${API_BASE_URL}/api/users`,
  USER_BY_ID: (id: string) => `${API_BASE_URL}/api/users/${id}`,
  USER_STATS: (id: string) => `${API_BASE_URL}/api/users/${id}/stats`,
  APPROVE_USER: (id: string) => `${API_BASE_URL}/api/users/${id}/approve`,
  UPDATE_USER_STATUS: (id: string) => `${API_BASE_URL}/api/users/${id}/status`,
  LEADERBOARD: `${API_BASE_URL}/api/users/leaderboard`,

  // Reports
  REPORTS: `${API_BASE_URL}/api/reports`,
  REPORT_BY_ID: (id: string) => `${API_BASE_URL}/api/reports/${id}`,
  UPDATE_REPORT_STATUS: (id: string) => `${API_BASE_URL}/api/reports/${id}/status`,
  ADD_COMMENT: (id: string) => `${API_BASE_URL}/api/reports/${id}/comment`,
  UPVOTE_REPORT: (id: string) => `${API_BASE_URL}/api/reports/${id}/upvote`,

  // Tasks
  TASKS: `${API_BASE_URL}/api/tasks`,
  MY_TASKS: `${API_BASE_URL}/api/tasks/my-tasks`,
  TASK_BY_ID: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
  ASSIGN_TASK: `${API_BASE_URL}/api/tasks/assign`,
  UPDATE_TASK_STATUS: (id: string) => `${API_BASE_URL}/api/tasks/${id}/status`,
  COMPLETE_TASK: (id: string) => `${API_BASE_URL}/api/tasks/${id}/complete`,
  GRANT_REWARD: (id: string) => `${API_BASE_URL}/api/tasks/${id}/reward`,
  SOLVER_STATISTICS: `${API_BASE_URL}/api/tasks/statistics/solvers`,
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'nn_auth_token',
  USER: 'nn_user',
} as const;
