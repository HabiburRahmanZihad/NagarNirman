export interface Report {
  _id: string;
  title: string;
  description: string;
  images: string[];
  problemType: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'inProgress' | 'resolved' | 'closed';
  location: {
    address: string;
    district: string;
    division: string;
    coordinates: [number, number];
  };
  createdAt: number;
  updatedAt: number;
  assignedTo: string | null;
  history: any[];
}

export interface AnalyticsData {
  totalReports: number;
  completedReports: number;
  ongoingReports: number;
  averageResolutionTime: number;
  completionRate: number;
  monthlyStats: MonthlyStat[];
  districtStats: DistrictStat[];
  categoryStats: CategoryStat[];
  statusStats: StatusStat[];
  solverPerformance: SolverPerformance[];
}

export interface MonthlyStat {
  month: string;
  reports: number;
  completed: number;
}

export interface DistrictStat {
  district: string;
  division: string;
  reports: number;
  completed: number;
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface StatusStat {
  status: string;
  count: number;
  percentage: number;
}

export interface SolverPerformance {
  solverId: string;
  name: string;
  completedTasks: number;
  successRate: number;
  avgResolutionTime: number;
  rating: number;
}

export interface ExportFilters {
  startDate: Date;
  endDate: Date;
  division: string;
  district: string;
}