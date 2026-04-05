"use client"

import { QueueXLogo } from "@/components/queuex-logo"
import { useAppStore, setAdminView, logout, navigate } from "@/lib/store"
import { LayoutDashboard, ClipboardList, UtensilsCrossed, BarChart3, LogOut } from "lucide-react"

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, page: "admin-dashboard" as const },
  { key: "orders", label: "Live Orders", icon: ClipboardList, page: "admin-orders" as const },
  { key: "menu", label: "Menu Management", icon: UtensilsCrossed, page: "admin-menu" as const },
  { key: "analytics", label: "Analytics", icon: BarChart3, page: "admin-analytics" as const },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentPage } = useAppStore()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="p-6">
          <QueueXLogo />
          <p className="mt-1 text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.page
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setAdminView(item.key)
                    navigate(item.page)
                  }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        <div className="p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
