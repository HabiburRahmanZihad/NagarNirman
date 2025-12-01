"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Shield, HelpCircle, Check } from "lucide-react";
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

interface ChangeRoleModalProps {
  user: User;
  currentRole: string;
  onClose: () => void;
  onSave: (newRole: string) => void;
}

export default function ChangeRoleModal({ user, currentRole, onClose, onSave }: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isSaving, setIsSaving] = useState(false);

  const roles = [
    {
      value: "user",
      label: "User",
      icon: User,
      description: "Basic user permissions",
      features: ["View content", "Submit reports", "Basic interactions"]
    },
    {
      value: "problemSolver",
      label: "Problem Solver",
      icon: HelpCircle,
      description: "Can solve problems and earn points",
      features: ["All User features", "Solve problems", "Earn points", "Get rewards"]
    },
    {

      icon: Shield,
      description: "NGO organization account",
      features: ["All User features", "Solve problems", "Manage team", "Organization profile"]
    },
    {
      value: "authority",
      label: "Authority",
      icon: Shield,
      description: "Full administrative access",
      features: ["All Problem Solver features", "Manage users", "System configuration", "Full access"]
    }
  ];

  const handleSave = async () => {
    if (selectedRole !== currentRole) {
      setIsSaving(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(selectedRole);
      setIsSaving(false);
    } else {
      onClose();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'authority': return 'from-red-500 to-red-600';
      case 'problemSolver': return 'from-blue-500 to-blue-600';

      default: return 'from-gray-500 to-gray-600';
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
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Change User Role</h2>
              <p className="text-gray-600 mt-1">Update permissions and access level for this user</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-linear-to-br from-[#2a7d2f] to-[#1e5c22] rounded-2xl flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-linear-to-r from-yellow-400 to-yellow-500 border-2 border-white rounded-full flex items-center justify-center">
                  <Shield size={12} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentRole === 'authority' ? 'bg-red-100 text-red-700' :
                      currentRole === 'problemSolver' ? 'bg-blue-100 text-blue-700' :

                        'bg-gray-100 text-gray-700'
                    }`}>
                    {currentRole}
                  </span>
                </div>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select New Role</h3>
            <div className="grid gap-4">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.value;
                const isCurrent = currentRole === role.value;

                return (
                  <motion.label
                    key={role.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                        ? 'border-[#2a7d2f] bg-green-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } ${isCurrent ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      aria-label={`Select ${role.label} role`}
                      value={role.value}
                      checked={isSelected}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="sr-only"
                    />

                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-linear-to-r ${getRoleColor(role.value)}`}>
                        <IconComponent size={24} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900 text-lg">{role.label}</span>
                          {isCurrent && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              Current
                            </span>
                          )}
                          {isSelected && (
                            <div className="p-1 bg-green-500 rounded-full">
                              <Check size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{role.description}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {role.features.map((feature, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200">
                              <Check size={12} className="text-green-500 mr-1" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.label>
                );
              })}
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
              whileHover={{ scale: selectedRole !== currentRole && !isSaving ? 1.05 : 1 }}
              whileTap={{ scale: selectedRole !== currentRole && !isSaving ? 0.95 : 1 }}
              onClick={handleSave}
              disabled={selectedRole === currentRole || isSaving}
              className="px-8 py-3 bg-linear-to-r from-[#2a7d2f] to-[#1e5c22] text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Update Role</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}