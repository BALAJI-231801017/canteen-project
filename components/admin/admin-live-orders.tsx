"use client"

import { useAppStore, updateOrderStatus } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, ChefHat } from "lucide-react"

export function AdminLiveOrders() {
  const { orders } = useAppStore()

  const activeOrders = orders.filter((o) => o.status !== "ready")
  const readyOrders = orders.filter((o) => o.status === "ready")

  function getStatusBadge(status: string) {
    switch (status) {
      case "placed":
        return <Badge variant="outline" className="border-chart-4/30 bg-chart-4/10 text-chart-4">Placed</Badge>
      case "preparing":
        return <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Preparing</Badge>
      case "ready":
        return <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">Ready</Badge>
      default:
        return null
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Live Orders</h1>
        <p className="text-sm text-muted-foreground">Manage incoming and active orders</p>
      </div>

      {/* Active Orders */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          <Clock size={18} className="text-primary" />
          Active Orders ({activeOrders.length})
        </h2>
        <div className="glass-strong overflow-hidden rounded-2xl shadow-md">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Order ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Items</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Outlet</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 transition-colors hover:bg-secondary/20">
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{order.id}</td>
                  <td className="px-5 py-4 text-sm text-foreground">
                    {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{order.outlet}</td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{"₹"}{order.total}</td>
                  <td className="px-5 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {order.status === "placed" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "preparing")}
                          className="h-8 rounded-lg bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                        >
                          <ChefHat size={14} className="mr-1" />
                          Preparing
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "ready")}
                          className="h-8 rounded-lg bg-accent text-xs text-accent-foreground hover:bg-accent/90"
                        >
                          <CheckCircle2 size={14} className="mr-1" />
                          Ready
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {activeOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No active orders at the moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ready Orders */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          <CheckCircle2 size={18} className="text-accent" />
          Ready for Pickup ({readyOrders.length})
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {readyOrders.map((order) => (
            <div key={order.id} className="glass-strong rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{order.id}</span>
                {getStatusBadge(order.status)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{order.outlet}</p>
              <p className="mt-1 text-sm text-foreground">
                {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
              </p>
              <p className="mt-2 text-base font-bold text-primary">{"₹"}{order.total}</p>
            </div>
          ))}
          {readyOrders.length === 0 && (
            <div className="glass-strong col-span-full rounded-2xl p-8 text-center text-sm text-muted-foreground shadow-md">
              No orders ready for pickup
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
