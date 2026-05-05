"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { products, categories } from "@/lib/data";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useToast } from "@/components/ui/Toast";

export default function Products() {
  const [active, setActive] = useState("Todos");
  const filtered = active === "Todos" ? products : products.filter(p => p.category === active);

  return (
    <section id="produtos" style={{ padding: "80px 0", background: "var(--black)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div className="font-condensed" style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>Coleção</div>
            <h2 className="font-display" style={{ fontSize: "clamp(36px,6vw,64px)", lineHeight: 0.95, color: "var(--white)" }}>
              NOSSOS<br /><span style={{ color: "var(--gold)" }}>PRODUTOS</span>
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} className="font-condensed"
                style={{
                  padding: "8px 16px", borderRadius: 3, cursor: "pointer",
                  border: active === cat ? "none" : "1px solid rgba(255,255,255,0.12)",
                  background: active === cat ? "var(--gold)" : "transparent",
                  color: active === cat ? "var(--black)" : "var(--gray)",
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "all 0.2s",
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/produtos" className="btn-outline" style={{
            display: "inline-block", padding: "14px 40px", borderRadius: 4, textDecoration: "none", fontSize: 14, background: "transparent",
          }}>
            Ver todos os produtos →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();
  const { showToast } = useToast();
  const liked = isLiked(p.id);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

  const handleAdd = () => {
    const size = selectedSize || p.sizes[1] || p.sizes[0];
    addItem(p, size);
    setAdded(true);
    showToast(`${p.name} adicionado ao carrinho!`, "success", "👟");
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(p);
    showToast(liked ? "Removido dos favoritos" : "Adicionado aos favoritos!", liked ? "info" : "success", liked ? "💔" : "❤️");
  };

  return (
    <div className="product-card"
      style={{
        background: hovered ? "var(--black-3)" : "var(--black-2)",
        border: hovered ? "1px solid rgba(245,197,24,0.35)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, overflow: "hidden", cursor: "pointer",
        transition: "background 0.3s,border 0.3s",
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 72 }}>
          <span style={{ transition: "transform 0.3s", transform: hovered ? "scale(1.1)" : "scale(1)" }}>{p.emoji}</span>
          {p.tag && <div style={{ position: "absolute", top: 12, left: 12 }}><span className="tag">{p.tag}</span></div>}
          {discount && <div className="font-condensed" style={{ position: "absolute", top: 12, right: 12, background: "#e74c3c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 2 }}>-{discount}%</div>}
          <button onClick={handleToggleLike}
            style={{
              position: "absolute", bottom: 12, right: 12,
              width: 32, height: 32, borderRadius: "50%", background: "rgba(10,10,10,0.85)",
              border: liked ? "1px solid rgba(231,76,60,0.4)" : "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              color: liked ? "#e74c3c" : "var(--gray)",
              opacity: hovered || liked ? 1 : 0, transition: "opacity 0.2s, color 0.2s",
            }}>
            <span style={{ fontSize: 14 }}>{liked ? "❤️" : "🤍"}</span>
          </button>
        </div>
      </Link>

      <div style={{ padding: "16px 16px 20px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3 }}>{p.brand}</div>
        <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
          <div className="font-condensed" style={{ fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 2 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--white)")}>
            {p.name}
          </div>
        </Link>
        <div style={{ fontSize: 11, color: "var(--gray)", marginBottom: 8 }}>{p.desc}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
          {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i <= Math.round(p.stars) ? "var(--gold)" : "none"} color="var(--gold)" />)}
          <span style={{ fontSize: 10, color: "var(--gray)", marginLeft: 2 }}>({p.reviews})</span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Tamanho</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {p.sizes.map(size => (
              <button key={size} onClick={() => setSelectedSize(size === selectedSize ? null : size)} className="font-condensed"
                style={{
                  width: 32, height: 28, borderRadius: 3, cursor: "pointer", fontSize: 11, fontWeight: 600,
                  border: selectedSize === size ? "1.5px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                  background: selectedSize === size ? "rgba(245,197,24,0.1)" : "transparent",
                  color: selectedSize === size ? "var(--gold)" : "var(--gray)", transition: "all 0.2s",
                }}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {p.oldPrice && <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", textDecoration: "line-through" }}>R$ {p.oldPrice.toLocaleString("pt-BR")}</div>}
            <div className="font-display" style={{ fontSize: 24, color: "var(--gold)" }}>R$ {p.price.toLocaleString("pt-BR")}</div>
            <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)" }}>ou 12x de R$ {Math.round(p.price / 12)}</div>
          </div>
          <button onClick={handleAdd} className="btn-gold"
            style={{
              padding: "10px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 13,
              display: "flex", alignItems: "center", gap: 6,
              background: added ? "#22C55E" : "var(--gold)",
            }}>
            <ShoppingBag size={14} />{added ? "✓" : "Comprar"}
          </button>
        </div>
      </div>
    </div>
  );
}
