export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string; // e.g., 'outerwear', 'knitwear', 'tailoring', 'essentials', 'accessories'
  images: string[];
  sizes: string[]; // e.g. ['XS', 'S', 'M', 'L', 'XL']
  colors: { name: string; hex: string }[];
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  isNewArrival?: boolean;
  materials: string;
  careInstructions: string;
  origin: string;
  fit: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'credit_card' | 'cod' | 'apple_pay';
  paymentStatus: 'paid' | 'pending';
  promoCode?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}
