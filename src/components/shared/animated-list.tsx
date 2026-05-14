'use client'

import { motion } from 'framer-motion'
import { listVariants, itemVariants } from '@/lib/motion/variants'

interface AnimatedListProps {
  children: React.ReactNode
  className?: string
}

/** Wraps a list container — staggers children on mount */
export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

/** Individual staggered item — must be inside AnimatedList */
export function AnimatedItem({ children, className }: AnimatedListProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
