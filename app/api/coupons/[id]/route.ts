// app/api/coupons/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UpdateCouponInput, DiscountType, CouponStatus } from "@/lib/validations/coupon";
import { Prisma } from "@/app/generated/prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

// ── GET /api/coupons/:id ──────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const coupon = await prisma.coupon.findUnique({ where: { id } });

    if (!coupon) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: coupon });
  } catch (err) {
    console.error("[GET /api/coupons/:id]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// ── PATCH /api/coupons/:id ────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body: UpdateCouponInput = await req.json().catch(() => ({}));

    // build a partial update — only include fields that were sent
    const update: Prisma.CouponUpdateInput = {};

    if (body.code !== undefined) {
      update.code = body.code.trim().toUpperCase();
    }
    if (body.description !== undefined) {
      update.description = body.description;
    }
    if (body.discountType !== undefined) {
      if (!["PERCENTAGE", "FIXED"].includes(body.discountType)) {
        return NextResponse.json({ error: "discountType inválido" }, { status: 422 });
      }
      update.discountType = body.discountType as DiscountType;
    }
    if (body.discountValue !== undefined) {
      const v = Number(body.discountValue);
      if (isNaN(v) || v <= 0) {
        return NextResponse.json({ error: "discountValue inválido" }, { status: 422 });
      }
      update.discountValue = v;
    }
    if (body.minOrderValue !== undefined) {
      update.minOrderValue = body.minOrderValue != null ? Number(body.minOrderValue) : null;
    }
    if (body.maxUses !== undefined) {
      update.maxUses = body.maxUses != null ? Number(body.maxUses) : null;
    }
    if (body.singleUsePerUser !== undefined) {
      update.singleUsePerUser = Boolean(body.singleUsePerUser);
    }
    if (body.status !== undefined) {
      if (!["ACTIVE", "INACTIVE"].includes(body.status)) {
        return NextResponse.json({ error: "status inválido" }, { status: 422 });
      }
      update.status = body.status as CouponStatus;
    }
    if (body.expiresAt !== undefined) {
      update.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 422 });
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data:  update,
    });

    return NextResponse.json({ data: coupon });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 });
      }
      if (err.code === "P2002") {
        return NextResponse.json({ error: "Já existe um cupom com esse código" }, { status: 409 });
      }
    }

    console.error("[PATCH /api/coupons/:id]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// ── DELETE /api/coupons/:id ───────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.coupon.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 });
    }

    console.error("[DELETE /api/coupons/:id]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}