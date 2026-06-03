import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.type !== "payment") return NextResponse.json({ ok: true });

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ ok: true });

    const payment = new Payment(client);
    const data = await payment.get({ id: paymentId });

    const orderId = data.external_reference;
    if (!orderId) return NextResponse.json({ ok: true });

    const methodMap: Record<string, string> = {
      credit_card: "CREDIT_CARD",
      debit_card:  "DEBIT_CARD",
      pix:         "PIX",
      bolbradesco: "BOLETO",
      pec:         "BOLETO",
    };
    const paymentMethod = (methodMap[data.payment_type_id ?? ""] ?? "CREDIT_CARD") as any;

    if (data.status === "approved") {
      await prisma.$transaction(async tx => {
        const order = await tx.order.update({
          where: { id: orderId },
          data: {
            status:        "CONFIRMED",
            paymentStatus: "PAID",
            paymentMethod,
          },
        });
        if (order.couponId) {
          await tx.coupon.update({
            where: { id: order.couponId },
            data:  { usedCount: { increment: 1 } },
          });
        }
      });
    }

    if (data.status === "rejected" || data.status === "cancelled") {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "FAILED", status: "CANCELLED" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/webhook/mercadopago]", err);
    return NextResponse.json({ ok: true }); // sempre 200 pro MP não retentar em loop
  }
}