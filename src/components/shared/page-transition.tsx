'use client'

import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion/variants'

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
