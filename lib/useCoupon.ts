// lib/useCoupon.ts

import { useState, useCallback } from "react";

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
}

interface UseCouponReturn {
  applied:      AppliedCoupon | null;
  loading:      boolean;
  error:        string | null;
  success:      string | null;
  apply:        (code: string) => Promise<void>;
  remove:       () => void;
  calcDiscount: (subtotal: number) => number;
}

export function useCoupon(): UseCouponReturn {
  const [applied,  setApplied]  = useState<AppliedCoupon | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState<string | null>(null);

  const apply = useCallback(async (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;

    // já está aplicado
    if (applied?.code === code) {
      setError("Este cupom já está aplicado.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // busca pelo código na listagem (GET /api/coupons?search=CODE)
      const res = await fetch(`/api/coupons?search=${encodeURIComponent(code)}&status=ACTIVE`);

      if (!res.ok) throw new Error("Erro ao verificar cupom.");

      const { data } = await res.json();

      // filtra pelo código exato (a busca é "contains", então precisamos checar)
      const coupon = (data as any[]).find(
        (c) => c.code === code && c.status === "ACTIVE"
      );

      if (!coupon) {
        setError("Cupom inválido ou inativo.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // verifica expiração no cliente também
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        setError("Este cupom expirou.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // verifica limite de usos
      if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        setError("Este cupom atingiu o limite de usos.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      setApplied({
        id:            coupon.id,
        code:          coupon.code,
        discountType:  coupon.discountType,
        discountValue: Number(coupon.discountValue),
      });

      const label =
        coupon.discountType === "PERCENTAGE"
          ? `${coupon.discountValue}% de desconto`
          : `R$ ${Number(coupon.discountValue).toFixed(2)} de desconto`;

      setSuccess(`✓ Cupom ${coupon.code} aplicado — ${label}!`);
    } catch {
      setError("Não foi possível validar o cupom. Tente novamente.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [applied]);

  const remove = useCallback(() => {
    setApplied(null);
    setSuccess(null);
    setError(null);
  }, []);

  const calcDiscount = useCallback(
    (subtotal: number): number => {
      if (!applied) return 0;
      if (applied.discountType === "PERCENTAGE") {
        return Math.round((subtotal * applied.discountValue) / 100);
      }
      // FIXED — não pode ser maior que o subtotal
      return Math.min(applied.discountValue, subtotal);
    },
    [applied]
  );

  return { applied, loading, error, success, apply, remove, calcDiscount };
}