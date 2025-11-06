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

export const DISTRICTS = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet',
  'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj',
  'Tangail', 'Jamalpur', 'Sherpur', 'Netrokona', 'Kishoreganj',
  'Narsingdi', 'Manikganj', 'Munshiganj', 'Faridpur', 'Gopalganj',
  'Madaripur', 'Shariatpur', 'Rajbari', 'Pabna', 'Sirajganj',
  'Bogra', 'Natore', 'Naogaon', 'Joypurhat', 'Chapai Nawabganj',
  'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari', 'Feni',
  'Lakshmipur', 'Noakhali', 'Brahmanbaria', 'Chandpur', 'Jessore',
  'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Chuadanga', 'Jhenaidah',
  'Satkhira', 'Bagerhat', 'Pirojpur', 'Jhalokati', 'Patuakhali',
  'Barguna', 'Bhola', 'Dinajpur', 'Thakurgaon', 'Panchagarh',
  'Nilphamari', 'Lalmonirhat', 'Kurigram', 'Gaibandha', 'Habiganj',
  'Moulvibazar', 'Sunamganj'
] as const;

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

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/users/register',
  LOGIN: '/api/users/login',
  PROFILE: '/api/users/profile',
  APPLY_PROBLEM_SOLVER: '/api/users/apply-problem-solver',

  // Reports
  REPORTS: '/api/reports',
  REPORT_BY_ID: (id: string) => `/api/reports/${id}`,
  UPDATE_REPORT_STATUS: (id: string) => `/api/reports/${id}/status`,

  // Tasks
  TASKS: '/api/tasks',
  ASSIGN_TASK: '/api/tasks/assign',
  COMPLETE_TASK: '/api/tasks/complete',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'nn_auth_token',
  USER: 'nn_user',
} as const;
