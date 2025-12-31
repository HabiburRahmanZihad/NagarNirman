"use client";

import { motion } from "framer-motion";
import { useState } from "react";


// Props for ToggleStatusSwitch component
interface ToggleStatusSwitchProps {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
}

export default function ToggleStatusSwitch({ isActive, onToggle }: ToggleStatusSwitchProps) {
  const [loading, setLoading] = useState(false);


  // Handle toggle action
  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(!isActive);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2a7d2f] focus:ring-offset-2 shadow-inner ${
        isActive 
          ? 'bg-linear-to-r from-[#2a7d2f] to-[#1e5c22]' 
          : 'bg-linear-to-r from-gray-400 to-gray-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <motion.span
        initial={false}
        animate={{
          x: isActive ? 32 : 4,
          backgroundColor: isActive ? '#ffffff' : '#f3f4f6'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`inline-block h-5 w-5 transform rounded-full shadow-lg border border-gray-200 ${
          loading ? 'opacity-70' : ''
        }`}
      />
      
      {/* Status Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          className="text-xs text-white font-bold"
        >
          ✓
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 0 : 1 }}
          className="text-xs text-white font-bold"
        >
          ✕
        </motion.span>
      </div>
    </motion.button>
  );
}