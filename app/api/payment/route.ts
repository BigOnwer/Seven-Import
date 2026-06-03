import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { randomUUID } from "crypto";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { orderId, formData } = await req.json();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== session.userId)
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        ...formData,
        transaction_amount: Number(order.total),
        external_reference: order.id,
      },
      requestOptions: { idempotencyKey: randomUUID() },
    });

    // Atualiza pedido
    const methodMap: Record<string, string> = {
      credit_card: "CREDIT_CARD",
      debit_card:  "DEBIT_CARD",
      bank_transfer: "PIX",
      ticket:      "BOLETO",
    };

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod: (methodMap[result.payment_type_id ?? ""] ?? "CREDIT_CARD") as any,
        paymentStatus: result.status === "approved" ? "PAID"    : "PENDING",
        status:        result.status === "approved" ? "CONFIRMED": "PENDING",
      },
    });

    if (result.status === "approved" && order.couponId) {
      await prisma.coupon.update({
        where: { id: order.couponId },
        data:  { usedCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      status:       result.status,
      statusDetail: result.status_detail,
      qrCode:       result.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      boletoUrl:    result.transaction_details?.external_resource_url,
      barcode:      result.barcode?.content,
    });

  } catch (err: any) {
    console.error("[POST /api/payment]", err);
    return NextResponse.json({ error: err?.message ?? "Erro ao processar pagamento" }, { status: 500 });
  }
}