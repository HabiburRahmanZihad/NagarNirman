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
      const error = new Error(errorData.message || 'An error occurred');
      (error as any).status = response.status;
      (error as any).data = errorData;

      // Don't log expected 404 errors (like "No application found")
      if (response.status !== 404) {
        console.error('API Error:', error);
      }

      throw error;
    }

    return await response.json();
  } catch (error) {
    // Only log unexpected errors
    if (!(error as any).status) {
      console.error('Network Error:', error);
    }
    throw error;
  }
};

// Report API functions
export const reportAPI = {
  getAll: (filters?: { division?: string; district?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.division) params.append('division', filters.division);
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
  assign: (data: { title: string; description: string; report: string; assignedTo: string; priority?: string; deadline?: string }) => {
    return apiClient(API_ENDPOINTS.ASSIGN_TASK, {
      method: 'POST',
      body: JSON.stringify(data),
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

  getAll: (filters?: { status?: string; priority?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.TASKS}?${queryString}` : API_ENDPOINTS.TASKS;

    return apiClient(url, { requiresAuth: true });
  },

  getMyTasks: (limit: number = 100) => {
    return apiClient(`${API_ENDPOINTS.MY_TASKS}?limit=${limit}`, { requiresAuth: true });
  },

  updateStatus: (taskId: string, status: string) => {
    return apiClient(API_ENDPOINTS.UPDATE_TASK_STATUS(taskId), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      requiresAuth: true,
    });
  },

  getSolverStatistics: () => {
    return apiClient(API_ENDPOINTS.SOLVER_STATISTICS, { requiresAuth: true });
  },

  acceptTask: (taskId: string) => {
    return apiClient(API_ENDPOINTS.ACCEPT_TASK(taskId), {
      method: 'POST',
      requiresAuth: true,
    });
  },

  startTask: (taskId: string) => {
    return apiClient(API_ENDPOINTS.START_TASK(taskId), {
      method: 'POST',
      requiresAuth: true,
    });
  },

  submitProof: (taskId: string, data: { images: string[]; description: string }) => {
    return apiClient(API_ENDPOINTS.SUBMIT_PROOF(taskId), {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  getPendingReview: (filters: { page?: number; limit?: number; division?: string } = {}) => {
    const { page = 1, limit = 10, division } = filters;
    let url = `${API_ENDPOINTS.PENDING_REVIEW_TASKS}?page=${page}&limit=${limit}`;
    if (division) {
      url += `&division=${encodeURIComponent(division)}`;
    }
    return apiClient(url, {
      requiresAuth: true,
    });
  },

  approveTask: (taskId: string, data: { points?: number; rating?: number; feedback?: string }) => {
    return apiClient(API_ENDPOINTS.APPROVE_TASK(taskId), {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  rejectTask: (taskId: string, rejectionReason: string) => {
    return apiClient(API_ENDPOINTS.REJECT_TASK(taskId), {
      method: 'POST',
      body: JSON.stringify({ rejectionReason }),
      requiresAuth: true,
    });
  },

  getById: (taskId: string) => {
    return apiClient(API_ENDPOINTS.TASK_BY_ID(taskId), { requiresAuth: true });
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
  // Get SuperAdmin dashboard statistics
  getAdminDashboard: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/admin-dashboard`, { requiresAuth: true });
  },

  // Get comprehensive analytics data
  getAnalytics: async (filters?: { division?: string; startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams();
    if (filters?.division) params.append('division', filters.division);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = queryString
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/analytics?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/analytics`;

    const response: any = await apiClient(url, { requiresAuth: true });
    return response.data || response; // Extract data property if it exists
  },

  // Get complete map data with all divisions and districts
  getCompleteMapData: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/map`, { requiresAuth: false });
  },

  // Get all division-level statistics
  getAllDivisions: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/divisions`, { requiresAuth: false });
  },

  // Get district statistics for a specific division
  getDivisionDistricts: (division: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/divisions/${encodeURIComponent(division)}/districts`, { requiresAuth: false });
  },

  // Get complete statistics
  getCompleteStats: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/complete`, { requiresAuth: false });
  },

  // Get summary statistics
  getSummary: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/statistics/summary`, { requiresAuth: false });
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

  // Get all users (Authority only)
  getAllUsers: (filters?: { role?: string; division?: string; district?: string; approved?: boolean; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.division) params.append('division', filters.division);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.approved !== undefined) params.append('approved', filters.approved.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users`;

    return apiClient(url, { requiresAuth: true });
  },

  // Update user role (Authority only)
  updateUserRole: (userId: string, role: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
      requiresAuth: true,
    });
  },

  // Update user status (Authority only)
  updateUserStatus: (userId: string, isActive: boolean) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
      requiresAuth: true,
    });
  },

  // Delete user (Authority only)
  deleteUser: (userId: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userId}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  // Get all NGOs and Problem Solvers (Authority only)
  getSolvers: (filters?: { division?: string; district?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.division) params.append('division', filters.division);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/solvers?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/solvers`;

    return apiClient(url, { requiresAuth: true });
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

  // Update user role (SuperAdmin only)
  updateRole: (userId: string, newRole: 'user' | 'authority' | 'problemSolver' | 'ngo') => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
      requiresAuth: true,
    });
  },
};
