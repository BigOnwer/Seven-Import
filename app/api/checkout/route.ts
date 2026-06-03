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
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { items, address, couponId, subtotal, discount, shipping, total } = await req.json();

    // Cria Order PENDING antes de ir pro MP
    const order = await prisma.order.create({
      data: {
        userId:        session.user.id,
        couponId:      couponId ?? null,
        status:        "PENDING",
        paymentMethod: "CREDIT_CARD", // o MP define o real; webhook corrige
        paymentStatus: "PENDING",
        subtotal,
        discount:      discount ?? 0,
        shipping:      shipping ?? 0,
        total,
        address:       address.rua + (address.numero ? `, ${address.numero}` : "") + (address.complemento ? ` ${address.complemento}` : ""),
        city:          address.cidade,
        state:         address.estado,
        zipCode:       address.cep,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity:  item.quantity,
            price:     item.price,
            size:      item.size ?? null,
          })),
        },
      },
    });

    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        external_reference: order.id,
        items: items.map((item: any) => ({
          id:          String(item.id),
          title:       item.name,
          quantity:    item.quantity,
          unit_price:  item.price,
          currency_id: "BRL",
          picture_url: item.image,
        })),
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,
        // back_urls só em produção com URL real
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
  } catch (err) {
    console.error("[POST /api/checkout]", err);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}