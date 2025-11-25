"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import UsersTable from "@/components/manage-users/UsersTable";
import UserFilterBar from "@/components/manage-users/UserFilterBar";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import RefreshButton from "@/components/common/RefreshButton";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/utils/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "problemSolver" | "ngo" | "authority";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 pb-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor user accounts in {authUser?.division || 'your'} division
          </p>
          {authUser?.division && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                Division: {authUser.division}
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                District: {authUser.district}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#2a7d2f] rounded-lg">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">{users.length} users in {authUser?.division}</p>
              </div>
            </div>
          </div>
          <RefreshButton onClick={loadUsers} className="ml-2" tooltip="Refresh Users" />
        </div>
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
    </motion.div>
  );
}