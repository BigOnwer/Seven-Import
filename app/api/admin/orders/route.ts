import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

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