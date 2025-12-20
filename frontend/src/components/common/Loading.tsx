'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

interface FullPageLoadingProps {
  text?: string;
  subtext?: string;
  showOverlay?: boolean;
}

interface InlineLoadingProps {
  text?: string;
}

// ============================================
// INLINE LOADING (for sections/components)
// ============================================
const Loading: React.FC<LoadingProps> = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8"
    >
      <div className="relative">
        {/* Outer animated ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-[#2a7d2f] border-r-[#81d586]`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner pulsing dot */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#81d586] opacity-30"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      {text && (
        <motion.p
          className="mt-4 text-[#6B7280] font-medium"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

// ============================================
// INLINE LOADING (alternative variant)
// ============================================
export const InlineLoading: React.FC<InlineLoadingProps> = ({ text = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-12"
    >
      {/* Three bouncing dots */}
      <div className="flex gap-2 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-linear-to-br from-[#2a7d2f] to-[#81d586]"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      <p className="text-[#6B7280] font-medium text-sm">{text}</p>
    </motion.div>
  );
};

// ============================================
// FULL PAGE LOADING (prevents scroll & clicks)
// ============================================
export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  text = 'Loading...',
  subtext = '',
  showOverlay = true,
}) => {
  // Prevent scroll when component mounts
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.documentElement).overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = originalStyle;
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-9999 flex items-center justify-center ${showOverlay
        ? 'bg-white/95 backdrop-blur-md'
        : 'bg-white'
        }`}
      style={{
        pointerEvents: 'auto', // Prevent all clicks
      }}
    >
      {/* Loading container with animation */}
      <motion.div
        className="flex flex-col items-center justify-center gap-6"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Main animated spinner with gradient */}
        <motion.div className="relative w-24 h-24">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2a7d2f] border-r-[#81d586] border-b-[#2a7d2f]/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Middle counter-rotating ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent border-l-[#81d586] border-b-[#2a7d2f]/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-6 rounded-full bg-linear-to-br from-[#2a7d2f]/10 to-[#81d586]/10 border-2 border-[#2a7d2f]/20"
            animate={{
              scale: [0.8, 1.1, 0.8],
              boxShadow: [
                '0 0 0 0 rgba(42, 125, 47, 0.4)',
                '0 0 0 20px rgba(42, 125, 47, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Center dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2a7d2f]"
            animate={{
              boxShadow: [
                '0 0 10px rgba(42, 125, 47, 0.8)',
                '0 0 20px rgba(42, 125, 47, 0.4)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Loading text with animation */}
        <div className="text-center">
          <motion.h3
            className="text-xl font-bold text-[#2a7d2f] mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.h3>

          {/* Dots animation beneath text */}
          <div className="flex gap-1 justify-center mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#81d586]"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        {/* Subtle background shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            background: [
              'linear-gradient(0deg, transparent, rgba(42, 125, 47, 0.1))',
              'linear-gradient(90deg, transparent, rgba(42, 125, 47, 0.1))',
              'linear-gradient(180deg, transparent, rgba(42, 125, 47, 0.1))',
              'linear-gradient(270deg, transparent, rgba(42, 125, 47, 0.1))',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Loading;
