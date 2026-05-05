import Link from "next/link";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Pedidos rastreados em tempo real",
  "Lista de favoritos sincronizada",
  "Cupons e descontos exclusivos",
  "Checkout mais rápido",
];

export default function AuthLeft() {
  return (
    <div style={{
      background: "#0a0a0a",
      padding: "48px 44px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      minHeight: "100vh",
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(245,197,24,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.04) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        pointerEvents: "none",
      }} />

      {/* BG glow */}
      <div style={{
        position: "absolute", top: "45%", left: "35%",
        transform: "translate(-50%,-50%)",
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,197,24,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Giant BG word */}
      <div className="font-display" style={{
        position: "absolute", bottom: -30, left: -16,
        fontSize: "clamp(100px,14vw,180px)",
        color: "rgba(245,197,24,0.05)",
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
      }}>SEVEN</div>

      {/* Logo */}
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", position: "relative", zIndex: 1 }}>
        <CrownSVG />
        <div>
          <div className="font-display" style={{ fontSize: 28, color: "#f5c518", lineHeight: 1, letterSpacing: "0.05em" }}>SEVEN</div>
          <div className="font-condensed" style={{ fontSize: 9, color: "#555", letterSpacing: "0.38em", textTransform: "uppercase" }}>IMPORT BR</div>
        </div>
      </Link>

      {/* Center copy */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 className="font-display" style={{
          fontSize: "clamp(32px,3.5vw,52px)", color: "#fff",
          lineHeight: 0.92, marginBottom: 18,
        }}>
          QUEM VIVE<br />DE VERDADE<br />
          <span style={{ color: "#f5c518" }}>USA SEVEN</span>
        </h2>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.75, maxWidth: 300, marginBottom: 28 }}>
          Faça login para acessar seus pedidos, favoritos e as melhores condições exclusivas para membros.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {benefits.map(b => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle size={13} color="#f5c518" />
              <span style={{ fontSize: 12, color: "#888" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 14 }} />
        <div className="font-condensed" style={{ fontSize: 10, color: "#333", letterSpacing: "0.07em" }}>
          © 2024–2025 Seven Import BR · Belo Horizonte, MG
        </div>
      </div>
    </div>
  );
}

function CrownSVG() {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
      <path d="M4 24L8 10L16 18L24 10L28 24H4Z" fill="#F5C518" />
      <circle cx="8" cy="10" r="2.5" fill="#F5C518" />
      <circle cx="16" cy="8" r="2.5" fill="#F5C518" />
      <circle cx="24" cy="10" r="2.5" fill="#F5C518" />
      <rect x="4" y="24" width="24" height="4" rx="1" fill="#C9A000" />
    </svg>
  );
}
