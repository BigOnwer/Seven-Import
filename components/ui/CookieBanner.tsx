"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem("seven-cookies");
      if (!accepted) setTimeout(() => setShow(true), 1500);
    } catch {
      setShow(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem("seven-cookies", "accepted"); } catch {}
    setShow(false);
  };

  const decline = () => {
    try { localStorage.setItem("seven-cookies", "declined"); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      maxWidth: 380, width: "calc(100vw - 48px)",
      background: "var(--black-2)",
      border: "1px solid rgba(245,197,24,0.2)",
      borderRadius: 12,
      padding: "20px 20px 16px",
      zIndex: 800,
      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
      animation: "slideInCookie 0.4s cubic-bezier(0.23,1,0.32,1) forwards",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Cookie size={18} color="var(--gold)" />
          <span className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", letterSpacing: "0.05em" }}>
            Cookies & Privacidade
          </span>
        </div>
        <button onClick={decline}
          style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer", padding: 2 }}>
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: 12, color: "var(--gray)", lineHeight: 1.65, marginBottom: 14 }}>
        Usamos cookies para melhorar sua experiência, salvar seu carrinho e personalizar conteúdo. Ao continuar, você concorda com nossa{" "}
        <Link href="/faq" style={{ color: "var(--gold)", textDecoration: "none" }}>política de privacidade</Link>.
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={accept} className="btn-gold"
          style={{ flex: 2, padding: "9px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12 }}>
          Aceitar todos
        </button>
        <button onClick={decline} className="btn-outline"
          style={{ flex: 1, padding: "9px 0", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "transparent" }}>
          Recusar
        </button>
      </div>

      <style>{`
        @keyframes slideInCookie {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
