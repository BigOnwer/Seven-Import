"use client";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { useState } from "react";

const SHIPPING_THRESHOLD = 800;

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const discount = couponApplied ? Math.round(total * 0.1) : 0;
  const finalTotal = total - discount;
  const freeShipping = finalTotal >= SHIPPING_THRESHOLD;

  const handleCoupon = () => {
    if (coupon.toUpperCase() === "SEVEN10") {
      setCouponApplied(true); setCouponError(false);
    } else {
      setCouponError(true); setCouponApplied(false);
      setTimeout(() => setCouponError(false), 2000);
    }
  };

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      clearCart();
      setCheckingOut(false);
      alert("✅ Pedido realizado! Entre em contato via @sevenimportbr para finalizar o pagamento.");
    }, 1800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      <div style={{ paddingTop: 108 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
          {/* Header */}
          <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "space-between" }}>
            <div>
              <h1 className="font-display" style={{ fontSize: "clamp(36px,5vw,60px)", color: "var(--white)", lineHeight: 0.95 }}>
                MEU <span style={{ color: "var(--gold)" }}>CARRINHO</span>
              </h1>
              <div className="font-condensed" style={{ fontSize: 13, color: "var(--gray)", marginTop: 6 }}>
                {items.length === 0 ? "Seu carrinho está vazio" : `${items.reduce((s, i) => s + i.quantity, 0)} item(s)`}
              </div>
            </div>
            <Link href="/produtos" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gold)", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <ArrowLeft size={16} /> Continuar comprando
            </Link>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
              <h2 className="font-display" style={{ fontSize: 36, color: "var(--white)", marginBottom: 12 }}>CARRINHO VAZIO</h2>
              <p style={{ color: "var(--gray)", marginBottom: 32, fontSize: 15 }}>Explore nossa coleção e encontre o par perfeito para você.</p>
              <Link href="/produtos" className="btn-gold" style={{ padding: "14px 32px", borderRadius: 4, textDecoration: "none", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ShoppingBag size={16} /> Ver produtos
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }} className="cart-grid">
              {/* Items */}
              <div>
                {/* Free shipping progress */}
                <div style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Truck size={16} color={freeShipping ? "#22C55E" : "var(--gold)"} />
                    <span className="font-condensed" style={{ fontSize: 13, color: freeShipping ? "#22C55E" : "var(--white)", fontWeight: 600, letterSpacing: "0.05em" }}>
                      {freeShipping ? "✓ Você ganhou frete grátis!" : `Falta R$ ${(SHIPPING_THRESHOLD - finalTotal).toLocaleString("pt-BR")} para frete grátis`}
                    </span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (finalTotal / SHIPPING_THRESHOLD) * 100)}%`, background: freeShipping ? "#22C55E" : "var(--gold)", borderRadius: 2, transition: "width 0.4s ease" }} />
                  </div>
                </div>

                {/* Cart items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`}
                      style={{
                        background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10, padding: "20px",
                        display: "flex", gap: 20, alignItems: "center",
                      }}>
                      {/* Emoji image */}
                      <div style={{
                        width: 90, height: 90, background: "rgba(255,255,255,0.03)",
                        borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 40, flexShrink: 0,
                      }}>
                        {item.product.emoji}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 3 }}>{item.product.brand}</div>
                        <div className="font-condensed" style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>{item.product.name}</div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.05em" }}>Tamanho: <span style={{ color: "var(--white)" }}>{item.size}</span></span>
                        </div>
                      </div>

                      {/* Qty control */}
                      <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                        <button onClick={() => updateQty(item.product.id, item.size, item.quantity - 1)}
                          style={{ width: 34, height: 36, background: "var(--black-3)", border: "none", color: "var(--white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Minus size={12} />
                        </button>
                        <span className="font-condensed" style={{ width: 32, textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--white)" }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.size, item.quantity + 1)}
                          style={{ width: 34, height: 36, background: "var(--black-3)", border: "none", color: "var(--white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}</div>
                        {item.quantity > 1 && <div style={{ fontSize: 11, color: "var(--gray)", fontFamily: "'Barlow Condensed',sans-serif" }}>R$ {item.product.price.toLocaleString("pt-BR")} cada</div>}
                      </div>

                      {/* Remove */}
                      <button onClick={() => removeItem(item.product.id, item.size)}
                        style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer", padding: 4, transition: "color 0.2s", flexShrink: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#e74c3c")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 24, position: "sticky", top: 90 }}>
                <h2 className="font-display" style={{ fontSize: 24, color: "var(--white)", marginBottom: 20 }}>RESUMO</h2>

                {/* Coupon */}
                <div style={{ marginBottom: 20 }}>
                  <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Cupom de desconto</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                      placeholder="Ex: SEVEN10"
                      className="font-condensed"
                      style={{
                        flex: 1, background: "var(--black)", border: `1px solid ${couponError ? "#e74c3c" : couponApplied ? "#22C55E" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 4, padding: "10px 12px", color: "var(--white)", fontSize: 13,
                        fontWeight: 600, letterSpacing: "0.08em", outline: "none",
                      }}
                      onKeyDown={e => e.key === "Enter" && handleCoupon()}
                    />
                    <button onClick={handleCoupon} className="btn-outline" style={{ padding: "10px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, background: "transparent", display: "flex", alignItems: "center" }}>
                      <Tag size={14} />
                    </button>
                  </div>
                  {couponApplied && <div className="font-condensed" style={{ fontSize: 11, color: "#22C55E", marginTop: 5 }}>✓ Cupom SEVEN10 aplicado — 10% off!</div>}
                  {couponError && <div className="font-condensed" style={{ fontSize: 11, color: "#e74c3c", marginTop: 5 }}>Cupom inválido. Tente SEVEN10!</div>}
                </div>

                <div className="stripe-sep" style={{ marginBottom: 16 }} />

                {/* Totals */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--gray)" }}>Subtotal</span>
                    <span className="font-condensed" style={{ fontSize: 14, color: "var(--white)", fontWeight: 600 }}>R$ {total.toLocaleString("pt-BR")}</span>
                  </div>
                  {couponApplied && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "#22C55E" }}>Desconto (10%)</span>
                      <span className="font-condensed" style={{ fontSize: 14, color: "#22C55E", fontWeight: 600 }}>-R$ {discount.toLocaleString("pt-BR")}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--gray)" }}>Frete</span>
                    <span className="font-condensed" style={{ fontSize: 14, color: freeShipping ? "#22C55E" : "var(--white)", fontWeight: 600 }}>
                      {freeShipping ? "Grátis" : "A calcular"}
                    </span>
                  </div>
                </div>

                <div className="stripe-sep" style={{ marginBottom: 16 }} />

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                  <span className="font-condensed" style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Total</span>
                  <div style={{ textAlign: "right" }}>
                    <div className="font-display" style={{ fontSize: 30, color: "var(--gold)" }}>R$ {finalTotal.toLocaleString("pt-BR")}</div>
                    <div style={{ fontSize: 11, color: "var(--gray)", fontFamily: "'Barlow Condensed',sans-serif" }}>ou 12x de R$ {Math.round(finalTotal / 12).toLocaleString("pt-BR")}</div>
                  </div>
                </div>

                <button onClick={handleCheckout} disabled={checkingOut} className="btn-gold"
                  style={{
                    width: "100%", padding: "16px 0", borderRadius: 6, border: "none", cursor: checkingOut ? "wait" : "pointer",
                    fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: checkingOut ? 0.8 : 1,
                  }}>
                  {checkingOut ? "Processando..." : <><ShoppingBag size={16} /> Finalizar Pedido</>}
                </button>

                <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 16 }}>
                  {["💳 Cartão", "📱 Pix", "🏦 Boleto"].map(m => (
                    <span key={m} className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.05em" }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
