'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface DecorationsProps {
  imageUrl: string;
}

export default function Decorations({ imageUrl }: DecorationsProps) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="w-96 h-96 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
          <Image
            width={500}
            height={500}
            src={imageUrl}
            alt="Community development"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 -left-4 z-20"
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#f2a921" strokeWidth="1">
          <path d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"/>
        </svg>
      </motion.div>
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 -right-10 z-20"
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#f2a921" strokeWidth="1">
          <path d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"/>
        </svg>
      </motion.div>
      

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
        className="absolute -bottom-8 -right-8 w-32 h-32 border-2 border-[#f2a921] rounded-full opacity-40"
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
        className="absolute top-1/2 -left-8 w-20 h-20 border border-[#f2a921] rounded-full opacity-20"
      />

      <div className="absolute inset-0 -z-10 bg-dotted-pattern opacity-20" />
    </div>
  );
}