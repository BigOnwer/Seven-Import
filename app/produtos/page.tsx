"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Heart, Star, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products, categories } from "@/lib/data";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cartContext";

function ProdutosContent() {
  const searchParams = useSearchParams();
  const paramCat = searchParams.get("categoria") || "Todos";
  const paramSale = searchParams.get("sale") === "true";

  const [activeCategory, setActiveCategory] = useState(paramCat);
  const [sortBy, setSortBy] = useState("relevancia");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceMax, setPriceMax] = useState(1500);
  const [onlySale, setOnlySale] = useState(paramSale);
  const [liked, setLiked] = useState<number[]>([]);

  useEffect(() => { setActiveCategory(paramCat); }, [paramCat]);
  useEffect(() => { setOnlySale(paramSale); }, [paramSale]);

  let filtered = products
    .filter(p => activeCategory === "Todos" || p.category === activeCategory)
    .filter(p => p.price <= priceMax)
    .filter(p => !onlySale || p.isSale);

  if (sortBy === "menor-preco") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "maior-preco") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "avaliacao") filtered = [...filtered].sort((a, b) => b.stars - a.stars);

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* Page header */}
      <div style={{
        paddingTop: 108, paddingBottom: 40,
        background: "linear-gradient(180deg, var(--black-2) 0%, var(--black) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
            <Link href="/" style={{ color: "var(--gray)", textDecoration: "none" }}>Início</Link>
            {" → "}Produtos{activeCategory !== "Todos" && ` → ${activeCategory}`}
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(40px,6vw,72px)", color: "var(--white)", lineHeight: 0.95, marginBottom: 8 }}>
            {activeCategory === "Todos" ? <>TODA A <span style={{ color: "var(--gold)" }}>COLEÇÃO</span></> : <><span style={{ color: "var(--gold)" }}>{activeCategory}</span></>}
          </h1>
          <div className="font-condensed" style={{ fontSize: 13, color: "var(--gray)" }}>
            {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="font-condensed"
                style={{
                  padding: "7px 14px", borderRadius: 3, cursor: "pointer",
                  border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
                  background: activeCategory === cat ? "var(--gold)" : "transparent",
                  color: activeCategory === cat ? "var(--black)" : "var(--gray)",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "all 0.2s",
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + filter */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {onlySale && (
              <span className="tag" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                onClick={() => setOnlySale(false)}>
                Promoção <X size={10} />
              </span>
            )}
            <div style={{ position: "relative" }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="font-condensed"
                style={{
                  background: "var(--black-2)", color: "var(--white)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4,
                  padding: "8px 32px 8px 12px", fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                  appearance: "none",
                }}>
                <option value="relevancia">Relevância</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
                <option value="avaliacao">Melhor Avaliado</option>
              </select>
              <ChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--gray)", pointerEvents: "none" }} />
            </div>
            <button onClick={() => setFilterOpen(!filterOpen)}
              className="font-condensed"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 4, cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.1)", background: filterOpen ? "var(--gold)" : "transparent",
                color: filterOpen ? "var(--black)" : "var(--white)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}>
              <SlidersHorizontal size={14} /> Filtros
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div style={{
            background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "24px", marginBottom: 28,
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24,
          }}>
            <div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Preço máximo</div>
              <input type="range" min={300} max={1500} step={50} value={priceMax} onChange={e => setPriceMax(+e.target.value)}
                style={{ width: "100%", accentColor: "var(--gold)" }} />
              <div className="font-condensed" style={{ fontSize: 13, color: "var(--white)", marginTop: 6 }}>até R$ {priceMax.toLocaleString("pt-BR")}</div>
            </div>
            <div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Ofertas</div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={onlySale} onChange={e => setOnlySale(e.target.checked)} style={{ accentColor: "var(--gold)", width: 16, height: 16 }} />
                <span className="font-condensed" style={{ fontSize: 13, color: "var(--white)" }}>Apenas promoções</span>
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={() => { setPriceMax(1500); setOnlySale(false); setActiveCategory("Todos"); }} className="btn-outline"
                style={{ padding: "8px 16px", borderRadius: 4, cursor: "pointer", fontSize: 12, background: "transparent" }}>
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div className="font-display" style={{ fontSize: 28, color: "var(--white)", marginBottom: 8 }}>Nenhum produto</div>
            <div style={{ color: "var(--gray)", marginBottom: 24 }}>Tente ajustar os filtros</div>
            <button onClick={() => { setActiveCategory("Todos"); setPriceMax(1500); setOnlySale(false); }} className="btn-gold"
              style={{ padding: "12px 24px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 14 }}>
              Ver todos
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p}
                isLiked={liked.includes(p.id)}
                onLike={() => setLiked(prev => prev.includes(p.id) ? prev.filter(i => i !== p.id) : [...prev, p.id])} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function ProductCard({ product, isLiked, onLike }: { product: Product; isLiked: boolean; onLike: () => void }) {
  const [hov, setHov] = useState(false);
  const [selSize, setSelSize] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const disc = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  return (
    <div className="product-card"
      style={{
        background: hov ? "var(--black-3)" : "var(--black-2)",
        border: hov ? "1px solid rgba(245,197,24,0.35)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, overflow: "hidden",
        transition: "background 0.3s,border 0.3s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>

      <Link href={`/produtos/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 72 }}>
          <span style={{ transition: "transform 0.3s", transform: hov ? "scale(1.1)" : "scale(1)" }}>{product.emoji}</span>
          {product.tag && <span className="tag" style={{ position: "absolute", top: 12, left: 12 }}>{product.tag}</span>}
          {disc && <span className="font-condensed" style={{ position: "absolute", top: 12, right: 12, background: "#e74c3c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 2 }}>-{disc}%</span>}
          <button onClick={e => { e.preventDefault(); onLike(); }}
            style={{
              position: "absolute", bottom: 12, right: 12, width: 32, height: 32, borderRadius: "50%",
              background: "rgba(10,10,10,0.85)", border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              color: isLiked ? "#e74c3c" : "var(--gray)", opacity: hov ? 1 : 0, transition: "opacity 0.2s",
            }}>
            <Heart size={14} fill={isLiked ? "#e74c3c" : "none"} />
          </button>
        </div>
      </Link>

      <div style={{ padding: "14px 16px 18px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3 }}>{product.brand}</div>
        <Link href={`/produtos/${product.slug}`} style={{ textDecoration: "none" }}>
          <div className="font-condensed" style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 2 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--white)")}>
            {product.name}
          </div>
        </Link>

        <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i <= Math.round(product.stars) ? "var(--gold)" : "none"} color="var(--gold)" />)}
          <span style={{ fontSize: 10, color: "var(--gray)", marginLeft: 2 }}>({product.reviews})</span>
        </div>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
          {product.sizes.map(sz => (
            <button key={sz} onClick={() => setSelSize(sz === selSize ? null : sz)} className="font-condensed"
              style={{
                width: 30, height: 26, borderRadius: 3, cursor: "pointer", fontSize: 10, fontWeight: 600,
                border: selSize === sz ? "1.5px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                background: selSize === sz ? "rgba(245,197,24,0.1)" : "transparent",
                color: selSize === sz ? "var(--gold)" : "var(--gray)", transition: "all 0.2s",
              }}>{sz}</button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {product.oldPrice && <div style={{ fontSize: 10, color: "var(--gray)", textDecoration: "line-through", fontFamily: "'Barlow Condensed',sans-serif" }}>R$ {product.oldPrice.toLocaleString("pt-BR")}</div>}
            <div className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>R$ {product.price.toLocaleString("pt-BR")}</div>
          </div>
          <button onClick={() => { addItem(product, selSize || product.sizes[1]); setAdded(true); setTimeout(() => setAdded(false), 1400); }}
            className="btn-gold" style={{
              padding: "9px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 12,
              display: "flex", alignItems: "center", gap: 5,
              background: added ? "#22C55E" : "var(--gold)",
            }}>
            <ShoppingBag size={13} />{added ? "✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense>
      <ProdutosContent />
    </Suspense>
  );
}
