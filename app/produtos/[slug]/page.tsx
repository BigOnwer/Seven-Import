"use client";
import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import {
  ShoppingBag, Heart, Star, ChevronRight,
  Minus, Plus, Check, Truck, Shield, RotateCcw,
  ImageOff, ChevronLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useToast } from "@/components/ui/Toast";
import type { ApiProduct } from "@/lib/useProducts";

// ─── Tipos locais ─────────────────────────────────────────────────────────────
type PageData = {
  data: ApiProduct;
  related: ApiProduct[];
};

type GalleryItem = { type: "image"; url: string } | { type: "emoji"; value: string };

// ─── Hook de busca por slug ───────────────────────────────────────────────────
function useProductBySlug(slug: string) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    fetch(`/api/products/slug/${slug}`)
      .then(res => res.json())
      .then(json => {
        if (!json.success) throw new Error(json.error ?? "Produto não encontrado.");
        setPageData({ data: json.data, related: json.related ?? [] });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { pageData, loading, error };
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { pageData, loading, error } = useProductBySlug(slug);
  const { addItem }             = useCart();
  const { toggle, isLiked }     = useWishlist();
  const { showToast }           = useToast();

  const [selectedSize,  setSelectedSize]  = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty,           setQty]           = useState(1);
  const [activeImg,     setActiveImg]     = useState(0);
  const [added,         setAdded]         = useState(false);
  const [sizeError,     setSizeError]     = useState(false);
  const [imgError,      setImgError]      = useState<Record<number, boolean>>({});

  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(0);
    setActiveImg(0);
    setQty(1);
    setAdded(false);
    setSizeError(false);
    setImgError({});
  }, [slug]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--black)" }}>
        <Navbar />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "140px 24px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="product-detail-grid">
            <div>
              <div style={{ background: "var(--black-2)", borderRadius: 12, height: 420, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ display: "flex", gap: 8 }}>
                {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: 80, background: "var(--black-2)", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
              {[120, 200, 80, 60, 100, 50].map((w, i) => (
                <div key={i} style={{ height: i === 1 ? 52 : 16, width: `${w}%`, maxWidth: "100%", background: "var(--black-2)", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Erro / não encontrado ──────────────────────────────────────────────────
  if (error || !pageData) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px" }}>
          <div style={{ fontSize: 64 }}>😕</div>
          <h1 className="font-display" style={{ fontSize: 40, color: "var(--white)", textAlign: "center" }}>
            PRODUTO NÃO <span style={{ color: "var(--gold)" }}>ENCONTRADO</span>
          </h1>
          {error && <p style={{ fontSize: 14, color: "var(--gray)" }}>{error}</p>}
          <Link href="/produtos" className="btn-gold" style={{ padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 14, marginTop: 8 }}>
            Ver todos os produtos
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { data: product, related } = pageData;
  const liked    = isLiked(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  // ── Monta galeria: midiaUrl + images[] ou emoji como fallback ──────────────
  const gallery: GalleryItem[] = (() => {
    const imgs: GalleryItem[] = [];
    if (product.midiaUrl && product.midiaType === "image") {
      imgs.push({ type: "image", url: product.midiaUrl });
    }
    if (Array.isArray(product.images)) {
      product.images.forEach(url => {
        if (url && !imgs.some(g => g.type === "image" && g.url === url)) {
          imgs.push({ type: "image", url });
        }
      });
    }
    if (imgs.length === 0) {
      imgs.push({ type: "emoji", value: product.emoji });
    }
    return imgs;
  })();

  const totalImgs   = gallery.length;
  const isMulti     = totalImgs > 1;

  const goTo = (i: number) => setActiveImg((i + totalImgs) % totalImgs);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    const size = selectedSize ?? product.sizes[0] ?? 0;
    for (let i = 0; i < qty; i++) addItem(product as any, size);
    setAdded(true);
    showToast(`${product.name} adicionado ao carrinho!`, "success", "👟");
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleLike = () => {
    toggle(product as any);
    showToast(
      liked ? "Removido dos favoritos" : "Adicionado aos favoritos!",
      liked ? "info" : "success",
      liked ? "💔" : "❤️",
    );
  };

  const detailsList: string[] = product.details
    ? product.details.split(/\n|;/).map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div style={{ paddingTop: 108 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 0" }}>
          <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Link href="/"         style={{ color: "var(--gray)", textDecoration: "none" }}>Início</Link>
            <ChevronRight size={10} />
            <Link href="/produtos" style={{ color: "var(--gray)", textDecoration: "none" }}>Produtos</Link>
            <ChevronRight size={10} />
            <Link href={`/produtos?category=${product.category}`} style={{ color: "var(--gray)", textDecoration: "none" }}>{product.category}</Link>
            <ChevronRight size={10} />
            <span style={{ color: "var(--gold)" }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* ── Conteúdo principal ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="product-detail-grid">

          {/* ── Galeria ── */}
          <div>
            {/* Imagem principal */}
            <div style={{
              background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, height: 420, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 120, marginBottom: 12,
              position: "relative", overflow: "hidden",
            }}>
              {gallery[activeImg]?.type === "image" && !imgError[activeImg] ? (
                <img
                  src={(gallery[activeImg] as { type: "image"; url: string }).url}
                  alt={product.name}
                  onError={() => setImgError(e => ({ ...e, [activeImg]: true }))}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }}
                />
              ) : imgError[activeImg] ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--gray)" }}>
                  <ImageOff size={40} />
                  <span className="font-condensed" style={{ fontSize: 11, letterSpacing: "0.1em" }}>Imagem indisponível</span>
                </div>
              ) : (
                <span>{(gallery[activeImg] as { type: "emoji"; value: string })?.value ?? product.emoji}</span>
              )}

              {/* Badges */}
              {product.tag && (
                <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
                  <span className="tag" style={{ fontSize: 12, padding: "4px 12px" }}>{product.tag}</span>
                </div>
              )}
              {discount && (
                <div className="font-condensed" style={{
                  position: "absolute", top: 20, right: 20, zIndex: 1,
                  background: "#e74c3c", color: "#fff", fontSize: 14, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 3,
                }}>-{discount}%</div>
              )}
              {!product.inStock && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                  <span className="font-condensed" style={{ color: "var(--gray)", fontSize: 14, letterSpacing: "0.25em", textTransform: "uppercase" }}>Esgotado</span>
                </div>
              )}

              {/* Setas de navegação — só aparecem com múltiplas imagens */}
              {isMulti && (
                <>
                  <button
                    onClick={() => goTo(activeImg - 1)}
                    aria-label="Imagem anterior"
                    style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      zIndex: 3, width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(10,10,10,0.75)", border: "1px solid rgba(255,255,255,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "var(--white)", transition: "background 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.25)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(10,10,10,0.75)")}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => goTo(activeImg + 1)}
                    aria-label="Próxima imagem"
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      zIndex: 3, width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(10,10,10,0.75)", border: "1px solid rgba(255,255,255,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "var(--white)", transition: "background 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.25)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(10,10,10,0.75)")}
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Contador */}
                  <div className="font-condensed" style={{
                    position: "absolute", bottom: 14, right: 14, zIndex: 3,
                    background: "rgba(10,10,10,0.7)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20, padding: "3px 10px",
                    fontSize: 11, color: "var(--gray)", letterSpacing: "0.08em",
                  }}>
                    {activeImg + 1} / {totalImgs}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {gallery.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  style={{
                    width: 72, height: 72, flexShrink: 0,
                    background: "var(--black-2)",
                    border: activeImg === i
                      ? "2px solid var(--gold)"
                      : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8, fontSize: 28, cursor: "pointer",
                    transition: "border 0.2s, transform 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", position: "relative", padding: 0,
                    transform: activeImg === i ? "scale(1.05)" : "scale(1)",
                    opacity: activeImg === i ? 1 : 0.65,
                  }}
                  onMouseEnter={e => { if (activeImg !== i) e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { if (activeImg !== i) e.currentTarget.style.opacity = "0.65"; }}
                >
                  {item.type === "image" && !imgError[i] ? (
                    <img
                      src={item.url}
                      alt={`${product.name} ${i + 1}`}
                      onError={() => setImgError(e => ({ ...e, [i]: true }))}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span>{product.emoji}</span>
                  )}
                  {/* Indicador ativo */}
                  {activeImg === i && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: 3, background: "var(--gold)", borderRadius: "0 0 6px 6px",
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Info do produto ── */}
          <div>
            <div className="font-condensed" style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
              {product.brand}
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(32px,4vw,52px)", color: "var(--white)", lineHeight: 0.95, marginBottom: 12 }}>
              {product.name}
            </h1>

            {/* Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill={i <= Math.round(product.stars) ? "var(--gold)" : "none"} color="var(--gold)" />
                ))}
              </div>
              <span className="font-condensed" style={{ fontSize: 13, color: "var(--gold)" }}>{product.stars.toFixed(1)}</span>
              <span style={{ fontSize: 12, color: "var(--gray)" }}>({product.reviews} avaliações)</span>
              <span className="font-condensed" style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.1em",
                background: product.inStock ? "rgba(34,197,94,0.1)" : "rgba(231,76,60,0.1)",
                color: product.inStock ? "#22C55E" : "#e74c3c",
                border: `1px solid ${product.inStock ? "rgba(34,197,94,0.3)" : "rgba(231,76,60,0.3)"}`,
              }}>
                {product.inStock ? `${product.stock} em estoque` : "Esgotado"}
              </span>
            </div>

            {/* Preço */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {product.oldPrice && (
                <div className="font-condensed" style={{ fontSize: 14, color: "var(--gray)", textDecoration: "line-through" }}>
                  R$ {product.oldPrice.toLocaleString("pt-BR")}
                </div>
              )}
              <div className="font-display" style={{ fontSize: 48, color: "var(--gold)", lineHeight: 1 }}>
                R$ {product.price.toLocaleString("pt-BR")}
              </div>
              <div className="font-condensed" style={{ fontSize: 13, color: "var(--gray)", marginTop: 4 }}>
                ou 12x de R$ {Math.round(product.price / 12).toLocaleString("pt-BR")} sem juros
              </div>
              {discount && product.oldPrice && (
                <div className="font-condensed" style={{ fontSize: 12, color: "#22C55E", marginTop: 4 }}>
                  ✓ Você economiza R$ {(product.oldPrice - product.price).toLocaleString("pt-BR")}
                </div>
              )}
            </div>

            {/* Cores */}
            {product.colors.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                  Cor: <span style={{ color: "var(--white)" }}>{product.colorNames[selectedColor] ?? ""}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.colors.map((c, i) => (
                    <button key={i} onClick={() => setSelectedColor(i)}
                      title={product.colorNames[i]}
                      style={{
                        width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer",
                        border: selectedColor === i ? "3px solid var(--gold)" : "3px solid transparent",
                        outline: selectedColor === i ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.2)",
                        outlineOffset: 2, transition: "all 0.2s",
                      }} />
                  ))}
                </div>
              </div>
            )}

            {/* Tamanhos */}
            {product.sizes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="font-condensed" style={{
                  fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10,
                  color: sizeError ? "#e74c3c" : "var(--gray)",
                  transition: "color 0.2s",
                }}>
                  {sizeError ? "⚠ Selecione um tamanho!" : "Tamanho"}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className="font-condensed"
                      style={{
                        width: 48, height: 44, borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700,
                        border: selectedSize === size
                          ? "2px solid var(--gold)"
                          : sizeError
                            ? "1px solid rgba(231,76,60,0.4)"
                            : "1px solid rgba(255,255,255,0.12)",
                        background: selectedSize === size ? "rgba(245,197,24,0.12)" : "transparent",
                        color: selectedSize === size ? "var(--gold)" : "var(--white)",
                        transition: "all 0.2s",
                      }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade + Adicionar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{
                display: "flex", alignItems: "center",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, overflow: "hidden",
              }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 40, height: 50, background: "var(--black-2)", border: "none", color: "var(--white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Minus size={14} />
                </button>
                <span className="font-condensed" style={{ width: 40, textAlign: "center", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                  style={{ width: 40, height: 50, background: "var(--black-2)", border: "none", color: "var(--white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-gold"
                style={{
                  flex: 1, height: 50, borderRadius: 6, border: "none",
                  cursor: product.inStock ? "pointer" : "not-allowed",
                  fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: !product.inStock ? "var(--gray)" : added ? "#22C55E" : "var(--gold)",
                  opacity: product.inStock ? 1 : 0.6,
                  transition: "background 0.3s",
                }}>
                {!product.inStock
                  ? <><ShoppingBag size={16} /> Indisponível</>
                  : added
                    ? <><Check size={16} /> Adicionado!</>
                    : <><ShoppingBag size={16} /> Adicionar ao Carrinho</>
                }
              </button>

              <button
                onClick={handleToggleLike}
                style={{
                  width: 50, height: 50, borderRadius: 6, cursor: "pointer",
                  border: liked ? "1px solid #e74c3c" : "1px solid rgba(255,255,255,0.12)",
                  background: liked ? "rgba(231,76,60,0.1)" : "transparent",
                  color: liked ? "#e74c3c" : "var(--gray)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                <Heart size={18} fill={liked ? "#e74c3c" : "none"} />
              </button>
            </div>

            {/* Descrição */}
            <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.75, marginBottom: 24 }}>
              {product.description}
            </p>

            {/* Detalhes */}
            {detailsList.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
                  Detalhes
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {detailsList.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--gray)" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { icon: Truck,     label: "Envio nacional" },
                { icon: Shield,    label: "100% original"  },
                { icon: RotateCcw, label: "Troca grátis"   },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, padding: "10px 8px", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 6, textAlign: "center",
                }}>
                  <Icon size={16} color="var(--gold)" />
                  <span className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Produtos relacionados ── */}
        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,44px)", color: "var(--white)" }}>
                VOCÊ TAMBÉM <span style={{ color: "var(--gold)" }}>VAI GOSTAR</span>
              </h2>
              <Link href="/produtos" className="btn-outline" style={{ padding: "10px 20px", borderRadius: 4, textDecoration: "none", fontSize: 13, background: "transparent" }}>
                Ver todos
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

// ─── Card de relacionado ──────────────────────────────────────────────────────
function RelatedCard({ product: p }: { product: ApiProduct }) {
  const [imgErr, setImgErr] = useState(false);

  // Pega a primeira imagem disponível (midiaUrl ou images[0])
  const thumbUrl = (p.midiaUrl && p.midiaType === "image")
    ? p.midiaUrl
    : (Array.isArray(p.images) && p.images[0]) || null;

  return (
    <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
      <div className="product-card" style={{
        background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, overflow: "hidden", transition: "border 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.35)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>

        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, background: "rgba(255,255,255,0.02)", position: "relative", overflow: "hidden" }}>
          {thumbUrl && !imgErr ? (
            <img
              src={thumbUrl}
              alt={p.name}
              onError={() => setImgErr(true)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span>{p.emoji}</span>
          )}
        </div>

        <div style={{ padding: "12px 14px 16px" }}>
          <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>{p.brand}</div>
          <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>{p.name}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div className="font-display" style={{ fontSize: 20, color: "var(--gold)" }}>R$ {p.price.toLocaleString("pt-BR")}</div>
            {p.oldPrice && (
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", textDecoration: "line-through" }}>
                R$ {p.oldPrice.toLocaleString("pt-BR")}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}