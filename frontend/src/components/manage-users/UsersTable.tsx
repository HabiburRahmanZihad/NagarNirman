"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Users, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import ChangeRoleModal from "./ChangeRoleModal";
import DeleteUserModal from "./DeleteUserModal";
import ToggleStatusSwitch from "./ToggleStatusSwitch";
import Card from "@/components/common/Card";
import { InlineLoading } from "@/components/common";

import type { User } from "@/types";


// Props for UsersTable component
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
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // Handlers for role change and delete actions
  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };


  // Handler for delete action
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };


  // Format date to readable string
  const formatDate = (date?: string | Date | undefined) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  // Get role-based badge color, icon, and label
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'authority': return 'bg-red-500/10 text-red-700 border border-red-200';
      case 'problemSolver': return 'bg-blue-500/10 text-blue-700 border border-blue-200';
      default: return 'bg-gray-500/10 text-gray-700 border border-gray-200';
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'authority': return '👑';
      case 'problemSolver': return '💡';
      default: return '👤';
    }
  };


  // Get role label
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
      <Card className="rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border-t-4 border-secondary p-4 xs:p-5 sm:p-6 lg:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 xs:mb-5 sm:mb-6 pb-4 xs:pb-5 sm:pb-6 border-b border-accent/10 gap-2 xs:gap-3">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-info flex items-center gap-2 xs:gap-3">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
              <Users className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
            </div>
            Users Table
          </h2>
          <span className="px-3 xs:px-4 py-1.5 xs:py-2 bg-info/10 text-info rounded-full text-xs xs:text-sm font-bold">
            {users.length} users
          </span>
        </div>

        {/* Table or Empty State */}
        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 xs:py-12 sm:py-16"
          >
            <Users className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 text-neutral/30 mx-auto mb-3 xs:mb-4" />
            <h3 className="text-base xs:text-lg font-bold text-neutral/70 mb-1.5 xs:mb-2">No Users Found</h3>
            <p className="text-neutral/50 max-w-sm mx-auto text-xs xs:text-sm">
              No users match your current search criteria. Try adjusting your filters or search terms.
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto -mx-4 xs:-mx-5 sm:-mx-6 lg:-mx-8">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-linear-to-r from-primary/5 to-secondary/5 border-b-2 border-accent/20">
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">User</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">Role</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider hidden sm:table-cell">District</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider hidden md:table-cell">Points</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">Status</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  <th className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-left font-bold text-info text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">Actions</th>
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
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4">
                      <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
                        <div className="relative">
                          <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-linear-to-br from-primary to-secondary rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-xs xs:text-sm sm:text-lg shadow-lg">
                            {user.name.charAt(0)}
                          </div>
                          {user.isActive && (
                            <div className="absolute -bottom-0.5 -right-0.5 xs:-bottom-1 xs:-right-1 w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-info group-hover:text-primary transition-colors text-xs xs:text-sm sm:text-base truncate">
                            {user.name}
                          </div>
                          <div className="text-neutral/60 text-[10px] xs:text-xs sm:text-sm font-medium truncate max-w-[100px] xs:max-w-[150px] sm:max-w-none">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4">
                      <div className="flex items-center space-x-1 xs:space-x-2">
                        <span className="text-sm xs:text-base sm:text-lg">{getRoleIcon(user.role)}</span>
                        <span className={`inline-flex items-center px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                          <span className="hidden xs:inline">{getRoleLabel(user.role)}</span>
                          <span className="xs:hidden">{user.role === 'problemSolver' ? 'PS' : user.role === 'authority' ? 'Auth' : 'User'}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 bg-accent/20 text-accent rounded-full text-[10px] xs:text-xs sm:text-sm font-bold border border-accent/40">
                        📍 {user.district}
                      </span>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2">
                        <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-primary rounded-full"></div>
                        <span className="font-bold text-primary text-sm xs:text-base sm:text-lg">{user.points}</span>
                        <span className="text-neutral/60 text-[10px] xs:text-xs sm:text-sm font-medium">pts</span>
                      </div>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4">
                      <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3">
                        <ToggleStatusSwitch
                          isActive={!!user.isActive}
                          onToggle={(isActive) => onStatusToggle?.(user._id, isActive)}
                        />
                        <span className={`text-[10px] xs:text-xs sm:text-sm font-bold flex items-center gap-0.5 xs:gap-1 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {user.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Active</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Inactive</span>
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 hidden lg:table-cell">
                      <div className="text-neutral/70 font-medium text-[10px] xs:text-xs sm:text-sm">{formatDate(user.createdAt)}</div>
                    </td>
                    <td className="px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4">
                      <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRoleChange(user)}
                          className="p-1.5 xs:p-2 text-primary hover:text-white hover:bg-primary rounded-lg transition-all duration-200 border border-primary/30 hover:border-primary shadow-sm"
                          title="Change Role"
                        >
                          <Edit size={14} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(user)}
                          className="p-1.5 xs:p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 border border-red-300/30 hover:border-red-600 shadow-sm"
                          title="Delete User"
                        >
                          <Trash2 size={14} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px]" />
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
          <div className="mt-4 xs:mt-5 sm:mt-6 pt-4 xs:pt-5 sm:pt-6 border-t border-accent/10">
            <div className="flex flex-col xs:flex-row items-center justify-between flex-wrap gap-3 xs:gap-4">
              <div className="text-[10px] xs:text-xs sm:text-sm font-medium text-neutral/70 order-2 xs:order-1">
                Showing <span className="text-info font-bold">{(currentPage! - 1) * 10 + 1}</span> to{" "}
                <span className="text-info font-bold">{Math.min(currentPage! * 10, users.length)}</span> of{" "}
                <span className="text-info font-bold">{users.length}</span> results
              </div>
              <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 order-1 xs:order-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange?.(currentPage! - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 xs:p-2 border border-accent/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white hover:border-primary transition-all font-medium"
                >
                  <ChevronLeft size={16} className="xs:w-5 xs:h-5" />
                </motion.button>

                <div className="flex space-x-0.5 xs:space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onPageChange?.(page)}
                      className={`px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg text-xs xs:text-sm font-bold transition-all duration-200 ${currentPage === page
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
                  className="p-1.5 xs:p-2 border border-accent/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white hover:border-primary transition-all font-medium"
                >
                  <ChevronRight size={16} className="xs:w-5 xs:h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {showRoleModal && selectedUser && (
        <ChangeRoleModal
          user={selectedUser!}
          currentRole={selectedUser!.role}
          onClose={() => setShowRoleModal(false)}
          onSave={(newRole) => {
            if (onRoleChange) {
              onRoleChange(selectedUser!._id, newRole);
            }
            setShowRoleModal(false);
          }}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          user={selectedUser!}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            if (onDeleteUser) {
              onDeleteUser(selectedUser!._id);
            } else if (onDelete) {
              onDelete(selectedUser!._id);
            }
            setShowDeleteModal(false);
          }}
        />
      )}
    </>
  );
}