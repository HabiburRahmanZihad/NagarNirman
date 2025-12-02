'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Home, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NotFoundDisplayProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

interface InlineNotFoundProps {
  title?: string;
  message?: string;
}

interface NotFoundProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

// ============================================
// INLINE NOT FOUND (for sections/components)
// ============================================
const InlineNotFound: React.FC<InlineNotFoundProps> = ({
  title = 'Not Found',
  message = 'The item you are looking for does not exist.',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 my-4"
    >
      <div className="flex gap-4">
        <div className="shrink-0">
          <Search className="w-12 h-12 text-amber-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-900 mb-1">{title}</h3>
          <p className="text-amber-700">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// NOT FOUND DISPLAY (card component)
// ============================================
const NotFoundDisplay: React.FC<NotFoundDisplayProps> = ({
  title = 'Not Found',
  message = 'The item you are looking for does not exist or has been removed.',
  showHomeButton = true,
  showBackButton = true,
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-amber-100 p-12 text-center max-w-md mx-auto"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -10, 10, -5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex justify-center mb-6"
      >
        <div className="p-4 bg-amber-50 rounded-full">
          <Search className="w-16 h-16 text-amber-500" />
        </div>
      </motion.div>

      {/* Content */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-xl text-amber-600 mb-3 font-semibold">404</p>
      <p className="text-gray-600 mb-8">{message}</p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {showBackButton && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back
          </motion.button>
        )}

        {showHomeButton && (
          <Link href="/" className="w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2a7d2f] text-white rounded-lg hover:bg-[#236b27] transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// FULL PAGE NOT FOUND (prevents interaction)
// ============================================
const NotFound: React.FC<NotFoundProps> = ({
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or has been removed.',
  showHomeButton = true,
  showBackButton = true,
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-white/95 backdrop-blur-md"
      style={{ pointerEvents: 'auto' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-col items-center justify-center gap-6 text-center max-w-md p-6"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -15, 15, -8, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="p-8 bg-amber-50 rounded-full"
        >
          <Search className="w-20 h-20 text-amber-500" />
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-amber-500"
        >
          404
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-gray-900"
        >
          {title}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 max-w-xs"
        >
          {message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 w-full"
        >
          {showBackButton && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              <ChevronLeft className="w-5 h-5" />
              Go Back
            </motion.button>
          )}

          {showHomeButton && (
            <Link href="/" className="w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2a7d2f] text-white rounded-xl hover:bg-[#236b27] transition-colors font-semibold"
              >
                <Home className="w-5 h-5" />
                Go Home
              </motion.button>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export { InlineNotFound, NotFoundDisplay };
export default NotFound;
