"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UsersTable from "@/components/manage-users/UsersTable";
import UserFilterBar from "@/components/manage-users/UserFilterBar";
import toast from "react-hot-toast";
import { Users, RefreshCw, UserCheck, UserX, Star } from "lucide-react";
import { FullPageLoading } from "@/components/common";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/utils/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "problemSolver" | "authority" | "superAdmin";
  division: string;
  district: string;
  points: number;
  approved: boolean;
  isActive: boolean;
  avatar?: string;
  profilePicture?: string;
  createdAt: string;
}

export default function SuperAdminUsersPage() {
  const { user: authUser, isLoading: authLoading } = useAuth();
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const usersPerPage = 10;

  // Load users from API
  const loadUsers = async (showToast = false) => {
    if (showToast) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      // Fetch all users (superAdmin has no division restrictions)
      const response = await userAPI.getAllUsers({
        limit: 1000 // Get all users
      });

      if (response.success && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
        if (showToast) {
          toast.success(`Users refreshed! ${response.data.length} users loaded`);
        } else {
          toast.success(`Loaded ${response.data.length} users from the system`);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (authUser?.role === "superAdmin") {
      loadUsers();
    }
  }, [authUser]);

  // Filter and search users
  useEffect(() => {
    let result = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.division?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }
    if (filters.division) {
      result = result.filter(user => user.division === filters.division);
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await userAPI.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, role: newRole as User['role'] } : user
          )
        );
        toast.success(`User role updated to ${newRole} successfully!`);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user role';
      toast.error(errorMessage);
    }
  };

  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      const response = await userAPI.updateUserStatus(userId, isActive);
      if (response.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, isActive } : user
          )
        );
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully!`);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user status';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await userAPI.deleteUser(userId);
      if (response.success) {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        toast.success("User deleted successfully!");
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (authLoading || isLoading) {
    return <FullPageLoading text="Loading users..." />;
  }

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 bg-base-300 min-h-screen container mx-auto">
      {/* Welcome Section with Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 xs:p-6 sm:p-8 lg:p-12 border-t-4 border-accent flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1 xs:mb-2 sm:mb-3">
            All Users Management 👥
          </h1>
          <p className="text-white/90 text-xs xs:text-sm sm:text-lg font-semibold">
            System-wide user management (SuperAdmin)
          </p>
        </div>
        <motion.button
          onClick={() => loadUsers(true)}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          disabled={isRefreshing}
          className="p-2 xs:p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg xs:rounded-xl sm:rounded-2xl transition-all disabled:opacity-50 shrink-0"
          title="Refresh users"
        >
          <RefreshCw className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
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

      {/* Filter Bar */}
      <UserFilterBar
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        filters={filters}
        userDivision={null}
      />

      {/* Users Table */}
      <UsersTable
        users={currentUsers}
        onRoleChange={handleRoleChange}
        onStatusToggle={handleStatusToggle}
        onDeleteUser={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={false}
      />
    </div>
  );
}
