'use client';

import { motion } from 'framer-motion';

interface DecorationsProps {
  imageUrl: string;
}

export default function Decorations({ imageUrl }: DecorationsProps) {
  return (
    <div className="relative">
      {/* Dotted pattern background */}
      <div className="absolute -top-8 -right-8 w-64 h-64 bg-dotted-pattern bg-cover opacity-20" />
      
      {/* Heart decoration */}
      <motion.div
        animate={{
          rotate: [0, -5, 0, 5, 0],
          scale: [1, 1.05, 1, 1.05, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-4 -left-4 z-20"
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffe733" strokeWidth="2">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>

      {/* Main circular image */}
      <motion.div
        animate={{
          y: [0, -15, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10"
      >
        <div className="w-96 h-96 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
          <img
            src={imageUrl}
            alt="Children smiling"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-8 -right-8 w-24 h-24 border-2 border-[#ffe733] rounded-full opacity-30"
      />
      
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 -left-8 w-16 h-16 border border-white rounded-full opacity-20"
      />
    </div>
  );
}