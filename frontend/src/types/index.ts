// Type definitions for NagarNirman

export type UserRole = 'user' | 'authority' | 'problemSolver' | 'superAdmin';

export type ReportStatus = 'pending' | 'inProgress' | 'resolved';

export type TaskStatus = 'pending' | 'inProgress' | 'completed';

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

export interface Location {
  city: string;
  district: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Comment {
  user: string; // User ID
  comment: string;
  date: Date;
}

export interface HistoryEntry {
  status: string;
  updatedBy: string; // User ID
  date: Date;
}

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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  division: string;
  district: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

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
export interface UserOnboardingStep {
  icon: React.ComponentType<{ className?: string }>
  step: string
  title: string
  description: string
  color: string
}

export interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}

export interface TimelineStep {
  step: number
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  align: 'left' | 'right'
}

export interface ProblemTypeCard {
  icon: React.ComponentType<{ className?: string }> | string
  title: string
  description: string
  color: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface Milestone {
  year: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}