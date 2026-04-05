"use client"

import { useSyncExternalStore } from "react"

export type MenuItem = {
  id: string
  name: string
  price: number
  category: string
  prepTime: string
  image: string
  available: boolean
  outlet: string
}

export type CartItem = MenuItem & {
  quantity: number
}

export type OrderStatus = "placed" | "preparing" | "ready"

export type Order = {
  id: string
  items: CartItem[]
  total: number
  status: OrderStatus
  outlet: string
  pickupTime: string
  createdAt: Date
}

export type AppState = {
  currentPage: "login" | "outlets" | "menu" | "cart" | "payment" | "tracking" | "qr-pickup" | "admin-dashboard" | "admin-orders" | "admin-menu" | "admin-analytics"
  user: { name: string; collegeId: string } | null
  selectedOutlet: string | null
  cart: CartItem[]
  orders: Order[]
  currentOrder: Order | null
  adminView: string
}

const menuData: MenuItem[] = [
  // REC CAFE
  { id: "rc1", name: "Masala Dosa", price: 60, category: "Breakfast", prepTime: "10 min", image: "/images/food-1.jpg", available: true, outlet: "REC CAFE" },
  { id: "rc2", name: "Chai & Biscuits", price: 30, category: "Beverages", prepTime: "5 min", image: "/images/food-2.jpg", available: true, outlet: "REC CAFE" },
  { id: "rc3", name: "Veg Sandwich", price: 50, category: "Snacks", prepTime: "8 min", image: "/images/food-3.jpg", available: true, outlet: "REC CAFE" },
  { id: "rc4", name: "Samosa (2 pcs)", price: 25, category: "Snacks", prepTime: "5 min", image: "/images/food-4.jpg", available: true, outlet: "REC CAFE" },
  { id: "rc5", name: "Fresh Juice", price: 45, category: "Beverages", prepTime: "5 min", image: "/images/food-5.jpg", available: true, outlet: "REC CAFE" },
  { id: "rc6", name: "Veg Biryani", price: 90, category: "Meals", prepTime: "15 min", image: "/images/food-6.jpg", available: true, outlet: "REC CAFE" },
  { id: "rc7", name: "Paneer Butter Masala", price: 110, category: "Meals", prepTime: "15 min", image: "/images/food-7.jpg", available: true, outlet: "REC CAFE" },
  { id: "rc8", name: "Cold Coffee", price: 55, category: "Beverages", prepTime: "5 min", image: "/images/food-8.jpg", available: true, outlet: "REC CAFE" },
  // REC MART
  { id: "rm1", name: "Veg Burger", price: 65, category: "Snacks", prepTime: "8 min", image: "/images/food-3.jpg", available: true, outlet: "REC MART" },
  { id: "rm2", name: "French Fries", price: 50, category: "Snacks", prepTime: "8 min", image: "/images/food-4.jpg", available: true, outlet: "REC MART" },
  { id: "rm3", name: "Mango Shake", price: 60, category: "Beverages", prepTime: "5 min", image: "/images/food-5.jpg", available: true, outlet: "REC MART" },
  { id: "rm4", name: "Chicken Biryani", price: 120, category: "Meals", prepTime: "15 min", image: "/images/food-6.jpg", available: true, outlet: "REC MART" },
  { id: "rm5", name: "Egg Dosa", price: 50, category: "Breakfast", prepTime: "10 min", image: "/images/food-1.jpg", available: true, outlet: "REC MART" },
  { id: "rm6", name: "Espresso", price: 40, category: "Beverages", prepTime: "5 min", image: "/images/food-8.jpg", available: true, outlet: "REC MART" },
  // HUT CAFE
  { id: "hc1", name: "Masala Maggi", price: 40, category: "Snacks", prepTime: "8 min", image: "/images/food-3.jpg", available: true, outlet: "HUT CAFE" },
  { id: "hc2", name: "Poha", price: 35, category: "Breakfast", prepTime: "8 min", image: "/images/food-1.jpg", available: true, outlet: "HUT CAFE" },
  { id: "hc3", name: "Lemon Soda", price: 25, category: "Beverages", prepTime: "3 min", image: "/images/food-5.jpg", available: true, outlet: "HUT CAFE" },
  { id: "hc4", name: "Pav Bhaji", price: 70, category: "Meals", prepTime: "12 min", image: "/images/food-7.jpg", available: true, outlet: "HUT CAFE" },
  { id: "hc5", name: "Spring Roll", price: 45, category: "Snacks", prepTime: "8 min", image: "/images/food-4.jpg", available: true, outlet: "HUT CAFE" },
  { id: "hc6", name: "Hot Chocolate", price: 50, category: "Beverages", prepTime: "5 min", image: "/images/food-8.jpg", available: true, outlet: "HUT CAFE" },
  // SIXTH SENSE
  { id: "ss1", name: "Fried Rice", price: 80, category: "Meals", prepTime: "12 min", image: "/images/food-6.jpg", available: true, outlet: "SIXTH SENSE" },
  { id: "ss2", name: "Gobi Manchurian", price: 70, category: "Snacks", prepTime: "10 min", image: "/images/food-4.jpg", available: true, outlet: "SIXTH SENSE" },
  { id: "ss3", name: "Lime Mint Cooler", price: 45, category: "Beverages", prepTime: "5 min", image: "/images/food-5.jpg", available: true, outlet: "SIXTH SENSE" },
  { id: "ss4", name: "Chole Bhature", price: 75, category: "Meals", prepTime: "12 min", image: "/images/food-7.jpg", available: true, outlet: "SIXTH SENSE" },
  { id: "ss5", name: "Idli Sambar", price: 40, category: "Breakfast", prepTime: "8 min", image: "/images/food-1.jpg", available: true, outlet: "SIXTH SENSE" },
  { id: "ss6", name: "Cappuccino", price: 50, category: "Beverages", prepTime: "5 min", image: "/images/food-2.jpg", available: true, outlet: "SIXTH SENSE" },
]

