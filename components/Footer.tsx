"use client";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--black)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }} className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <CrownSVG />
              <div>
                <div className="font-display" style={{ fontSize: 28, color: "var(--gold)", lineHeight: 1 }}>SEVEN</div>
                <div className="font-condensed" style={{ fontSize: 9, color: "var(--gray)", letterSpacing: "0.3em", textTransform: "uppercase" }}>IMPORT BR</div>
              </div>
            </Link>
            <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
              Quem vive de verdade usa Seven. Tênis premium e importados com entrega para todo o Brasil desde 2024.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="https://instagram.com/sevenimportbr" target="_blank"
                style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray)", transition: "all 0.2s", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--gray)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://wa.me/5531999999999" target="_blank"
                style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray)", transition: "all 0.2s", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#25D366"; (e.currentTarget as HTMLElement).style.color = "#25D366"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--gray)"; }}>
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Produtos */}
          <div>
            <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Produtos</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Novidades", href: "/produtos?sort=novo" },
                { label: "Nike", href: "/produtos?categoria=Nike" },
                { label: "Jordan", href: "/produtos?categoria=Jordan" },
                { label: "Off-White", href: "/produtos?categoria=Off-White" },
                { label: "Vans", href: "/produtos?categoria=Vans" },
                { label: "Timberland", href: "/produtos?categoria=Timberland" },
                { label: "Outlet", href: "/produtos?sale=true" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontSize: 13, color: "var(--gray)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Informações */}
          <div>
            <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Informações</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Sobre nós", href: "/sobre" },
                { label: "FAQ", href: "/faq" },
                { label: "Minha conta", href: "/conta" },
                { label: "Rastreio de pedido", href: "/conta" },
                { label: "Política de troca", href: "/faq" },
                { label: "Formas de pagamento", href: "/faq" },
              ].map(l => (
                <Link key={l.href + l.label} href={l.href} style={{ fontSize: 13, color: "var(--gray)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div>
            <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Contato</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "@sevenimportbr", href: "https://instagram.com/sevenimportbr" },
                { label: "@miguelxi77", href: "https://instagram.com/miguelxi77" },
                { label: "linktr.ee/sevenimportbr", href: "https://linktr.ee/sevenimportbr" },
                { label: "WhatsApp", href: "https://wa.me/5531999999999" },
              ].map(l => (
                <a key={l.href} href={l.href} target="_blank" style={{ fontSize: 13, color: "var(--gray)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
                  {l.label}
                </a>
              ))}
            </div>

            {/* Mini CTA */}
            <div style={{ marginTop: 24, background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: 8, padding: "14px 16px" }}>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.1em", marginBottom: 6 }}>📷 Nos siga</div>
              <a href="https://instagram.com/sevenimportbr" target="_blank" className="font-condensed"
                style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", textDecoration: "none", letterSpacing: "0.03em" }}>
                @sevenimportbr
              </a>
            </div>
          </div>
        </div>

        <div className="stripe-sep" style={{ marginBottom: 24 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.05em" }}>
            © {year} Seven Import BR · Todos os direitos reservados · Belo Horizonte, MG
          </p>
          <p className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.05em" }}>
            Parcelas sem juros · Envio nacional · 100% original · Since 2024
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

function CrownSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M4 22L8 10L16 18L24 10L28 22H4Z" fill="#F5C518" />
      <circle cx="8" cy="10" r="2.5" fill="#F5C518" />
      <circle cx="16" cy="8" r="2.5" fill="#F5C518" />
      <circle cx="24" cy="10" r="2.5" fill="#F5C518" />
      <rect x="4" y="22" width="24" height="4" rx="1" fill="#C9A000" />
    </svg>
  );
}
