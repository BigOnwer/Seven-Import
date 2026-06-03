"use client";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Truck, X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { useCoupon } from "@/lib/useCoupon";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SHIPPING_THRESHOLD = 800;

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const { applied, loading: couponLoading, error: couponError, success: couponSuccess, apply, remove, calcDiscount } = useCoupon();

  const [couponInput,  setCouponInput]  = useState("");
  const [checkingOut,  setCheckingOut]  = useState(false);

  const discount   = calcDiscount(total);
  const finalTotal = total - discount;
  const freeShipping = finalTotal >= SHIPPING_THRESHOLD;

  const router = useRouter()

  const handleApply = async () => {
    await apply(couponInput);
    // limpa o campo só em caso de sucesso (erro fica visível)
    if (!couponError) setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    remove();
    setCouponInput("");
  };

  const handleCheckout = () => {
    setCheckingOut(true);
    router.push("/checkout");
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
                {items.length === 0
                  ? "Seu carrinho está vazio"
                  : `${items.reduce((s, i) => s + i.quantity, 0)} item(s)`}
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

              {/* ── Itens ── */}
              <div>
                {/* Barra de frete grátis */}
                <div style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Truck size={16} color={freeShipping ? "#22C55E" : "var(--gold)"} />
                    <span className="font-condensed" style={{ fontSize: 13, color: freeShipping ? "#22C55E" : "var(--white)", fontWeight: 600, letterSpacing: "0.05em" }}>
                      {freeShipping
                        ? "✓ Você ganhou frete grátis!"
                        : `Falta R$ ${(SHIPPING_THRESHOLD - finalTotal).toLocaleString("pt-BR")} para frete grátis`}
                    </span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (finalTotal / SHIPPING_THRESHOLD) * 100)}%`, background: freeShipping ? "#22C55E" : "var(--gold)", borderRadius: 2, transition: "width 0.4s ease" }} />
                  </div>
                </div>

                {/* Itens do carrinho */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`}
                      style={{
                        background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10, padding: "20px",
                        display: "flex", gap: 20, alignItems: "center",
                      }}>
                      <div style={{ width: 90, height: 90, background: "rgba(255,255,255,0.03)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0 }}>
                        {item.product.emoji}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 3 }}>{item.product.brand}</div>
                        <div className="font-condensed" style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>{item.product.name}</div>
                        <span className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.05em" }}>
                          Tamanho: <span style={{ color: "var(--white)" }}>{item.size}</span>
                        </span>
                      </div>

                      {/* Qty */}
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
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

                      {/* Preço */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>
                          R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}
                        </div>
                        {item.quantity > 1 && (
                          <div style={{ fontSize: 11, color: "var(--gray)", fontFamily: "'Barlow Condensed',sans-serif" }}>
                            R$ {item.product.price.toLocaleString("pt-BR")} cada
                          </div>
                        )}
                      </div>

                      {/* Remover */}
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

              {/* ── Resumo ── */}
              <div style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 24, position: "sticky", top: 90 }}>
                <h2 className="font-display" style={{ fontSize: 24, color: "var(--white)", marginBottom: 20 }}>RESUMO</h2>

                {/* ── Cupom ── */}
                <div style={{ marginBottom: 20 }}>
                  <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Cupom de desconto</div>

                  {applied ? (
                    /* cupom aplicado — exibe tag removível */
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
                      borderRadius: 6, padding: "10px 14px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Tag size={13} color="#22C55E" />
                        <span className="font-condensed" style={{ fontSize: 13, fontWeight: 700, color: "#22C55E", letterSpacing: "0.08em" }}>
                          {applied.code}
                        </span>
                        <span className="font-condensed" style={{ fontSize: 11, color: "#22C55E", opacity: 0.8 }}>
                          {applied.discountType === "PERCENTAGE"
                            ? `−${applied.discountValue}%`
                            : `−R$ ${applied.discountValue.toFixed(2)}`}
                        </span>
                      </div>
                      <button onClick={handleRemoveCoupon}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#22C55E", opacity: 0.7, padding: 2, display: "flex", alignItems: "center" }}
                        title="Remover cupom">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    /* campo para digitar cupom */
                    <div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === "Enter" && handleApply()}
                          placeholder="Digite seu cupom"
                          disabled={couponLoading}
                          className="font-condensed"
                          style={{
                            flex: 1, background: "var(--black)",
                            border: `1px solid ${couponError ? "#e74c3c" : "rgba(255,255,255,0.1)"}`,
                            borderRadius: 4, padding: "10px 12px",
                            color: "var(--white)", fontSize: 13, fontWeight: 600,
                            letterSpacing: "0.08em", outline: "none",
                            opacity: couponLoading ? 0.5 : 1,
                          }}
                        />
                        <button
                          onClick={handleApply}
                          disabled={couponLoading || !couponInput.trim()}
                          className="btn-outline"
                          style={{ padding: "10px 14px", borderRadius: 4, cursor: "pointer", fontSize: 12, background: "transparent", display: "flex", alignItems: "center", gap: 5, opacity: (!couponInput.trim() || couponLoading) ? 0.5 : 1 }}>
                          {couponLoading
                            ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                            : <Tag size={14} />}
                          {couponLoading ? "" : "Aplicar"}
                        </button>
                      </div>

                      {/* feedback */}
                      {couponError && (
                        <div className="font-condensed" style={{ fontSize: 11, color: "#e74c3c", marginTop: 6 }}>
                          ⚠ {couponError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* success fora do applied-tag para aparecer por 1 ciclo */}
                  {couponSuccess && !couponError && (
                    <div className="font-condensed" style={{ fontSize: 11, color: "#22C55E", marginTop: 6 }}>
                      {couponSuccess}
                    </div>
                  )}
                </div>

                <div className="stripe-sep" style={{ marginBottom: 16 }} />

                {/* Totais */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--gray)" }}>Subtotal</span>
                    <span className="font-condensed" style={{ fontSize: 14, color: "var(--white)", fontWeight: 600 }}>
                      R$ {total.toLocaleString("pt-BR")}
                    </span>
                  </div>

                  {applied && discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "#22C55E" }}>
                        Cupom {applied.code}
                        {applied.discountType === "PERCENTAGE" && ` (${applied.discountValue}%)`}
                      </span>
                      <span className="font-condensed" style={{ fontSize: 14, color: "#22C55E", fontWeight: 600 }}>
                        −R$ {discount.toLocaleString("pt-BR")}
                      </span>
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
                    <div className="font-display" style={{ fontSize: 30, color: "var(--gold)" }}>
                      R$ {finalTotal.toLocaleString("pt-BR")}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray)", fontFamily: "'Barlow Condensed',sans-serif" }}>
                      ou 12x de R$ {Math.round(finalTotal / 12).toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>

                <button onClick={handleCheckout} disabled={checkingOut} className="btn-gold"
                  style={{ width: "100%", padding: "16px 0", borderRadius: 6, border: "none", cursor: checkingOut ? "wait" : "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: checkingOut ? 0.8 : 1 }}>
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
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}