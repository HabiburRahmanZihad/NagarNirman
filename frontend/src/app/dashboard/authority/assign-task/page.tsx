// src/app/dashboard/authority/assign-task/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface Report {
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
  upvotes: string[];
  comments: any[];
  createdBy: string;
  assignedTo: string | null;
  history: {
    status: string;
    note: string;
    updatedBy: string;
    date: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ProblemSolver {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  division: string;
  district: string;
  address: string;
  profession: string;
  organization: string;
  skills: string[];
  motivation: string;
  experience: string;
  profileImage: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  appliedAt: string;
  rating: number;
  completedTasks: number;
  successRate: number;
  points: number;
  avgResolutionTime: number;
}

// Multiple dummy users for testing
const dummyUsers = [
  // {
  //   _id: "69112fcd36bb614c42ffc6a1",
  //   name: "Habibur Rahman",
  //   email: "habib@zihad.com",
  //   password: "$2a$10$/rDOIFGsvdw766f60h1AJesssSKph91qy0twANDHjmKSTEyzHrPMi",
  //   role: "authority",
  //   division: "Chittagong",
  //   district: "Chandpur",
  //   points: 1000,
  //   approved: true,
  //   isActive: true,
  //   avatar: "",
  //   createdAt: "2025-11-10T00:20:29.651+00:00",
  //   updatedAt: "2025-11-10T00:20:29.651+00:00"
  // },
  {
    _id: "69112fcd36bb614c42ffc6a66",
    name: "Rahim Khan",
    email: "rahim@khan.com",
    password: "$2a$10$/rDOIFGsvdw766f60h1AJesssSKph91qy0twANDHjmKSTEyzHrPMi",
    role: "authority",
    division: "Dhaka",
    district: "Narayanganj",
    points: 1000,
    approved: true,
    isActive: true,
    avatar: "",
    createdAt: "2025-11-10T00:20:29.651+00:00",
    updatedAt: "2025-11-10T00:20:29.651+00:00"
  }
];

// All reports data
const allReports: Report[] = [
  // Chandpur reports
  {
    _id: "69183427faef057a765604bd",
    title: "Water Logging in Chandpur City",
    description: "Severe water logging in main city area after heavy rainfall",
    images: ["https://i.ibb.co/1t68tQsW/Moana-Nunez-nid.png"],
    problemType: "water logging",
    severity: "high",
    status: "pending",
    location: {
      address: "City Center, Chandpur, Chittagong",
      district: "Chandpur",
      division: "Chittagong",
      coordinates: [90.7667, 23.2500]
    },
    upvotes: [],
    comments: [],
    createdBy: "6918336cfaef057a765604b8",
    assignedTo: null,
    history: [{
      status: "pending",
      note: "Report submitted",
      updatedBy: "6918336cfaef057a765604b8",
      date: "2025-11-15T08:04:55.362Z"
    }],
    createdAt: "2025-11-15T08:04:55.362Z",
    updatedAt: "2025-11-15T08:04:55.362Z"
  },
  {
    _id: "69183427faef057a765604be",
    title: "Broken Bridge in Rural Area",
    description: "Bridge connecting two villages is broken and needs immediate repair",
    images: ["https://i.ibb.co/1t68tQsW/Moana-Nunez-nid.png"],
    problemType: "infrastructure",
    severity: "high",
    status: "pending",
    location: {
      address: "Village Road, Chandpur, Chittagong",
      district: "Chandpur",
      division: "Chittagong",
      coordinates: [90.8000, 23.3000]
    },
    upvotes: [],
    comments: [],
    createdBy: "6918336cfaef057a765604b8",
    assignedTo: null,
    history: [{
      status: "pending",
      note: "Report submitted",
      updatedBy: "6918336cfaef057a765604b8",
      date: "2025-11-15T08:04:55.362Z"
    }],
    createdAt: "2025-11-15T08:04:55.362Z",
    updatedAt: "2025-11-15T08:04:55.362Z"
  },
  // Barishal reports
  {
    _id: "69183427faef057a765604bf",
    title: "Flooded Roads in Barishal",
    description: "Main roads flooded due to poor drainage system",
    images: ["https://i.ibb.co/1t68tQsW/Moana-Nunez-nid.png"],
    problemType: "water logging",
    severity: "high",
    status: "pending",
    location: {
      address: "Main Road, Barishal, Barishal",
      district: "Barishal",
      division: "Barishal",
      coordinates: [90.3667, 22.7000]
    },
    upvotes: [],
    comments: [],
    createdBy: "6918336cfaef057a765604b8",
    assignedTo: null,
    history: [{
      status: "pending",
      note: "Report submitted",
      updatedBy: "6918336cfaef057a765604b8",
      date: "2025-11-15T08:04:55.362Z"
    }],
    createdAt: "2025-11-15T08:04:55.362Z",
    updatedAt: "2025-11-15T08:04:55.362Z"
  },
  {
    _id: "69183427faef057a765604bg",
    title: "Garbage Pileup in Barishal Market",
    description: "Large garbage accumulation in central market",
    images: ["https://i.ibb.co/1t68tQsW/Moana-Nunez-nid.png"],
    problemType: "garbage",
    severity: "medium",
    status: "pending",
    location: {
      address: "Central Market, Barishal, Barishal",
      district: "Barishal",
      division: "Barishal",
      coordinates: [90.3500, 22.7500]
    },
    upvotes: [],
    comments: [],
    createdBy: "6918336cfaef057a765604b8",
    assignedTo: null,
    history: [{
      status: "pending",
      note: "Report submitted",
      updatedBy: "6918336cfaef057a765604b8",
      date: "2025-11-15T08:04:55.362Z"
    }],
    createdAt: "2025-11-15T08:04:55.362Z",
    updatedAt: "2025-11-15T08:04:55.362Z"
  },
  // Narayanganj reports
  {
    _id: "69183427faef057a765604bh",
    title: "Industrial Waste in Narayanganj",
    description: "Industrial waste dumping in residential areas",
    images: ["https://i.ibb.co/1t68tQsW/Moana-Nunez-nid.png"],
    problemType: "pollution",
    severity: "high",
    status: "pending",
    location: {
      address: "Industrial Zone, Narayanganj, Dhaka",
      district: "Narayanganj",
      division: "Dhaka",
      coordinates: [90.5000, 23.6167]
    },
    upvotes: [],
    comments: [],
    createdBy: "6918336cfaef057a765604b8",
    assignedTo: null,
    history: [{
      status: "pending",
      note: "Report submitted",
      updatedBy: "6918336cfaef057a765604b8",
      date: "2025-11-15T08:04:55.362Z"
    }],
    createdAt: "2025-11-15T08:04:55.362Z",
    updatedAt: "2025-11-15T08:04:55.362Z"
  },
  {
    _id: "69183427faef057a765604bi",
    title: "Traffic Congestion in Narayanganj",
    description: "Severe traffic congestion during peak hours",
    images: ["https://i.ibb.co/1t68tQsW/Moana-Nunez-nid.png"],
    problemType: "traffic",
    severity: "medium",
    status: "pending",
    location: {
      address: "Main Highway, Narayanganj, Dhaka",
      district: "Narayanganj",
      division: "Dhaka",
      coordinates: [90.5167, 23.6333]
    },
    upvotes: [],
    comments: [],
    createdBy: "6918336cfaef057a765604b8",
    assignedTo: null,
    history: [{
      status: "pending",
      note: "Report submitted",
      updatedBy: "6918336cfaef057a765604b8",
      date: "2025-11-15T08:04:55.362Z"
    }],
    createdAt: "2025-11-15T08:04:55.362Z",
    updatedAt: "2025-11-15T08:04:55.362Z"
  }
];

// All problem solvers data
const allProblemSolvers: ProblemSolver[] = [
  // Chandpur problem solvers
  {
    _id: "691833a1faef057a765604bd",
    userId: "6918336cfaef057a765604c2",
    fullName: "Karimullah Ahmed",
    email: "karimullah@example.com",
    phone: "+880 1711-223344",
    division: "Chittagong",
    district: "Chandpur",
    address: "Chandpur Town, Chandpur",
    profession: "Civil Engineer",
    organization: "Chandpur Development Society",
    skills: ["infrastructure", "construction", "project management"],
    motivation: "Working for the development of Chandpur district",
    experience: "5 years in civil engineering",
    profileImage: null,
    status: "approved",
    reviewedBy: "admin123",
    reviewedAt: "2025-11-15T09:00:00.000Z",
    reviewNote: "Local expert in Chandpur",
    appliedAt: "2025-11-12T09:00:00.000Z",
    rating: 4.6,
    completedTasks: 42,
    successRate: 89,
    points: 1450,
    avgResolutionTime: 22
  },
  {
    _id: "691833a1faef057a765604be",
    userId: "6918336cfaef057a765604c3",
    fullName: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "+880 1811-334455",
    division: "Chittagong",
    district: "Chandpur",
    address: "Hazariganj, Chandpur",
    profession: "Environmental Specialist",
    organization: "Green Chandpur Initiative",
    skills: ["environment", "water management", "community development"],
    motivation: "Passionate about environmental issues in Chandpur",
    experience: "4 years in environmental science",
    profileImage: null,
    status: "approved",
    reviewedBy: "admin123",
    reviewedAt: "2025-11-15T09:00:00.000Z",
    reviewNote: "Environmental specialist",
    appliedAt: "2025-11-11T09:00:00.000Z",
    rating: 4.4,
    completedTasks: 38,
    successRate: 85,
    points: 1200,
    avgResolutionTime: 26
  },
  // Barishal problem solvers
  {
    _id: "691833a1faef057a765604bf",
    userId: "6918336cfaef057a765604c4",
    fullName: "Abdul Malek",
    email: "malek@example.com",
    phone: "+880 1712-445566",
    division: "Barishal",
    district: "Barishal",
    address: "Barishal City, Barishal",
    profession: "Urban Planner",
    organization: "Barishal Development Authority",
    skills: ["urban planning", "infrastructure", "community development"],
    motivation: "Dedicated to improving Barishal city infrastructure",
    experience: "6 years in urban planning",
    profileImage: null,
    status: "approved",
    reviewedBy: "admin123",
    reviewedAt: "2025-11-15T09:00:00.000Z",
    reviewNote: "Expert in urban development",
    appliedAt: "2025-11-10T09:00:00.000Z",
    rating: 4.7,
    completedTasks: 51,
    successRate: 92,
    points: 1750,
    avgResolutionTime: 20
  },
  {
    _id: "691833a1faef057a765604bg",
    userId: "6918336cfaef057a765604c5",
    fullName: "Fatema Begum",
    email: "fatema@example.com",
    phone: "+880 1812-556677",
    division: "Barishal",
    district: "Barishal",
    address: "Sadar Road, Barishal",
    profession: "Environmental Engineer",
    organization: "Clean Barishal Project",
    skills: ["environment", "waste management", "public health"],
    motivation: "Committed to making Barishal cleaner and healthier",
    experience: "4 years in environmental engineering",
    profileImage: null,
    status: "approved",
    reviewedBy: "admin123",
    reviewedAt: "2025-11-15T09:00:00.000Z",
    reviewNote: "Environmental engineering expert",
    appliedAt: "2025-11-09T09:00:00.000Z",
    rating: 4.5,
    completedTasks: 45,
    successRate: 88,
    points: 1550,
    avgResolutionTime: 24
  },
  // Narayanganj problem solvers
  {
    _id: "691833a1faef057a765604bh",
    userId: "6918336cfaef057a765604c6",
    fullName: "Rafiqul Islam",
    email: "rafiq@example.com",
    phone: "+880 1713-667788",
    division: "Dhaka",
    district: "Narayanganj",
    address: "Narayanganj Industrial Area",
    profession: "Industrial Engineer",
    organization: "Narayanganj Development Board",
    skills: ["industrial management", "pollution control", "infrastructure"],
    motivation: "Working to solve industrial problems in Narayanganj",
    experience: "7 years in industrial engineering",
    profileImage: null,
    status: "approved",
    reviewedBy: "admin123",
    reviewedAt: "2025-11-15T09:00:00.000Z",
    reviewNote: "Industrial problems specialist",
    appliedAt: "2025-11-08T09:00:00.000Z",
    rating: 4.8,
    completedTasks: 58,
    successRate: 94,
    points: 1950,
    avgResolutionTime: 18
  },
  {
    _id: "691833a1faef057a765604bi",
    userId: "6918336cfaef057a765604c7",
    fullName: "Shamima Akter",
    email: "shamima@example.com",
    phone: "+880 1813-778899",
    division: "Dhaka",
    district: "Narayanganj",
    address: "Bandar, Narayanganj",
    profession: "Traffic Management Specialist",
    organization: "Narayanganj Traffic Control",
    skills: ["traffic management", "urban planning", "public transport"],
    motivation: "Solving traffic issues in Narayanganj",
    experience: "5 years in traffic management",
    profileImage: null,
    status: "approved",
    reviewedBy: "admin123",
    reviewedAt: "2025-11-15T09:00:00.000Z",
    reviewNote: "Traffic management expert",
    appliedAt: "2025-11-07T09:00:00.000Z",
    rating: 4.6,
    completedTasks: 47,
    successRate: 90,
    points: 1650,
    avgResolutionTime: 21
  }
];

const AssignTaskPage = () => {
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(authUser || dummyUsers[0]);
  const [reports, setReports] = useState<Report[]>([]);
  const [problemSolvers, setProblemSolvers] = useState<ProblemSolver[]>([]);
  const [filters, setFilters] = useState({
    division: '',
    district: '',
    status: 'pending',
    severity: ''
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedSolver, setSelectedSolver] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'points' | 'completedTasks' | 'successRate'>('rating');

  // Update current user when auth user changes
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  // Get user info
  const isAuthorityUser = currentUser?.role === 'authority';
  const userDistrict = currentUser?.district;
  const userDivision = currentUser?.division;

  // Auto-set filters based on user's location
  useEffect(() => {
    if (isAuthorityUser && userDistrict && userDivision) {
      setFilters({
        division: userDivision,
        district: userDistrict,
        status: 'pending',
        severity: ''
      });
    }
  }, [isAuthorityUser, userDistrict, userDivision]);

  // Load data based on user's district
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Filter reports based on user's district
        let filteredReports = allReports;
        if (isAuthorityUser && userDistrict) {
          filteredReports = allReports.filter(report => 
            report.location.district === userDistrict
          );
        }
        setReports(filteredReports);
        
        // Filter problem solvers based on user's district
        let filteredSolvers = allProblemSolvers.filter(solver => solver.status === 'approved');
        if (isAuthorityUser && userDistrict) {
          filteredSolvers = filteredSolvers.filter(solver => 
            solver.district === userDistrict
          );
        }
        
        // Sort problem solvers by rating
        const sortedSolvers = filteredSolvers.sort((a, b) => b.rating - a.rating);
        setProblemSolvers(sortedSolvers);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthorityUser, userDistrict, currentUser]);

  // Get available districts based on selected division
  const availableDistricts = filters.division 
    ? Array.from(new Set(
        reports
          .filter(report => report.location.division === filters.division)
          .map(report => report.location.district)
      ))
    : [];

  // Get unique divisions that have reports
  const divisions = Array.from(new Set(reports.map(report => report.location.division)));

  // Sort problem solvers based on selected criteria
  const getSortedSolvers = (solvers: ProblemSolver[]) => {
    return [...solvers].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'points':
          return b.points - a.points;
        case 'completedTasks':
          return b.completedTasks - a.completedTasks;
        case 'successRate':
          return b.successRate - a.successRate;
        default:
          return b.rating - a.rating;
      }
    });
  };

  // Filter reports based on filters
  const filteredReports = reports.filter(report => {
    if (filters.division && report.location.division !== filters.division) return false;
    if (filters.district && report.location.district !== filters.district) return false;
    if (filters.status && report.status !== filters.status) return false;
    if (filters.severity && report.severity !== filters.severity) return false;
    return true;
  });

  const assignTask = async (reportId: string, solverId: string) => {
    setAssigning(true);
    
    try {
      const report = reports.find(r => r._id === reportId);
      const solver = problemSolvers.find(s => s._id === solverId);
      
      if (!report || !solver) {
        toast.error('Invalid report or problem solver');
        return;
      }

      // TODO: Uncomment when backend is ready
      /*
      // API call to save task in database
      const response = await fetch('/api/tasks/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          solverId,
          assignedBy: currentUser?._id || 'admin',
          division: report.location.division,
          district: report.location.district
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign task');
      }
      */

      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      setReports(prev => prev.map(report => 
        report._id === reportId 
          ? { 
              ...report, 
              status: 'inProgress',
              assignedTo: solverId,
              history: [
                ...report.history,
                {
                  status: 'inProgress',
                  note: `Assigned to ${solver.fullName} (${solver.organization})`,
                  updatedBy: currentUser?.name || 'admin',
                  date: new Date().toISOString()
                }
              ],
              updatedAt: new Date().toISOString()
            }
          : report
      ));

      toast.success(`Task assigned to ${solver.fullName} successfully!`);
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error('Failed to assign task. Please try again.');
    } finally {
      setAssigning(false);
      setSelectedReport(null);
      setSelectedSolver('');
    }
  };

  const updateTaskStatus = async (reportId: string, newStatus: Report['status']) => {
    setUpdatingStatus(reportId);
    
    try {
      // TODO: Uncomment when backend is ready
      /*
      // API call to update status in database
      const response = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          updatedBy: currentUser?._id || 'admin'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      */

      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setReports(prev => prev.map(report => 
        report._id === reportId 
          ? { 
              ...report, 
              status: newStatus,
              history: [
                ...report.history,
                {
                  status: newStatus,
                  note: `Status updated to ${newStatus}`,
                  updatedBy: currentUser?.name || 'admin',
                  date: new Date().toISOString()
                }
              ],
              updatedAt: new Date().toISOString()
            }
          : report
      ));

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inProgress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    if (rating >= 3.5) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get available problem solvers for the selected report's location
  const getAvailableSolvers = (report: Report) => {
    const solvers = problemSolvers.filter(solver => 
      solver.division === report.location.division && 
      solver.district === report.location.district
    );
    return getSortedSolvers(solvers);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81d586] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignable tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/dashboard/authority" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Authority Dashboard
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-[#81d586] font-medium">Task Assignment</li>
            </ol>
          </nav>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#002E2E]">Task Assignment Center</h1>
              <p className="text-gray-600 mt-2">
                {isAuthorityUser && userDistrict 
                  ? `Managing infrastructure issues in ${userDistrict} district`
                  : 'Assign and monitor infrastructure issues across Bangladesh'
                }
              </p>
              {isAuthorityUser && userDistrict && userDivision && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    Division: {userDivision}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    District: {userDistrict}
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#81d586]">{filteredReports.length}</div>
              <div className="text-sm text-gray-500">Tasks Found</div>
            </div>
          </div>
        </div>


        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reports.filter(r => r.status === 'inProgress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-[#F6FFF9] rounded-lg">
                <div className="w-6 h-6 bg-[#81d586] rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Solvers</p>
                <p className="text-2xl font-bold text-[#002E2E]">
                  {problemSolvers.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#002E2E]">Advanced Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division
              </label>
              <select
                value={filters.division}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  division: e.target.value, 
                  district: ''
                })}
                disabled={isAuthorityUser}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81d586] focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All Divisions</option>
                {divisions.map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
              {isAuthorityUser && (
                <p className="text-xs text-gray-500 mt-1">Automatically set to your division: {userDivision}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                disabled={isAuthorityUser || !filters.division}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81d586] focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All Districts</option>
                {availableDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {!filters.division && !isAuthorityUser && (
                <p className="text-xs text-gray-500 mt-1">Select a division first</p>
              )}
              {isAuthorityUser && (
                <p className="text-xs text-gray-500 mt-1">Automatically set to your district: {userDistrict}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81d586] focus:border-transparent transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81d586] focus:border-transparent transition-colors"
              >
                <option value="">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#002E2E]">
                Infrastructure Issues {isAuthorityUser && userDistrict && `in ${userDistrict}`}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredReports.length} tasks found
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => {
                  const availableSolvers = getAvailableSolvers(report);
                  const canAssign = availableSolvers.length > 0 && report.status === 'pending';
                  
                  return (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          {report.images.length > 0 && (
                            <img 
                              src={report.images[0]} 
                              alt={report.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {report.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {report.description}
                            </p>
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                              {report.problemType}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.location.district}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.location.division}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 truncate max-w-[150px]">
                          {report.location.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                          {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {report.status === 'pending' && (
                          <button
                            onClick={() => setSelectedReport(report)}
                            disabled={!canAssign}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              canAssign 
                                ? 'bg-[#81d586] text-white hover:bg-[#65b869]' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {canAssign ? 'Assign' : 'No Solvers'}
                          </button>
                        )}
                        
                        {report.status !== 'pending' && (
                          <select
                            value={report.status}
                            onChange={(e) => updateTaskStatus(report._id, e.target.value as Report['status'])}
                            disabled={updatingStatus === report._id}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81d586] focus:border-transparent disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="inProgress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No tasks found</p>
                <p className="text-gray-400 mt-1">
                  {isAuthorityUser && userDistrict 
                    ? `No infrastructure issues reported in ${userDistrict} district with current filters`
                    : 'Try adjusting your filters or check back later'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-[#002E2E]">
                  Assign Task
                </h3>
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setSelectedSolver('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Task Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Task Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Title:</span>
                    <p className="font-medium">{selectedReport.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium">{selectedReport.problemType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Severity:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(selectedReport.severity)}`}>
                      {selectedReport.severity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <p className="font-medium">{selectedReport.location.district}, {selectedReport.location.division}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">Description:</span>
                    <p className="text-sm mt-1">{selectedReport.description}</p>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Problem Solvers By:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'rating', label: 'Highest Rating' },
                    { value: 'points', label: 'Most Points' },
                    { value: 'completedTasks', label: 'Most Completed Tasks' },
                    { value: 'successRate', label: 'Highest Success Rate' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === option.value
                          ? 'bg-[#81d586] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Problem Solvers */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Problem Solvers in {selectedReport.location.district} 
                  <span className="text-gray-500 ml-2">(Sorted by {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()})</span>
                </label>
                
                {getAvailableSolvers(selectedReport).length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="text-gray-500">No problem solvers available in this district</p>
                    <p className="text-sm text-gray-400 mt-1">Problem solvers will be shown when available in {selectedReport.location.district}</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getAvailableSolvers(selectedReport).map((solver, index) => (
                      <div
                        key={solver._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedSolver === solver._id
                            ? 'border-[#81d586] bg-[#F6FFF9] ring-2 ring-[#81d586] ring-opacity-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSolver(solver._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {/* Rank Badge */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-500' : 'bg-[#81d586]'
                            }`}>
                              {index + 1}
                            </div>
                            
                            {/* Profile */}
                            <div className="w-12 h-12 bg-[#81d586] rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                              {solver.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-lg">{solver.fullName}</h4>
                                <div className="flex items-center space-x-1">
                                  <svg className={`w-4 h-4 ${getRatingColor(solver.rating)}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                  </svg>
                                  <span className={`font-bold ${getRatingColor(solver.rating)}`}>
                                    {solver.rating}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{solver.organization} • {solver.profession}</p>
                              
                              {/* Performance Stats */}
                              <div className="grid grid-cols-4 gap-4 text-xs">
                                <div className="text-center">
                                  <div className="font-bold text-gray-900">{solver.completedTasks}</div>
                                  <div className="text-gray-500">Tasks</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-green-600">{solver.successRate}%</div>
                                  <div className="text-gray-500">Success</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-blue-600">{solver.points}</div>
                                  <div className="text-gray-500">Points</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-purple-600">{solver.avgResolutionTime}h</div>
                                  <div className="text-gray-500">Avg. Time</div>
                                </div>
                              </div>
                              
                              {/* Skills */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {solver.skills.slice(0, 3).map((skill, idx) => (
                                  <span key={idx} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                    {skill}
                                  </span>
                                ))}
                                {solver.skills.length > 3 && (
                                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                    +{solver.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Selection Indicator */}
                          <div className="flex-shrink-0 ml-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedSolver === solver._id 
                                ? 'bg-[#81d586] border-[#81d586]' 
                                : 'bg-white border-gray-300'
                            }`}>
                              {selectedSolver === solver._id && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setSelectedSolver('');
                  }}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={assigning}
                >
                  Cancel
                </button>
                <button
                  onClick={() => assignTask(selectedReport._id, selectedSolver)}
                  disabled={!selectedSolver || assigning || getAvailableSolvers(selectedReport).length === 0}
                  className="px-6 py-2 bg-[#81d586] text-white rounded-lg hover:bg-[#65b869] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                >
                  {assigning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Assigning...
                    </>
                  ) : (
                    'Assign Task'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignTaskPage;