import { API_ENDPOINTS } from '@/constants';
import { getAuthToken } from './helpers';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiClient = async <T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { requiresAuth = false, headers = {}, ...restOptions } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(endpoint, {
      ...restOptions,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'An error occurred');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Report API functions
export const reportAPI = {
  getAll: (filters?: { district?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.district) params.append('district', filters.district);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.REPORTS}?${queryString}` : API_ENDPOINTS.REPORTS;

    return apiClient(url, { requiresAuth: true });
  },

  getById: (id: string) => {
    return apiClient(API_ENDPOINTS.REPORT_BY_ID(id), { requiresAuth: true });
  },

  create: (data: FormData) => {
    return apiClient(API_ENDPOINTS.REPORTS, {
      method: 'POST',
      body: data,
      requiresAuth: true,
      headers: {}, // Don't set Content-Type for FormData
    });
  },

  updateStatus: (id: string, status: string) => {
    return apiClient(API_ENDPOINTS.UPDATE_REPORT_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      requiresAuth: true,
    });
  },
};

// Task API functions
export const taskAPI = {
  assign: (reportId: string, assignedTo: string) => {
    return apiClient(API_ENDPOINTS.ASSIGN_TASK, {
      method: 'POST',
      body: JSON.stringify({ reportId, assignedTo }),
      requiresAuth: true,
    });
  },

  complete: (taskId: string, proofURL: string) => {
    return apiClient(API_ENDPOINTS.COMPLETE_TASK(taskId), {
      method: 'POST',
      body: JSON.stringify({ taskId, proofURL }),
      requiresAuth: true,
    });
  },
};

// Map API functions
export const mapAPI = {
  getAllDivisions: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/map/divisions`);
  },

  getDivisionStats: (division: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/map/divisions/${encodeURIComponent(division)}`);
  },

  getDistrictStats: (district: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/map/districts/${encodeURIComponent(district)}`);
  },
};

// Statistics API functions - Comprehensive statistics with all report states
export const statisticsAPI = {
  // Get complete map data with all divisions and districts
  getCompleteMapData: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/map`);
  },

  // Get all division-level statistics
  getAllDivisions: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/divisions`);
  },

  // Get district statistics for a specific division
  getDivisionDistricts: (division: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/divisions/${encodeURIComponent(division)}/districts`);
  },

  // Get complete statistics
  getCompleteStats: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/complete`);
  },

  // Get summary statistics
  getSummary: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/summary`);
  },
};

// User Profile API functions
export const userAPI = {
  // Get user profile
  getProfile: (userId: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userId}`, {
      requiresAuth: true,
    });
  },

  // Update user profile
  updateProfile: (data: any) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Get user statistics
  getUserStats: (userId: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userId}/stats`, {
      requiresAuth: true,
    });
  },
};

// Problem Solver Application API functions
export const problemSolverAPI = {
  // Submit application
  applyAsProblemSolver: (data: any) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/apply-problem-solver`, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Get user's own application
  getMyApplication: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/my-application`, {
      requiresAuth: true,
    });
  },

  // Get all applications (Authority only)
  getAllApplications: (filters?: { status?: string; division?: string; district?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.division) params.append('division', filters.division);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/applications/all?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/applications/all`;

    return apiClient(url, { requiresAuth: true });
  },

  // Get application details (Authority only)
  getApplicationById: (id: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/applications/${id}`, {
      requiresAuth: true,
    });
  },

  // Review application (Authority only)
  reviewApplication: (id: string, status: 'approved' | 'rejected', reviewNote?: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/applications/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNote }),
      requiresAuth: true,
    });
  },
};
