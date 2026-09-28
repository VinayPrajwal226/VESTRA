import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialCategories, initialProducts, initialUsers } from '../data/seedData.ts';
import { Category, MediaFile, Order, Product, Review, User } from '../types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: User[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  media: MediaFile[];
}

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Failed to read db.json, falling back to seed data:', err);
    }

    const defaultData: DatabaseSchema = {
      users: initialUsers,
      products: initialProducts,
      categories: initialCategories,
      orders: [
        {
          id: 'ord_1082',
          userId: 'usr_demo_1',
          customerName: 'Julian Sterling',
          customerEmail: 'customer@vestra.com',
          shippingAddress: {
            street: '128 Mercer Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            postalCode: '10012',
            country: 'United States',
            phone: '+1 (555) 234-5678',
          },
          items: [
            {
              productId: 'prd_01',
              title: 'Double-Breasted Cashmere Trench',
              price: 890,
              quantity: 1,
              selectedSize: 'M',
              selectedColor: 'Camel Tan',
              image: '/src/assets/images/product_cashmere_overcoat_1790603713161.jpg',
            },
          ],
          subtotal: 890,
          shippingFee: 0,
          discount: 0,
          tax: 71.2,
          total: 961.2,
          status: 'Shipped',
          paymentMethod: 'credit_card',
          paymentStatus: 'paid',
          trackingNumber: 'VSTR-98234-NY',
          createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
      ],
      media: [
        {
          id: 'med_01',
          filename: 'product_cashmere_overcoat_1790603713161.jpg',
          originalName: 'Cashmere-Trench-Hero.jpg',
          mimeType: 'image/jpeg',
          size: 421000,
          url: '/src/assets/images/product_cashmere_overcoat_1790603713161.jpg',
          uploadedAt: new Date().toISOString(),
        },
        {
          id: 'med_02',
          filename: 'product_minimalist_suit_1790603724383.jpg',
          originalName: 'Minimalist-Suit-Look.jpg',
          mimeType: 'image/jpeg',
          size: 389000,
          url: '/src/assets/images/product_minimalist_suit_1790603724383.jpg',
          uploadedAt: new Date().toISOString(),
        },
      ],
    };

    this.saveDataDirect(defaultData);
    return defaultData;
  }

  private saveDataDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  private persist() {
    this.saveDataDirect(this.data);
  }

  // --- USERS ---
  getUsers(): User[] {
    return this.data.users;
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.persist();
    return this.data.users[index];
  }

  // --- PRODUCTS ---
  getProducts(params?: {
    category?: string;
    search?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
    page?: number;
    limit?: number;
  }): { products: Product[]; total: number; page: number; totalPages: number } {
    let result = [...this.data.products];

    if (params?.category && params.category !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.materials.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (params?.size) {
      result = result.filter((p) => p.sizes.includes(params.size!));
    }

    if (params?.color) {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === params.color!.toLowerCase())
      );
    }

    if (params?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    // Sort
    switch (params?.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    const total = result.length;
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, params?.limit || 12);
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = result.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total,
      page,
      totalPages,
    };
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  createProduct(data: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'rating' | 'reviewsCount'>): Product {
    const newProduct: Product = {
      ...data,
      id: `prd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProduct);
    this.updateCategoryCounts();
    this.persist();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.updateCategoryCounts();
    this.persist();
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    const changed = this.data.products.length < prevLen;
    if (changed) {
      this.updateCategoryCounts();
      this.persist();
    }
    return changed;
  }

  adjustStock(productId: string, quantityToDeduct: number): boolean {
    const product = this.getProductById(productId);
    if (!product) return false;
    const nextStock = Math.max(0, product.stockCount - quantityToDeduct);
    product.stockCount = nextStock;
    product.inStock = nextStock > 0;
    this.persist();
    return true;
  }

  addProductReview(productId: string, review: Omit<Review, 'id' | 'createdAt'>): Product | null {
    const product = this.getProductById(productId);
    if (!product) return null;

    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    product.reviews.unshift(newRev);
    product.reviewsCount = product.reviews.length;
    const avg = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    product.rating = Math.round(avg * 10) / 10;

    this.persist();
    return product;
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    return this.data.categories;
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.data.categories.find((c) => c.slug === slug);
  }

  createCategory(data: Omit<Category, 'id' | 'itemCount'>): Category {
    const newCategory: Category = {
      ...data,
      id: `cat_${Date.now()}`,
      itemCount: 0,
    };
    this.data.categories.push(newCategory);
    this.updateCategoryCounts();
    this.persist();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.persist();
    return this.data.categories[index];
  }

  deleteCategory(id: string): boolean {
    const prevLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    const changed = this.data.categories.length < prevLen;
    if (changed) this.persist();
    return changed;
  }

  private updateCategoryCounts() {
    this.data.categories.forEach((cat) => {
      cat.itemCount = this.data.products.filter(
        (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
      ).length;
    });
  }

  // --- ORDERS ---
  getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders
        .filter((o) => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [...this.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber'>): Order {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now().toString().slice(-4)}${randomSuffix}`,
      trackingNumber: `VSTR-${randomSuffix}-${new Date().getFullYear()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock
    orderData.items.forEach((item) => {
      this.adjustStock(item.productId, item.quantity);
    });

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  updateOrderStatus(
    id: string,
    status: Order['status'],
    trackingNumber?: string
  ): Order | null {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  // --- MEDIA ---
  getMedia(): MediaFile[] {
    return [...this.data.media].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  getMediaById(id: string): MediaFile | undefined {
    return this.data.media.find((m) => m.id === id);
  }

  addMedia(file: Omit<MediaFile, 'id' | 'uploadedAt'>): MediaFile {
    const newMedia: MediaFile = {
      ...file,
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      uploadedAt: new Date().toISOString(),
    };
    this.data.media.unshift(newMedia);
    this.persist();
    return newMedia;
  }

  deleteMedia(id: string): boolean {
    const item = this.getMediaById(id);
    if (!item) return false;
    this.data.media = this.data.media.filter((m) => m.id !== id);
    this.persist();
    return true;
  }

  // --- STATS ---
  getDashboardStats() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const totalProducts = this.data.products.length;
    const lowStockCount = this.data.products.filter((p) => p.stockCount <= 5).length;
    const recentOrders = this.data.orders.slice(0, 5);

    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalProducts,
      lowStockCount,
      recentOrders,
    };
  }
}

export const db = new DatabaseService();
