"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag, Star, SlidersHorizontal, X,
  ChevronDown, Heart, ImageOff,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/lib/data";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useToast } from "@/components/ui/Toast";
import { useProducts, type ApiProduct, type ProductFilters } from "@/lib/useProducts";

// ─── Opções de ordenação (espelha a API) ──────────────────────────────────────
const SORT_OPTIONS = [
  { value: "newest",     label: "Mais recentes"    },
  { value: "price_asc",  label: "Menor preço"      },
  { value: "price_desc", label: "Maior preço"      },
  { value: "stars",      label: "Melhor avaliação" },
] as const;

// ─── Faixas de preço ──────────────────────────────────────────────────────────
const PRICE_RANGES = [
  { label: "Todos",       min: undefined, max: undefined },
  { label: "Até R$500",   min: 0,         max: 500       },
  { label: "R$500–800",   min: 500,       max: 800       },
  { label: "Acima R$800", min: 800,       max: undefined },
] as const;

// ─── Conteúdo principal ───────────────────────────────────────────────────────
function ProdutosContent() {
  const searchParams  = useSearchParams();
  const paramCat      = searchParams.get("category") ?? undefined;
  const paramSale     = searchParams.get("sale") === "true";

  const [filterOpen, setFilterOpen] = useState(false);

  const {
    products, meta, loading, error,
    filters, updateFilters, setPage,
  } = useProducts({
    limit:    12,
    sort:     "newest",
    category: paramCat,
    inStock:  paramSale ? true : undefined,
  });

  // Sincroniza query params na primeira montagem
  useEffect(() => {
    if (paramCat)  updateFilters({ category: paramCat });
    if (paramSale) updateFilters({ inStock: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCategory = filters.category ?? "Todos";

  const handleCategory = (cat: string) =>
    updateFilters({ category: cat === "Todos" ? undefined : cat });

  const activePriceRange = PRICE_RANGES.find(
    r => r.min === filters.minPrice && r.max === filters.maxPrice,
  ) ?? PRICE_RANGES[0];

  const hasActiveFilters =
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock  !== undefined ||
    (filters.sort && filters.sort !== "newest");

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* ── Page header ── */}
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
            {activeCategory === "Todos"
              ? <>TODA A <span style={{ color: "var(--gold)" }}>COLEÇÃO</span></>
              : <span style={{ color: "var(--gold)" }}>{activeCategory}</span>
            }
          </h1>
          <div className="font-condensed" style={{ fontSize: 13, color: "var(--gray)" }}>
            {loading
              ? "Carregando..."
              : meta
                ? `${meta.total} produto${meta.total !== 1 ? "s" : ""} encontrado${meta.total !== 1 ? "s" : ""}`
                : ""
            }
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── Toolbar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          {/* Categorias */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => handleCategory(cat)} className="font-condensed"
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

          {/* Sort + toggle filtros */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Tag promoção ativa */}
            {filters.inStock === true && (
              <span className="tag" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                onClick={() => updateFilters({ inStock: undefined })}>
                Em estoque <X size={10} />
              </span>
            )}

            {/* Select de ordenação */}
            <div style={{ position: "relative" }}>
              <select
                value={filters.sort ?? "newest"}
                onChange={e => updateFilters({ sort: e.target.value as ProductFilters["sort"] })}
                className="font-condensed"
                style={{
                  background: "var(--black-2)", color: "var(--white)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4,
                  padding: "8px 32px 8px 12px", fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                  appearance: "none",
                }}>
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--gray)", pointerEvents: "none" }} />
            </div>

            <button onClick={() => setFilterOpen(v => !v)} className="font-condensed"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 4, cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.1)",
                background: filterOpen ? "var(--gold)" : "transparent",
                color: filterOpen ? "var(--black)" : "var(--white)",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}>
              <SlidersHorizontal size={14} /> Filtros
            </button>
          </div>
        </div>

        {/* ── Painel de filtros ── */}
        {filterOpen && (
          <div style={{
            background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "24px", marginBottom: 28,
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24,
          }}>
            {/* Faixa de preço */}
            <div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                Faixa de preço
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PRICE_RANGES.map(range => {
                  const active = activePriceRange.label === range.label;
                  return (
                    <button key={range.label} onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                      className="font-condensed"
                      style={{
                        textAlign: "left", padding: "6px 10px", borderRadius: 4, cursor: "pointer",
                        fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                        border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                        background: active ? "rgba(201,168,76,0.15)" : "transparent",
                        color: active ? "var(--gold)" : "var(--gray)",
                        transition: "all 0.2s",
                      }}>
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disponibilidade */}
            <div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                Disponibilidade
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Todos",      value: undefined },
                  { label: "Em estoque", value: true      },
                  { label: "Esgotados",  value: false     },
                ].map(opt => {
                  const active = filters.inStock === opt.value;
                  return (
                    <button key={String(opt.value)} onClick={() => updateFilters({ inStock: opt.value })}
                      className="font-condensed"
                      style={{
                        textAlign: "left", padding: "6px 10px", borderRadius: 4, cursor: "pointer",
                        fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                        border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                        background: active ? "rgba(201,168,76,0.15)" : "transparent",
                        color: active ? "var(--gold)" : "var(--gray)",
                        transition: "all 0.2s",
                      }}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Limpar */}
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              {hasActiveFilters && (
                <button
                  onClick={() => updateFilters({
                    category: undefined, minPrice: undefined, maxPrice: undefined,
                    inStock: undefined, sort: "newest",
                  })}
                  className="btn-outline"
                  style={{ padding: "8px 16px", borderRadius: 4, cursor: "pointer", fontSize: 12, background: "transparent", display: "flex", alignItems: "center", gap: 6 }}>
                  <X size={12} /> Limpar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Erro ── */}
        {error && (
          <div style={{ padding: "16px 20px", background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, color: "#e74c3c", marginBottom: 24, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <ProductSkeleton />
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div className="font-display" style={{ fontSize: 28, color: "var(--white)", marginBottom: 8 }}>Nenhum produto</div>
            <div style={{ color: "var(--gray)", marginBottom: 24 }}>Tente ajustar os filtros</div>
            <button
              onClick={() => updateFilters({ category: undefined, minPrice: undefined, maxPrice: undefined, inStock: undefined, sort: "newest" })}
              className="btn-gold"
              style={{ padding: "12px 24px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 14 }}>
              Ver todos
            </button>
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
      </div>

      <Footer />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite",
        }}>
          <div style={{ height: 200, background: "rgba(255,255,255,0.04)" }} />
          <div style={{ padding: "14px 16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ height: 10, width: "40%", background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
            <div style={{ height: 16, width: "70%", background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
            <div style={{ height: 10, width: "50%", background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
            <div style={{ height: 28, width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Card de produto ──────────────────────────────────────────────────────────
function ProductCard({ product: p }: { product: ApiProduct }) {
  const [hov,         setHov]         = useState(false);
  const [selSize,     setSelSize]     = useState<number | null>(null);
  const [added,       setAdded]       = useState(false);
  const [imgError,    setImgError]    = useState(false);

  const { addItem }          = useCart();
  const { toggle, isLiked }  = useWishlist();
  const { showToast }        = useToast();

  const liked    = isLiked(p.id);
  const disc     = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

  // Primeira imagem disponível: midiaUrl → images[0] → emoji
  const thumbUrl = (p.midiaUrl && p.midiaType === "image")
    ? p.midiaUrl
    : (Array.isArray(p.images) && p.images[0]) || null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const size = selSize ?? p.sizes[1] ?? p.sizes[0];
    addItem(p as any, size);
    setAdded(true);
    showToast(`${p.name} adicionado ao carrinho!`, "success", "👟");
    setTimeout(() => setAdded(false), 1400);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(p as any);
    showToast(
      liked ? "Removido dos favoritos" : "Adicionado aos favoritos!",
      liked ? "info" : "success",
      liked ? "💔" : "❤️",
    );
  };

  return (
    <div
      className="product-card"
      style={{
        background:   hov ? "var(--black-3)" : "var(--black-2)",
        border:       hov ? "1px solid rgba(245,197,24,0.35)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, overflow: "hidden",
        transition:   "background 0.3s, border 0.3s",
        opacity:      p.inStock ? 1 : 0.65,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* ── Imagem ── */}
      <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          background: "rgba(255,255,255,0.02)", height: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", fontSize: 72, overflow: "hidden",
        }}>
          {thumbUrl && !imgError ? (
            <img
              src={thumbUrl}
              alt={p.name}
              onError={() => setImgError(true)}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.3s",
                transform: hov ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : imgError ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "var(--gray)" }}>
              <ImageOff size={28} />
              <span className="font-condensed" style={{ fontSize: 10, letterSpacing: "0.1em" }}>Sem imagem</span>
            </div>
          ) : (
            <span style={{ transition: "transform 0.3s", transform: hov ? "scale(1.1)" : "scale(1)" }}>
              {p.emoji}
            </span>
          )}

          {/* Badges */}
          {p.tag && (
            <span className="tag" style={{ position: "absolute", top: 12, left: 12 }}>{p.tag}</span>
          )}
          {disc && (
            <span className="font-condensed" style={{
              position: "absolute", top: 12, right: 12,
              background: "#e74c3c", color: "#fff",
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 2,
            }}>
              -{disc}%
            </span>
          )}

          {/* Esgotado */}
          {!p.inStock && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span className="font-condensed" style={{ color: "var(--gray)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Esgotado
              </span>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleLike}
            style={{
              position: "absolute", bottom: 12, right: 12,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(10,10,10,0.85)",
              border: liked ? "1px solid rgba(231,76,60,0.4)" : "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              color: liked ? "#e74c3c" : "var(--gray)",
              opacity: hov || liked ? 1 : 0, transition: "opacity 0.2s, color 0.2s",
            }}>
            <Heart size={14} fill={liked ? "#e74c3c" : "none"} />
          </button>
        </div>
      </Link>

      {/* ── Info ── */}
      <div style={{ padding: "14px 16px 18px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3 }}>
          {p.brand}
        </div>

        <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
          <div className="font-condensed"
            style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 2, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--white)")}>
            {p.name}
          </div>
        </Link>

        {/* Stars */}
        <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={10} fill={i <= Math.round(p.stars) ? "var(--gold)" : "none"} color="var(--gold)" />
          ))}
          <span style={{ fontSize: 10, color: "var(--gray)", marginLeft: 2 }}>({p.reviews})</span>
        </div>

        {/* Tamanhos */}
        {p.sizes.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
            {p.sizes.map(sz => (
              <button key={sz} onClick={() => setSelSize(sz === selSize ? null : sz)} className="font-condensed"
                style={{
                  width: 30, height: 26, borderRadius: 3, cursor: "pointer", fontSize: 10, fontWeight: 600,
                  border: selSize === sz ? "1.5px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                  background: selSize === sz ? "rgba(245,197,24,0.1)" : "transparent",
                  color: selSize === sz ? "var(--gold)" : "var(--gray)", transition: "all 0.2s",
                }}>
                {sz}
              </button>
            ))}
          </div>
        )}

        {/* Preço + botão */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {p.oldPrice && (
              <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", textDecoration: "line-through" }}>
                R$ {p.oldPrice.toLocaleString("pt-BR")}
              </div>
            )}
            <div className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>
              R$ {p.price.toLocaleString("pt-BR")}
            </div>
            <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)" }}>
              12x R$ {Math.round(p.price / 12)}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!p.inStock}
            className="btn-gold"
            style={{
              padding: "9px 12px", borderRadius: 4, border: "none",
              cursor: p.inStock ? "pointer" : "not-allowed",
              fontSize: 12, display: "flex", alignItems: "center", gap: 5,
              background: !p.inStock ? "var(--gray)" : added ? "#22C55E" : "var(--gold)",
              opacity: p.inStock ? 1 : 0.6,
              transition: "background 0.2s",
            }}>
            <ShoppingBag size={13} />
            {!p.inStock ? "Esgotado" : added ? "✓" : "Add"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ProdutosPage() {
  return (
    <Suspense>
      <ProdutosContent />
    </Suspense>
  );
}