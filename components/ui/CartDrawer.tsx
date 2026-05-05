"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, count } = useCart();
  const [open, setOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  // Auto-open when item added
  useEffect(() => {
    if (count > prevCount) {
      setOpen(true);
    }
    setPrevCount(count);
  }, [count]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 400, maxWidth: "100vw",
        background: "var(--black-2)",
        borderLeft: "1px solid rgba(245,197,24,0.15)",
        zIndex: 600,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1)",
        display: "flex", flexDirection: "column",
        boxShadow: open ? "-20px 0 60px rgba(0,0,0,0.5)" : "none",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={20} color="var(--gold)" />
            <span className="font-display" style={{ fontSize: 22, color: "var(--white)" }}>CARRINHO</span>
            {count > 0 && (
              <span style={{
                background: "var(--gold)", color: "var(--black)",
                fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                fontSize: 11, padding: "2px 8px", borderRadius: 10,
              }}>{count}</span>
            )}
          </div>
          <button onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <div className="font-display" style={{ fontSize: 24, color: "var(--white)", marginBottom: 8 }}>VAZIO</div>
              <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 24 }}>Seu carrinho está esperando por tênis incríveis.</p>
              <Link href="/produtos" onClick={() => setOpen(false)} className="btn-gold"
                style={{ padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 13, display: "inline-block" }}>
                Ver produtos
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`}
                  style={{
                    background: "var(--black-3)", border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 8, padding: "14px",
                    display: "flex", gap: 12, alignItems: "center",
                  }}>
                  {/* Emoji */}
                  <div style={{
                    width: 60, height: 60, background: "rgba(255,255,255,0.03)",
                    borderRadius: 6, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 28, flexShrink: 0,
                  }}>
                    {item.product.emoji}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-condensed" style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray)", marginBottom: 8 }}>
                      Tam. {item.size} · {item.product.brand}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Qty */}
                      <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                        <button onClick={() => updateQty(item.product.id, item.size, item.quantity - 1)}
                          style={{ width: 26, height: 26, background: "transparent", border: "none", color: "var(--gray)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Minus size={10} />
                        </button>
                        <span className="font-condensed" style={{ width: 24, textAlign: "center", fontSize: 12, fontWeight: 700, color: "var(--white)" }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.size, item.quantity + 1)}
                          style={{ width: 26, height: 26, background: "transparent", border: "none", color: "var(--gray)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Plus size={10} />
                        </button>
                      </div>
                      <div className="font-display" style={{ fontSize: 18, color: "var(--gold)" }}>
                        R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.product.id, item.size)}
                    style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer", flexShrink: 0, padding: 4, transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e74c3c")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "20px 24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="font-condensed" style={{ fontSize: 14, color: "var(--gray)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Subtotal</span>
              <span className="font-display" style={{ fontSize: 26, color: "var(--gold)" }}>R$ {total.toLocaleString("pt-BR")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn-gold"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px 0", borderRadius: 6, textDecoration: "none", fontSize: 14,
                }}>
                Finalizar Compra <ArrowRight size={16} />
              </Link>
              <Link href="/carrinho" onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "11px 0", borderRadius: 6, textDecoration: "none", fontSize: 13,
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--gray)", border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--white)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--gray)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                Ver carrinho completo
              </Link>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 16 }}>
              {["💳 12x sem juros", "📱 Pix", "✈ Frete grátis acima de R$800"].map(m => (
                <span key={m} className="font-condensed" style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.03em" }}>{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
}
