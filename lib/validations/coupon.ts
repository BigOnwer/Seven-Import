// lib/validations/coupon.ts

export type DiscountType = "PERCENTAGE" | "FIXED";
export type CouponStatus  = "ACTIVE" | "INACTIVE";

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxUses?: number;
  singleUsePerUser?: boolean;
  status?: CouponStatus;
  expiresAt?: string; // ISO date string
}

export type UpdateCouponInput = Partial<CreateCouponInput>;

export interface CouponFilters {
  status?: CouponStatus;
  search?: string;   // matches code or description
  page?: number;
  limit?: number;
}

// ── validation helpers ────────────────────────────────────────────────────────

export function validateCreateCoupon(body: unknown): {
  data: CreateCouponInput | null;
  error: string | null;
} {
  if (!body || typeof body !== "object") {
    return { data: null, error: "Body inválido" };
  }

  const b = body as Record<string, unknown>;

  if (!b.code || typeof b.code !== "string" || !b.code.trim()) {
    return { data: null, error: "Código obrigatório" };
  }

  if (!["PERCENTAGE", "FIXED"].includes(b.discountType as string)) {
    return { data: null, error: "discountType deve ser PERCENTAGE ou FIXED" };
  }

  const discountValue = Number(b.discountValue);
  if (isNaN(discountValue) || discountValue <= 0) {
    return { data: null, error: "discountValue deve ser um número positivo" };
  }

  if (b.discountType === "PERCENTAGE" && discountValue > 100) {
    return { data: null, error: "discountValue não pode ultrapassar 100 para PERCENTAGE" };
  }

  if (b.minOrderValue !== undefined && b.minOrderValue !== null) {
    const min = Number(b.minOrderValue);
    if (isNaN(min) || min < 0) {
      return { data: null, error: "minOrderValue inválido" };
    }
  }

  if (b.maxUses !== undefined && b.maxUses !== null) {
    const max = Number(b.maxUses);
    if (!Number.isInteger(max) || max < 1) {
      return { data: null, error: "maxUses deve ser um inteiro positivo" };
    }
  }

  if (b.expiresAt !== undefined && b.expiresAt !== null) {
    const d = new Date(b.expiresAt as string);
    if (isNaN(d.getTime())) {
      return { data: null, error: "expiresAt deve ser uma data ISO válida" };
    }
  }

  if (b.status && !["ACTIVE", "INACTIVE"].includes(b.status as string)) {
    return { data: null, error: "status deve ser ACTIVE ou INACTIVE" };
  }

  return {
    data: {
      code:             (b.code as string).trim().toUpperCase(),
      description:      b.description ? String(b.description) : undefined,
      discountType:     b.discountType as DiscountType,
      discountValue,
      minOrderValue:    b.minOrderValue != null ? Number(b.minOrderValue) : undefined,
      maxUses:          b.maxUses       != null ? Number(b.maxUses)       : undefined,
      singleUsePerUser: Boolean(b.singleUsePerUser),
      status:           (b.status as CouponStatus) ?? "ACTIVE",
      expiresAt:        b.expiresAt ? String(b.expiresAt) : undefined,
    },
    error: null,
  };
}