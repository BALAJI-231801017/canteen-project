const API_BASE_URL = '/api';

export interface User {
  id: string;
  name: string;
  email: string;
  outlet_id?: string;
}

export interface Outlet {
  id: string;
  name: string;
  location: string;
  cuisines: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface OrderItem {
  menu_item_id: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  outlet_id: string;
  total_price: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
}

export const apiClient = {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    return data.user;
  },

  async getOutlets(): Promise<Outlet[]> {
    const response = await fetch(`${API_BASE_URL}/outlets`);

    if (!response.ok) {
      throw new Error('Failed to fetch outlets');
    }

    const data = await response.json();
    return data.outlets;
  },

  async getMenu(outletId: string): Promise<MenuItem[]> {
    const response = await fetch(`${API_BASE_URL}/menu?outlet_id=${outletId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }

    const data = await response.json();
    return data.menu_items;
  },

  async createOrder(
    userId: string,
    outletId: string,
    totalPrice: number,
    items: OrderItem[]
  ): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        outlet_id: outletId,
        total_price: totalPrice,
        items,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Order creation failed');
    }

    const data = await response.json();
    return data.order;
  },

  async getOrder(orderId: string): Promise<{ order: Order; items: any[] }> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return response.json();
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Order update failed');
    }

    const data = await response.json();
    return data.order;
  },

  async getAdminOrders(outletId: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/admin/orders?outlet_id=${outletId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return data.orders;
  },
};
