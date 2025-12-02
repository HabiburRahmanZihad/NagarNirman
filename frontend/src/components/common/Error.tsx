'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onRetry?: () => void;
  retryText?: string;
}

interface InlineErrorProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
}

interface FullPageErrorProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onRetry?: () => void;
  retryText?: string;
  errorCode?: number;
}

// ============================================
// INLINE ERROR (for sections/components)
// ============================================
export const InlineError: React.FC<InlineErrorProps> = ({
  title,
  message,
  icon = <AlertCircle className="w-12 h-12 text-red-500" />,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 my-4"
    >
      <div className="flex gap-4">
        <div className="shrink-0">{icon}</div>
        <div className="flex-1">
          {title && <h3 className="text-lg font-semibold text-red-900 mb-1">{title}</h3>}
          <p className="text-red-700">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// ERROR DISPLAY (card component)
// ============================================
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred. Please try again.',
  icon = <AlertCircle className="w-16 h-16 text-red-500" />,
  showHomeButton = true,
  showBackButton = false,
  onRetry,
  retryText = 'Try Again',
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-red-100 p-12 text-center max-w-md mx-auto"
    >
      <motion.div
        animate={{ rotate: [0, -5, 5, -5, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        {icon}
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 mb-8">{message}</p>

      <div className="flex flex-col gap-3">
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            {retryText}
          </motion.button>
        )}

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
// FULL PAGE ERROR (prevents interaction)
// ============================================
export const FullPageError: React.FC<FullPageErrorProps> = ({
  title,
  message,
  icon,
  showHomeButton = true,
  showBackButton = false,
  onRetry,
  retryText = 'Try Again',
  errorCode,
}) => {
  const router = useRouter();

  const defaultTitles: Record<number, string> = {
    404: 'Page Not Found',
    500: 'Server Error',
    503: 'Service Unavailable',
    401: 'Unauthorized',
    403: 'Forbidden',
  };

  const defaultMessages: Record<number, string> = {
    404: 'The page you are looking for does not exist.',
    500: 'Something went wrong on our end. Please try again later.',
    503: 'Our service is temporarily unavailable. Please try again soon.',
    401: 'You are not authorized to access this resource.',
    403: 'You do not have permission to access this resource.',
  };

  const displayTitle = title || (errorCode ? defaultTitles[errorCode] : 'Something Went Wrong');
  const displayMessage =
    message || (errorCode ? defaultMessages[errorCode] : 'An unexpected error occurred.');
  const displayIcon = icon || <AlertCircle className="w-24 h-24 text-red-500" />;

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
        {/* Error Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-6 bg-red-50 rounded-full"
        >
          {displayIcon}
        </motion.div>

        {/* Error Code (if provided) */}
        {errorCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-red-600"
          >
            {errorCode}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900"
        >
          {displayTitle}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600"
        >
          {displayMessage}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 w-full"
        >
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              {retryText}
            </motion.button>
          )}

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

export default ErrorDisplay;
