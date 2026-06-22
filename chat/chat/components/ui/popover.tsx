"use client"

import { cn } from "@/lib/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { motion } from "framer-motion"
import * as React from "react"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<HTMLDivElement, any>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content ref={ref} className={cn("rounded-md bg-white/5 border border-white/10 p-3 shadow-lg", className)} {...props}>
      <motion.div initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -6, opacity: 0 }}>
        {children}
      </motion.div>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverContent, PopoverTrigger }

