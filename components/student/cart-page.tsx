"use client"

import { useState } from "react"
import { QueueXLogo } from "@/components/queuex-logo"
import { Button } from "@/components/ui/button"
import { useAppStore, updateCartQuantity, removeFromCart, navigate } from "@/lib/store"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Clock } from "lucide-react"
import Image from "next/image"

const pickupTimes = ["Now", "15 min", "30 min", "45 min", "1 hour"]

export function CartPage() {
  const { cart, selectedOutlet } = useAppStore()
  const [selectedTime, setSelectedTime] = useState("15 min")
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="gradient-bg flex min-h-screen flex-col items-center justify-center p-6">
        <div className="glass-strong flex flex-col items-center gap-4 rounded-2xl p-10 text-center shadow-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
            <ShoppingBag size={36} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground">Browse the menu and add delicious items</p>
          <Button
            onClick={() => navigate("menu")}
            className="gradient-primary mt-2 rounded-xl text-primary-foreground hover:opacity-90"
          >
            Browse Menu
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

      <div className="relative mx-auto max-w-2xl">
        <header className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate("menu")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft size={18} />
          </button>
          <QueueXLogo size="sm" />
        </header>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Your Cart</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {cart.length} {cart.length === 1 ? "item" : "items"} from {selectedOutlet}
        </p>

        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item.id} className="glass-strong flex items-center gap-4 rounded-2xl p-4 shadow-md">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm font-bold text-primary">{"₹"}{item.price * item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pickup Time */}
        <div className="glass-strong mt-6 rounded-2xl p-5 shadow-md">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock size={16} className="text-primary" />
            Pickup Time
          </div>
          <div className="flex flex-wrap gap-2">
            {pickupTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedTime === time
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="glass-strong mt-6 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-lg font-bold text-foreground">
            <span>Total</span>
            <span className="text-primary">{"₹"}{total}</span>
          </div>
        </div>

        <Button
          onClick={() => navigate("payment")}
          className="gradient-primary mt-6 h-14 w-full rounded-2xl text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}
