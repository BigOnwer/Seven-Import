// lib/useBuyNow.ts
import { useState } from "react";
import { useCart } from "./cartContext";

export function useBuyNow() {
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const { addItem } = useCart(); // importe seu useCart

  async function buyNow(item: any) {
    setLoadingId(item.id);
    addItem(item, item.size ?? item.sizes?.[0]);   // adiciona ao carrinho
    window.location.href = "/checkout";             // redireciona para o checkout
    setLoadingId(null);
  }

  return { buyNow, loadingId };
}