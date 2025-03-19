'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface RouteTransitionProps {
  children: ReactNode
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
} 