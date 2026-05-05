"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";

export default function PromoBanner() {
  const [show, setShow] = useState(true);

  // Countdown to a fixed future date
  const target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(23, 59, 59, 0);

  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!show) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1000 0%, #2a1800 50%, #1a1000 100%)",
      border: "1px solid rgba(245,197,24,0.25)",
      borderRadius: 12,
      margin: "24px 24px 0",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      flexWrap: "wrap",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* BG glow */}
      <div style={{
        position: "absolute", top: "50%", left: "30%",
        transform: "translate(-50%,-50%)",
        width: 300, height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Left: badge + text */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
        <div style={{
          background: "var(--gold)", color: "var(--black)",
          borderRadius: 8, padding: "8px 10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Zap size={20} fill="var(--black)" />
        </div>
        <div>
          <div className="font-display" style={{ fontSize: "clamp(16px,3vw,24px)", color: "var(--white)", lineHeight: 1 }}>
            PROMOÇÃO RELÂMPAGO — <span style={{ color: "var(--gold)" }}>20% OFF</span>
          </div>
          <div className="font-condensed" style={{ fontSize: 12, color: "var(--gray)", letterSpacing: "0.08em", marginTop: 4 }}>
            Use o cupom <span style={{ color: "var(--gold)", fontWeight: 700 }}>FLASH20</span> · Válido por tempo limitado
          </div>
        </div>
      </div>

      {/* Center: countdown */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
        {[
          { val: pad(timeLeft.h), label: "HRS" },
          { val: pad(timeLeft.m), label: "MIN" },
          { val: pad(timeLeft.s), label: "SEG" },
        ].map((t, i) => (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ textAlign: "center" }}>
              <div className="font-display" style={{
                fontSize: "clamp(22px,3vw,32px)",
                color: "var(--gold)", lineHeight: 1,
                background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: 6,
                border: "1px solid rgba(245,197,24,0.2)",
                minWidth: 52, display: "block",
              }}>
                {t.val}
              </div>
              <div className="font-condensed" style={{ fontSize: 8, color: "var(--gray)", letterSpacing: "0.2em", marginTop: 3 }}>
                {t.label}
              </div>
            </div>
            {i < 2 && (
              <div className="font-display" style={{ fontSize: 24, color: "var(--gold)", marginBottom: 12, opacity: 0.6 }}>:</div>
            )}
          </div>
        ))}
      </div>

      {/* Right: CTA + close */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
        <Link href="/produtos?sale=true" className="btn-gold"
          style={{ padding: "10px 20px", borderRadius: 6, textDecoration: "none", fontSize: 13, whiteSpace: "nowrap" }}>
          Ver ofertas
        </Link>
        <button onClick={() => setShow(false)}
          style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer", padding: 4, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
