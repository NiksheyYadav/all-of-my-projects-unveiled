"use client"
import { useSidebar } from "@/components/sidebar-provider"
import { Bell, Menu, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useRouter } from "next/navigation"

export function SiteHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  const { toggle } = useSidebar()
  const router = useRouter()

  const handleLogout = () => {
    if (isAdmin) {
      router.push("/admin/login")
    } else {
      router.push("/login")
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex items-center gap-2">
        <Sun className="h-5 w-5" />
        <span className="font-semibold">{isAdmin ? "Admin Portal" : "Customer Portal"}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ModeToggle />
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
