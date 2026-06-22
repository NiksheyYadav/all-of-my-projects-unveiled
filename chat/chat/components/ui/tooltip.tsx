"use client"

import { cn } from "@/lib/utils"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { motion } from "framer-motion"
import * as React from "react"

const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<HTMLDivElement, any>(({ className, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content ref={ref} sideOffset={6} className={cn("rounded-md bg-black text-white text-sm px-2 py-1", className)} {...props}>
      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{children}</motion.div>
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipContent, TooltipTrigger }

