"use client"

import { useAppStore } from "@/lib/store"
import { LoginPage } from "@/components/student/login-page"
import { OutletSelectionPage } from "@/components/student/outlet-selection-page"
import { MenuPage } from "@/components/student/menu-page"
import { CartPage } from "@/components/student/cart-page"
import { PaymentPage } from "@/components/student/payment-page"
import { TrackingPage } from "@/components/student/tracking-page"
import { QRPickupPage } from "@/components/student/qr-pickup-page"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminLiveOrders } from "@/components/admin/admin-live-orders"
import { AdminMenuManagement } from "@/components/admin/admin-menu-management"
import { AdminAnalytics } from "@/components/admin/admin-analytics"

export default function Home() {
  const { currentPage } = useAppStore()

  switch (currentPage) {
    case "login":
      return <LoginPage />
    case "outlets":
      return <OutletSelectionPage />
    case "menu":
      return <MenuPage />
    case "cart":
      return <CartPage />
    case "payment":
      return <PaymentPage />
    case "tracking":
      return <TrackingPage />
    case "qr-pickup":
      return <QRPickupPage />
    case "admin-dashboard":
      return (
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      )
    case "admin-orders":
      return (
        <AdminLayout>
          <AdminLiveOrders />
        </AdminLayout>
      )
    case "admin-menu":
      return (
        <AdminLayout>
          <AdminMenuManagement />
        </AdminLayout>
      )
    case "admin-analytics":
      return (
        <AdminLayout>
          <AdminAnalytics />
        </AdminLayout>
      )
    default:
      return <LoginPage />
  }
}
