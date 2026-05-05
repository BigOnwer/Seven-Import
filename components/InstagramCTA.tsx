"use client";
import { ArrowRight } from "lucide-react";

export default function InstagramCTA() {
  return (
    <section
      style={{
        padding: "80px 24px",
        background: "var(--black-2)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff" stroke="none"/></svg>
        </div>

        <div
          className="font-condensed"
          style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}
        >
          Nos siga no Instagram
        </div>

        <h2
          className="font-display"
          style={{ fontSize: "clamp(36px, 6vw, 64px)", color: "var(--white)", lineHeight: 0.95, marginBottom: 16 }}
        >
          @SEVENIMPORTBR
        </h2>

        <p style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.7, marginBottom: 32 }}>
          Acompanhe lançamentos, novidades e promoções exclusivas.
          936+ seguidores já fazem parte da nossa comunidade.
        </p>

        <a
          href="https://instagram.com/sevenimportbr"
          target="_blank"
          className="btn-gold"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 32px",
            borderRadius: 4,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Seguir agora <ArrowRight size={16} />
        </a>

        {/* Links */}
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 24 }}>
          {[
            { label: "linktr.ee/sevenimportbr", href: "https://linktr.ee/sevenimportbr" },
            { label: "@miguelxi77", href: "https://instagram.com/miguelxi77" },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              className="font-condensed"
              style={{
                fontSize: 12,
                color: "var(--gray)",
                textDecoration: "none",
                letterSpacing: "0.05em",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
