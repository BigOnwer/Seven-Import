import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const orders = await prisma.order.findMany({
    where: { paymentStatus: { not: "PENDING" } },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true, phone: true, cpf: true } },
      items: { include: { product: { select: { name: true, emoji: true, images: true, brand: true } } } },
      coupon: { select: { code: true } },
    },
  });

  return NextResponse.json({ data: orders });
}