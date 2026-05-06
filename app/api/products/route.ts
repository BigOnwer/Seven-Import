import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session"; // ← correto: session própria do projeto

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("[GET_PRODUCTS]", error);
    return NextResponse.json({ error: "Erro ao buscar produtos." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Autenticação via session cookie do próprio projeto
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    // Apenas admins podem criar produtos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const body = await req.json();
    const { name, price, description, details, stock, size, midiaUrl, midiaType } = body;

    // Validações básicas
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }
    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json({ error: "Preço inválido." }, { status: 400 });
    }
    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Descrição é obrigatória." }, { status: 400 });
    }
    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
      return NextResponse.json({ error: "Estoque inválido." }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        Details: details?.trim() ?? null,
        Size: size ? Number(size) : null,
        stock: Number(stock),
        midiaUrl: midiaUrl ?? null,
        midiaType: midiaType ?? null,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("[CREATE_PRODUCT]", error);
    return NextResponse.json({ error: "Erro interno ao criar produto." }, { status: 500 });
  }
}