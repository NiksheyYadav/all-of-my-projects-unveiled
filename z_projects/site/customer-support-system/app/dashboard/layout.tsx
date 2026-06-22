import type React from "react"
import { SidebarProvider } from "@/components/sidebar-provider"
import { CustomerSidebar } from "@/components/customer-sidebar"
import { SiteHeader } from "@/components/site-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <CustomerSidebar />
        <div className="flex flex-col flex-1 transition-all duration-300">
          <SiteHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
