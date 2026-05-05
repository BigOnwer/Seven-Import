"use client";
import Link from "next/link";
import { ArrowRight, Zap, Star } from "lucide-react";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cartContext";
import { useState } from "react";

export default function Hero() {
  const featured = products[0];
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(featured, featured.sizes[2]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section style={{
      minHeight: "100vh", background: "var(--black)",
      paddingTop: 108, position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center",
    }}>
      {/* BG huge text */}
      <div className="font-display" style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontSize: "clamp(100px,20vw,300px)",
        color: "rgba(245,197,24,0.04)", whiteSpace: "nowrap",
        pointerEvents: "none", lineHeight: 1, userSelect: "none",
      }}>SEVEN</div>

      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(245,197,24,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(245,197,24,0.04) 1px,transparent 1px)",
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(transparent,var(--black))" }} />

      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 24px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 60, alignItems: "center", width: "100%", position: "relative", zIndex: 1,
      }} className="hero-grid">

        {/* Left */}
        <div>
          <div className="fade-up delay-1" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <span className="tag">Since 2024</span>
            <span className="tag-outline">Premium Quality</span>
          </div>

          <h1 className="font-display fade-up delay-2" style={{
            fontSize: "clamp(52px,8vw,106px)", lineHeight: 0.9,
            letterSpacing: "-0.01em", marginBottom: 24,
          }}>
            <span style={{ color: "var(--white)" }}>QUEM</span><br />
            <span style={{ color: "var(--white)" }}>VIVE DE</span><br />
            <span className="shimmer-text">VERDADE</span><br />
            <span style={{ color: "var(--white)" }}>USA </span>
            <span style={{ color: "var(--gold)" }}>SEVEN</span>
          </h1>

          <p className="fade-up delay-3" style={{
            color: "var(--gray)", fontSize: 16, lineHeight: 1.7,
            maxWidth: 420, marginBottom: 36,
          }}>
            Tênis premium e importados para quem não abre mão de estilo.
            Parcelamos em até 12x e enviamos para todo o Brasil.
          </p>

          <div className="fade-up delay-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/produtos" className="btn-gold" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 4, textDecoration: "none", fontSize: 14,
            }}>
              Ver Coleção <ArrowRight size={16} />
            </Link>
            <Link href="/busca" className="btn-outline" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 4, textDecoration: "none", fontSize: 14, background: "transparent",
            }}>
              Buscar tênis
            </Link>
          </div>

          <div className="fade-up delay-4" style={{
            display: "flex", gap: 32, marginTop: 48, paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            {[{ value: "936+", label: "Seguidores" }, { value: "12x", label: "Sem Juros" }, { value: "100%", label: "Original" }].map(s => (
              <div key={s.label}>
                <div className="font-display" style={{ fontSize: 32, color: "var(--gold)", lineHeight: 1 }}>{s.value}</div>
                <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - floating card */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 480 }}>
          <div style={{
            position: "absolute", width: 380, height: 380, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(245,197,24,0.15) 0%,transparent 70%)",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />

          <div className="float" style={{
            background: "var(--black-3)", border: "1px solid rgba(245,197,24,0.25)",
            borderRadius: 16, padding: 32, width: 340, textAlign: "center", position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
              background: "var(--gold)", color: "var(--black)",
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11,
              letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "4px 16px", borderRadius: 2, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
            }}>
              <Zap size={10} fill="currentColor" /> Destaque da Semana
            </div>

            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 80 }}>
              {featured.emoji}
            </div>

            <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{featured.brand}</div>
            <div className="font-display" style={{ fontSize: 24, color: "var(--white)", marginBottom: 4 }}>{featured.name}</div>
            <div className="font-condensed" style={{ fontSize: 12, color: "var(--gray)", marginBottom: 14 }}>{featured.desc}</div>

            <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 20 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />)}
              <span className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", marginLeft: 4 }}>5.0</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", textDecoration: "line-through" }}>R$ {featured.oldPrice?.toLocaleString("pt-BR")}</div>
                <div className="font-display" style={{ fontSize: 28, color: "var(--gold)" }}>R$ {featured.price.toLocaleString("pt-BR")}</div>
              </div>
              <button onClick={handleAdd} className="btn-gold" style={{
                padding: "10px 18px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 13,
                background: added ? "#22C55E" : undefined,
              }}>
                {added ? "✓ Adicionado!" : "Comprar"}
              </button>
            </div>
          </div>

          <div style={{ position: "absolute", top: 60, right: -10, background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: "'Barlow Condensed',sans-serif", color: "var(--white)" }}>
            🚀 Frete Grátis
          </div>
          <div style={{ position: "absolute", bottom: 100, left: -10, background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: "'Barlow Condensed',sans-serif", color: "var(--white)" }}>
            💳 Até 12x
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { display: none !important; }
        }
      `}</style>
    </section>
  );
}
