"use client"

import { QueueXLogo } from "@/components/queuex-logo"
import { Button } from "@/components/ui/button"
import { useAppStore, navigate } from "@/lib/store"
import { MapPin, ArrowLeft } from "lucide-react"

function QRCodeSVG({ value }: { value: string }) {
  // Simple QR-style visual representation
  const hash = Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const grid = Array.from({ length: 21 }, (_, row) =>
    Array.from({ length: 21 }, (_, col) => {
      // Fixed patterns for QR corners
      if (row < 7 && col < 7) return true
      if (row < 7 && col > 13) return true
      if (row > 13 && col < 7) return true
      // Data area - pseudo-random based on hash
      return ((hash * (row + 1) * (col + 1)) % 7) < 3
    })
  )

  return (
    <svg viewBox="0 0 21 21" className="h-full w-full">
      {grid.map((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              className="fill-foreground"
            />
          ) : null
        )
      )}
    </svg>
  )
}

export function QRPickupPage() {
  const { currentOrder } = useAppStore()

  if (!currentOrder) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center p-6">
        <div className="glass-strong rounded-2xl p-10 text-center shadow-lg">
          <h2 className="text-xl font-bold text-foreground">No active order</h2>
          <Button onClick={() => navigate("outlets")} className="mt-4 gradient-primary text-primary-foreground rounded-xl">
            Browse Outlets
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg min-h-screen p-4 lg:p-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-md">
        <header className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate("tracking")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft size={18} />
          </button>
          <QueueXLogo size="sm" />
        </header>

        <div className="glass-strong flex flex-col items-center rounded-2xl p-8 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">Pickup QR Code</h1>
            <p className="mt-1 text-sm text-muted-foreground">Show this code at the counter</p>
          </div>

          <div className="mb-6 h-56 w-56 rounded-2xl bg-primary-foreground p-4 shadow-lg">
            <QRCodeSVG value={currentOrder.id} />
          </div>

          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-3xl font-bold text-primary">{currentOrder.id}</p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
            <MapPin size={16} />
            <span className="font-medium">Pickup at: {currentOrder.outlet}</span>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Present this QR code to the staff at the selected outlet for order verification and pickup.
          </p>

          <Button
            onClick={() => navigate("outlets")}
            className="mt-6 h-12 w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Order Again
          </Button>
        </div>
      </div>
    </div>
  )
}
