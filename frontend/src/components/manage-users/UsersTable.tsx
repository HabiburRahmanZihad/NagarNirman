"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Users, Loader2 } from "lucide-react";
import ChangeRoleModal from "./ChangeRoleModal";
import DeleteUserModal from "./DeleteUserModal";
import ToggleStatusSwitch from "./ToggleStatusSwitch";

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

interface UsersTableProps {
  users: User[];
  onRoleChange?: (userId: string, newRole: string) => void;
  onStatusToggle?: (userId: string, isActive: boolean) => void;
  onDeleteUser?: (userId: string) => void;
  onApprove?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  isSuperAdmin?: boolean;
}

export default function UsersTable({
  users,
  onRoleChange,
  onStatusToggle,
  onDeleteUser,
  onApprove,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  isSuperAdmin = false
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'authority': return 'bg-red-500/10 text-red-700 border border-red-200';
      case 'problemSolver': return 'bg-blue-500/10 text-blue-700 border border-blue-200';

      default: return 'bg-gray-500/10 text-gray-700 border border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'authority': return '👑';
      case 'problemSolver': return '💡';

      default: return '👤';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'authority': return 'Authority';
      case 'problemSolver': return 'Problem Solver';

      case 'user': return 'User';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
      >
        <Loader2 className="w-12 h-12 text-[#2a7d2f] animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Users</h3>
        <p className="text-gray-500">Please wait while we load the user data...</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Table Header */}
        {/* <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#2a7d2f] rounded-lg">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">{users.length} users found</p>
            </div>
          </div>
        </div> */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-gray-900 to-black text-white">
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">District</th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-linear-to-br from-[#2a7d2f] to-[#1e5c22] rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                          {user.name.charAt(0)}
                        </div>
                        {user.isActive && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-[#2a7d2f] transition-colors">
                          {user.name}
                        </div>
                        <div className="text-gray-500 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getRoleIcon(user.role)}</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                      📍 {user.district}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#2a7d2f] rounded-full"></div>
                      <span className="font-bold text-[#2a7d2f] text-lg">{user.points}</span>
                      <span className="text-gray-500 text-sm">pts</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <ToggleStatusSwitch
                        isActive={user.isActive}
                        onToggle={(isActive) => onStatusToggle(user._id, isActive)}
                      />
                      <span className={`text-sm font-semibold ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {user.isActive ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600 font-medium">{formatDate(user.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#2a7d2f" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRoleChange(user)}
                        className="p-2 text-gray-600 hover:text-white hover:bg-[#2a7d2f] rounded-xl transition-all duration-200 border border-gray-300 hover:border-[#2a7d2f] shadow-sm"
                        title="Change Role"
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#dc2626" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-gray-600 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200 border border-gray-300 hover:border-red-600 shadow-sm"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              No users match your current search criteria. Try adjusting your filters or search terms.
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{(currentPage - 1) * 10 + 1}</span> to{" "}
                <span className="font-semibold">{Math.min(currentPage * 10, users.length)}</span> of{" "}
                <span className="font-semibold">{users.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors font-medium text-gray-700"
                >
                  Previous
                </motion.button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${currentPage === page
                          ? 'bg-[#2a7d2f] text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                        }`}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors font-medium text-gray-700"
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {showRoleModal && selectedUser && (
        <ChangeRoleModal
          user={selectedUser}
          currentRole={selectedUser.role}
          onClose={() => setShowRoleModal(false)}
          onSave={(newRole) => {
            if (onRoleChange) {
              onRoleChange(selectedUser._id, newRole);
            }
            setShowRoleModal(false);
          }}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            if (onDeleteUser) {
              onDeleteUser(selectedUser._id);
            } else if (onDelete) {
              onDelete(selectedUser._id);
            }
            setShowDeleteModal(false);
          }}
        />
      )}
    </>
  );
}