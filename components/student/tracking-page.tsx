"use client"

import { useState, useEffect } from "react"
import { QueueXLogo } from "@/components/queuex-logo"
import { Button } from "@/components/ui/button"
import { useAppStore, navigate } from "@/lib/store"
import { apiClient, Order } from "@/lib/api-client"
import { CheckCircle2, Circle, Package, ChefHat, Clock, Loader2 } from "lucide-react"

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready for Pickup", icon: CheckCircle2 },
] as const

export function TrackingPage() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    async function loadOrder() {
      try {
        const orderData = localStorage.getItem("current_order")
        if (!orderData) {
          setIsLoading(false)
          return
        }
        
        const order = JSON.parse(orderData)
        const data = await apiClient.getOrder(order.id)
        setCurrentOrder(data.order)
      } catch (err) {
        console.error("Failed to load order:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadOrder()
  }, [])

  useEffect(() => {
    if (!currentOrder) return
    
    // Auto-refresh order status every 10 seconds
    const refreshInterval = setInterval(async () => {
      try {
        const data = await apiClient.getOrder(currentOrder.id)
        setCurrentOrder(data.order)
      } catch (err) {
        console.error("Failed to refresh order:", err)
      }
    }, 10000)
    
    return () => clearInterval(refreshInterval)
  }, [currentOrder])

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center p-6">
        <div className="glass-strong flex flex-col items-center gap-4 rounded-2xl p-10 text-center shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-foreground">Loading order...</p>
        </div>
      </div>
    )
  }

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

  const statusIndex = statusSteps.findIndex((s) => s.key === currentOrder.status)
  const progressWidth = currentOrder.status === "placed" ? "16%" : currentOrder.status === "preparing" ? "50%" : "100%"

  const remainingMinutes = Math.max(0, 15 - Math.floor(elapsed / 60))
  const remainingSeconds = Math.max(0, 59 - (elapsed % 60))

  return (
    <div className="gradient-bg min-h-screen p-4 lg:p-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-md">
        <header className="mb-6 flex items-center justify-center">
          <QueueXLogo />
        </header>

        <div className="glass-strong rounded-2xl p-6 shadow-xl">
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-2xl font-bold text-foreground">{currentOrder.id}</p>
            <p className="mt-1 text-sm text-muted-foreground">{currentOrder.outlet}</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          {/* Status Steps */}
          <div className="flex flex-col gap-5">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = index <= statusIndex
              const isCurrent = index === statusIndex
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? "gradient-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground"
                    } ${isCurrent ? "animate-pulse" : ""}`}
                  >
                    {isActive ? <Icon size={22} /> : <Circle size={22} />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary">In progress...</p>
                    )}
                    {index < statusIndex && (
                      <p className="text-xs text-accent">Completed</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Timer */}
          {currentOrder.status !== "ready" && (
            <div className="mt-8 flex items-center justify-center gap-3 rounded-xl bg-primary/5 p-4">
              <Clock size={20} className="text-primary" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Estimated Time</p>
                <p className="text-xl font-bold font-mono text-foreground">
                  {String(remainingMinutes).padStart(2, "0")}:{String(remainingSeconds).padStart(2, "0")}
                </p>
              </div>
            </div>
          )}

          {/* Ready for pickup */}
          {currentOrder.status === "ready" && (
            <Button
              onClick={() => navigate("qr-pickup")}
              className="gradient-primary mt-6 h-14 w-full rounded-2xl text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90"
            >
              Show QR for Pickup
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
