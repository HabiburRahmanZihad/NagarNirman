"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UsersTable from "@/components/manage-users/UsersTable";
import UserFilterBar from "@/components/manage-users/UserFilterBar";
import toast from "react-hot-toast";
import { Users } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "problem-solver" | "admin";
  district: string;
  points: number;
  approved: boolean;
  isActive: boolean;
  avatar: string;
  createdAt: string;
}

export default function ManageUsersPage() {
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

  // Load dummy data
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyUsers: User[] = [
        {
          _id: "690ede0fb7e5eabc30d43087",
          name: "Pori Moni",
          email: "pori@moni.com",
          role: "user",
          district: "Pirojpur",
          points: 0,
          approved: true,
          isActive: true,
          avatar: "",
          createdAt: "2025-11-08T06:07:11.148Z"
        },
        {
          _id: "690ede0fb7e5eabc30d43088",
          name: "Shakib Khan",
          email: "shakib@khan.com",
          role: "problem-solver",
          district: "Dhaka",
          points: 150,
          approved: true,
          isActive: true,
          avatar: "",
          createdAt: "2025-10-15T12:30:45.148Z"
        },
        {
          _id: "690ede0fb7e5eabc30d43089",
          name: "Joya Ahsan",
          email: "joya@ahsan.com",
          role: "admin",
          district: "Chittagong",
          points: 300,
          approved: true,
          isActive: false,
          avatar: "",
          createdAt: "2025-09-22T08:15:33.148Z"
        },
        {
          _id: "690ede0fb7e5eabc30d43090",
          name: "Anisur Rahman",
          email: "anis@rahman.com",
          role: "user",
          district: "Rajshahi",
          points: 75,
          approved: true,
          isActive: true,
          avatar: "",
          createdAt: "2025-11-01T14:20:15.148Z"
        },
        {
          _id: "690ede0fb7e5eabc30d43091",
          name: "Tania Ahmed",
          email: "tania@ahmed.com",
          role: "problem-solver",
          district: "Sylhet",
          points: 220,
          approved: true,
          isActive: true,
          avatar: "",
          createdAt: "2025-10-28T09:45:22.148Z"
        },
        {
          _id: "690ede0fb7e5eabc30d43092",
          name: "Rafiq Islam",
          email: "rafiq@islam.com",
          role: "user",
          district: "Khulna",
          points: 45,
          approved: true,
          isActive: false,
          avatar: "",
          createdAt: "2025-11-05T16:30:18.148Z"
        }
      ];
      setUsers(dummyUsers);
      setFilteredUsers(dummyUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

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
      // Placeholder API call
      console.log(`PUT /api/users/${userId}/role`, { role: newRole });
      
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
    } catch (error) {
      toast.error('Failed to update role. Please try again.');
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      // Placeholder API call
      console.log(`PUT /api/users/${userId}/status`, { isActive });
      
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
    } catch (error) {
      toast.error('Failed to update status. Please try again.');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Placeholder API call
      console.log(`DELETE /api/users/${userId}`);
      
      const userToDelete = users.find(user => user._id === userId);
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
    } catch (error) {
      toast.error('Failed to delete user. Please try again.');
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
          <p className="text-gray-600 mt-1">Manage and monitor all user accounts</p>
        </div>
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#2a7d2f] rounded-lg">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">{users.length} users found</p>
            </div>
          </div>
        </div>
      </div>

      <UserFilterBar 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
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