import type React from "react"
import { SidebarProvider } from "@/components/sidebar-provider"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SiteHeader } from "@/components/site-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For login and forgot password pages, render without the admin layout
  const isAuthPage =
    typeof window !== "undefined" &&
    (window.location.pathname === "/admin/login" || window.location.pathname === "/admin/forgot-password")

  // During server rendering, we can't check window.location
  // So we'll render the full layout and let client-side code handle the auth pages
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        {!isAuthPage && <AdminSidebar />}
        <div className={`flex flex-col flex-1 transition-all duration-300 ${!isAuthPage ? "" : "w-full"}`}>
          {!isAuthPage && <SiteHeader isAdmin />}
          <main className={`flex-1 ${!isAuthPage ? "p-4 md:p-6" : ""}`}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
