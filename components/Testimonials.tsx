"use client";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "_souzzazxw",
    handle: "@souzzazxw",
    text: "Meu AJ4 chegou perfeito, embalagem impecável e veio antes do prazo. Seven import é top demais 🔥",
    product: "Air Jordan 4 Yellow Thunder",
    stars: 5,
  },
  {
    name: "th.any_7",
    handle: "@th.any_7",
    text: "Parcelei em 12x sem juros e o tênis é original, tenho foto ao lado. Recomendo 100% para todo mundo!",
    product: "Nike Air Force 1 × LV",
    stars: 5,
  },
  {
    name: "miguelxi77",
    handle: "@miguelxi77",
    text: "Terceira compra na Seven e sempre impecável. Atendimento rápido, produto autêntico. Não troco por nada.",
    product: "Air Max Plus TN",
    stars: 5,
  },
  {
    name: "fead_oficial",
    handle: "@fead_oficial",
    text: "Recebi meu Timberland em 3 dias. Qualidade incrível, couro legítimo. Seven é referência em BH!",
    product: "Timberland 6-Inch Premium",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "80px 0", background: "var(--black)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div
            className="font-condensed"
            style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}
          >
            Depoimentos
          </div>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "var(--white)", lineHeight: 1 }}
          >
            O QUE NOSSOS{" "}
            <span style={{ color: "var(--gold)" }}>CLIENTES</span>
            <br />
            DIZEM
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: "var(--black-2)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                padding: "24px 22px",
                position: "relative",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
            >
              <Quote
                size={28}
                color="var(--gold)"
                style={{ opacity: 0.25, position: "absolute", top: 20, right: 20 }}
              />
              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={13} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>

              <p style={{ fontSize: 14, color: "#CCCCCC", lineHeight: 1.65, marginBottom: 18 }}>
                "{t.text}"
              </p>

              <div className="stripe-sep" style={{ marginBottom: 14 }} />

              <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
                Comprou: {t.product}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>
                  {t.name}
                </span>
                <span style={{ fontSize: 11, color: "var(--gray)" }}>{t.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
