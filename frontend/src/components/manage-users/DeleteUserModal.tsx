"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, User, Trash2, Shield } from "lucide-react";
import { useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "problemSolver" | "authority";
  district: string;
  points: number;
  approved: boolean;
  isActive: boolean;
  avatar: string;
  createdAt: string;
}

interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserModal({ user, onClose, onConfirm }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm();
    setIsDeleting(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'authority': return 'bg-red-500/20 text-red-700 border-red-200';
      case 'problemSolver': return 'bg-blue-500/20 text-blue-700 border-blue-200';

      default: return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#000000a8] bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center space-x-4 p-6 border-b border-gray-200 bg-linear-to-r from-red-50 to-red-100">
            <div className="p-3 bg-red-500 rounded-xl">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Delete User</h2>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-200 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Warning Message */}
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <AlertTriangle size={18} />
                <span className="font-semibold">Irreversible Action</span>
              </div>
              <p className="text-red-700 text-sm">
                You are about to permanently delete this user account. All associated data will be lost.
              </p>
            </div>

            <p className="text-gray-700 mb-6 text-center">
              Are you sure you want to delete the user{" "}
              <strong className="text-red-600">{user.name}</strong>?
            </p>

            {/* User Summary */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-linear-to-br from-[#2a7d2f] to-[#1e5c22] rounded-xl flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                  <div className="font-bold text-[#2a7d2f]">{user.points}</div>
                  <div className="text-gray-500">Points</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                  <div className="font-bold text-blue-600">{user.district}</div>
                  <div className="text-gray-500">District</div>
                </div>
              </div>
            </div>

            {/* Impact Details */}
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">What will be deleted:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>User profile and account information</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>All associated points and rewards</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>Activity history and records</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>Any submitted content or solutions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: !isDeleting ? 1.05 : 1 }}
              whileTap={{ scale: !isDeleting ? 0.95 : 1 }}
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-8 py-3 bg-linear-to-r from-red-600 to-red-700 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  <span>Delete User</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}