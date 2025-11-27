'use client';

import { motion } from 'framer-motion';

interface DecorationsProps {
  imageUrl: string;
}

export default function Decorations({ imageUrl }: DecorationsProps) {
  return (
    <div className="relative">
      {/* Main circular image container */}
      <motion.div
        animate={{
          y: [0, -20, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10"
      >
        <div className="w-[500px] h-[500px] rounded-full overflow-hidden border-8 border-white/30 shadow-2xl relative">
          <img
            src={imageUrl}
            alt="Community development"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-[#81d586] rounded-full opacity-40"
      />
      
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-8 -left-8 w-20 h-20 border-2 border-white rounded-full opacity-30"
      />

      {/* Map Pin decoration */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -5, 0, 5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-12 -right-4 z-20"
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="#81d586">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
      </motion.div>

      {/* Heart decoration */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-16 left-4 z-20"
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="#f2a921">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </motion.div>
    </div>
  );
}