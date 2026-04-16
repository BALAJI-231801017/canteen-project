"use client"

import { useEffect, useState } from "react"
import { QueueXLogo } from "@/components/queuex-logo"
import { selectOutlet } from "@/lib/store"
import { apiClient, Outlet } from "@/lib/api-client"
import { Coffee, ShoppingBag, Utensils, Sparkles, ArrowRight, Loader2 } from "lucide-react"

const iconMap: Record<string, any> = {
  "REC CAFE": Coffee,
  "REC MART": ShoppingBag,
  "HUT CAFE": Utensils,
  "SIXTH SENSE": Sparkles,
}

const colorMap: Record<string, string> = {
  "REC CAFE": "from-primary to-primary/80",
  "REC MART": "from-accent to-accent/80",
  "HUT CAFE": "from-chart-3 to-chart-3/80",
  "SIXTH SENSE": "from-chart-4 to-chart-4/80",
}

export function OutletSelectionPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadOutlets() {
      try {
        const data = await apiClient.getOutlets()
        setOutlets(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load outlets")
      } finally {
        setIsLoading(false)
      }
    }
    loadOutlets()
  }, [])

  const handleSelectOutlet = (outlet: Outlet) => {
    localStorage.setItem("selected_outlet", JSON.stringify(outlet))
    selectOutlet(outlet.name)
  }
  if (isLoading) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center p-6">
        <div className="glass-strong flex flex-col items-center gap-4 rounded-2xl p-10 text-center shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-foreground">Loading outlets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center p-6">
        <div className="glass-strong flex flex-col items-center gap-4 rounded-2xl p-10 text-center shadow-lg">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

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
            const Icon = iconMap[outlet.name] || Coffee
            const color = colorMap[outlet.name] || "from-primary to-primary/80"
            return (
              <button
                key={outlet.id}
                onClick={() => handleSelectOutlet(outlet)}
                className="glass-strong group relative flex items-center gap-5 rounded-2xl p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-primary-foreground shadow-md`}>
                  <Icon size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{outlet.name}</h3>
                  <p className="text-sm text-muted-foreground">{outlet.location}</p>
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
