// components/Products.tsx  — integrado com API
'use client';
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Star, Search, SlidersHorizontal, X } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useToast } from "@/components/ui/Toast";
import { useProducts, type ApiProduct, type ProductFilters } from "@/lib/useProducts";
import { categories } from "@/lib/data"; // mantém as categorias estáticas para os filtros
import ProductCardImage from "./ProductcardImage";
import { useBuyNow } from "@/lib/useBuyNow";

// ─── Constantes ───────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "newest",     label: "Mais recentes" },
  { value: "price_asc",  label: "Menor preço"   },
  { value: "price_desc", label: "Maior preço"   },
  { value: "stars",      label: "Melhor avaliação" },
] as const;

// ─── Seção principal ──────────────────────────────────────────────────────────
export default function Products() {
  const [showFilters, setShowFilters] = useState(false);

  const { products, meta, loading, error, filters, updateFilters, setPage } = useProducts({
    limit: 8,
    sort: "newest",
  });

  const activeCategory = filters.category ?? "Todos";

  const handleCategory = (cat: string) => {
    updateFilters({ category: cat === "Todos" ? undefined : cat });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value || undefined }, true /* debounce */);
  };

  return (
    <section id="produtos" style={{ padding: "80px 0", background: "var(--black)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div className="font-condensed" style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>Coleção</div>
            <h2 className="font-display" style={{ fontSize: "clamp(36px,6vw,64px)", lineHeight: 0.95, color: "var(--white)" }}>
              NOSSOS<br /><span style={{ color: "var(--gold)" }}>PRODUTOS</span>
            </h2>
          </div>

          {/* Search + filtros toggle */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }} />
              <input
                type="text"
                placeholder="Buscar produto..."
                defaultValue={filters.search ?? ""}
                onChange={handleSearch}
                className="font-condensed"
                style={{
                  background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
                  padding: "10px 16px 10px 36px", color: "var(--white)", fontSize: 13, outline: "none",
                  width: 220, transition: "border 0.2s",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
                background: showFilters ? "rgba(245,197,24,0.15)" : "var(--black-2)",
                border: showFilters ? "1px solid rgba(245,197,24,0.5)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, cursor: "pointer", color: showFilters ? "var(--gold)" : "var(--gray)", fontSize: 13,
                transition: "all 0.2s",
              }}>
              <SlidersHorizontal size={14} />
              <span className="font-condensed" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>Filtros</span>
            </button>
          </div>
        </div>

        {/* ── Filtros expandidos ── */}
        {showFilters && (
          <div style={{
            background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10, padding: "20px 24px", marginBottom: 28,
            display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-end",
          }}>
            {/* Ordenação */}
            <div>
              <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Ordenar por</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => updateFilters({ sort: opt.value as ProductFilters["sort"] })}
                    className="font-condensed"
                    style={{
                      padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                      border: filters.sort === opt.value ? "none" : "1px solid rgba(255,255,255,0.1)",
                      background: filters.sort === opt.value ? "var(--gold)" : "transparent",
                      color: filters.sort === opt.value ? "var(--black)" : "var(--gray)",
                      transition: "all 0.2s",
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Faixa de preço */}
            <div>
              <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Faixa de preço</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {[
                  { label: "Todos", min: undefined, max: undefined },
                  { label: "Até R$500",    min: 0,   max: 500  },
                  { label: "R$500–800",    min: 500, max: 800  },
                  { label: "Acima R$800",  min: 800, max: undefined },
                ].map(range => {
                  const active = filters.minPrice === range.min && filters.maxPrice === range.max;
                  return (
                    <button key={range.label} onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                      className="font-condensed"
                      style={{
                        padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                        border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                        background: active ? "var(--gold)" : "transparent",
                        color: active ? "var(--black)" : "var(--gray)",
                        transition: "all 0.2s",
                      }}>
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estoque */}
            <div>
              <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Disponibilidade</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { label: "Todos",       value: undefined },
                  { label: "Em estoque",  value: true  },
                  { label: "Esgotados",   value: false },
                ].map(opt => {
                  const active = filters.inStock === opt.value;
                  return (
                    <button key={String(opt.value)} onClick={() => updateFilters({ inStock: opt.value })}
                      className="font-condensed"
                      style={{
                        padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                        border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                        background: active ? "var(--gold)" : "transparent",
                        color: active ? "var(--black)" : "var(--gray)",
                        transition: "all 0.2s",
                      }}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Limpar filtros */}
            {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.inStock !== undefined || (filters.sort && filters.sort !== "newest")) && (
              <button
                onClick={() => updateFilters({ search: undefined, category: undefined, minPrice: undefined, maxPrice: undefined, inStock: undefined, sort: "newest" })}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                  background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)",
                  borderRadius: 4, cursor: "pointer", color: "#e74c3c", fontSize: 12,
                }}>
                <X size={12} />
                <span className="font-condensed" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>Limpar</span>
              </button>
            )}
          </div>
        )}

        {/* ── Categorias ── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)} className="font-condensed"
              style={{
                padding: "8px 16px", borderRadius: 3, cursor: "pointer",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.12)",
                background: activeCategory === cat ? "var(--gold)" : "transparent",
                color: activeCategory === cat ? "var(--black)" : "var(--gray)",
                fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* ── Resultados e estado ── */}
        {error && (
          <div style={{ padding: "16px 20px", background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, color: "#e74c3c", marginBottom: 24, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {meta && !loading && (
          <div className="font-condensed" style={{ fontSize: 12, color: "var(--gray)", letterSpacing: "0.1em", marginBottom: 16 }}>
            {meta.total} produto{meta.total !== 1 ? "s" : ""} encontrado{meta.total !== 1 ? "s" : ""}
            {filters.search && <span> para "<span style={{ color: "var(--gold)" }}>{filters.search}</span>"</span>}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <ProductSkeleton />
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div className="font-condensed" style={{ fontSize: 16, letterSpacing: "0.1em" }}>Nenhum produto encontrado.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* ── Paginação ── */}
        {meta && meta.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} className="font-condensed"
                style={{
                  width: 36, height: 36, borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700,
                  border: meta.page === n ? "none" : "1px solid rgba(255,255,255,0.12)",
                  background: meta.page === n ? "var(--gold)" : "transparent",
                  color: meta.page === n ? "var(--black)" : "var(--gray)",
                  transition: "all 0.2s",
                }}>
                {n}
              </button>
            ))}
          </div>
        )}

        {/* ── Ver todos ── */}
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

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite",
        }}>
          <div style={{ height: 200, background: "rgba(255,255,255,0.04)" }} />
          <div style={{ padding: "16px 16px 20px" }}>
            <div style={{ height: 10, width: "40%", background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 16, width: "75%", background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 10, width: "60%", background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 16 }} />
            <div style={{ height: 28, width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Card de produto (agora usa ApiProduct) ───────────────────────────────────
function ProductCard({ product: p }: { product: ApiProduct }) {
  const { buyNow, loadingId } = useBuyNow();         // ← novo
  const isBuying = loadingId === p.id;
  const [hovered,      setHovered]      = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [added,        setAdded]        = useState(false);
  const { addItem }    = useCart();
  const { toggle, isLiked } = useWishlist();
  const { showToast }  = useToast();
  const liked    = isLiked(p.id);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

  const handleAdd = () => {
    const size = selectedSize || p.sizes[1] || p.sizes[0];
    addItem(p as any, size);
    setAdded(true);
    showToast(`${p.name} adicionado ao carrinho!`, "success", "👟");
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    buyNow({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.images?.[0],   // ajuste para o campo de imagem do seu ApiProduct
    });
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(p as any);
    showToast(
      liked ? "Removido dos favoritos" : "Adicionado aos favoritos!",
      liked ? "info" : "success",
      liked ? "💔" : "❤️",
    );
  };

  return (
    <div className="product-card"
      style={{
        background:  hovered ? "var(--black-3)" : "var(--black-2)",
        border:      hovered ? "1px solid rgba(245,197,24,0.35)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, overflow: "hidden", cursor: "pointer",
        transition: "background 0.3s, border 0.3s",
        opacity: p.inStock ? 1 : 0.6,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      <ProductCardImage product={p} hovered={hovered}>
        {/* botão de wishlist permanece igual, só muda onde fica */}
        <button
          onClick={handleToggleLike}
          style={{
            position: "absolute", bottom: 12, right: 12, zIndex: 5,
            width: 32, height: 32, borderRadius: "50%", background: "rgba(10,10,10,0.85)",
            border: liked ? "1px solid rgba(231,76,60,0.4)" : "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            color: liked ? "#e74c3c" : "var(--gray)",
            opacity: hovered || liked ? 1 : 0, transition: "opacity 0.2s, color 0.2s",
          }}>
          <span style={{ fontSize: 14 }}>{liked ? "❤️" : "🤍"}</span>
        </button>
      </ProductCardImage>

      <div style={{ padding: "16px 16px 20px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3 }}>{p.brand}</div>
        <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
          <div className="font-condensed" style={{ fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 2, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--white)")}>
            {p.name}
          </div>
        </Link>
        <div style={{ fontSize: 11, color: "var(--gray)", marginBottom: 8 }}>{p.description}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={10} fill={i <= Math.round(p.stars) ? "var(--gold)" : "none"} color="var(--gold)" />
          ))}
          <span style={{ fontSize: 10, color: "var(--gray)", marginLeft: 2 }}>({p.reviews})</span>
        </div>

        {p.sizes.length > 0 && (
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
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {p.oldPrice && (
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", textDecoration: "line-through" }}>
                R$ {p.oldPrice.toLocaleString("pt-BR")}
              </div>
            )}
            <div className="font-display" style={{ fontSize: 24, color: "var(--gold)" }}>
              R$ {p.price.toLocaleString("pt-BR")}
            </div>
            <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)" }}>
              ou 12x de R$ {Math.round(p.price / 12)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {/* Adicionar ao carrinho — comportamento original */}
            <button
              onClick={handleAdd}
              disabled={!p.inStock}
              className="btn-gold"
              style={{
                padding: "10px 12px", borderRadius: 4, border: "none",
                cursor: p.inStock ? "pointer" : "not-allowed", fontSize: 13,
                display: "flex", alignItems: "center", gap: 6,
                background: !p.inStock ? "var(--gray)" : added ? "#22C55E" : "var(--gold)",
                opacity: p.inStock ? 1 : 0.6,
              }}>
              <ShoppingBag size={14} />
              {!p.inStock ? "Esgotado" : added ? "✓" : ""}
            </button>

            {/* Comprar agora → Mercado Pago */}
            <button
              onClick={handleBuyNow}
              disabled={!p.inStock || isBuying}
              className="font-condensed"
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 4,
                cursor: p.inStock && !isBuying ? "pointer" : "not-allowed",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                border: "1px solid var(--gold)",
                color: isBuying ? "var(--gray)" : "var(--gold)",   // azul do MP
                transition: "all 0.2s",
              }}>
              {isBuying ? "Aguarde..." : "Comprar agora"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}