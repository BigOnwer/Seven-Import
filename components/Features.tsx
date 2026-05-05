"use client";
import { Truck, CreditCard, Shield, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Envio Nacional",
    desc: "Entregamos para todo o Brasil com rastreamento em tempo real.",
    highlight: "Frete grátis acima de R$ 800",
  },
  {
    icon: CreditCard,
    title: "Parcelamos em 12x",
    desc: "Divida sua compra em até 12 vezes sem juros no cartão.",
    highlight: "Aceitamos todos os cartões",
  },
  {
    icon: Shield,
    title: "100% Autêntico",
    desc: "Todos os produtos são verificados e garantidos originais.",
    highlight: "Certificado de autenticidade",
  },
  {
    icon: MessageCircle,
    title: "Atendimento VIP",
    desc: "Suporte via Instagram e WhatsApp com resposta rápida.",
    highlight: "@sevenimportbr",
  },
];

export default function Features() {
  return (
    <section style={{ background: "var(--black-2)", padding: "72px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: "var(--black-2)",
                padding: "32px 28px",
                transition: "background 0.3s",
                cursor: "default",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--black-3)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--black-2)")}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: "rgba(245,197,24,0.1)",
                  border: "1px solid rgba(245,197,24,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <f.icon size={22} color="var(--gold)" />
              </div>
              <div
                className="font-condensed"
                style={{ fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 8, letterSpacing: "0.02em" }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6, marginBottom: 12 }}>
                {f.desc}
              </div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                → {f.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
