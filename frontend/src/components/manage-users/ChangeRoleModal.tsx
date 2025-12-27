"use client";

import { X, User as UserIcon, Lightbulb, Shield, Check } from "lucide-react";
import { useState } from "react";
import type { User } from "@/types";

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
      label: "👤 User",
      icon: UserIcon,
      description: "Basic user permissions",
      badge: "Standard Access",
      color: "from-blue-500 to-cyan-500",
      features: ["📖 View content", "📝 Submit reports", "💬 Basic interactions"]
    },
    {
      value: "problemSolver",
      label: "💡 Problem Solver",
      icon: Lightbulb,
      description: "Can solve problems and earn points",
      badge: "Problem Solver",
      color: "from-amber-500 to-orange-500",
      features: ["🎯 Solve problems", "⭐ Earn points", "🏆 Get rewards", "📊 View statistics"]
    },
    {
      value: "authority",
      label: "👑 Authority",
      icon: Shield,
      description: "Full administrative access",
      badge: "Administrative",
      color: "from-red-500 to-rose-500",
      features: ["🎯 All Solver features", "👥 Manage users", "⚙️ System config", "📋 Full access"]
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


  const getRoleTextColor = (role: User['role'] | string): string => {
    switch (role) {
      case 'authority': return 'text-red-700 bg-red-100';
      case 'problemSolver': return 'text-amber-700 bg-amber-100';
      default: return 'text-blue-700 bg-blue-100';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-linear-to-b from-white to-base-100 rounded-3xl shadow-2xl max-w-2xl w-full border border-accent/20 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient Background */}
        <div className="bg-linear-to-r from-primary to-secondary text-white p-8 border-b-4 border-accent relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Change User Role</h2>
          <p className="text-white/90 font-medium">Update permissions and access level for this user</p>
        </div>

        {/* User Info Section */}
        <div className="p-8 bg-linear-to-r from-primary/5 to-secondary/5 border-b border-accent/20">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg border-2 border-accent">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Shield size={16} className="text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-2xl font-extrabold text-neutral">{user.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getRoleTextColor(currentRole)}`}>
                  {currentRole === 'problemSolver' ? 'Problem Solver' : currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                </span>
              </div>
              <p className="text-info font-semibold mb-1">{user.email}</p>
              <p className="text-neutral/60 text-sm">📍 {user.district} • 🗓️ Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
            </div>
          </div>
        </div>

        {/* Role Selection - Scrollable */}
        <div className="p-8 flex-1 overflow-y-auto">
          <h3 className="text-xl font-extrabold text-neutral mb-6 flex items-center gap-2   bg-white pb-4">
            <Shield className="w-6 h-6 text-secondary" />
            Select New Role
          </h3>
          <div className="grid gap-5">
            {roles.map((role) => {
              const IconComponent = role.icon;
              const isSelected = selectedRole === role.value;
              const isCurrent = currentRole === role.value;

              return (
                <label
                  key={role.value}
                  className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden ${isSelected
                    ? 'border-accent bg-linear-to-r from-accent/10 to-secondary/10 shadow-xl'
                    : 'border-accent/20 hover:border-accent/50 hover:bg-base-200/50'
                    } ${isCurrent ? 'ring-2 ring-secondary ring-opacity-50' : ''}`}
                >
                  <div className={`absolute inset-0 bg-linear-to-r ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <input
                    type="radio"
                    name="role"
                    aria-label={`Select ${role.label} role`}
                    value={role.value}
                    checked={isSelected}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="sr-only"
                  />

                  <div className="flex items-start space-x-5 relative z-10">
                    <div className={`p-4 rounded-xl bg-linear-to-br ${role.color} text-white shadow-lg shrink-0`}>
                      <IconComponent size={28} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-extrabold text-lg text-neutral">{role.label}</span>
                        <span className="px-3 py-1 bg-linear-to-r from-accent to-secondary text-white rounded-full text-xs font-bold uppercase tracking-wider">
                          {role.badge}
                        </span>
                        {isCurrent && (
                          <span className="px-3 py-1 bg-info/20 text-info rounded-full text-xs font-bold uppercase tracking-wider">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-neutral/70 font-medium mb-4">{role.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {role.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all ${isSelected
                              ? `bg-linear-to-r ${role.color} text-white border-accent/50 shadow-md`
                              : 'bg-base-200 text-neutral/70 border-accent/20'
                              }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-2 bg-accent text-primary rounded-full shrink-0 shadow-lg">
                        <Check size={20} />
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 p-8 bg-linear-to-r from-primary/5 to-secondary/5 border-t border-accent/20 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-3 text-neutral font-bold hover:bg-base-200 rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedRole === currentRole || isSaving}
            className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all duration-200 shadow-lg ${selectedRole === currentRole || isSaving
              ? 'bg-neutral/30 text-neutral/50 cursor-not-allowed'
              : 'bg-linear-to-r from-accent to-secondary text-white hover:shadow-xl'
              }`}
          >
            {isSaving ? (
              <>
                <Shield size={20} />
                Updating...
              </>
            ) : (
              <>
                <Shield size={20} />
                Update Role
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}