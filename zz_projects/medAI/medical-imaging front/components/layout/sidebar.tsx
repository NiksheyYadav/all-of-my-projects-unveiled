"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Brain,
  FileX,
  History,
  Upload,
  Settings,
  LogOut,
  Users,
  Calendar,
  Scan,
  FileText,
  Home,
} from "lucide-react"
import { useAuth, type UserRole } from "@/components/auth/auth-provider"

interface SidebarLinkProps {
  href: string
  icon: React.ElementType
  label: string
  roles?: UserRole[]
}

const doctorLinks: SidebarLinkProps[] = [
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/dashboard/patients", icon: Users, label: "Patients" },
  { href: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { href: "/dashboard/mri", icon: Brain, label: "MRI Analysis" },
  { href: "/dashboard/ct", icon: Scan, label: "CT Analysis" },
  { href: "/dashboard/xray", icon: FileX, label: "X-Ray Analysis" },
  { href: "/dashboard/history", icon: History, label: "Analysis History" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/upload", icon: Upload, label: "Upload" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

const patientLinks: SidebarLinkProps[] = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { href: "/dashboard/results", icon: FileText, label: "My Results" },
  { href: "/dashboard/history", icon: History, label: "Medical History" },
  { href: "/dashboard/upload", icon: Upload, label: "Upload Images" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Determine which links to show based on user role
  const links = user?.role === "doctor" ? doctorLinks : patientLinks

  return (
    <div className="h-screen w-64 bg-sidebar border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">MedVision AI</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}

export function UserNav() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Avatar>
      <AvatarImage src={user.profileImage || "/placeholder-user.jpg"} alt={user.name} />
      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}

