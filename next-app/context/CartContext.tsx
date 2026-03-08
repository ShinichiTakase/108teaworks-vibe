"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "108teaworks-cart";

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  imagePath?: string;
};

type CartState = {
  items: CartItem[];
  addToCart: (slug: string, title: string, price: number, quantity: number, imagePath?: string) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartState | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is CartItem =>
        x &&
        typeof x === "object" &&
        typeof (x as CartItem).slug === "string" &&
        typeof (x as CartItem).title === "string" &&
        typeof (x as CartItem).price === "number" &&
        typeof (x as CartItem).quantity === "number"
    );
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Cart save failed", e);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    setItems((prev) => (prev.length > 0 ? prev : loadCart()));
  }, []);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback(
    (slug: string, title: string, price: number, quantity: number, imagePath?: string) => {
      setItems((prev) => {
        const i = prev.findIndex((x) => x.slug === slug);
        if (i >= 0) {
          const next = [...prev];
          next[i] = {
            ...next[i],
            quantity: next[i].quantity + quantity,
            title,
            price,
            imagePath: imagePath ?? next[i].imagePath,
          };
          return next;
        }
        return [...prev, { slug, title, price, quantity, imagePath }];
      });
    },
    []
  );

  const removeFromCart = useCallback((slug: string) => {
    setItems((prev) => prev.filter((x) => x.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((x) => (x.slug === slug ? { ...x, quantity } : x))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
