"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const cats = [
  {
    name: "Nike",
    emoji: "👟",
    desc: "Air Force, Air Max, SB Dunk e mais",
    color: "#e74c3c",
    href: "/produtos?categoria=Nike",
    count: 4,
  },
  {
    name: "Jordan",
    emoji: "🏀",
    desc: "AJ1, AJ4, AJ11 — lendas do basquete",
    color: "#F5C518",
    href: "/produtos?categoria=Jordan",
    count: 1,
  },
  {
    name: "Off-White",
    emoji: "🔖",
    desc: "Collabs exclusivas de Virgil Abloh",
    color: "#ffffff",
    href: "/produtos?categoria=Off-White",
    count: 1,
  },
  {
    name: "Timberland",
    emoji: "🥾",
    desc: "Botas premium que viraram ícone",
    color: "#C8A96E",
    href: "/produtos?categoria=Timberland",
    count: 1,
  },
  {
    name: "Vans",
    emoji: "🛹",
    desc: "Old Skool, Sk8-Hi e clássicos",
    color: "#3498db",
    href: "/produtos?categoria=Vans",
    count: 1,
  },
  {
    name: "Outlet",
    emoji: "🔥",
    desc: "Melhores preços da coleção",
    color: "#e74c3c",
    href: "/produtos?sale=true",
    count: 6,
    isHot: true,
  },
];

export default function CategoryGrid() {
  return (
    <section style={{ padding: "80px 0", background: "var(--black-2)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>
              Explorar
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(32px,5vw,56px)", color: "var(--white)", lineHeight: 0.95 }}>
              CATEGORIAS
            </h2>
          </div>
          <Link href="/produtos" style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600,
            fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--gold)", textDecoration: "none", transition: "gap 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.gap = "10px")}
          onMouseLeave={e => (e.currentTarget.style.gap = "6px")}>
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
        }}>
          {cats.map((cat) => (
            <Link key={cat.name} href={cat.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "var(--black-3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "28px 20px 24px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.borderColor = `${cat.color}50`;
                  el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${cat.color}30`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.boxShadow = "none";
                }}
              >
                {cat.isHot && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: "#e74c3c", color: "#fff",
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 700, fontSize: 9, letterSpacing: "0.1em",
                    padding: "2px 7px", borderRadius: 10, textTransform: "uppercase",
                  }}>HOT</div>
                )}

                {/* Color accent dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: cat.color,
                  margin: "0 auto 14px",
                  boxShadow: `0 0 12px ${cat.color}80`,
                }} />

                <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>{cat.emoji}</div>

                <div className="font-display" style={{ fontSize: 20, color: "var(--white)", marginBottom: 6 }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--gray)", lineHeight: 1.5, marginBottom: 10 }}>
                  {cat.desc}
                </div>
                <div className="font-condensed" style={{ fontSize: 10, color: cat.color, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {cat.count} produto{cat.count !== 1 ? "s" : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
