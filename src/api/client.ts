import { Category, MediaFile, Order, Product, User } from '../types/index.ts';

const TOKEN_KEY = 'vestra_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    return request<{ success: boolean; token: string; user: User; message: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
  },

  async register(payload: { name: string; email: string; password: string; role?: string }) {
    return request<{ success: boolean; token: string; user: User; message: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  async getMe() {
    return request<{ success: boolean; user: User }>('/api/auth/me');
  },

  async updateProfile(updates: Partial<User>) {
    return request<{ success: boolean; user: User; message: string }>(
      '/api/auth/profile',
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  },

  async forgotPassword(email: string) {
    return request<{ success: boolean; message: string; demoToken?: string }>(
      '/api/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  },

  async resetPassword(payload: { email: string; newPassword: string }) {
    return request<{ success: boolean; message: string }>(
      '/api/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  // Products
  async getProducts(params?: Record<string, any>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<{
      success: boolean;
      products: Product[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/api/products${query}`);
  },

  async getProduct(identifier: string) {
    return request<{ success: boolean; product: Product; related: Product[] }>(
      `/api/products/${identifier}`
    );
  },

  async createProduct(data: any) {
    return request<{ success: boolean; product: Product; message: string }>(
      '/api/products',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async updateProduct(id: string, updates: any) {
    return request<{ success: boolean; product: Product; message: string }>(
      `/api/products/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  },

  async deleteProduct(id: string) {
    return request<{ success: boolean; message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  async addProductReview(id: string, review: { rating: number; comment: string; userName?: string }) {
    return request<{ success: boolean; product: Product; message: string }>(
      `/api/products/${id}/reviews`,
      {
        method: 'POST',
        body: JSON.stringify(review),
      }
    );
  },

  // Categories
  async getCategories() {
    return request<{ success: boolean; categories: Category[] }>('/api/categories');
  },

  async getCategory(slug: string) {
    return request<{ success: boolean; category: Category }>(`/api/categories/${slug}`);
  },

  async createCategory(data: any) {
    return request<{ success: boolean; category: Category; message: string }>(
      '/api/categories',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async updateCategory(id: string, updates: any) {
    return request<{ success: boolean; category: Category; message: string }>(
      `/api/categories/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  },

  async deleteCategory(id: string) {
    return request<{ success: boolean; message: string }>(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  async createOrder(data: any) {
    return request<{ success: boolean; order: Order; message: string }>(
      '/api/orders',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async getMyOrders() {
    return request<{ success: boolean; orders: Order[] }>('/api/orders/my');
  },

  async getAllOrders() {
    return request<{ success: boolean; orders: Order[] }>('/api/orders/all');
  },

  async getOrder(id: string) {
    return request<{ success: boolean; order: Order }>(`/api/orders/${id}`);
  },

  async updateOrderStatus(id: string, status: string, trackingNumber?: string) {
    return request<{ success: boolean; order: Order; message: string }>(
      `/api/orders/${id}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status, trackingNumber }),
      }
    );
  },

  // Media (Multer File Upload, Download, Delete)
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ success: boolean; media: MediaFile; message: string }>(
      '/api/media/upload',
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  async getMedia() {
    return request<{ success: boolean; media: MediaFile[] }>('/api/media');
  },

  async deleteMedia(id: string) {
    return request<{ success: boolean; message: string }>(`/api/media/${id}`, {
      method: 'DELETE',
    });
  },

  getDownloadMediaUrl(id: string) {
    return `/api/media/download/${id}`;
  },

  // Stats
  async getDashboardStats() {
    return request<{
      success: boolean;
      stats: {
        totalOrders: number;
        totalRevenue: number;
        totalProducts: number;
        lowStockCount: number;
        recentOrders: Order[];
      };
    }>('/api/admin/stats');
  },
};
