import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface CartItemData {
  medicineId: string;
  name: string;
  brand: string;
  strength: string;
  form: string;
  price: number;
  quantity: number;
  prescriptionRequired: boolean;
}

interface CartContextValue {
  items: CartItemData[];
  addToCart: (item: Omit<CartItemData, 'quantity'>, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  incrementQuantity: (medicineId: string) => void;
  decrementQuantity: (medicineId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>([]);

  const addToCart = useCallback((item: Omit<CartItemData, 'quantity'>, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.medicineId === item.medicineId);
      if (existing) {
        return prev.map(i =>
          i.medicineId === item.medicineId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    setItems(prev => prev.filter(i => i.medicineId !== medicineId));
  }, []);

  const updateQuantity = useCallback((medicineId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i =>
      i.medicineId === medicineId ? { ...i, quantity } : i
    ));
  }, []);

  const incrementQuantity = useCallback((medicineId: string) => {
    setItems(prev => prev.map(i =>
      i.medicineId === medicineId ? { ...i, quantity: i.quantity + 1 } : i
    ));
  }, []);

  const decrementQuantity = useCallback((medicineId: string) => {
    setItems(prev => prev.map(i =>
      i.medicineId === medicineId
        ? { ...i, quantity: Math.max(1, i.quantity - 1) }
        : i
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      clearCart,
      totalItems,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
