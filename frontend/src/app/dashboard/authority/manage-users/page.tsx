"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import UsersTable from "@/components/manage-users/UsersTable";
import UserFilterBar from "@/components/manage-users/UserFilterBar";
import toast from "react-hot-toast";
import Card from "@/components/common/Card";
import {
  Users,
  RefreshCw,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";
import RefreshButton from "@/components/common/RefreshButton";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/utils/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "problemSolver" | "authority";
  division: string;
  district: string;
  points: number;
  approved: boolean;
  isActive: boolean;
  avatar?: string;
  profilePicture?: string;
  createdAt: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    district: "",
    status: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const usersPerPage = 10;

  // Load users from API
  const loadUsers = useCallback(async () => {
    if (!authUser?.division) return;

    setIsLoading(true);
    try {
      // Fetch users from authority's division only
      const response = await userAPI.getAllUsers({
        division: authUser.division,
        limit: 100 // Get all users from this division
      });

      if (response.success && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
        toast.success(`Loaded ${response.data.length} users from ${authUser.division}`);
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser?.division) {
      loadUsers();
    }
  }, [authUser, loadUsers]);

  // Filter and search users
  useEffect(() => {
    let result = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }
    if (filters.district) {
      result = result.filter(user => user.district === filters.district);
    }
    if (filters.status) {
      const isActive = filters.status === "active";
      result = result.filter(user => user.isActive === isActive);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, filters, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleFilterChange = (newFilters: any) => setFilters(newFilters);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await userAPI.updateUserRole(userId, newRole);

      if (response.success) {
        setUsers(users.map(user =>
          user._id === userId ? { ...user, role: newRole as any } : user
        ));

        toast.success(`Role updated to ${newRole} successfully!`, {
          style: {
            background: '#2a7d2f',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#2a7d2f',
          },
        });
      } else {
        throw new Error(response.message || 'Failed to update role');
      }
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Failed to update role. Please try again.');
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await userAPI.updateUserStatus(userId, isActive);

      if (response.success) {
        setUsers(users.map(user =>
          user._id === userId ? { ...user, isActive } : user
        ));

        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully!`, {
          style: {
            background: isActive ? '#2a7d2f' : '#f59e0b',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: isActive ? '#2a7d2f' : '#f59e0b',
          },
        });
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status. Please try again.');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const userToDelete = users.find(user => user._id === userId);

      const response = await userAPI.deleteUser(userId);

      if (response.success) {
        setUsers(users.filter(user => user._id !== userId));

        toast.success(`User "${userToDelete?.name}" deleted successfully!`, {
          style: {
            background: '#dc2626',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#dc2626',
          },
        });
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
      {/* Welcome Section with Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Manage Users 👥
          </h1>
          <p className="text-white/90 text-lg font-semibold">
            Manage and monitor user accounts in <span className="text-accent font-bold">{authUser?.division} Division</span>
          </p>
        </div>
        <motion.button
          onClick={loadUsers}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all disabled:opacity-50 shrink-0"
          title="Refresh users"
        >
          <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { title: 'Active Users', value: users.filter(u => u.isActive).length, icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
          { title: 'Inactive Users', value: users.filter(u => !u.isActive).length, icon: UserX, color: 'text-red-600', bgColor: 'bg-red-50' },
          { title: 'Problem Solvers', value: users.filter(u => u.role === 'problemSolver').length, icon: Trash2, color: 'text-purple-600', bgColor: 'bg-purple-50' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 border-2 border-accent/20 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-neutral/70 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-3xl font-extrabold text-info mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-white/50 p-3 rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <UserFilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        userDivision={authUser?.division}
      />

      <UsersTable
        users={currentUsers}
        onRoleChange={updateUserRole}
        onStatusToggle={toggleUserStatus}
        onDeleteUser={deleteUser}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}