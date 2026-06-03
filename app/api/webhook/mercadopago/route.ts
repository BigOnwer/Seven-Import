import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { createHmac } from "crypto";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

function verifySignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  // Se não configurou o secret ainda, loga aviso mas não bloqueia em dev
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[WEBHOOK] MERCADO_PAGO_WEBHOOK_SECRET não configurado em produção!");
      return false;
    }
    return true;
  }

  const xSignature = req.headers.get("x-signature") ?? "";
  const xRequestId = req.headers.get("x-request-id") ?? "";
  const urlParams  = new URL(req.url).searchParams;
  const dataId     = urlParams.get("data.id") ?? "";

  // Monta a string de verificação conforme doc do MP
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${xSignature.split(",").find(p => p.startsWith("ts="))?.split("=")[1] ?? ""};`;

  const [, v1Part] = xSignature.split(",");
  const receivedHash = v1Part?.split("=")[1] ?? "";

  const expectedHash = createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return expectedHash === receivedHash;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!verifySignature(req, rawBody)) {
      console.warn("[WEBHOOK] Assinatura inválida — requisição rejeitada.");
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    if (body.type !== "payment") return NextResponse.json({ ok: true });

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ ok: true });

    const payment = new Payment(client);
    const data = await payment.get({ id: paymentId });

    const orderId = data.external_reference;
    if (!orderId) return NextResponse.json({ ok: true });

    const methodMap: Record<string, string> = {
      credit_card:    "CREDIT_CARD",
      debit_card:     "DEBIT_CARD",
      pix:            "PIX",
      bolbradesco:    "BOLETO",
      pec:            "BOLETO",
    };
    const paymentMethod = (methodMap[data.payment_type_id ?? ""] ?? "CREDIT_CARD") as any;

    if (data.status === "approved") {
      await prisma.$transaction(async tx => {
        const order = await tx.order.update({
          where: { id: orderId },
          data: { status: "CONFIRMED", paymentStatus: "PAID", paymentMethod },
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
    return NextResponse.json({ ok: true });
  }
}