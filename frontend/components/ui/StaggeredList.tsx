'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggeredListProps {
  children: ReactNode;
  staggerDelay?: number;
  animation?: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale';
  duration?: number;
  className?: string;
  itemClassName?: string;
  once?: boolean;
}

export default function StaggeredList({
  children,
  staggerDelay = 100,
  animation = 'fade-up',
  duration = 500,
  className = '',
  itemClassName = '',
  once = true,
}: StaggeredListProps) {
  const staggerInSeconds = staggerDelay / 1000;
  const durationInSeconds = duration / 1000;

  const getVariants = () => {
    switch (animation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, x: 0 },
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  const itemVariants = getVariants();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerInSeconds,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{
                duration: durationInSeconds,
                ease: 'easeOut',
              }}
              className={itemClassName}
            >
              {child}
            </motion.div>
          ))
        : <motion.div
            variants={itemVariants}
            transition={{
              duration: durationInSeconds,
              ease: 'easeOut',
            }}
            className={itemClassName}
          >
            {children}
          </motion.div>
      }
    </motion.div>
  );
}