const sampleOrders: Order[] = [
  {
    id: "QX-1024",
    items: [{ ...menuData[0], quantity: 2 }, { ...menuData[1], quantity: 1 }],
    total: 150,
    status: "preparing",
    outlet: "REC CAFE",
    pickupTime: "12:30 PM",
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "QX-1025",
    items: [{ ...menuData[5], quantity: 1 }],
    total: 90,
    status: "placed",
    outlet: "REC CAFE",
    pickupTime: "12:45 PM",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "QX-1026",
    items: [{ ...menuData[8], quantity: 1 }, { ...menuData[9], quantity: 1 }],
    total: 115,
    status: "ready",
    outlet: "REC MART",
    pickupTime: "1:00 PM",
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
  },
]

let state: AppState = {
  currentPage: "login",
  user: null,
  selectedOutlet: null,
  cart: [],
  orders: [...sampleOrders],
  currentOrder: null,
  adminView: "dashboard",
}

const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function getSnapshot(): AppState {
  return state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAppStore(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function navigate(page: AppState["currentPage"]) {
  state = { ...state, currentPage: page }
  emitChange()
}

export function login(collegeId: string) {
  state = { ...state, user: { name: "Student", collegeId }, currentPage: "outlets" }
  emitChange()
}

export function adminLogin() {
  state = { ...state, user: { name: "Admin", collegeId: "ADMIN" }, currentPage: "admin-dashboard" }
  emitChange()
}

export function selectOutlet(outlet: string) {
  state = { ...state, selectedOutlet: outlet, currentPage: "menu", cart: [] }
  emitChange()
}

export function addToCart(item: MenuItem) {
  const existing = state.cart.find((c) => c.id === item.id)
  if (existing) {
    state = {
      ...state,
      cart: state.cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)),
    }
  } else {
    state = { ...state, cart: [...state.cart, { ...item, quantity: 1 }] }
  }
  emitChange()
}

export function removeFromCart(itemId: string) {
  state = { ...state, cart: state.cart.filter((c) => c.id !== itemId) }
  emitChange()
}

export function updateCartQuantity(itemId: string, qty: number) {
  if (qty <= 0) {
    removeFromCart(itemId)
    return
  }
  state = {
    ...state,
    cart: state.cart.map((c) => (c.id === itemId ? { ...c, quantity: qty } : c)),
  }
  emitChange()
}

export function placeOrder(pickupTime: string) {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const order: Order = {
    id: `QX-${1027 + state.orders.length}`,
    items: [...state.cart],
    total,
    status: "placed",
    outlet: state.selectedOutlet || "Unknown",
    pickupTime,
    createdAt: new Date(),
  }
  state = {
    ...state,
    orders: [...state.orders, order],
    currentOrder: order,
    cart: [],
    currentPage: "tracking",
  }
  emitChange()
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  state = {
    ...state,
    orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    currentOrder: state.currentOrder?.id === orderId ? { ...state.currentOrder, status } : state.currentOrder,
  }
  emitChange()
}

export function setAdminView(view: string) {
  state = { ...state, adminView: view }
  emitChange()
}

export function logout() {
  state = {
    currentPage: "login",
    user: null,
    selectedOutlet: null,
    cart: [],
    orders: [...sampleOrders],
    currentOrder: null,
    adminView: "dashboard",
  }
  emitChange()
}

export function getMenuItems(): MenuItem[] {
  return menuData
}

export function getMenuItemsByOutlet(outlet: string): MenuItem[] {
  return menuData.filter((item) => item.outlet === outlet)
}

export function toggleItemAvailability(itemId: string) {
  const idx = menuData.findIndex((i) => i.id === itemId)
  if (idx !== -1) {
    menuData[idx] = { ...menuData[idx], available: !menuData[idx].available }
  }
  emitChange()
}
