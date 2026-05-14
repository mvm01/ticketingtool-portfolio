import type { Variants } from 'framer-motion'

/** Fade + slide up — used for page entry */
export const pageVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
  },
}

/** Container that staggers its children */
export const listVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

/** Single staggered item — fade + slide up */
export const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.25, 0.1, 0.25, 1] },
  },
}

/** Slide in from the right — mobile step transitions */
export const slideRightVariants: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.24, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    x: -32,
    transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
  },
}

/** Stat card — fade + scale up */
export const statVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
  },
}
