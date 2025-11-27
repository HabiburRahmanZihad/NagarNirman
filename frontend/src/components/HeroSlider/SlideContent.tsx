'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
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
        className="text-[#ffe733] font-semibold text-lg mb-4 tracking-wide"
      >
        {smallTitle}
      </motion.h3>

      <motion.h1
        variants={itemVariants}
        className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
      >
        {mainHeading}
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg"
      >
        {paragraph}
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          variants={buttonVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#ffe733] text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-colors duration-300 shadow-lg"
        >
          {primaryBtn}
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
        >
          {secondaryBtn}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}