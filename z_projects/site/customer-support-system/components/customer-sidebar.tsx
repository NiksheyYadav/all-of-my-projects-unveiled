"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"
import { FileText, Home, LogOut, MessageSquare, Sun, User, ChevronLeft, Menu, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function CustomerSidebar() {
  const { isOpen, isMobile, toggle, close } = useSidebar()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return a simpler version during server rendering
  if (!mounted) {
    return (
      <div className="fixed inset-y-0 z-50 flex h-full flex-col border-r bg-background">
        <div className="flex h-12 items-center justify-between border-b px-4 bg-zinc-800 text-white">
          <div className="flex items-center gap-2 font-semibold">
            <Sun className="h-5 w-5" />
            <span>Akshat Udyam</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={close} aria-hidden="true" />
      )}

      {/* Sidebar toggle button for mobile */}
      {isMobile && !isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="fixed left-4 top-4 z-50 h-8 w-8 rounded-full bg-zinc-800 text-white shadow-md md:hidden"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      )}

      <div
        className={cn(
          "fixed inset-y-0 z-50 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isMobile
            ? isOpen
              ? "left-0 w-[240px]"
              : "-left-[240px] w-[240px]"
            : isOpen
              ? "left-0 w-[240px]"
              : "-left-[240px] w-[240px]",
        )}
      >
        <div className="flex h-12 items-center justify-between border-b px-4 bg-zinc-800 text-white">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Sun className="h-5 w-5" />
            <span>Akshat Udyam</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8 text-white">
            <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-1">
          <nav className="grid gap-0.5 px-2">
            <NavItem href="/dashboard" icon={Home} label="Dashboard" />
            <NavItem href="/dashboard/solar-systems" icon={Sun} label="My Solar System" />
            <NavItem href="/dashboard/energy-usage" icon={Zap} label="Energy Usage" />
            <NavItem href="/dashboard/invoices" icon={FileText} label="Invoices" />
            <NavItem href="/dashboard/support" icon={MessageSquare} label="Support" />
            <NavItem href="/dashboard/profile" icon={User} label="Profile" />
          </nav>
        </ScrollArea>
        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 text-xs">
              <div className="font-medium">Customer User</div>
              <div className="text-muted-foreground">customer@example.com</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-7 w-7"
              title="Sign out"
              onClick={() => router.push("/login")}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ElementRef<typeof Home>
  label: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href
  const { isMobile, close } = useSidebar()

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "transparent",
      )}
      onClick={isMobile ? close : undefined}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}
