// lib/useProducts.ts
"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  description: string;
  details: string | null;
  sizes: number[];
  colors: string[];
  colorNames: string[];
  stock: number;
  tag: string | null;
  stars: number;
  reviews: number;
  emoji: string;
  midiaUrl: string | null;
  midiaType: string | null;
  images: string[];
  isNew: boolean;
  isSale: boolean;
  inStock: boolean;
  createdAt: string;
};

export type ProductFilters = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "stars";
  page?: number;
  limit?: number;
};

export type ProductsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function buildQuery(filters: ProductFilters): string {
  const p = new URLSearchParams();
  if (filters.search)             p.set("search",   filters.search);
  if (filters.category)           p.set("category", filters.category);
  if (filters.minPrice !== undefined) p.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) p.set("maxPrice", String(filters.maxPrice));
  if (filters.inStock  !== undefined) p.set("inStock",  String(filters.inStock));
  if (filters.sort)               p.set("sort",     filters.sort);
  if (filters.page)               p.set("page",     String(filters.page));
  if (filters.limit)              p.set("limit",    String(filters.limit));
  return p.toString();
}

// ─── Hook principal ───────────────────────────────────────────────────────────
export function useProducts(initialFilters: ProductFilters = {}) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta,     setMeta]     = useState<ProductsMeta | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [filters,  setFilters]  = useState<ProductFilters>({ page: 1, limit: 12, ...initialFilters });

  // Debounce na busca por texto
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (f: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products?${buildQuery(f)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro ao buscar produtos.");
      setProducts(json.data);
      setMeta(json.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  // Atualiza filtros com debounce opcional (para search)
  const updateFilters = useCallback((partial: Partial<ProductFilters>, debounce = false) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const next = { ...filters, page: 1, ...partial };
    if (debounce) {
      debounceRef.current = setTimeout(() => setFilters(next), 400);
    } else {
      setFilters(next);
    }
  }, [filters]);

  const setPage = useCallback((page: number) => setFilters(f => ({ ...f, page })), []);

  const refresh = useCallback(() => fetchProducts(filters), [filters, fetchProducts]);

  return { products, meta, loading, error, filters, updateFilters, setPage, refresh };
}

// ─── Ações de produto (CRUD) ──────────────────────────────────────────────────
export async function createProduct(data: Partial<ApiProduct>): Promise<{ success: boolean; data?: ApiProduct; error?: string }> {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error ?? "Erro ao criar produto." };
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Erro de conexão." };
  }
}

export async function updateProduct(id: number, data: Partial<ApiProduct>): Promise<{ success: boolean; data?: ApiProduct; error?: string }> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error ?? "Erro ao atualizar produto." };
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Erro de conexão." };
  }
}

export async function deleteProduct(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error ?? "Erro ao remover produto." };
    return { success: true };
  } catch {
    return { success: false, error: "Erro de conexão." };
  }
}