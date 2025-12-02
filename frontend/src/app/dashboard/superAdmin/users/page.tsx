"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import UsersTable from "@/components/manage-users/UsersTable";
import UserFilterBar from "@/components/manage-users/UserFilterBar";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import { RefreshButton } from "@/components/common";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/utils/api";
import divisionsData from "@/data/divisionsData.json";

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
  const router = useRouter();
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
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
    } catch (error: any) {
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
            user._id === userId ? { ...user, role: newRole as any } : user
          )
        );
        toast.success(`User role updated to ${newRole} successfully!`);
      }
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Failed to update user role');
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
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#2a7d2f] rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  All Users Management
                </h1>
                <p className="text-gray-600 mt-1">
                  System-wide user management (SuperAdmin)
                </p>
              </div>
            </div>
            <RefreshButton
              onClick={() => loadUsers(true)}
              isRefreshing={isRefreshing}
              variant="primary"
            />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <span className="text-3xl">👥</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Authorities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'authority').length}
                </p>
              </div>
              <span className="text-3xl">🏛️</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Problem Solvers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'problemSolver').length}
                </p>
              </div>
              <span className="text-3xl">💡</span>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <UserFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            divisions={divisionsData.map(d => d.division)}
            districts={divisionsData.flatMap(d => d.districts.map(dist => dist.name))}
            isSuperAdmin={true}
          />
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <UsersTable
            users={currentUsers}
            onRoleChange={handleRoleChange}
            onDelete={handleDelete}
            isSuperAdmin={true}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors ${currentPage === pageNum
                            ? 'bg-[#2a7d2f] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
