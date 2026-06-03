import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const code       = req.nextUrl.searchParams.get("code")?.toUpperCase();
    const orderValue = parseFloat(req.nextUrl.searchParams.get("orderValue") ?? "0");

    if (!code) return NextResponse.json({ error: "Código obrigatório" }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || coupon.status !== "ACTIVE")
      return NextResponse.json({ error: "Cupom inválido ou inativo" }, { status: 400 });

    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });

    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses)
      return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });

    if (coupon.minOrderValue && orderValue < Number(coupon.minOrderValue))
      return NextResponse.json(
        { error: `Pedido mínimo de R$ ${Number(coupon.minOrderValue).toLocaleString("pt-BR")} para este cupom` },
        { status: 400 }
      );

    return NextResponse.json({
      id:            coupon.id,
      code:          coupon.code,
      description:   coupon.description,
      discountType:  coupon.discountType,
      discountValue: Number(coupon.discountValue),
    });
  } catch (err) {
    console.error("[GET /api/coupons/validate]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}