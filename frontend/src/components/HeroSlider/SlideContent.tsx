'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      duration: 1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="max-w-2xl"
    >
      <motion.h3
        variants={itemVariants}
        className="text-[#81d586] font-semibold text-xl mb-6 tracking-wider uppercase"
      >
        {smallTitle}
      </motion.h3>

      <motion.h1
        variants={itemVariants}
        className="text-6xl lg:text-7xl font-bold leading-tight mb-8"
      >
        {mainHeading}
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-gray-200 text-xl mb-12 leading-relaxed max-w-xl"
      >
        {paragraph}
      </motion.p>

      <motion.div
        variants={containerVariants}
        className="flex flex-col sm:flex-row gap-6"
      >
        <motion.button
          variants={buttonVariants}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "#1e6b23"
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#2a7d2f] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#1e6b23] transition-all duration-300 shadow-2xl border-2 border-[#2a7d2f] hover:border-[#81d586]"
        >
          {primaryBtn}
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "white",
            color: "#2a7d2f"
          }}
          whileTap={{ scale: 0.95 }}
          className="border-2 border-white text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-[#2a7d2f] transition-all duration-300"
        >
          {secondaryBtn}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}