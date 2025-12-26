"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import UsersTable from "@/components/manage-users/UsersTable";
import UserFilterBar from "@/components/manage-users/UserFilterBar";
import toast from "react-hot-toast";
import {
  Users,
  RefreshCw,
  UserCheck,
  UserX,
  Star,
} from "lucide-react";
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

interface FilterState {
  role: string;
  division: string;
  district: string;
  status: string;
}

// Define API response types
interface UsersApiResponse {
  success: boolean;
  message?: string;
  data?: User[];
}

interface BasicApiResponse {
  success: boolean;
  message?: string;
}

export default function ManageUsersPage() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    division: "",
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

      // Type assertion for the response
      const usersResponse = response as UsersApiResponse;

      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
        toast.success(`Loaded ${usersResponse.data.length} users from ${authUser.division}`);
      } else {
        // Handle unsuccessful response
        toast.error(usersResponse.message || 'Failed to load users');
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users. Please try again.');
      setUsers([]);
      setFilteredUsers([]);
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
  const handleFilterChange = (newFilters: FilterState) => setFilters(newFilters);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await userAPI.updateUserRole(userId, newRole);

      // Type assertion for the response
      const roleResponse = response as BasicApiResponse;

      if (roleResponse.success) {
        setUsers(users.map(user =>
          user._id === userId ? { ...user, role: newRole as User['role'] } : user
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
        throw new Error(roleResponse.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update role. Please try again.';
      toast.error(errorMessage);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await userAPI.updateUserStatus(userId, isActive);

      // Type assertion for the response
      const statusResponse = response as BasicApiResponse;

      if (statusResponse.success) {
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
        throw new Error(statusResponse.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status. Please try again.';
      toast.error(errorMessage);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const userToDelete = users.find(user => user._id === userId);

      const response = await userAPI.deleteUser(userId);

      // Type assertion for the response
      const deleteResponse = response as BasicApiResponse;

      if (deleteResponse.success) {
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
        throw new Error(deleteResponse.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
      {/* Welcome Section with Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent flex items-center justify-between gap-3 xs:gap-4"
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1 xs:mb-2 sm:mb-3">
            Manage Users 👥
          </h1>
          <p className="text-white/90 text-xs xs:text-sm sm:text-lg font-semibold">
            <span className="hidden xs:inline">Manage and monitor user accounts in </span>
            <span className="text-accent font-bold">{authUser?.division}<span className="hidden xs:inline"> Division</span></span>
          </p>
        </div>
        <motion.button
          onClick={loadUsers}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          className="p-2 xs:p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg xs:rounded-xl sm:rounded-2xl transition-all disabled:opacity-50 shrink-0"
          title="Refresh users"
        >
          <RefreshCw className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
        {[
          { title: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { title: 'Active Users', value: users.filter(u => u.isActive).length, icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
          { title: 'Inactive Users', value: users.filter(u => !u.isActive).length, icon: UserX, color: 'text-red-600', bgColor: 'bg-red-50' },
          { title: 'Problem Solvers', value: users.filter(u => u.role === 'problemSolver').length, icon: Star, color: 'text-purple-600', bgColor: 'bg-purple-50' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border-2 border-accent/20 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] xs:text-xs sm:text-sm font-bold text-neutral/70 uppercase tracking-wide truncate">{stat.title}</p>
                  <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold text-info mt-1 xs:mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-white/50 p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl shrink-0`}>
                  <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
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