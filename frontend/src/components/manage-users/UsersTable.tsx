"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Users, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import ChangeRoleModal from "./ChangeRoleModal";
import DeleteUserModal from "./DeleteUserModal";
import ToggleStatusSwitch from "./ToggleStatusSwitch";
import Card from "@/components/common/Card";
import { InlineLoading } from "@/components/common";

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
    return <InlineLoading text="Loading users..." />;
  }

  return (
    <>
      <Card className="rounded-3xl shadow-xl border-t-4 border-secondary p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-accent/10">
          <h2 className="text-2xl font-extrabold text-info flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
            Users Table
          </h2>
          <span className="px-4 py-2 bg-info/10 text-info rounded-full text-sm font-bold">
            {users.length} users
          </span>
        </div>

        {/* Table or Empty State */}
        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-20 h-20 text-neutral/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral/70 mb-2">No Users Found</h3>
            <p className="text-neutral/50 max-w-sm mx-auto">
              No users match your current search criteria. Try adjusting your filters or search terms.
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-primary/5 to-secondary/5 border-b-2 border-accent/20">
                  <th className="px-6 py-4 text-left font-bold text-info text-sm uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left font-bold text-info text-sm uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left font-bold text-info text-sm uppercase tracking-wider">District</th>
                  <th className="px-6 py-4 text-left font-bold text-info text-sm uppercase tracking-wider">Points</th>
                  <th className="px-6 py-4 text-left font-bold text-info text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-info text-sm uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left font-bold text-info text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-linear-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user.name.charAt(0)}
                          </div>
                          {user.isActive && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-info group-hover:text-primary transition-colors">
                            {user.name}
                          </div>
                          <div className="text-neutral/60 text-sm font-medium">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getRoleIcon(user.role)}</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold border border-accent/40">
                        📍 {user.district}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="font-bold text-primary text-lg">{user.points}</span>
                        <span className="text-neutral/60 text-sm font-medium">pts</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ToggleStatusSwitch
                          isActive={user.isActive}
                          onToggle={(isActive) => onStatusToggle?.(user._id, isActive)}
                        />
                        <span className={`text-sm font-bold flex items-center gap-1 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {user.isActive ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-neutral/70 font-medium text-sm">{formatDate(user.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRoleChange(user)}
                          className="p-2 text-primary hover:text-white hover:bg-primary rounded-lg transition-all duration-200 border border-primary/30 hover:border-primary shadow-sm"
                          title="Change Role"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 border border-red-300/30 hover:border-red-600 shadow-sm"
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
        )}

        {/* Pagination */}
        {totalPages && totalPages > 1 && (
          <div className="mt-6 pt-6 border-t border-accent/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm font-medium text-neutral/70">
                Showing <span className="text-info font-bold">{(currentPage! - 1) * 10 + 1}</span> to{" "}
                <span className="text-info font-bold">{Math.min(currentPage! * 10, users.length)}</span> of{" "}
                <span className="text-info font-bold">{users.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange?.(currentPage! - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-accent/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white hover:border-primary transition-all font-medium"
                >
                  <ChevronLeft size={20} />
                </motion.button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onPageChange?.(page)}
                      className={`px-3 py-2 rounded-lg font-bold transition-all duration-200 ${currentPage === page
                        ? 'bg-primary text-white shadow-lg border border-primary'
                        : 'text-neutral/70 hover:bg-primary/10 border border-accent/20'
                        }`}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange?.(currentPage! + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-accent/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white hover:border-primary transition-all font-medium"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </Card>

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