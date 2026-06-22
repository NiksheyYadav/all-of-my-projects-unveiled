"use client"

import { cn } from "@/lib/utils"
import * as SelectPrimitive from "@radix-ui/react-select"
import * as React from "react"

const Select = SelectPrimitive.Root
const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref} className={cn("inline-flex items-center justify-between rounded-md px-3 py-2 bg-white/5 border border-white/10", className)} {...props}>
    {children}
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = ({ className, ...props }: any) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content className={cn("rounded-md bg-white/5 border border-white/10 p-2 shadow-lg", className)} {...props} />
  </SelectPrimitive.Portal>
)

const SelectItem = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof SelectPrimitive.Item>>(({ className, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref} className={cn("px-3 py-2 rounded-md text-sm hover:bg-white/5 cursor-pointer", className)} {...props} />
))
SelectItem.displayName = "SelectItem"

export { Select, SelectContent, SelectItem, SelectTrigger }

