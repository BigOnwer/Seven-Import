import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { items, address, couponId, shipping } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
    }

    // Busca preços reais do banco — nunca confia no cliente
    const productIds = items.map((i: any) => i.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, stock: true, emoji: true, images: true },
    });

    // Valida que todos os produtos existem
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "Um ou mais produtos não encontrados." }, { status: 400 });
    }

    // Monta itens com preços do banco
    const validatedItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.id);
      if (!product) throw new Error(`Produto ${item.id} não encontrado.`);
      if (product.stock < item.quantity) {
        throw new Error(`Produto "${product.name}" sem estoque suficiente.`);
      }
      return {
        id:       product.id,
        name:     product.name,
        price:    product.price,   // preço real do banco
        quantity: item.quantity,
        size:     item.size ?? null,
        image:    product.images?.[0] ?? null,
      };
    });

    // Calcula subtotal com preços reais
    const subtotal = validatedItems.reduce(
      (sum, i) => sum + i.price * i.quantity, 0
    );

    // Valida e aplica cupom se enviado
    let discount = 0;
    let validCoupon = null;
    if (couponId) {
      validCoupon = await prisma.coupon.findUnique({ where: { id: couponId } });
      if (validCoupon && validCoupon.status === "ACTIVE") {
        if (!validCoupon.expiresAt || validCoupon.expiresAt > new Date()) {
          if (!validCoupon.maxUses || validCoupon.usedCount < validCoupon.maxUses) {
            discount = validCoupon.discountType === "PERCENTAGE"
              ? subtotal * (Number(validCoupon.discountValue) / 100)
              : Math.min(Number(validCoupon.discountValue), subtotal);
          }
        }
      }
    }

    const shippingValue = Number(shipping ?? 0);
    const total = Math.max(0, subtotal - discount + shippingValue);

    const order = await prisma.order.create({
      data: {
        userId:        session.user.id,
        couponId:      validCoupon?.id ?? null,
        status:        "PENDING",
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "PENDING",
        subtotal,
        discount,
        shipping:      shippingValue,
        total,
        address:       `${address.rua}${address.numero ? `, ${address.numero}` : ""}${address.complemento ? ` ${address.complemento}` : ""}`,
        city:          address.cidade,
        state:         address.estado,
        zipCode:       address.cep,
        items: {
          create: validatedItems.map(item => ({
            productId: item.id,
            quantity:  item.quantity,
            price:     item.price,
            size:      item.size,
          })),
        },
      },
    });

    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        external_reference: order.id,
        items: validatedItems.map(item => ({
          id:          String(item.id),
          title:       item.name,
          quantity:    item.quantity,
          unit_price:  item.price,
          currency_id: "BRL",
          picture_url: item.image,
        })),
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,
        ...(process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost") && {
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
            failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/falha`,
            pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
          },
          auto_return: "approved",
        }),
      },
    });

    return NextResponse.json({
      checkoutUrl: response.sandbox_init_point ?? response.init_point,
      orderId: order.id,
    });
  } catch (err: any) {
    console.error("[POST /api/checkout]", err.message);
    return NextResponse.json(
      { error: err.message ?? "Erro ao criar pedido." },
      { status: 400 }
    );
  }
}