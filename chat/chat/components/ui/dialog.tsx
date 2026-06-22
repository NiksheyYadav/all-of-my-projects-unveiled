"use client"

import { cn } from "@/lib/utils"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import * as React from "react"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = ({ children, ...props }: any) => (
  <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>
)

const DialogOverlay = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    asChild
    ref={ref}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn("fixed inset-0 bg-black/50")}
    />
  </DialogPrimitive.Overlay>
))
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef<HTMLDivElement, any>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/5 border border-white/10 p-6 shadow-lg",
        className
      )}
      {...props}
    >
      <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}>
        {children}
        <DialogPrimitive.Close className="absolute right-3 top-3 inline-flex items-center justify-center rounded-md p-1 hover:bg-white/5">
          <X className="w-4 h-4" />
        </DialogPrimitive.Close>
      </motion.div>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
)

const DialogTitle = React.forwardRef<HTMLHeadingElement, any>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, any>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-white/60", className)} {...props} />
))
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger }

