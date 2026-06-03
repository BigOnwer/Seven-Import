'use client';
import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

interface Props {
  orderId: string;
  amount: number;
  onSuccess: (data: any) => void;
  onError: (err: any) => void;
}

export default function MercadoPagoBrick({ orderId, amount, onSuccess, onError }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = process.env.MERCADO_PAGO_PUBLIC_TOKEN;
    if (!key) return;

    initMercadoPago(key, { locale: "pt-BR" });
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div style={{ padding:"40px 0", textAlign:"center", color:"var(--gray)" }}>
        <div style={{ fontSize:24, marginBottom:12 }}>⏳</div>
        <div className="font-condensed" style={{ fontSize:13, letterSpacing:"0.1em" }}>Carregando...</div>
      </div>
    );
  }

  const onSubmit = async ({ formData }: any) => {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, formData }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Erro no pagamento");
    onSuccess(data);
  };

  return (
    <Payment
      initialization={{ amount }}
      customization={{
        paymentMethods: {
          creditCard: "all",
          debitCard: "all",
          ticket: "all",
          bankTransfer: "all",
        },
        visual: {
          style: {
            theme: "dark",
            customVariables: {
              baseColor: "#F5C518",
              textPrimaryColor: "#ffffff",
              textSecondaryColor: "#999999",
              inputBackgroundColor: "#0a0a0a",
              formBackgroundColor: "#111111",
              borderRadiusMedium: "6px",
            },
          },
        },
      } as any}
      onSubmit={onSubmit}
      onError={(err) => {
        console.error("Brick error:", err);
        onError(err);
      }}
    />
  );
}