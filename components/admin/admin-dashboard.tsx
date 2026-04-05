"use client"

import { useAppStore, getMenuItems } from "@/lib/store"
import { ShoppingBag, DollarSign, TrendingUp, Clock } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const revenueData = [
  { day: "Mon", revenue: 4200 },
  { day: "Tue", revenue: 3800 },
  { day: "Wed", revenue: 5100 },
  { day: "Thu", revenue: 4600 },
  { day: "Fri", revenue: 6200 },
  { day: "Sat", revenue: 3200 },
  { day: "Sun", revenue: 2800 },
]

const peakHourData = [
  { hour: "8AM", orders: 12 },
  { hour: "9AM", orders: 25 },
  { hour: "10AM", orders: 18 },
  { hour: "11AM", orders: 30 },
  { hour: "12PM", orders: 65 },
  { hour: "1PM", orders: 78 },
  { hour: "2PM", orders: 45 },
  { hour: "3PM", orders: 35 },
  { hour: "4PM", orders: 48 },
  { hour: "5PM", orders: 40 },
  { hour: "6PM", orders: 32 },
]

const PRIMARY_COLOR = "#4a6cf7"
const ACCENT_COLOR = "#22c0a0"

export function AdminDashboard() {
  const { orders } = useAppStore()
  const menuItems = getMenuItems()

  const todayOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const mostOrdered = menuItems[0]?.name || "Masala Dosa"
  const avgPrepTime = "12 min"

  const stats = [
    { label: "Total Orders Today", value: todayOrders, icon: ShoppingBag, color: "bg-primary/10 text-primary" },
    { label: "Total Revenue", value: `₹${totalRevenue}`, icon: DollarSign, color: "bg-accent/10 text-accent" },
    { label: "Most Ordered", value: mostOrdered, icon: TrendingUp, color: "bg-chart-3/10 text-chart-3" },
    { label: "Avg Prep Time", value: avgPrepTime, icon: Clock, color: "bg-chart-4/10 text-chart-4" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of today&apos;s canteen operations</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-strong rounded-2xl p-5 shadow-md">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="glass-strong rounded-2xl p-6 shadow-md">
          <h3 className="mb-4 text-base font-semibold text-foreground">Weekly Revenue</h3>
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: PRIMARY_COLOR },
            }}
            className="h-[260px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "oklch(0.5 0.03 250)" }} />
                <YAxis tick={{ fontSize: 12, fill: "oklch(0.5 0.03 250)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill={PRIMARY_COLOR} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Peak Hours Chart */}
        <div className="glass-strong rounded-2xl p-6 shadow-md">
          <h3 className="mb-4 text-base font-semibold text-foreground">Peak Hours</h3>
          <ChartContainer
            config={{
              orders: { label: "Orders", color: ACCENT_COLOR },
            }}
            className="h-[260px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "oklch(0.5 0.03 250)" }} />
                <YAxis tick={{ fontSize: 12, fill: "oklch(0.5 0.03 250)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="orders" stroke={ACCENT_COLOR} strokeWidth={2} dot={{ r: 4, fill: ACCENT_COLOR }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
