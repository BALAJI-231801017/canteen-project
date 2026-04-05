"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area,
  ResponsiveContainer, Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const ordersPerHourData = [
  { hour: "8AM", orders: 12 },
  { hour: "9AM", orders: 28 },
  { hour: "10AM", orders: 22 },
  { hour: "11AM", orders: 35 },
  { hour: "12PM", orders: 72 },
  { hour: "1PM", orders: 85 },
  { hour: "2PM", orders: 50 },
  { hour: "3PM", orders: 38 },
  { hour: "4PM", orders: 55 },
  { hour: "5PM", orders: 42 },
  { hour: "6PM", orders: 30 },
  { hour: "7PM", orders: 18 },
]

const revenueTrendData = [
  { date: "Feb 1", revenue: 12400 },
  { date: "Feb 5", revenue: 14200 },
  { date: "Feb 10", revenue: 13800 },
  { date: "Feb 15", revenue: 16500 },
  { date: "Feb 20", revenue: 15200 },
  { date: "Feb 24", revenue: 18300 },
]

const top5Items = [
  { name: "Masala Dosa", orders: 156 },
  { name: "Veg Biryani", orders: 134 },
  { name: "Cold Coffee", orders: 121 },
  { name: "Samosa", orders: 108 },
  { name: "Paneer Masala", orders: 95 },
]

const CHART_COLORS = ["#4a6cf7", "#22c0a0", "#5a9fd4", "#e8a838", "#d06c9e"]
const PRIMARY_COLOR = "#4a6cf7"
const ACCENT_COLOR = "#22c0a0"

export function AdminAnalytics() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Detailed insights into canteen performance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orders Per Hour */}
        <div className="glass-strong rounded-2xl p-6 shadow-md">
          <h3 className="mb-1 text-base font-semibold text-foreground">Orders Per Hour</h3>
          <p className="mb-4 text-xs text-muted-foreground">Today&apos;s order distribution</p>
          <ChartContainer
            config={{
              orders: { label: "Orders", color: PRIMARY_COLOR },
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersPerHourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "oklch(0.5 0.03 250)" }} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.03 250)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="orders" fill={PRIMARY_COLOR} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Revenue Trend */}
        <div className="glass-strong rounded-2xl p-6 shadow-md">
          <h3 className="mb-1 text-base font-semibold text-foreground">Revenue Trend</h3>
          <p className="mb-4 text-xs text-muted-foreground">Monthly revenue over time</p>
          <ChartContainer
            config={{
              revenue: { label: "Revenue (₹)", color: ACCENT_COLOR },
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "oklch(0.5 0.03 250)" }} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.03 250)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT_COLOR} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={ACCENT_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={ACCENT_COLOR} strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Top 5 Selling Items */}
        <div className="glass-strong rounded-2xl p-6 shadow-md lg:col-span-2">
          <h3 className="mb-1 text-base font-semibold text-foreground">Top 5 Selling Items</h3>
          <p className="mb-4 text-xs text-muted-foreground">Most popular items this month</p>
          <ChartContainer
            config={{
              orders: { label: "Orders", color: PRIMARY_COLOR },
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5Items} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 240)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.5 0.03 250)" }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: "oklch(0.5 0.03 250)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="orders" radius={[0, 6, 6, 0]}>
                  {top5Items.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
