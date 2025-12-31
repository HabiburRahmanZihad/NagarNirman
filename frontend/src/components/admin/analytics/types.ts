import { HistoryEntry } from '@/types';


// Report interface representing a user-submitted report
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
  history: HistoryEntry[];
}



// Analytics data structures
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


// Individual analytics data types
export interface MonthlyStat {
  month: string;
  reports: number;
  completed: number;
}



// Individual district statistics
export interface DistrictStat {
  district: string;
  division: string;
  reports: number;
  completed: number;
}


// Individual category statistics
export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}


// Individual status statistics
export interface StatusStat {
  status: string;
  count: number;
  percentage: number;
}


// Individual solver performance statistics
export interface SolverPerformance {
  solverId: string;
  name: string;
  completedTasks: number;
  successRate: number;
  avgResolutionTime: number;
  rating: number;
}


// Export filters interface
export interface ExportFilters {
  startDate: Date;
  endDate: Date;
  division: string;
  district: string;
}