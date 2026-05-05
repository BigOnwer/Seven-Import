"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Bell, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useToast } from "@/components/ui/Toast";

const upcomingDrops = [
  {
    name: "Nike Air Max 1 \"Safari\"",
    brand: "Nike",
    emoji: "🦁",
    releaseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d; })(),
    price: 1099,
    desc: "O retorno do Safari Print mais icônico de todos os tempos.",
    tag: "Pré-venda",
    color: "#C8A96E",
  },
  {
    name: "Jordan 1 High OG \"Lost & Found\"",
    brand: "Air Jordan",
    emoji: "🔴",
    releaseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 14); return d; })(),
    price: 1649,
    desc: "Chicago reimaginada com o desgaste intencional que virou febre.",
    tag: "Exclusivo",
    color: "#e74c3c",
  },
  {
    name: "New Balance 9060 \"Sea Salt\"",
    brand: "New Balance",
    emoji: "⚪",
    releaseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 21); return d; })(),
    price: 899,
    desc: "O chunky runner que conquistou o mundo do streetwear.",
    tag: "Em breve",
    color: "#aaaaaa",
  },
];

function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function DropCard({ drop }: { drop: typeof upcomingDrops[0] }) {
  const t = useCountdown(drop.releaseDate);
  const pad = (n: number) => String(n).padStart(2, "0");
  const [notified, setNotified] = useState(false);
  const { showToast } = useToast();

  const handleNotify = () => {
    setNotified(true);
    showToast(`Aviso ativado para ${drop.name}!`, "success", "🔔");
  };

  return (
    <div style={{
      background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, overflow: "hidden", transition: "all 0.3s",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.borderColor = `${drop.color}40`;
      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px rgba(0,0,0,0.4)`;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLElement).style.boxShadow = "none";
    }}>
      {/* Image area */}
      <div style={{
        height: 200, background: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)`,
        borderBottom: `1px solid ${drop.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 80, position: "relative",
      }}>
        {drop.emoji}
        <span className="tag" style={{ position: "absolute", top: 14, left: 14, background: drop.color === "#e74c3c" ? "#e74c3c" : "var(--gold)", color: drop.color === "#e74c3c" ? "#fff" : "var(--black)" }}>
          {drop.tag}
        </span>
      </div>

      <div style={{ padding: "20px 20px 22px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: drop.color, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{drop.brand}</div>
        <div className="font-display" style={{ fontSize: 20, color: "var(--white)", marginBottom: 6, lineHeight: 1.1 }}>{drop.name}</div>
        <div style={{ fontSize: 12, color: "var(--gray)", lineHeight: 1.6, marginBottom: 16 }}>{drop.desc}</div>

        {/* Countdown */}
        <div style={{ marginBottom: 16 }}>
          <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Lança em</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ v: pad(t.d), l: "dias" }, { v: pad(t.h), l: "hrs" }, { v: pad(t.m), l: "min" }, { v: pad(t.s), l: "seg" }].map(x => (
              <div key={x.l} style={{ textAlign: "center" }}>
                <div className="font-display" style={{
                  fontSize: 22, color: "var(--gold)", lineHeight: 1,
                  background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)",
                  borderRadius: 6, padding: "4px 8px", minWidth: 44, display: "block",
                }}>{x.v}</div>
                <div className="font-condensed" style={{ fontSize: 8, color: "var(--gray)", letterSpacing: "0.15em", marginTop: 3, textTransform: "uppercase" }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="font-display" style={{ fontSize: 24, color: "var(--gold)" }}>
            R$ {drop.price.toLocaleString("pt-BR")}
          </div>
          <button onClick={handleNotify} className={notified ? "" : "btn-gold"}
            style={{
              padding: "9px 14px", borderRadius: 6, border: notified ? "1px solid rgba(34,197,94,0.4)" : "none",
              cursor: "pointer", fontSize: 12,
              background: notified ? "rgba(34,197,94,0.1)" : "var(--gold)",
              color: notified ? "#22C55E" : "var(--black)",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.3s",
            }}>
            <Bell size={13} fill={notified ? "#22C55E" : "none"} />
            {notified ? "Avisado!" : "Me avise"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LancamentosPage() {
  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();
  const { showToast } = useToast();
  const newProducts = products.filter(p => p.isNew);
  const saleProducts = products.filter(p => p.isSale).slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        paddingTop: 108, paddingBottom: 60,
        background: "linear-gradient(180deg, var(--black-2) 0%, var(--black) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div className="font-display" style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          fontSize: "clamp(80px,15vw,200px)", color: "rgba(245,197,24,0.04)",
          whiteSpace: "nowrap", pointerEvents: "none",
        }}>DROPS</div>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <span className="tag" style={{ display: "inline-block", marginBottom: 16 }}>New Drops</span>
          <h1 className="font-display" style={{ fontSize: "clamp(44px,7vw,84px)", color: "var(--white)", lineHeight: 0.9, marginBottom: 16 }}>
            LANÇAMENTOS<br /><span style={{ color: "var(--gold)" }}>& NOVIDADES</span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
            Fique por dentro dos próximos drops e não perca nenhum lançamento exclusivo. Ative o aviso e seja o primeiro a saber.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Upcoming drops */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>Em breve</div>
              <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)", lineHeight: 0.95 }}>
                PRÓXIMOS <span style={{ color: "var(--gold)" }}>DROPS</span>
              </h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {upcomingDrops.map(drop => <DropCard key={drop.name} drop={drop} />)}
          </div>
        </div>

        {/* New arrivals */}
        {newProducts.length > 0 && (
          <div style={{ marginBottom: 72 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>Chegaram agora</div>
                <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)", lineHeight: 0.95 }}>
                  RECÉM <span style={{ color: "var(--gold)" }}>CHEGADOS</span>
                </h2>
              </div>
              <Link href="/produtos" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gold)", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {newProducts.map(p => (
                <div key={p.id} style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", transition: "all 0.3s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                  <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ height: 180, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
                      {p.emoji}
                      <span className="tag" style={{ position: "absolute", top: 12, left: 12 }}>Novo</span>
                    </div>
                  </Link>
                  <div style={{ padding: "14px 16px 18px" }}>
                    <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 3 }}>{p.brand}</div>
                    <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 10 }}>{p.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>R$ {p.price.toLocaleString("pt-BR")}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { toggle(p); showToast(isLiked(p.id) ? "Removido dos favoritos" : "Adicionado aos favoritos", "info", isLiked(p.id) ? "💔" : "❤️"); }}
                          style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: `1px solid ${isLiked(p.id) ? "rgba(231,76,60,0.4)" : "rgba(255,255,255,0.12)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: isLiked(p.id) ? "#e74c3c" : "var(--gray)", transition: "all 0.2s" }}>
                          ♥
                        </button>
                        <button onClick={() => { addItem(p, p.sizes[1]); showToast(`${p.name} adicionado!`, "success", "👟"); }}
                          className="btn-gold" style={{ padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                          <ShoppingBag size={13} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sale picks */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <div className="font-condensed" style={{ fontSize: 11, color: "#e74c3c", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>🔥 Outlet</div>
            <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)", lineHeight: 0.95 }}>
              MELHORES <span style={{ color: "#e74c3c" }}>OFERTAS</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {saleProducts.map(p => {
              const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
              return (
                <Link key={p.id} href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", transition: "all 0.3s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(231,76,60,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                    <div style={{ height: 150, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, position: "relative" }}>
                      {p.emoji}
                      {disc > 0 && <span className="font-condensed" style={{ position: "absolute", top: 10, right: 10, background: "#e74c3c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 2 }}>-{disc}%</span>}
                    </div>
                    <div style={{ padding: "12px 14px 16px" }}>
                      <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>{p.name}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                        {p.oldPrice && <span style={{ fontSize: 11, color: "var(--gray)", textDecoration: "line-through", fontFamily: "'Barlow Condensed',sans-serif" }}>R$ {p.oldPrice.toLocaleString("pt-BR")}</span>}
                        <span className="font-display" style={{ fontSize: 20, color: "#e74c3c" }}>R$ {p.price.toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/produtos?sale=true" className="btn-outline" style={{ padding: "12px 32px", borderRadius: 6, textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent" }}>
              Ver todas as ofertas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
