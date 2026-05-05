"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@/lib/data";

type WishlistContextType = {
  items: Product[];
  toggle: (product: Product) => void;
  isLiked: (id: number) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("seven-wishlist");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("seven-wishlist", JSON.stringify(items));
    } catch {}
  }, [items]);

  const toggle = (product: Product) => {
    setItems(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isLiked = (id: number) => items.some(p => p.id === id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isLiked, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
