"use client"

import { QueueXLogo } from "@/components/queuex-logo"
import { selectOutlet } from "@/lib/store"
import { Coffee, ShoppingBag, Utensils, Sparkles, ArrowRight } from "lucide-react"

const outlets = [
  { name: "REC CAFE", description: "South Indian & Snacks", icon: Coffee, color: "from-primary to-primary/80" },
  { name: "REC MART", description: "Quick Bites & Beverages", icon: ShoppingBag, color: "from-accent to-accent/80" },
  { name: "HUT CAFE", description: "North Indian & Chinese", icon: Utensils, color: "from-chart-3 to-chart-3/80" },
  { name: "SIXTH SENSE", description: "Multi-Cuisine", icon: Sparkles, color: "from-chart-4 to-chart-4/80" },
]

export function OutletSelectionPage() {
  return (
    <div className="gradient-bg min-h-screen p-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <QueueXLogo />
          <div className="glass rounded-full px-4 py-2 text-sm text-muted-foreground">
            Welcome, Student
          </div>
        </header>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Select Your Outlet</h1>
          <p className="mt-2 text-muted-foreground">Choose a canteen to browse the menu and place your order</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {outlets.map((outlet) => {
            const Icon = outlet.icon
            return (
              <button
                key={outlet.name}
                onClick={() => selectOutlet(outlet.name)}
                className="glass-strong group relative flex items-center gap-5 rounded-2xl p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${outlet.color} text-primary-foreground shadow-md`}>
                  <Icon size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{outlet.name}</h3>
                  <p className="text-sm text-muted-foreground">{outlet.description}</p>
                </div>
                <ArrowRight className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" size={20} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
