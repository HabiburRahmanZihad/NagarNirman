"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Sparkles, Target, TrendingUp } from "lucide-react";
import TaskCard from "@/components/solver/TaskCard";
import TaskFilterBar from "@/components/solver/TaskFilterBar";

interface Task {
  _id: string;
  title: string;
  description: string;
  location: {
    division: string;
    district: string;
  };
  severity: "low" | "medium" | "high";
  images: string[];
  assignedDate: string;
  status: "pending" | "ongoing" | "completed";
  rewardPoints: number;
  history: {
    status: string;
    date: string;
  }[];
}

const dummyTasks: Task[] = [
  {
    _id: "tsk_001",
    title: "Garbage accumulation in roadside drain",
    description: "Blocked drainage causing water overflow in residential area near market.",
    location: { division: "Dhaka", district: "Gazipur" },
    severity: "high",
    images: ["https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=500"],
    assignedDate: "2025-11-10T08:30:00Z",
    status: "pending",
    rewardPoints: 50,
    history: [{ status: "pending", date: "2025-11-10" }]
  },
  {
    _id: "tsk_002",
    title: "Plastic waste in public park",
    description: "Large amount of plastic bottles and wrappers scattered across children's play area.",
    location: { division: "Dhaka", district: "Mirpur" },
    severity: "medium",
    images: ["https://images.unsplash.com/photo-1587132135056-6130359ab700?w=500"],
    assignedDate: "2025-11-09T14:20:00Z",
    status: "ongoing",
    rewardPoints: 30,
    history: [
      { status: "pending", date: "2025-11-09" },
      { status: "ongoing", date: "2025-11-10" }
    ]
  },
  {
    _id: "tsk_003",
    title: "Abandoned furniture on sidewalk",
    description: "Old sofa and chairs blocking pedestrian pathway near school.",
    location: { division: "Dhaka", district: "Uttara" },
    severity: "low",
    images: ["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500"],
    assignedDate: "2025-11-08T09:15:00Z",
    status: "completed",
    rewardPoints: 20,
    history: [
      { status: "pending", date: "2025-11-08" },
      { status: "ongoing", date: "2025-11-09" },
      { status: "completed", date: "2025-11-10" }
    ]
  },
  {
    _id: "tsk_004",
    title: "Industrial waste dumping in river",
    description: "Chemical waste being dumped directly into the river near industrial zone.",
    location: { division: "Dhaka", district: "Gazipur" },
    severity: "high",
    images: ["https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500"],
    assignedDate: "2025-11-11T10:00:00Z",
    status: "pending",
    rewardPoints: 75,
    history: [{ status: "pending", date: "2025-11-11" }]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SolverTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(dummyTasks);
  const [filters, setFilters] = useState({
    status: "all",
    severity: "all",
    district: "all",
    search: ""
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    ongoing: tasks.filter(t => t.status === 'ongoing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    totalPoints: tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.rewardPoints, 0)
  };

  useEffect(() => {
    let result = tasks;
    
    if (filters.status !== "all") {
      result = result.filter(task => task.status === filters.status);
    }
    
    if (filters.severity !== "all") {
      result = result.filter(task => task.severity === filters.severity);
    }
    
    if (filters.district !== "all") {
      result = result.filter(task => task.location.district === filters.district);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTasks(result);
  }, [filters, tasks]);

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(prev => prev.map(task => 
      task._id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            history: [...task.history, { status: newStatus, date: new Date().toISOString().split('T')[0] }]
          }
        : task
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Your Missions
          </h1>
          <p className="text-gray-600 mt-2">Manage and complete your assigned cleanup tasks</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white shadow-lg">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">{stats.totalPoints} Points Earned</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div
          variants={containerVariants}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.ongoing}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <TaskFilterBar filters={filters} onFiltersChange={setFilters} />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TaskCard task={task} onStatusUpdate={updateTaskStatus} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
            <Filter className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No missions found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your filters or check back later for new cleanup missions in your area.
          </p>
        </motion.div>
      )}
    </div>
  );
}