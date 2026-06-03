// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// ─── GET /api/products ───────────────────────────────────────────────────────
// Query params suportados:
//   ?search=air         → busca em name, description, brand (case-insensitive)
//   ?category=Nike      → filtra por category
//   ?minPrice=100       → preço mínimo
//   ?maxPrice=1000      → preço máximo
//   ?inStock=true       → apenas produtos com estoque > 0
//   ?sort=price_asc | price_desc | newest | stars
//   ?page=1&limit=12    → paginação
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search   = searchParams.get("search")   ?? "";
    const category = searchParams.get("category") ?? "";
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 999_999);
    const inStock  = searchParams.get("inStock");
    const sort     = searchParams.get("sort") ?? "newest";
    const page     = Math.max(1, Number(searchParams.get("page")  || 1));
    const limit    = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 12)));
    const skip     = (page - 1) * limit;

    // Monta filtro dinâmico
    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { name:        { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { brand:       { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        category ? { category: { equals: category, mode: "insensitive" } } : {},
        { price: { gte: minPrice, lte: maxPrice } },
        inStock === "true"  ? { stock: { gt: 0 } }   : {},
        inStock === "false" ? { stock: { lte: 0 } }  : {},
      ],
    };

    const orderBy: any =
      sort === "price_asc"  ? { price: "asc" }     :
      sort === "price_desc" ? { price: "desc" }    :
      sort === "stars"      ? { stars: "desc" }    :
      /* newest */            { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limit }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET_PRODUCTS]", error);
    return NextResponse.json({ error: "Erro ao buscar produtos." }, { status: 500 });
  }
}

// ─── POST /api/products ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session)                             return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    if (session.user.role !== "ADMIN")        return NextResponse.json({ error: "Acesso negado." },   { status: 403 });

    const body = await req.json();
    const {
      name, brand, category, price, oldPrice,
      description, details, sizes, colors, colorNames,
      stock, tag, stars, reviews, slug,
      emoji, midiaUrl, midiaType,
      isNew, isSale, inStock, images
    } = body;

    // ── Validações ──────────────────────────────────────────────────────────
    if (!name?.trim())                      return NextResponse.json({ error: "Nome é obrigatório." },       { status: 400 });
    if (!slug?.trim())                      return NextResponse.json({ error: "Slug é obrigatório." },       { status: 400 });
    if (!brand?.trim())                     return NextResponse.json({ error: "Marca é obrigatória." },      { status: 400 });
    if (!category?.trim())                  return NextResponse.json({ error: "Categoria é obrigatória." },  { status: 400 });
    if (!description?.trim())               return NextResponse.json({ error: "Descrição é obrigatória." },  { status: 400 });
    if (isNaN(Number(price)) || price <= 0) return NextResponse.json({ error: "Preço inválido." },          { status: 400 });
    if (isNaN(Number(stock)) || stock <  0) return NextResponse.json({ error: "Estoque inválido." },        { status: 400 });

    // Slug deve ser único
    const slugExists = await prisma.product.findUnique({ where: { slug: slug.trim() } });
    if (slugExists) return NextResponse.json({ error: "Slug já está em uso." }, { status: 409 });

    const product = await prisma.product.create({
      data: {
        name:        name.trim(),
        slug:        slug.trim(),
        brand:       brand.trim(),
        category:    category.trim(),
        price:       Number(price),
        oldPrice:    oldPrice  ? Number(oldPrice)   : null,
        description: description.trim(),
        details:     details?.trim()                ?? null,
        sizes:       Array.isArray(sizes)   ? sizes.map(Number)   : [],
        colors:      Array.isArray(colors)      ? colors      : [],
        colorNames:  Array.isArray(colorNames)  ? colorNames  : [],
        stock:       Number(stock),
        tag:         tag?.trim()                    ?? null,
        stars:       stars   ? Number(stars)   : 5.0,
        reviews:     reviews ? Number(reviews) : 0,
        emoji:       emoji?.trim()                  ?? "👟",
        midiaUrl:    midiaUrl                       ?? null,
        midiaType:   midiaType                      ?? null,
        images:      Array.isArray(images) ? images.filter(Boolean) : [],
        isNew:       Boolean(isNew),
        isSale:      Boolean(isSale),
        inStock:     inStock !== undefined ? Boolean(inStock) : Number(stock) > 0,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("[CREATE_PRODUCT]", error);
    return NextResponse.json({ error: "Erro interno ao criar produto." }, { status: 500 });
  }
}