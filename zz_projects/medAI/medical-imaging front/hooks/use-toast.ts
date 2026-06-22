"use client"

// Simple toast hook for notifications
import { useState, useEffect } from "react"

type ToastType = "default" | "success" | "error" | "warning" | "info" | "destructive"

interface ToastOptions {
  title: string
  description?: string
  duration?: number
  variant?: ToastType
}

// Global toast state
let toastQueue: ToastOptions[] = []
let listeners: Function[] = []

// Notify all listeners when toast queue changes
const notifyListeners = () => {
  listeners.forEach((listener) => listener(toastQueue))
}

export function toast(options: ToastOptions) {
  const toast = {
    ...options,
    duration: options.duration || 5000,
    variant: options.variant || "default",
  }

  toastQueue = [...toastQueue, toast]
  notifyListeners()

  // Auto-remove toast after duration
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t !== toast)
    notifyListeners()
  }, toast.duration)
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>(toastQueue)

  useEffect(() => {
    const handleToastChange = (newToasts: ToastOptions[]) => {
      setToasts([...newToasts])
    }

    listeners.push(handleToastChange)

    return () => {
      listeners = listeners.filter((listener) => listener !== handleToastChange)
    }
  }, [])

  return {
    toasts,
    toast,
  }
}

