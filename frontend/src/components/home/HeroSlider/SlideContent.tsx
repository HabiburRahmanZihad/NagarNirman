'use client';

import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { ArrowRight, PlayCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5
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
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.5
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
      key={smallTitle}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-2xl"
    >
      <div className="relative">
        <div className="absolute -inset-4 bg-black/20 rounded-2xl blur-lg -z-10" />

        <motion.h3
          variants={itemVariants}
          className="text-[#f2a921] font-semibold text-lg mb-4 tracking-wider uppercase"
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
          className="text-gray-200 mx-auto lg:mx-0 text-lg mb-8 leading-relaxed max-w-lg"
        >
          {paragraph}
        </motion.p>

        <motion.div
          variants={containerVariants}
          className="flex flex-col justify-center lg:justify-start sm:flex-row gap-4"
        >
          <motion.div variants={itemVariants}>
            <Button
              variant="primary"
              size="lg"
              iconPosition="right"
            >
              {primaryBtn}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              size="lg"
              iconPosition="right"
            >
              {secondaryBtn}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}