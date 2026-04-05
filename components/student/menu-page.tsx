"use client"

import { useState, useMemo } from "react"
import { QueueXLogo } from "@/components/queuex-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  useAppStore,
  getMenuItemsByOutlet,
  addToCart,
  navigate,
} from "@/lib/store"
import { Search, ShoppingCart, ArrowLeft, Clock, Plus } from "lucide-react"
import Image from "next/image"

export function MenuPage() {
  const { selectedOutlet, cart } = useAppStore()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const items = useMemo(
    () => getMenuItemsByOutlet(selectedOutlet || ""),
    [selectedOutlet]
  )

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  )

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch && item.available
    })
  }, [items, selectedCategory, search])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="gradient-bg min-h-screen p-4 pb-24 lg:p-6 lg:pb-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("outlets")}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft size={18} />
            </button>
            <QueueXLogo size="sm" />
          </div>
          <button
            onClick={() => navigate("cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </header>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{selectedOutlet}</h1>
          <p className="text-sm text-muted-foreground">Browse menu and add items to your cart</p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-xl border-border bg-secondary/50 pl-10 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => {
            const inCart = cart.find((c) => c.id === item.id)
            return (
              <div
                key={item.id}
                className="glass-strong group overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="glass rounded-lg text-xs font-medium text-foreground">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-primary">
                        {"₹"}{item.price}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {item.prepTime}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      className={`h-8 rounded-lg text-xs font-medium ${
                        inCart
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : "gradient-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      <Plus size={14} className="mr-1" />
                      {inCart ? `Added (${inCart.quantity})` : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating cart button for mobile */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden">
          <Button
            onClick={() => navigate("cart")}
            className="gradient-primary h-14 rounded-2xl px-8 text-base font-semibold text-primary-foreground shadow-xl"
          >
            <ShoppingCart size={18} className="mr-2" />
            View Cart ({cartCount} items)
          </Button>
        </div>
      )}
    </div>
  )
}
