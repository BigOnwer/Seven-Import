"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Star, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useToast } from "@/components/ui/Toast";
import { useProducts, type ApiProduct, type ProductFilters } from "@/lib/useProducts";
import ProductCardImage from "@/components/ProductcardImage";

// ─── countdown ────────────────────────────────────────────────────────────────
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

// ─── sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "newest",     label: "Mais recentes" },
  { value: "price_asc",  label: "Menor preço"   },
  { value: "price_desc", label: "Maior preço"   },
  { value: "stars",      label: "Melhor avaliação" },
] as const;

const PRICE_RANGES = [
  { label: "Todos",        min: undefined, max: undefined  },
  { label: "Até R$500",    min: 0,         max: 500        },
  { label: "R$500–800",    min: 500,       max: 800        },
  { label: "Acima R$800",  min: 800,       max: undefined  },
];

// ─── painel de filtros reutilizável ───────────────────────────────────────────
interface FilterPanelProps {
  filters: ProductFilters;
  updateFilters: (f: Partial<ProductFilters>, debounce?: boolean) => void;
  accentColor?: string;
}

function FilterPanel({ filters, updateFilters, accentColor = "var(--gold)" }: FilterPanelProps) {
  const hasActive =
    filters.search || filters.minPrice !== undefined ||
    filters.maxPrice !== undefined || filters.inStock !== undefined ||
    (filters.sort && filters.sort !== "newest");

  return (
    <div style={{
      background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10, padding: "20px 24px", marginBottom: 24,
      display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-end",
    }}>

      {/* ordenação */}
      <div>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Ordenar por</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SORT_OPTIONS.map(opt => {
            const active = filters.sort === opt.value;
            return (
              <button key={opt.value} onClick={() => updateFilters({ sort: opt.value as ProductFilters["sort"] })}
                className="font-condensed"
                style={{
                  padding: "6px 12px", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? accentColor : "transparent",
                  color: active ? "var(--black)" : "var(--gray)",
                  transition: "all 0.2s",
                }}>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* faixa de preço */}
      <div>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Faixa de preço</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PRICE_RANGES.map(range => {
            const active = filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <button key={range.label} onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                className="font-condensed"
                style={{
                  padding: "6px 12px", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? accentColor : "transparent",
                  color: active ? "var(--black)" : "var(--gray)",
                  transition: "all 0.2s",
                }}>
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* disponibilidade */}
      <div>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Disponibilidade</div>
        <div style={{ display: "flex", gap: 6 }}>
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
                  padding: "6px 12px", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? accentColor : "transparent",
                  color: active ? "var(--black)" : "var(--gray)",
                  transition: "all 0.2s",
                }}>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* limpar */}
      {hasActive && (
        <button
          onClick={() => updateFilters({ search: undefined, minPrice: undefined, maxPrice: undefined, inStock: undefined, sort: "newest" })}
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
  );
}

// ─── skeleton ─────────────────────────────────────────────────────────────────
function ProductSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${cols <= 4 ? 260 : 220}px, 1fr))`, gap: 16 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} style={{
          background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite",
        }}>
          <div style={{ height: 180, background: "rgba(255,255,255,0.04)" }} />
          <div style={{ padding: "14px 16px 18px" }}>
            <div style={{ height: 10, width: "40%", background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 14, width: "70%", background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 12 }} />
            <div style={{ height: 28, background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── card novo (novidades) ────────────────────────────────────────────────────
function NewProductCard({ product: p }: { product: ApiProduct }) {
  const [hovered, setHovered] = useState(false);
  const [added,   setAdded]   = useState(false);
  const { addItem }           = useCart();
  const { toggle, isLiked }   = useWishlist();
  const { showToast }         = useToast();
  const liked    = isLiked(p.id);

  const handleAdd = () => {
    addItem(p as any, p.sizes[1] ?? p.sizes[0]);
    setAdded(true);
    showToast(`${p.name} adicionado ao carrinho!`, "success", "👟");
    setTimeout(() => setAdded(false), 1500);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(p as any);
    showToast(liked ? "Removido dos favoritos" : "Adicionado aos favoritos!", liked ? "info" : "success", liked ? "💔" : "❤️");
  };

  return (
    <div
      style={{
        background: hovered ? "var(--black-3)" : "var(--black-2)",
        border: hovered ? "1px solid rgba(245,197,24,0.35)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, overflow: "hidden",
        transition: "background 0.3s, border 0.3s",
        opacity: p.inStock ? 1 : 0.6,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ProductCardImage product={p} hovered={hovered}>
        <button onClick={handleLike} style={{
          position: "absolute", bottom: 12, right: 12, zIndex: 5,
          width: 32, height: 32, borderRadius: "50%", background: "rgba(10,10,10,0.85)",
          border: liked ? "1px solid rgba(231,76,60,0.4)" : "1px solid rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          color: liked ? "#e74c3c" : "var(--gray)",
          opacity: hovered || liked ? 1 : 0, transition: "opacity 0.2s",
        }}>
          <span style={{ fontSize: 14 }}>{liked ? "❤️" : "🤍"}</span>
        </button>
      </ProductCardImage>

      <div style={{ padding: "14px 16px 18px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 3 }}>{p.brand}</div>
        <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
          <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 4,  transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--white)")}>
            {p.name}
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={10} fill={i <= Math.round(p.stars) ? "var(--gold)" : "none"} color="var(--gold)" />
          ))}
          <span style={{ fontSize: 10, color: "var(--gray)", marginLeft: 2 }}>({p.reviews})</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {p.oldPrice && (
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", textDecoration: "line-through" }}>
                R$ {p.oldPrice.toLocaleString("pt-BR")}
              </div>
            )}
            <div className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>
              R$ {p.price.toLocaleString("pt-BR")}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleAdd}
              disabled={!p.inStock}
              className="btn-gold"
              style={{
                padding: "8px 14px", borderRadius: 6, border: "none",
                cursor: p.inStock ? "pointer" : "not-allowed", fontSize: 12,
                display: "flex", alignItems: "center", gap: 5,
                background: !p.inStock ? "var(--gray)" : added ? "#22C55E" : "var(--gold)",
              }}>
              <ShoppingBag size={13} />
              {!p.inStock ? "Esgotado" : added ? "✓" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── card oferta ──────────────────────────────────────────────────────────────
function SaleProductCard({ product: p }: { product: ApiProduct }) {
  const [hovered, setHovered] = useState(false);
  const router   = useRouter();
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/produtos/${p.slug}`)}
      onKeyDown={e => e.key === "Enter" && router.push(`/produtos/${p.slug}`)}
      style={{
        background: hovered ? "var(--black-3)" : "var(--black-2)",
        border: hovered ? "1px solid rgba(231,76,60,0.35)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, overflow: "hidden", cursor: "pointer",
        transition: "background 0.3s, border 0.3s, transform 0.3s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ProductCardImage product={p} hovered={hovered}>
        {discount > 0 && (
          <span className="font-condensed" style={{
            position: "absolute", top: 10, right: 10, zIndex: 5,
            background: "#e74c3c", color: "#fff",
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 2,
          }}>
            -{discount}%
          </span>
        )}
      </ProductCardImage>

      <div style={{ padding: "12px 14px 16px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 2 }}>{p.brand}</div>
        <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>{p.name}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          {p.oldPrice && (
            <span style={{ fontSize: 11, color: "var(--gray)", textDecoration: "line-through", fontFamily: "'Barlow Condensed',sans-serif" }}>
              R$ {p.oldPrice.toLocaleString("pt-BR")}
            </span>
          )}
          <span className="font-display" style={{ fontSize: 20, color: "#e74c3c" }}>
            R$ {p.price.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── resultado count ──────────────────────────────────────────────────────────
function ResultCount({ meta, search, color = "var(--gold)" }: { meta: any; search?: string; color?: string }) {
  if (!meta) return null;
  return (
    <div className="font-condensed" style={{ fontSize: 12, color: "var(--gray)", letterSpacing: "0.1em", marginBottom: 16 }}>
      {meta.total} produto{meta.total !== 1 ? "s" : ""} encontrado{meta.total !== 1 ? "s" : ""}
      {search && <span> para "<span style={{ color }}>{search}</span>"</span>}
    </div>
  );
}

// ─── paginação ────────────────────────────────────────────────────────────────
function Pagination({ meta, setPage, accentColor = "var(--gold)" }: { meta: any; setPage: (n: number) => void; accentColor?: string }) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
      {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(n => (
        <button key={n} onClick={() => setPage(n)} className="font-condensed"
          style={{
            width: 36, height: 36, borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700,
            border: meta.page === n ? "none" : "1px solid rgba(255,255,255,0.12)",
            background: meta.page === n ? accentColor : "transparent",
            color: meta.page === n ? "var(--black)" : "var(--gray)",
            transition: "all 0.2s",
          }}>
          {n}
        </button>
      ))}
    </div>
  );
}

// ─── página principal ─────────────────────────────────────────────────────────
export default function LancamentosPage() {
  const [showNewFilters,  setShowNewFilters]  = useState(false);
  const [showSaleFilters, setShowSaleFilters] = useState(false);

  // hook separado para cada seção
  const newHook = useProducts({ isNew: true,  limit: 8,  sort: "newest" });
  const saleHook = useProducts({ isSale: true, limit: 8,  sort: "newest" });

  const nextDrop = useMemo(() => new Date(Date.now() + 3 * 86400000 + 7 * 3600000), []);
  const countdown = useCountdown(nextDrop);

  // barra de busca com estado local (repassa via updateFilters com debounce)
  const [newSearch,  setNewSearch]  = useState("");
  const [saleSearch, setSaleSearch] = useState("");

  const handleNewSearch  = (v: string) => { setNewSearch(v);  newHook.updateFilters({ search: v || undefined }, true); };
  const handleSaleSearch = (v: string) => { setSaleSearch(v); saleHook.updateFilters({ search: v || undefined }, true); };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* ── Hero ── */}
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
          <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
            Fique por dentro dos próximos drops e não perca nenhum lançamento exclusivo.
          </p>

          {/* countdown */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[
              { label: "Dias",     val: countdown.d },
              { label: "Horas",    val: countdown.h },
              { label: "Minutos",  val: countdown.m },
              { label: "Segundos", val: countdown.s },
            ].map(({ label, val }) => (
              <div key={label} style={{
                background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.15)",
                borderRadius: 8, padding: "10px 16px", minWidth: 58, textAlign: "center",
              }}>
                <div className="font-display" style={{ fontSize: 28, color: "var(--gold)", lineHeight: 1 }}>
                  {String(val).padStart(2, "0")}
                </div>
                <div className="font-condensed" style={{ fontSize: 9, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ════════════════════════════════════════════════════════════════
            SEÇÃO 1 — RECÉM CHEGADOS
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 80 }}>

          {/* header da seção */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>Chegaram agora</div>
              <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)", lineHeight: 0.95 }}>
                RECÉM <span style={{ color: "var(--gold)" }}>CHEGADOS</span>
              </h2>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {/* busca */}
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }} />
                <input
                  type="text" placeholder="Buscar..." value={newSearch}
                  onChange={e => handleNewSearch(e.target.value)}
                  className="font-condensed"
                  style={{
                    background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6, padding: "9px 14px 9px 32px",
                    color: "var(--white)", fontSize: 13, outline: "none", width: 180,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
                  onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              {/* toggle filtros */}
              <button onClick={() => setShowNewFilters(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
                  background: showNewFilters ? "rgba(245,197,24,0.15)" : "var(--black-2)",
                  border: showNewFilters ? "1px solid rgba(245,197,24,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6, cursor: "pointer",
                  color: showNewFilters ? "var(--gold)" : "var(--gray)", fontSize: 13,
                  transition: "all 0.2s",
                }}>
                <SlidersHorizontal size={13} />
                <span className="font-condensed" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>Filtros</span>
              </button>
              <Link href="/produtos" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gold)", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {showNewFilters && (
            <FilterPanel filters={newHook.filters} updateFilters={newHook.updateFilters} accentColor="var(--gold)" />
          )}

          <ResultCount meta={newHook.meta} search={newHook.filters.search} color="var(--gold)" />

          {newHook.error && (
            <div style={{ padding: "14px 18px", background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, color: "#e74c3c", marginBottom: 20, fontSize: 13 }}>
              ⚠️ {newHook.error}
            </div>
          )}

          {newHook.loading ? (
            <ProductSkeleton cols={4} />
          ) : newHook.products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div className="font-condensed" style={{ fontSize: 14, letterSpacing: "0.1em" }}>Nenhum lançamento encontrado.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {newHook.products.map(p => <NewProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Pagination meta={newHook.meta} setPage={newHook.setPage} accentColor="var(--gold)" />
        </div>

        {/* divisor */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 80 }} />

        {/* ════════════════════════════════════════════════════════════════
            SEÇÃO 2 — MELHORES OFERTAS
        ════════════════════════════════════════════════════════════════ */}
        <div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="font-condensed" style={{ fontSize: 11, color: "#e74c3c", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>🔥 Outlet</div>
              <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)", lineHeight: 0.95 }}>
                MELHORES <span style={{ color: "#e74c3c" }}>OFERTAS</span>
              </h2>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {/* busca */}
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }} />
                <input
                  type="text" placeholder="Buscar oferta..." value={saleSearch}
                  onChange={e => handleSaleSearch(e.target.value)}
                  className="font-condensed"
                  style={{
                    background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6, padding: "9px 14px 9px 32px",
                    color: "var(--white)", fontSize: 13, outline: "none", width: 180,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(231,76,60,0.5)")}
                  onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              {/* toggle filtros */}
              <button onClick={() => setShowSaleFilters(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
                  background: showSaleFilters ? "rgba(231,76,60,0.12)" : "var(--black-2)",
                  border: showSaleFilters ? "1px solid rgba(231,76,60,0.45)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6, cursor: "pointer",
                  color: showSaleFilters ? "#e74c3c" : "var(--gray)", fontSize: 13,
                  transition: "all 0.2s",
                }}>
                <SlidersHorizontal size={13} />
                <span className="font-condensed" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>Filtros</span>
              </button>
              <Link href="/produtos?sale=true" style={{ display: "flex", alignItems: "center", gap: 6, color: "#e74c3c", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {showSaleFilters && (
            <FilterPanel filters={saleHook.filters} updateFilters={saleHook.updateFilters} accentColor="#e74c3c" />
          )}

          <ResultCount meta={saleHook.meta} search={saleHook.filters.search} color="#e74c3c" />

          {saleHook.error && (
            <div style={{ padding: "14px 18px", background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, color: "#e74c3c", marginBottom: 20, fontSize: 13 }}>
              ⚠️ {saleHook.error}
            </div>
          )}

          {saleHook.loading ? (
            <ProductSkeleton cols={4} />
          ) : saleHook.products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏷️</div>
              <div className="font-condensed" style={{ fontSize: 14, letterSpacing: "0.1em" }}>Nenhuma oferta encontrada.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {saleHook.products.map(p => <SaleProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Pagination meta={saleHook.meta} setPage={saleHook.setPage} accentColor="#e74c3c" />
        </div>
      </div>

      <Footer />
    </div>
  );
}