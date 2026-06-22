"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type SidebarContextType = {
  isOpen: boolean
  isMobile: boolean
  toggle: () => void
  close: () => void
  open: () => void
}

// Create a default context value to prevent errors during server rendering
const defaultContextValue: SidebarContextType = {
  isOpen: true,
  isMobile: false,
  toggle: () => {},
  close: () => {},
  open: () => {},
}

const SidebarContext = createContext<SidebarContextType>(defaultContextValue)

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(defaultOpen)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [defaultOpen])

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  return <SidebarContext.Provider value={{ isOpen, isMobile, toggle, close, open }}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
  return useContext(SidebarContext)
}
