

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCreateCoupon } from "@/lib/validations/coupon";
import type { CouponStatus } from "@/lib/validations/coupon";
import { Prisma } from "@/app/generated/prisma/client";

// ── GET /api/coupons ──────────────────────────────────────────────────────────
// Query params: status, search, page, limit
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const status  = searchParams.get("status") as CouponStatus | null;
    const search  = searchParams.get("search") ?? "";
    const page    = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit   = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip    = (page - 1) * limit;

    const where: Prisma.CouponWhereInput = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { code:        { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [coupons, total] = await prisma.$transaction([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.coupon.count({ where }),
    ]);

    return NextResponse.json({
      data: coupons,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/coupons]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// ── POST /api/coupons ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { data, error } = validateCreateCoupon(body);

    if (error || !data) {
      return NextResponse.json({ error }, { status: 422 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code:             data.code,
        description:      data.description,
        discountType:     data.discountType,
        discountValue:    data.discountValue,
        minOrderValue:    data.minOrderValue,
        maxUses:          data.maxUses,
        singleUsePerUser: data.singleUsePerUser ?? false,
        status:           data.status ?? "ACTIVE",
        expiresAt:        data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });

    return NextResponse.json({ data: coupon }, { status: 201 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Já existe um cupom com esse código" },
        { status: 409 }
      );
    }

    console.error("[POST /api/coupons]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}