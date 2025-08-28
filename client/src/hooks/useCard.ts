import { useState, useEffect } from 'react';
import { Product } from '../types';
import toast from 'react-hot-toast';

const CART_KEY = 'bin';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const saveToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  };

  const addToCart = (product: Product) => {
    const existing = items.find(item => item.id === product._id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map(item =>
        item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [...items, { id: product._id, product, quantity: 1 }];
    }
    setItems(updated);
    saveToLocalStorage(updated);
    toast.success('Added to cart!');
  };

  const removeFromCart = (productId: string) => {
    const updated = items.filter(item => item.id !== productId);
    setItems(updated);
    saveToLocalStorage(updated);
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const updated = items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setItems(updated);
    saveToLocalStorage(updated);
  };

  const isInCart = (productId: string) => items.some(item => item.id === productId);

  const total = items.reduce(
    (acc, item) => acc + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return { items, addToCart, removeFromCart, updateQuantity, isInCart, total, itemCount };
};
