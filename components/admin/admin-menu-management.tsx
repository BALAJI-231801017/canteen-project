"use client"

import { useState } from "react"
import { getMenuItems, toggleItemAvailability } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit } from "lucide-react"
import Image from "next/image"

export function AdminMenuManagement() {
  const items = getMenuItems()
  const [search, setSearch] = useState("")
  const [selectedOutlet, setSelectedOutlet] = useState("All")

  const outlets = ["All", ...Array.from(new Set(items.map((i) => i.outlet)))]

  const filtered = items.filter((item) => {
    const matchOutlet = selectedOutlet === "All" || item.outlet === selectedOutlet
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchOutlet && matchSearch
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Menu Management</h1>
          <p className="text-sm text-muted-foreground">Add, edit, and manage menu items</p>
        </div>
        <Button className="gradient-primary rounded-xl text-primary-foreground hover:opacity-90">
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl border-border bg-secondary/50 pl-10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          {outlets.map((outlet) => (
            <button
              key={outlet}
              onClick={() => setSelectedOutlet(outlet)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedOutlet === outlet
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {outlet}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="glass-strong overflow-hidden rounded-2xl shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Item</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Outlet</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Price</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Prep Time</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Available</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-border/50 transition-colors hover:bg-secondary/20">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{item.outlet}</td>
                <td className="px-5 py-3 text-sm font-semibold text-foreground">{"₹"}{item.price}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{item.prepTime}</td>
                <td className="px-5 py-3">
                  <Switch
                    checked={item.available}
                    onCheckedChange={() => toggleItemAvailability(item.id)}
                  />
                </td>
                <td className="px-5 py-3">
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-muted-foreground hover:text-foreground">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
