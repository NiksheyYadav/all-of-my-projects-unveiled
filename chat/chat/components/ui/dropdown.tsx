"use client"

import { cn } from "@/lib/utils"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import * as React from "react"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuContent = ({ className, ...props }: any) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content className={cn("rounded-md bg-white/5 border border-white/10 p-2 shadow-lg", className)} {...props} />
  </DropdownMenuPrimitive.Portal>
)

const DropdownMenuItem = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref} className={cn("px-3 py-2 rounded-md text-sm hover:bg-white/5 cursor-pointer", className)} {...props} />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }

