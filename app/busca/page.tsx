"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, Star, ShoppingBag, ImageOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useToast } from "@/components/ui/Toast";
import { useProducts, type ApiProduct } from "@/lib/useProducts";

const SUGGESTIONS = ["Air Force 1", "Jordan 4", "Nike SB", "Air Max", "Off-White", "Timberland", "Vans", "Outlet"];

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Conteúdo principal ───────────────────────────────────────────────────────
function BuscaContent() {
  const searchParams = useSearchParams();
  const [inputVal, setInputVal] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(inputVal, 400);

  // Busca sem query → todos os produtos (newest); com query → filtra na API
  const { products, meta, loading } = useProducts({
    limit:  20,
    sort:   "newest",
    search: debouncedQuery.trim() || undefined,
  });

  const { addItem }         = useCart();
  const { toggle, isLiked } = useWishlist();
  const { showToast }       = useToast();
  const [added, setAdded]   = useState<string | null>(null);

  const handleSearch = (val: string) => setInputVal(val);

  const handleAddCart = (p: ApiProduct) => {
    addItem(p as any, p.sizes[1] ?? p.sizes[0]);
    setAdded(p.id);
    showToast(`${p.name} adicionado ao carrinho!`, "success", "👟");
    setTimeout(() => setAdded(null), 1500);
  };

  const handleToggleLike = (p: ApiProduct) => {
    const liked = isLiked(p.id);
    toggle(p as any);
    showToast(
      liked ? "Removido dos favoritos" : "Adicionado aos favoritos!",
      liked ? "info" : "success",
      liked ? "💔" : "❤️",
    );
  };

  const hasQuery   = debouncedQuery.trim().length > 0;
  const isSearching = loading && hasQuery; // só mostra spinner quando está buscando

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      <div style={{ paddingTop: 108 }}>
        {/* ── Search hero ── */}
        <div style={{
          padding: "60px 24px",
          background: "var(--black-2)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h1 className="font-display" style={{
              fontSize: "clamp(36px,5vw,60px)", color: "var(--white)",
              textAlign: "center", marginBottom: 32, lineHeight: 0.95,
            }}>
              BUSCAR <span style={{ color: "var(--gold)" }}>TÊNIS</span>
            </h1>

            {/* Input */}
            <div style={{ position: "relative" }}>
              {isSearching ? (
                <div style={{
                  position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)",
                  width: 20, height: 20, borderRadius: "50%",
                  border: "2px solid rgba(201,168,76,0.3)",
                  borderTopColor: "var(--gold)",
                  animation: "spin 0.7s linear infinite",
                }} />
              ) : (
                <Search size={20} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }} />
              )}
              <input
                autoFocus
                value={inputVal}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Ex: Air Force 1, Jordan, Nike..."
                className="font-condensed"
                style={{
                  width: "100%", height: 60, paddingLeft: 52,
                  paddingRight: inputVal ? 48 : 20,
                  background: "var(--black)",
                  border: "1.5px solid rgba(245,197,24,0.3)",
                  borderRadius: 8, color: "var(--white)",
                  fontSize: 18, fontWeight: 500, letterSpacing: "0.04em",
                  outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e  => (e.currentTarget.style.borderColor = "var(--gold)")}
                onBlur={e   => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.3)")}
              />
              {inputVal && (
                <button
                  onClick={() => handleSearch("")}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Sugestões — só quando input vazio */}
            {!inputVal && (
              <div style={{ marginTop: 20 }}>
                <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
                  Sugestões
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => handleSearch(s)} className="font-condensed"
                      style={{
                        padding: "7px 14px", borderRadius: 20, cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                        color: "var(--gray)", fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--gray)"; }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Resultados ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>

          {/* Contador */}
          {hasQuery && !loading && (
            <div className="font-condensed" style={{ fontSize: 13, color: "var(--gray)", marginBottom: 28, letterSpacing: "0.05em" }}>
              {products.length > 0 ? (
                <><span style={{ color: "var(--gold)" }}>{meta?.total ?? products.length}</span> resultado{(meta?.total ?? products.length) !== 1 ? "s" : ""} para "<span style={{ color: "var(--white)" }}>{debouncedQuery}</span>"</>
              ) : (
                <>Nenhum resultado para "<span style={{ color: "var(--white)" }}>{debouncedQuery}</span>"</>
              )}
            </div>
          )}

          {/* Sem resultados */}
          {hasQuery && !loading && products.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
              <h2 className="font-display" style={{ fontSize: 32, color: "var(--white)", marginBottom: 8 }}>SEM RESULTADOS</h2>
              <p style={{ color: "var(--gray)", marginBottom: 24 }}>Tente buscar por: Nike, Jordan, Air Force, Vans...</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => handleSearch(s)} className="font-condensed"
                    style={{ padding: "8px 16px", borderRadius: 4, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--gray)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skeleton durante busca */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite",
                }}>
                  <div style={{ height: 160, background: "rgba(255,255,255,0.04)" }} />
                  <div style={{ padding: "12px 14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 10, width: "40%", background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
                    <div style={{ height: 14, width: "70%", background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
                    <div style={{ height: 20, width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: 6, marginTop: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Header "todos os produtos" quando sem query */}
          {!hasQuery && !loading && (
            <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,44px)", color: "var(--white)", marginBottom: 24 }}>
              TODOS OS <span style={{ color: "var(--gold)" }}>PRODUTOS</span>
            </h2>
          )}

          {/* Grid de resultados */}
          {!loading && products.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {products.map(p => (
                <SearchCard
                  key={p.id}
                  product={p}
                  onAdd={() => handleAddCart(p)}
                  onLike={() => handleToggleLike(p)}
                  wasAdded={added === p.id}
                  liked={isLiked(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin  { to { transform: translateY(-50%) rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}

// ─── Card de resultado ────────────────────────────────────────────────────────
function SearchCard({
  product: p, onAdd, onLike, wasAdded, liked,
}: {
  product: ApiProduct;
  onAdd:    () => void;
  onLike:   () => void;
  wasAdded: boolean;
  liked:    boolean;
}) {
  const [hov,      setHov]      = useState(false);
  const [imgError, setImgError] = useState(false);

  const disc     = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  const thumbUrl = (p.midiaUrl && p.midiaType === "image")
    ? p.midiaUrl
    : (Array.isArray(p.images) && p.images[0]) || null;

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
      <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          height: 160, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 64, background: "rgba(255,255,255,0.02)",
          position: "relative", overflow: "hidden",
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "var(--gray)" }}>
              <ImageOff size={24} />
              <span className="font-condensed" style={{ fontSize: 9, letterSpacing: "0.1em" }}>Sem imagem</span>
            </div>
          ) : (
            <span style={{ transition: "transform 0.3s", transform: hov ? "scale(1.1)" : "scale(1)" }}>
              {p.emoji}
            </span>
          )}

          {p.tag && (
            <span className="tag" style={{ position: "absolute", top: 10, left: 10 }}>{p.tag}</span>
          )}
          {disc && (
            <span className="font-condensed" style={{
              position: "absolute", top: 10, right: 10,
              background: "#e74c3c", color: "#fff",
              fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 2,
            }}>
              -{disc}%
            </span>
          )}
          {!p.inStock && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="font-condensed" style={{ color: "var(--gray)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>Esgotado</span>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={e => { e.preventDefault(); onLike(); }}
            style={{
              position: "absolute", bottom: 10, right: 10,
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(10,10,10,0.85)",
              border: liked ? "1px solid rgba(231,76,60,0.4)" : "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              opacity: hov || liked ? 1 : 0, transition: "opacity 0.2s",
            }}>
            <span style={{ fontSize: 12 }}>{liked ? "❤️" : "🤍"}</span>
          </button>
        </div>
      </Link>

      <div style={{ padding: "12px 14px 16px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3 }}>
          {p.brand}
        </div>
        <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
          <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 6, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--white)")}>
            {p.name}
          </div>
        </Link>

        <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={9} fill={i <= Math.round(p.stars) ? "var(--gold)" : "none"} color="var(--gold)" />
          ))}
          <span style={{ fontSize: 10, color: "var(--gray)", marginLeft: 2 }}>({p.reviews})</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {p.oldPrice && (
              <div className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", textDecoration: "line-through" }}>
                R$ {p.oldPrice.toLocaleString("pt-BR")}
              </div>
            )}
            <div className="font-display" style={{ fontSize: 20, color: "var(--gold)" }}>
              R$ {p.price.toLocaleString("pt-BR")}
            </div>
          </div>
          <button
            onClick={onAdd}
            disabled={!p.inStock}
            className="btn-gold"
            style={{
              padding: "8px 12px", borderRadius: 4, border: "none",
              cursor: p.inStock ? "pointer" : "not-allowed",
              fontSize: 12, display: "flex", alignItems: "center", gap: 5,
              background: !p.inStock ? "var(--gray)" : wasAdded ? "#22C55E" : "var(--gold)",
              opacity: p.inStock ? 1 : 0.6,
            }}>
            <ShoppingBag size={12} />
            {!p.inStock ? "Esgotado" : wasAdded ? "✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuscaPage() {
  return <Suspense><BuscaContent /></Suspense>;
}