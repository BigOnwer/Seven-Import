"use client";
import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Star, ChevronRight, Minus, Plus, Check, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { useCart } from "@/lib/cartContext";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <Navbar />
        <div style={{ fontSize: 64 }}>😕</div>
        <h1 className="font-display" style={{ fontSize: 40, color: "var(--white)" }}>PRODUTO NÃO ENCONTRADO</h1>
        <Link href="/produtos" className="btn-gold" style={{ padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 14 }}>Ver todos os produtos</Link>
      </div>
    );
  }

  const related = getRelatedProducts(product, 4);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    for (let i = 0; i < qty; i++) addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ paddingTop: 108, paddingBottom: 0 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 0" }}>
          <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 6 }}>
            <Link href="/" style={{ color: "var(--gray)", textDecoration: "none" }}>Início</Link>
            <ChevronRight size={10} />
            <Link href="/produtos" style={{ color: "var(--gray)", textDecoration: "none" }}>Produtos</Link>
            <ChevronRight size={10} />
            <Link href={`/produtos?categoria=${product.category}`} style={{ color: "var(--gray)", textDecoration: "none" }}>{product.category}</Link>
            <ChevronRight size={10} />
            <span style={{ color: "var(--gold)" }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product main */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="product-detail-grid">

          {/* Left: images */}
          <div>
            {/* Main image */}
            <div style={{
              background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, height: 420, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 120, marginBottom: 12, position: "relative",
              overflow: "hidden",
            }}>
              <span style={{ transition: "transform 0.3s" }}>{product.images[activeImg]}</span>
              {product.tag && (
                <div style={{ position: "absolute", top: 20, left: 20 }}>
                  <span className="tag" style={{ fontSize: 12, padding: "4px 12px" }}>{product.tag}</span>
                </div>
              )}
              {discount && (
                <div className="font-condensed" style={{
                  position: "absolute", top: 20, right: 20,
                  background: "#e74c3c", color: "#fff", fontSize: 14, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 3,
                }}>-{discount}%</div>
              )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: 8 }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  style={{
                    flex: 1, height: 80, background: "var(--black-2)",
                    border: activeImg === i ? "2px solid var(--gold)" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8, fontSize: 28, cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  {img}
                </button>
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div>
            <div className="font-condensed" style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>{product.brand}</div>
            <h1 className="font-display" style={{ fontSize: "clamp(32px,4vw,52px)", color: "var(--white)", lineHeight: 0.95, marginBottom: 12 }}>{product.name}</h1>

            {/* Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= Math.round(product.stars) ? "var(--gold)" : "none"} color="var(--gold)" />)}
              </div>
              <span className="font-condensed" style={{ fontSize: 13, color: "var(--gold)" }}>{product.stars}</span>
              <span style={{ fontSize: 12, color: "var(--gray)" }}>({product.reviews} avaliações)</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {product.oldPrice && (
                <div className="font-condensed" style={{ fontSize: 14, color: "var(--gray)", textDecoration: "line-through" }}>R$ {product.oldPrice.toLocaleString("pt-BR")}</div>
              )}
              <div className="font-display" style={{ fontSize: 48, color: "var(--gold)", lineHeight: 1 }}>
                R$ {product.price.toLocaleString("pt-BR")}
              </div>
              <div className="font-condensed" style={{ fontSize: 13, color: "var(--gray)", marginTop: 4 }}>
                ou 12x de R$ {Math.round(product.price / 12).toLocaleString("pt-BR")} sem juros
              </div>
              {discount && (
                <div className="font-condensed" style={{ fontSize: 12, color: "#22C55E", marginTop: 4 }}>
                  ✓ Você economiza R$ {(product.oldPrice! - product.price).toLocaleString("pt-BR")}
                </div>
              )}
            </div>

            {/* Colors */}
            <div style={{ marginBottom: 20 }}>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                Cor: <span style={{ color: "var(--white)" }}>{product.colorNames[selectedColor]}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {product.colors.map((c, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer",
                      border: selectedColor === i ? "3px solid var(--gold)" : "3px solid transparent",
                      outline: selectedColor === i ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.2)",
                      outlineOffset: 2, transition: "all 0.2s",
                    }} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: 24 }}>
              <div className="font-condensed" style={{
                fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10,
                color: sizeError ? "#e74c3c" : "var(--gray)",
              }}>
                {sizeError ? "⚠ Selecione um tamanho!" : "Tamanho"}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.sizes.map(size => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className="font-condensed"
                    style={{
                      width: 48, height: 44, borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700,
                      border: selectedSize === size ? "2px solid var(--gold)" : sizeError ? "1px solid rgba(231,76,60,0.4)" : "1px solid rgba(255,255,255,0.12)",
                      background: selectedSize === size ? "rgba(245,197,24,0.12)" : "transparent",
                      color: selectedSize === size ? "var(--gold)" : "var(--white)",
                      transition: "all 0.2s",
                    }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 0,
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, overflow: "hidden",
              }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 40, height: 50, background: "var(--black-2)", border: "none", color: "var(--white)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Minus size={14} />
                </button>
                <span className="font-condensed" style={{ width: 40, textAlign: "center", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  style={{ width: 40, height: 50, background: "var(--black-2)", border: "none", color: "var(--white)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={14} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn-gold"
                style={{
                  flex: 1, height: 50, borderRadius: 6, border: "none", cursor: "pointer", fontSize: 15,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: added ? "#22C55E" : "var(--gold)",
                  transition: "background 0.3s",
                }}>
                {added ? <><Check size={16} /> Adicionado!</> : <><ShoppingBag size={16} /> Adicionar ao Carrinho</>}
              </button>

              <button onClick={() => setLiked(!liked)}
                style={{
                  width: 50, height: 50, borderRadius: 6, cursor: "pointer",
                  border: liked ? "1px solid #e74c3c" : "1px solid rgba(255,255,255,0.12)",
                  background: liked ? "rgba(231,76,60,0.1)" : "transparent",
                  color: liked ? "#e74c3c" : "var(--gray)", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                <Heart size={18} fill={liked ? "#e74c3c" : "none"} />
              </button>
            </div>

            {/* Description */}
            <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.75, marginBottom: 24 }}>{product.longDesc}</p>

            {/* Details */}
            <div style={{ marginBottom: 24 }}>
              <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Detalhes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {product.details.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--gray)" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { icon: Truck, label: "Envio nacional" },
                { icon: Shield, label: "100% original" },
                { icon: RotateCcw, label: "Troca grátis" },
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

        {/* Related products */}
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
            {related.map(p => (
              <Link key={p.id} href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
                <div className="product-card" style={{
                  background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10, overflow: "hidden",
                }}>
                  <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, background: "rgba(255,255,255,0.02)" }}>
                    {p.emoji}
                  </div>
                  <div style={{ padding: "12px 14px 16px" }}>
                    <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>{p.brand}</div>
                    <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>{p.name}</div>
                    <div className="font-display" style={{ fontSize: 20, color: "var(--gold)" }}>R$ {p.price.toLocaleString("pt-BR")}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}
