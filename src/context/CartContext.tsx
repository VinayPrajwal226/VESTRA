import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types/index.ts';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discount: number;
  applyPromo: (code: string) => { success: boolean; message: string };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vestra_cart_items';
const PROMO_STORAGE_KEY = 'vestra_promo_code';
const FREE_SHIPPING_THRESHOLD = 300;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCodeState] = useState(() => {
    return localStorage.getItem(PROMO_STORAGE_KEY) || '';
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === product.id && i.selectedSize === size && i.selectedColor === color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const nextQty = Math.min(product.stockCount, next[existingIndex].quantity + quantity);
        next[existingIndex] = { ...next[existingIndex], quantity: nextQty };
        return next;
      }

      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: Math.min(product.stockCount, quantity),
        selectedSize: size,
        selectedColor: color,
        image: product.images[0] || '/src/assets/images/product_cashmere_overcoat_1790603713161.jpg',
        maxStock: product.stockCount,
      };

      return [...prev, newItem];
    });

    setIsOpen(true);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.selectedSize === size && i.selectedColor === color)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedSize === size && item.selectedColor === color) {
          return { ...item, quantity: Math.min(item.maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCodeState('');
    localStorage.removeItem(PROMO_STORAGE_KEY);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 25;

  let discount = 0;
  if (promoCode.toUpperCase() === 'VESTRA10') {
    discount = Math.round(subtotal * 0.1 * 100) / 100;
  } else if (promoCode.toUpperCase() === 'ATELIER') {
    discount = Math.min(subtotal, 50);
  }

  const setPromoCode = (code: string) => {
    setPromoCodeState(code);
    localStorage.setItem(PROMO_STORAGE_KEY, code);
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'VESTRA10') {
      setPromoCode(clean);
      return { success: true, message: 'Code VESTRA10 applied: 10% off your purchase' };
    }
    if (clean === 'ATELIER') {
      setPromoCode(clean);
      return { success: true, message: 'Code ATELIER applied: $50 complimentary credit' };
    }
    return { success: false, message: 'Invalid or expired promotional code' };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        promoCode,
        setPromoCode,
        discount,
        applyPromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
