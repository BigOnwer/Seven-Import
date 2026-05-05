"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SobrePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        paddingTop: 108, paddingBottom: 0,
        background: "var(--black-2)", position: "relative", overflow: "hidden",
      }}>
        {/* BG text */}
        <div className="font-display" style={{
          position: "absolute", bottom: -20, right: -20,
          fontSize: "clamp(120px,18vw,240px)", color: "rgba(245,197,24,0.04)",
          lineHeight: 1, pointerEvents: "none", userSelect: "none",
        }}>2024</div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Nossa história</span>
            <h1 className="font-display" style={{ fontSize: "clamp(48px,7vw,96px)", lineHeight: 0.9, marginBottom: 28 }}>
              <span style={{ color: "var(--white)" }}>BORN IN</span><br />
              <span style={{ color: "var(--gold)" }}>BELO HORIZONTE</span>
            </h1>
            <p style={{ fontSize: 17, color: "var(--gray)", lineHeight: 1.8, maxWidth: 540 }}>
              A Seven Import nasceu em 2024 com um propósito simples: trazer os tênis mais desejados do mundo para as ruas brasileiras, com preço justo e atendimento de verdade.
            </p>
          </div>
        </div>
      </section>

      {/* Stripe */}
      <div className="stripe-sep" />

      {/* Stats */}
      <section style={{ background: "var(--black)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, overflow: "hidden" }}>
          {[
            { value: "936+", label: "Seguidores", emoji: "📷" },
            { value: "2024", label: "Fundada em", emoji: "🏆" },
            { value: "12x", label: "Sem juros", emoji: "💳" },
            { value: "100%", label: "Original", emoji: "✅" },
            { value: "BH", label: "Base em MG", emoji: "📍" },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--black-2)", padding: "28px 24px", textAlign: "center",
              transition: "background 0.3s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--black-3)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--black-2)")}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.emoji}</div>
              <div className="font-display" style={{ fontSize: 36, color: "var(--gold)", lineHeight: 1 }}>{s.value}</div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: "80px 24px", background: "var(--black-2)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="story-grid">
          <div>
            <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>Nossa missão</div>
            <h2 className="font-display" style={{ fontSize: "clamp(32px,5vw,60px)", color: "var(--white)", lineHeight: 0.9, marginBottom: 24 }}>
              STREETWEAR SEM<br /><span style={{ color: "var(--gold)" }}>FRONTEIRAS</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { title: "Curadoria rigorosa", text: "Cada par é selecionado com critério. Só entra no catálogo o que realmente vale a pena." },
                { title: "Preços honestos", text: "Parcelamos em até 12x sem juros. Acreditamos que tênis premium deve ser acessível." },
                { title: "Atendimento real", text: "Você fala com pessoas reais via Instagram. Sem robôs, sem enrolação." },
              ].map(item => (
                <div key={item.title} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 3, background: "var(--gold)", borderRadius: 2, flexShrink: 0, alignSelf: "stretch" }} />
                  <div>
                    <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", letterSpacing: "0.05em", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.65 }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {/* Brand card */}
            <div style={{ background: "var(--black-3)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 16, padding: 36, textAlign: "center" }}>
              <div style={{ marginBottom: 20 }}>
                <CrownSVG size={56} />
              </div>
              <div className="font-display" style={{ fontSize: 40, color: "var(--gold)", lineHeight: 1, marginBottom: 4 }}>SEVEN</div>
              <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 20 }}>IMPORT BR</div>
              <div className="stripe-sep" style={{ marginBottom: 20 }} />
              <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.7, marginBottom: 20 }}>
                "Quem vive de verdade usa Seven."<br />
                Porque estilo não é luxo — é identidade.
              </p>
              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />)}
              </div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.1em" }}>936+ clientes satisfeitos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 24px", background: "var(--black)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(32px,5vw,56px)", color: "var(--white)", lineHeight: 0.95 }}>
              NOSSOS <span style={{ color: "var(--gold)" }}>VALORES</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {[
              { emoji: "🔥", title: "Paixão", desc: "Somos apaixonados por tênis, cultura urbana e estilo de rua." },
              { emoji: "💎", title: "Qualidade", desc: "Nenhum par entra em nosso catálogo sem passar por rigorosa verificação." },
              { emoji: "🤝", title: "Confiança", desc: "Transparência total. O que você vê é o que você recebe." },
              { emoji: "🚀", title: "Agilidade", desc: "Envio rápido para todo o Brasil com rastreamento em tempo real." },
              { emoji: "💛", title: "Comunidade", desc: "Fazemos parte da mesma cultura. Cada cliente é da família Seven." },
            ].map(v => (
              <div key={v.title}
                style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "24px 20px", textAlign: "center", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.3)"; (e.currentTarget as HTMLElement).style.background = "var(--black-3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "var(--black-2)"; }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{v.emoji}</div>
                <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", letterSpacing: "0.05em", marginBottom: 8 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: "var(--gray)", lineHeight: 1.65 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location + Contact */}
      <section style={{ padding: "80px 24px", background: "var(--black-2)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(32px,5vw,56px)", color: "var(--white)", marginBottom: 8, lineHeight: 0.95 }}>
            FALE COM A <span style={{ color: "var(--gold)" }}>GENTE</span>
          </h2>
          <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 36, lineHeight: 1.7 }}>
            Estamos sempre disponíveis pelo Instagram. DM, comentário ou story — a Seven está aqui!
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <a href="https://instagram.com/sevenimportbr" target="_blank" className="btn-gold"
              style={{ padding: "13px 28px", borderRadius: 6, textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
              📷 @sevenimportbr <ArrowRight size={15} />
            </a>
            <a href="https://instagram.com/miguelxi77" target="_blank" className="btn-outline"
              style={{ padding: "13px 28px", borderRadius: 6, textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent" }}>
              <InstagramIcon size={15} /> @miguelxi77
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <MapPin size={14} color="var(--gold)" />
            <span className="font-condensed" style={{ fontSize: 13, color: "var(--gray)", letterSpacing: "0.08em" }}>Belo Horizonte, Minas Gerais · Enviamos para todo o Brasil</span>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 760px) { .story-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </div>
  );
}

function CrownSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto", display: "block" }}>
      <path d="M4 22L8 10L16 18L24 10L28 22H4Z" fill="#F5C518" />
      <circle cx="8" cy="10" r="2.5" fill="#F5C518" />
      <circle cx="16" cy="8" r="2.5" fill="#F5C518" />
      <circle cx="24" cy="10" r="2.5" fill="#F5C518" />
      <rect x="4" y="22" width="24" height="4" rx="1" fill="#C9A000" />
    </svg>
  );
}

function InstagramIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
