"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"
import { CreditCard, HelpCircle, Home, LifeBuoy, LogOut, MessageSquare, Settings, Ticket, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MainSidebar() {
  const { isOpen, isMobile } = useSidebar()

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex h-full flex-col border-r bg-background",
        isMobile ? "animate-in slide-in-from-left w-[80%] max-w-xs" : "w-[240px]",
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LifeBuoy className="h-5 w-5" />
          <span>Support Center</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          <NavItem href="/dashboard" icon={Home} label="Dashboard" />
          <NavItem href="/tickets" icon={Ticket} label="My Tickets" />
          <NavItem href="/chat" icon={MessageSquare} label="Live Chat" />
          <NavItem href="/faq" icon={HelpCircle} label="FAQ" />
          <NavItem href="/billing" icon={CreditCard} label="Billing" />
          <NavItem href="/profile" icon={User} label="Profile" />
          <NavItem href="/settings" icon={Settings} label="Settings" />
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-sm">
            <div className="font-medium">John Doe</div>
            <div className="text-muted-foreground">john@example.com</div>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" title="Sign out">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </div>
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

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "transparent",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}
