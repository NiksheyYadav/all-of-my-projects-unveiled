"use client"

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import * as React from 'react'

type MotionDivProps = React.ComponentProps<typeof motion.div>

interface ListItemProps extends MotionDivProps {
  onActivate?: () => void
}

export const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(({ className, children, onActivate, onKeyDown, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate?.()
        }
        onKeyDown?.(e)
      }}
      className={cn('w-full text-left p-4 rounded-xl transition-all duration-200 group', className)}
      {...(props as MotionDivProps)}
    >
      {children}
    </motion.div>
  )
})
ListItem.displayName = 'ListItem'
