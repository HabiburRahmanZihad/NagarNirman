// Type definitions for NagarNirman

export type UserRole = 'user' | 'authority' | 'problemSolver' | 'superAdmin';

export type ReportStatus = 'pending' | 'inProgress' | 'resolved';

export type TaskStatus = 'pending' | 'inProgress' | 'completed';


// User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; // Only in forms, not in responses
  role: UserRole;
  district: string;
  phone?: string;
  division?: string;
  address?: string;
  profilePicture?: string;
  points?: number;
  approved?: boolean; // for NGO/problemSolver applications
  isActive?: boolean;
  createdAt?: string | Date;
}



// Location interface
export interface Location {
  city: string;
  district: string;
  coordinates: [number, number]; // [longitude, latitude]
}


// Comment interface
export interface Comment {
  user: string; // User ID
  comment: string;
  date: Date;
}


// History entry interface
export interface HistoryEntry {
  status: string;
  updatedBy: string; // User ID
  date: Date;
}


// Report interface
export interface Report {
  _id: string;
  title: string;
  description: string;
  photoURL: string;
  location: Location;
  status: ReportStatus;
  createdBy: string; // User ID
  assignedTo?: string; // Problem solver/NGO ID
  history: HistoryEntry[];
  upvotes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt?: Date;
}


// Task interface
export interface Task {
  _id: string;
  reportId: string;
  assignedTo: string; // Problem solver/NGO ID
  status: TaskStatus;
  proofURL?: string;
  rewardGranted?: boolean;
  completedAt?: Date;
  createdAt?: Date;
}


// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data interface
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  division: string;
  district: string;
  role?: UserRole;
}



// Auth response interface
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}


// Standard API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Standard paginated response used across admin/list endpoints
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit?: number;
    totalPages?: number;
  };
  message?: string;
  error?: string;
}

// User onboarding step interface
export interface UserOnboardingStep {
  icon: React.ComponentType<{ className?: string }>
  step: string
  title: string
  description: string
  color: string
}


// Feature card interface
export interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}


// Timeline step interface
export interface TimelineStep {
  step: number
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  align: 'left' | 'right'
}


// Problem type card interface
export interface ProblemTypeCard {
  icon: React.ComponentType<{ className?: string }> | string
  title: string
  description: string
  color: string
}


// FAQ item interface
export interface FAQItem {
  question: string
  answer: string
}



// Milestone interface
export interface Milestone {
  year: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}