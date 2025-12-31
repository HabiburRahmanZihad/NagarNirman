import { API_ENDPOINTS } from '@/constants';
import { getAuthToken } from './helpers';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

// Typed API error with optional status and data fields
type ApiError = Error & { status?: number; data?: unknown };


// Type guard to check if error has status property
function hasStatus(err: unknown): err is { status?: number } {
  return typeof err === 'object' && err !== null && 'status' in err;
}


// Generic API client function
export const apiClient = async <T = unknown>(
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
    // Ensure endpoint is a valid string
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint provided to apiClient');
    }

    const response = await fetch(endpoint, {
      ...restOptions,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = ((errorData as unknown) as { message?: string })?.message ?? 'An error occurred';
      const apiError = Object.assign(new Error(message), { status: response.status, data: errorData }) as ApiError;

      // Don't log expected 404 errors (like "No application found")
      if (response.status !== 404) {
        console.error('API Error:', apiError);
      }

      throw apiError;
    }

    const data = await response.json();
    return data || {};
  } catch (error) {
    // Only log unexpected errors (errors without a status)
    if (!hasStatus(error) || !error.status) {
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
    if (filters?.page !== undefined && filters?.page !== null) params.append('page', String(filters.page));
    if (filters?.limit !== undefined && filters?.limit !== null) params.append('limit', String(filters.limit));

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

  getTaskStatistics: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/tasks/statistics/counts`, { requiresAuth: true });
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

    const response = await apiClient(url, { requiresAuth: true });
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: unknown }).data ?? response;
    }
    return response; // Extract data property if it exists
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
  updateProfile: (data: Record<string, unknown>) => {
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
    if (filters?.approved !== undefined) params.append('approved', String(filters.approved));
    if (filters?.page !== undefined && filters?.page !== null) params.append('page', String(filters.page));
    if (filters?.limit !== undefined && filters?.limit !== null) params.append('limit', String(filters.limit));

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

  // Get all Problem Solvers (Authority only)
  getSolvers: (filters?: { division?: string; district?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.division) params.append('division', filters.division);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.page !== undefined && filters?.page !== null) params.append('page', String(filters.page));
    if (filters?.limit !== undefined && filters?.limit !== null) params.append('limit', String(filters.limit));

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
  applyAsProblemSolver: (data: Record<string, unknown>) => {
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

  // Delete user's rejected application
  deleteMyApplication: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/my-application`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  // Get all applications (Authority only)
  getAllApplications: (filters?: { status?: string; division?: string; district?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.division) params.append('division', filters.division);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.page !== undefined && filters?.page !== null) params.append('page', String(filters.page));
    if (filters?.limit !== undefined && filters?.limit !== null) params.append('limit', String(filters.limit));

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
  updateRole: (userId: string, newRole: 'user' | 'authority' | 'problemSolver') => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
      requiresAuth: true,
    });
  },
};

// Notification API functions
export const notificationAPI = {
  // Get user's notifications with pagination and filters
  getAll: (filters?: { page?: number; limit?: number; unreadOnly?: boolean; type?: string }) => {
    return (async () => {
      try {
        let queryString = '';

        if (filters) {
          try {
            const params = new URLSearchParams();

            if (typeof filters.page === 'number' && filters.page > 0) {
              params.append('page', filters.page.toString());
            }
            if (typeof filters.limit === 'number' && filters.limit > 0) {
              params.append('limit', filters.limit.toString());
            }
            if (filters.unreadOnly === true) {
              params.append('unreadOnly', 'true');
            }
            if (typeof filters.type === 'string' && filters.type.trim().length > 0) {
              params.append('type', filters.type.trim());
            }

            queryString = params.toString();
          } catch (paramError) {
            console.error('Error building query parameters:', paramError);
            queryString = '';
          }
        }

        const url = queryString
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications?${queryString}`
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications`;

        const resp = await apiClient(url, { requiresAuth: true });
        // Normalize common responses: if API returns ApiResponse with data array, extract it.
        if (!resp) return [];
        if (Array.isArray(resp)) return resp;
        if (typeof resp === 'object' && 'data' in resp) return (resp as { data?: unknown }).data ?? resp;
        return resp;
      } catch (error) {
        // Network or other errors: fail gracefully and return empty array to callers
        console.error('Error in notificationAPI.getAll:', error);
        return [];
      }
    })();
  },

  // Get unread notification count
  getUnreadCount: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/unread-count`, {
      requiresAuth: true,
    });
  },

  // Mark notification as read
  markAsRead: (notificationId: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      requiresAuth: true,
    });
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/mark-all-read`, {
      method: 'PUT',
      requiresAuth: true,
    });
  },

  // Delete a notification
  delete: (notificationId: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  // Delete all notifications
  deleteAll: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/all`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};

// Leaderboard API
export const leaderboardAPI = {
  // Get full leaderboard
  getLeaderboard: () => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leaderboard`, {
      method: 'GET',
    });
  },

  // Get filtered and paginated leaderboard
  getFiltered: (params: {
    page?: number;
    limit?: number;
    district?: string;
    division?: string;
    sortBy?: 'points' | 'streak' | 'completed' | 'rating';
  }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.district) searchParams.append('district', params.district);
    if (params.division) searchParams.append('division', params.division);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);

    return apiClient(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leaderboard/filtered?${searchParams}`,
      {
        method: 'GET',
      }
    );
  },

  // Get user's rank and nearby competitors
  getUserRank: (userId: string) => {
    return apiClient(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leaderboard/rank/${userId}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Get district leaderboard
  getDistrictLeaderboard: (district: string, limit = 50) => {
    return apiClient(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leaderboard/district/${district}?limit=${limit}`,
      {
        method: 'GET',
      }
    );
  },
};
