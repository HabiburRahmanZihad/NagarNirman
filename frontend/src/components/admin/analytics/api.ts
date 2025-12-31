import { AnalyticsData, ExportFilters, Report } from './types';

// Dummy data for simulation
const dummyReports: Report[] = [
  {
    _id: "1",
    title: "Broken Street Lights",
    description: "Multiple street lights not working",
    images: ["https://example.com/image1.jpg"],
    problemType: "public property",
    severity: "high",
    status: "resolved",
    location: { address: "Main Road, Dhaka", district: "Dhaka", division: "Dhaka", coordinates: [90.4125, 23.8103] },
    createdAt: 1762824293831,
    updatedAt: 1762827500152,
    assignedTo: "solver1",
    history: []
  },
  {
    _id: "2",
    title: "Road Damage",
    description: "Large potholes on highway",
    images: ["https://example.com/image2.jpg"],
    problemType: "road issues",
    severity: "high",
    status: "inProgress",
    location: { address: "Highway, Chittagong", district: "Chittagong", division: "Chittagong", coordinates: [91.7832, 22.3569] },
    createdAt: 1762824293832,
    updatedAt: 1762827500153,
    assignedTo: "solver2",
    history: []
  },
  {
    _id: "3",
    title: "Garbage Pileup",
    description: "Garbage accumulating in market area",
    images: ["https://example.com/image3.jpg"],
    problemType: "sanitation",
    severity: "medium",
    status: "pending",
    location: { address: "Market Area, Sylhet", district: "Sylhet", division: "Sylhet", coordinates: [91.8720, 24.8949] },
    createdAt: 1762824293833,
    updatedAt: 1762827500154,
    assignedTo: null,
    history: []
  },
  {
    _id: "4",
    title: "Water Logging",
    description: "Severe water logging after rain",
    images: ["https://example.com/image4.jpg"],
    problemType: "drainage",
    severity: "high",
    status: "resolved",
    location: { address: "Residential Area, Rajshahi", district: "Rajshahi", division: "Rajshahi", coordinates: [88.6042, 24.3745] },
    createdAt: 1762824293834,
    updatedAt: 1762827500155,
    assignedTo: "solver3",
    history: []
  },
  {
    _id: "5",
    title: "Fire Hazard",
    description: "Electrical fire risk in building",
    images: ["https://example.com/image5.jpg"],
    problemType: "fire hazard",
    severity: "high",
    status: "resolved",
    location: { address: "Commercial Area, Khulna", district: "Khulna", division: "Khulna", coordinates: [89.5403, 22.8456] },
    createdAt: 1762824293835,
    updatedAt: 1762827500156,
    assignedTo: "solver1",
    history: []
  }
];

const divisions = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];
const districts = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh', 'Comilla', 'Noakhali', 'Jessore', 'Bogra'];
const categories = ['public property', 'road issues', 'sanitation', 'drainage', 'fire hazard', 'electrical', 'water supply'];
const solvers = ['solver1', 'solver2', 'solver3', 'solver4', 'solver5'];

// Simulated API functions
export const fetchReportAnalytics = async (): Promise<AnalyticsData> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const totalReports = dummyReports.length;
  const completedReports = dummyReports.filter(r => r.status === 'resolved').length;
  const ongoingReports = dummyReports.filter(r => r.status === 'inProgress').length;
  const completionRate = totalReports > 0 ? (completedReports / totalReports) * 100 : 0;

  const monthlyStats: { month: string; reports: number; completed: number }[] = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
    reports: 20 + (i * 7) % 31, // deterministic, not random
    completed: 10 + (i * 5) % 21
  }));

  const districtStats = districts.map(district => ({
    district,
    division: divisions[Math.floor(Math.random() * divisions.length)],
    reports: Math.floor(Math.random() * 40) + 5,
    completed: Math.floor(Math.random() * 25) + 2
  }));

  const categoryStats = categories.map(category => {
    const count = dummyReports.filter(r => r.problemType === category).length || Math.floor(Math.random() * 15) + 3;
    return {
      category,
      count,
      percentage: (count / totalReports) * 100
    };
  });

  const statusStats = [
    { status: 'pending', count: dummyReports.filter(r => r.status === 'pending').length, percentage: 20 },
    { status: 'inProgress', count: dummyReports.filter(r => r.status === 'inProgress').length, percentage: 30 },
    { status: 'resolved', count: dummyReports.filter(r => r.status === 'resolved').length, percentage: 50 }
  ];

  const solverPerformance = solvers.map(solverId => ({
    solverId,
    name: `Solver ${solverId.slice(-1)}`,
    completedTasks: Math.floor(Math.random() * 50) + 10,
    successRate: Math.floor(Math.random() * 30) + 70,
    avgResolutionTime: Math.floor(Math.random() * 72) + 12,
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
  }));

  return {
    totalReports,
    completedReports,
    ongoingReports,
    averageResolutionTime: 36.5,
    completionRate,
    monthlyStats,
    districtStats,
    categoryStats,
    statusStats,
    solverPerformance
  };
};


// Simulated export functions
export const generateCSV = (filters: ExportFilters): string => {
  const headers = ['Month', 'Total Reports', 'Completed', 'Completion Rate', 'Division', 'District'];
  const data = Array.from({ length: 12 }, (_, i) => [
    new Date(2024, i).toLocaleString('default', { month: 'short' }),
    Math.floor(Math.random() * 50) + 20,
    Math.floor(Math.random() * 30) + 10,
    `${Math.floor(Math.random() * 30) + 60}%`,
    filters.division,
    filters.district
  ]);

  return [headers, ...data].map(row =>
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
};


// Simulated PDF generation function
export const generatePDF = async (filters: ExportFilters): Promise<Blob> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const pdfContent = `
NAGARNIRMAN - PERFORMANCE ANALYTICS REPORT
===========================================

Report Period: ${filters.startDate.toDateString()} to ${filters.endDate.toDateString()}
Division: ${filters.division}
District: ${filters.district}

EXECUTIVE SUMMARY:
• Total Reports: 1,247
• Completed Reports: 893 (71.6%)
• Reports in Progress: 254
• Average Resolution Time: 36.5 hours
• Overall Completion Rate: 71.6%

CATEGORY BREAKDOWN:
• Public Property: 289 reports (23.1%)
• Road Issues: 356 reports (28.5%)
• Sanitation: 187 reports (15.0%)
• Drainage: 156 reports (12.5%)
• Fire Hazard: 89 reports (7.1%)
• Electrical: 98 reports (7.8%)
• Water Supply: 72 reports (5.8%)

TOP PERFORMING DISTRICTS:
1. Dhaka - 356 reports (75.0% completion)
2. Chittagong - 289 reports (68.5% completion)
3. Sylhet - 187 reports (72.2% completion)

PROBLEM SOLVER PERFORMANCE:
• Solver 1: 47 tasks (95% success rate)
• Solver 2: 63 tasks (98% success rate)
• Solver 3: 32 tasks (88% success rate)

Generated on: ${new Date().toLocaleString()}
This is a demo PDF export. Real implementation would include actual data and charts.
    `;

    const blob = new Blob([pdfContent], {
      type: 'application/pdf'
    });

    return blob;
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Blob(['PDF export service is currently unavailable. Please try again later.'], {
      type: 'application/pdf'
    });
  }
};