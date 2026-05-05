import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* BG 404 */}
        <div className="font-display" style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontSize: "clamp(160px,28vw,360px)",
          color: "rgba(245,197,24,0.04)", pointerEvents: "none",
          lineHeight: 1, userSelect: "none",
        }}>404</div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>👟</div>

          <h1 className="font-display" style={{ fontSize: "clamp(40px,7vw,80px)", color: "var(--white)", lineHeight: 0.9, marginBottom: 16 }}>
            PÁGINA<br /><span style={{ color: "var(--gold)" }}>NÃO ENCONTRADA</span>
          </h1>

          <p style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.7, maxWidth: 380, margin: "0 auto 36px" }}>
            Parece que esse caminho não existe. Mas temos muito tênis esperando por você!
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn-gold" style={{ padding: "13px 28px", borderRadius: 6, textDecoration: "none", fontSize: 14, display: "inline-block" }}>
              ← Voltar ao início
            </Link>
            <Link href="/produtos" className="btn-outline" style={{ padding: "13px 28px", borderRadius: 6, textDecoration: "none", fontSize: 14, display: "inline-block", background: "transparent" }}>
              Ver produtos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
