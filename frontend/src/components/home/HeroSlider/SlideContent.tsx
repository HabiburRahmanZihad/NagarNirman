'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

interface SlideContentProps {
  smallTitle: string;
  mainHeading: string;
  paragraph: string;
  primaryBtn: string;
  secondaryBtn: string;
}

export default function SlideContent({
  smallTitle,
  mainHeading,
  paragraph,
  primaryBtn,
  secondaryBtn
}: SlideContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl"
    >
      <div className="relative">
        <div className="absolute -inset-4 bg-black/20 rounded-2xl blur-lg -z-10" />
        
        <motion.h3
          variants={itemVariants}
          className="text-[#81d586] font-semibold text-lg mb-4 tracking-wider uppercase"
        >
          {smallTitle}
        </motion.h3>

        <motion.h1
          variants={itemVariants}
          className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
        >
          {mainHeading}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-gray-200 text-lg mb-8 leading-relaxed max-w-lg"
        >
          {paragraph}
        </motion.p>

        <motion.div
          variants={containerVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2a7d2f] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#236c27] transition-all duration-300 shadow-lg"
          >
            {primaryBtn}
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#002E2E] transition-all duration-300"
          >
            {secondaryBtn}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}