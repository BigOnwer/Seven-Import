// app/api/products/slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { slug: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { slug } = await params;
    if (!slug?.trim()) {
      return NextResponse.json({ error: "Slug inválido." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    // Busca produtos relacionados (mesma categoria, excluindo o atual, limite 4)
    const related = await prisma.product.findMany({
      where: { category: product.category, id: { not: product.id } },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    // Se não tiver 4 relacionados da mesma categoria, completa com outros
    const remaining = 4 - related.length;
    const extra = remaining > 0
      ? await prisma.product.findMany({
          where: { id: { notIn: [product.id, ...related.map(r => r.id)] } },
          orderBy: { stars: "desc" },
          take: remaining,
        })
      : [];

    return NextResponse.json({
      success: true,
      data: product,
      related: [...related, ...extra],
    });
  } catch (error) {
    console.error("[GET_PRODUCT_BY_SLUG]", error);
    return NextResponse.json({ error: "Erro ao buscar produto." }, { status: 500 });
  }
}