// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> }

// ─── GET /api/products/[id] ──────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)   return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[GET_PRODUCT]", error);
    return NextResponse.json({ error: "Erro ao buscar produto." }, { status: 500 });
  }
}

// ─── PUT /api/products/[id] ──────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session)                       return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    if (session.user.role !== "ADMIN")  return NextResponse.json({ error: "Acesso negado." },   { status: 403 });

    const { id } = await params
    if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });

    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists)   return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

    const body = await req.json();
    const {
      name, brand, category, price, oldPrice,
      description, details, sizes, colors, colorNames,
      stock, tag, stars, reviews, slug,
      emoji, midiaUrl, midiaType,
      isNew, isSale, inStock,
    } = body;

    // Validações somente dos campos enviados
    if (name !== undefined && !name?.trim())
      return NextResponse.json({ error: "Nome não pode ser vazio." }, { status: 400 });
    if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0))
      return NextResponse.json({ error: "Preço inválido." }, { status: 400 });
    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0))
      return NextResponse.json({ error: "Estoque inválido." }, { status: 400 });

    // Verifica slug único (se estiver sendo alterado)
    if (slug && slug !== exists.slug) {
      const slugTaken = await prisma.product.findUnique({ where: { slug: slug.trim() } });
      if (slugTaken) return NextResponse.json({ error: "Slug já está em uso." }, { status: 409 });
    }

    // Monta objeto apenas com campos enviados (partial update)
    const data: any = {};
    if (name        !== undefined) data.name        = name.trim();
    if (slug        !== undefined) data.slug        = slug.trim();
    if (brand       !== undefined) data.brand       = brand.trim();
    if (category    !== undefined) data.category    = category.trim();
    if (price       !== undefined) data.price       = Number(price);
    if (oldPrice    !== undefined) data.oldPrice    = oldPrice ? Number(oldPrice) : null;
    if (description !== undefined) data.description = description.trim();
    if (details     !== undefined) data.details     = details?.trim() ?? null;
    if (sizes       !== undefined) data.sizes       = Array.isArray(sizes) ? sizes.map(Number) : [];
    if (colors      !== undefined) data.colors      = Array.isArray(colors) ? colors : [];
    if (colorNames  !== undefined) data.colorNames  = Array.isArray(colorNames) ? colorNames : [];
    if (stock       !== undefined) data.stock       = Number(stock);
    if (tag         !== undefined) data.tag         = tag?.trim() ?? null;
    if (stars       !== undefined) data.stars       = Number(stars);
    if (reviews     !== undefined) data.reviews     = Number(reviews);
    if (emoji       !== undefined) data.emoji       = emoji?.trim() ?? "👟";
    if (midiaUrl    !== undefined) data.midiaUrl    = midiaUrl;
    if (midiaType   !== undefined) data.midiaType   = midiaType;
    if (isNew       !== undefined) data.isNew       = Boolean(isNew);
    if (isSale      !== undefined) data.isSale      = Boolean(isSale);
    if (inStock     !== undefined) data.inStock     = Boolean(inStock);

    const updated = await prisma.product.update({ where: { id }, data });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[UPDATE_PRODUCT]", error);
    return NextResponse.json({ error: "Erro interno ao atualizar produto." }, { status: 500 });
  }
}

// ─── DELETE /api/products/[id] ───────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session)                       return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    if (session.user.role !== "ADMIN")  return NextResponse.json({ error: "Acesso negado." },   { status: 403 });

    const { id } = await params
    if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });

    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists)   return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Produto removido com sucesso." });
  } catch (error) {
    console.error("[DELETE_PRODUCT]", error);
    return NextResponse.json({ error: "Erro interno ao remover produto." }, { status: 500 });
  }
}