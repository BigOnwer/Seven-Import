"use client";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/lib/wishlistContext";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/components/ui/Toast";
import { Star } from "lucide-react";

export default function FavoritosPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      <div style={{ paddingTop: 108 }}>
        {/* Header */}
        <div style={{ background: "var(--black-2)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px 36px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <Heart size={28} color="var(--gold)" fill="var(--gold)" />
              <h1 className="font-display" style={{ fontSize: "clamp(36px,5vw,60px)", color: "var(--white)", lineHeight: 0.95 }}>
                MEUS <span style={{ color: "var(--gold)" }}>FAVORITOS</span>
              </h1>
            </div>
            <div className="font-condensed" style={{ fontSize: 13, color: "var(--gray)" }}>
              {items.length === 0 ? "Nenhum favorito ainda" : `${items.length} item${items.length !== 1 ? "s" : ""} salvos`}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 72, marginBottom: 20 }}>💔</div>
              <h2 className="font-display" style={{ fontSize: 36, color: "var(--white)", marginBottom: 12 }}>
                LISTA VAZIA
              </h2>
              <p style={{ color: "var(--gray)", marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
                Explore nossa coleção e salve os pares que você mais curtir.
              </p>
              <Link href="/produtos" className="btn-gold"
                style={{ padding: "14px 32px", borderRadius: 6, textDecoration: "none", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ShoppingBag size={16} /> Explorar produtos
              </Link>
            </div>
          ) : (
            <>
              {/* Actions bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                <div className="font-condensed" style={{ fontSize: 12, color: "var(--gray)", letterSpacing: "0.1em" }}>
                  {items.length} produto{items.length !== 1 ? "s" : ""} na lista
                </div>
                <button
                  onClick={() => {
                    items.forEach(p => addItem(p, p.sizes[1] || p.sizes[0]));
                    showToast(`${items.length} itens adicionados ao carrinho!`, "success", "🛒");
                  }}
                  className="btn-gold"
                  style={{ padding: "10px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <ShoppingBag size={15} /> Adicionar tudo ao carrinho
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {items.map(p => {
                  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
                  return (
                    <div key={p.id}
                      style={{ background: "var(--black-2)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: 10, overflow: "hidden", transition: "all 0.3s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.35)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.15)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>

                      <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                        <div style={{ height: 180, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
                          {p.emoji}
                          {p.tag && <span className="tag" style={{ position: "absolute", top: 12, left: 12 }}>{p.tag}</span>}
                          {disc && <span className="font-condensed" style={{ position: "absolute", top: 12, right: 12, background: "#e74c3c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 2 }}>-{disc}%</span>}
                        </div>
                      </Link>

                      <div style={{ padding: "14px 16px 18px" }}>
                        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3 }}>{p.brand}</div>
                        <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
                          <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>{p.name}</div>
                        </Link>

                        <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                          {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i <= Math.round(p.stars) ? "var(--gold)" : "none"} color="var(--gold)" />)}
                          <span style={{ fontSize: 10, color: "var(--gray)", marginLeft: 2 }}>({p.reviews})</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            {p.oldPrice && <div style={{ fontSize: 10, color: "var(--gray)", textDecoration: "line-through", fontFamily: "'Barlow Condensed',sans-serif" }}>R$ {p.oldPrice.toLocaleString("pt-BR")}</div>}
                            <div className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>R$ {p.price.toLocaleString("pt-BR")}</div>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => { toggle(p); showToast("Removido dos favoritos", "info", "💔"); }}
                              style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#e74c3c", transition: "all 0.2s" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(231,76,60,0.2)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(231,76,60,0.1)"; }}>
                              <Trash2 size={14} />
                            </button>
                            <button onClick={() => { addItem(p, p.sizes[1] || p.sizes[0]); showToast(`${p.name} adicionado!`, "success", "👟"); }}
                              className="btn-gold" style={{ padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                              <ShoppingBag size={13} /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 40, textAlign: "center" }}>
                <Link href="/produtos" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--gold)", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Continuar explorando <ArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
