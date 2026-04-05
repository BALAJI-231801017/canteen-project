"use client"

import { useState, useEffect } from "react"
import { QueueXLogo } from "@/components/queuex-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore, placeOrder, navigate } from "@/lib/store"
import { ArrowLeft, Smartphone, CheckCircle2, Shield } from "lucide-react"

export function PaymentPage() {
  const { cart } = useAppStore()
  const [upiId, setUpiId] = useState("")
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!upiId.trim()) return
    setPaying(true)
  }

  useEffect(() => {
    if (paying) {
      const timer = setTimeout(() => {
        setSuccess(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [paying])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        const now = new Date()
        const pickupTime = `${now.getHours()}:${String(now.getMinutes() + 15).padStart(2, "0")}`
        placeOrder(pickupTime)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [success])

  if (success) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center p-6">
        <div className="glass-strong flex flex-col items-center gap-6 rounded-2xl p-10 text-center shadow-xl">
          <div className="flex h-24 w-24 animate-[bounce_0.5s_ease-in-out] items-center justify-center rounded-full bg-accent/20">
            <CheckCircle2 size={48} className="text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
          <p className="text-muted-foreground">Redirecting to order tracking...</p>
        </div>
      </div>
    )
  }

  if (paying) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center p-6">
        <div className="glass-strong flex flex-col items-center gap-6 rounded-2xl p-10 text-center shadow-xl">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-secondary border-t-primary" />
          <h2 className="text-xl font-bold text-foreground">Processing Payment...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we verify your UPI transaction</p>
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
            onClick={() => navigate("cart")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft size={18} />
          </button>
          <QueueXLogo size="sm" />
        </header>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Payment</h1>
        <p className="mb-6 text-sm text-muted-foreground">Complete your order with UPI</p>

        {/* Amount */}
        <div className="glass-strong mb-6 rounded-2xl p-6 text-center shadow-md">
          <p className="text-sm text-muted-foreground">Amount to Pay</p>
          <p className="mt-1 text-4xl font-bold text-primary">{"₹"}{total}</p>
        </div>

        {/* UPI Form */}
        <form onSubmit={handlePay} className="glass-strong rounded-2xl p-6 shadow-md">
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-primary/5 p-3">
            <Smartphone size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">UPI Payment</span>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="upi-id" className="text-sm font-medium text-foreground">
              UPI ID
            </Label>
            <Input
              id="upi-id"
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="h-12 rounded-xl border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            className="gradient-primary mt-6 h-14 w-full rounded-2xl text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90"
          >
            Pay Now {"₹"}{total}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield size={14} />
            <span>Secured by UPI - 100% Safe Payment</span>
          </div>
        </form>
      </div>
    </div>
  )
}
