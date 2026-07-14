"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, AlertCircle, Code } from "lucide-react";
import AuthLeft from "@/components/ui/AuthLeft";
import { useToast } from "@/components/ui/Toast";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const inp = (field: string): React.CSSProperties => ({
    width: "100%", height: 50,
    paddingLeft: 46, paddingRight: field === "password" ? 46 : 14,
    background: "#0d0d0d",
    border: `1.5px solid ${focused === field ? "#f5c518" : error ? "rgba(231,76,60,0.35)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 8, color: "#f5f5f0", fontSize: 15,
    fontFamily: "'Barlow', sans-serif", outline: "none",
    transition: "border-color .2s, box-shadow .2s",
    boxShadow: focused === field ? "0 0 0 3px rgba(245,197,24,0.1)" : "none",
  });
 
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      router.push("/produtos");

    } catch (err: unknown) {
      setError(
        err instanceof Error 
        ? err.message 
        : "Erro ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  }


  const label: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11,
    fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
    color: "#888", marginBottom: 7, display: "block",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }} className="auth-layout">
      <div className="auth-hide-mobile"><AuthLeft /></div>

      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "48px clamp(24px,6vw,80px)",
        background: "#111", minHeight: "100vh",
      }}>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          color: "#666", textDecoration: "none", marginBottom: 48,
          fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12,
          fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          transition: "color .2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f5c518")}
          onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
          <ArrowLeft size={14} /> Voltar ao site
        </Link>

        {success ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
            <h2 className="font-display" style={{ fontSize: 40, color: "#f5f5f0", marginBottom: 10 }}>
              BEM-VINDO, <span style={{ color: "#f5c518" }}>{userName.toUpperCase()}!</span>
            </h2>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Redirecionando para sua conta...</p>
            <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "#f5c518", animation: "fill 1.2s linear forwards", borderRadius: 2 }} />
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 32 }}>
                <h1 className="font-display" style={{ fontSize: "clamp(36px,4vw,52px)", color: "#f5f5f0", lineHeight: 0.92, marginBottom: 10 }}>
                  ENTRAR NA<br /><span style={{ color: "#f5c518" }}>SUA CONTA</span>
                </h1>
              
              <p style={{ fontSize: 14, color: "#888" }}>
                Não tem conta?{" "}
                <Link href="/cadastro" style={{ color: "#f5c518", textDecoration: "none", fontWeight: 600 }}>Cadastre-se grátis</Link>
              </p>
            </div>

            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)",
                borderRadius: 8, padding: "12px 14px", marginBottom: 20,
              }}>
                <AlertCircle size={15} color="#e74c3c" />
                <span style={{ fontSize: 13, color: "#e74c3c", fontFamily: "'Barlow',sans-serif" }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
                {/* Email */}
                <div>
                  <label style={label}>E-mail</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: focused === "email" ? "#f5c518" : "#555", transition: "color .2s" }} />
                    <input
                      type="email" value={email} placeholder="seu@email.com"
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      autoComplete="email" style={inp("email")}
                    />
                  </div>
                </div>

                <div>
                  <label style={label}>Senha</label>

                  <div style={{position:"relative"}}>

                  <Lock 
                  size={15}
                  style={{
                  position:"absolute",
                  left:15,
                  top:"50%",
                  transform:"translateY(-50%)",
                  color: focused === "password" ? "#f5c518" : "#555"
                  }}
                  />


                  <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  onChange={e => {
                  setPassword(e.target.value)
                  setError("")
                  }}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  style={inp("password")}
                  />


                  <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                  position:"absolute",
                  right:14,
                  top:"50%",
                  transform:"translateY(-50%)",
                  background:"none",
                  border:"none",
                  color:"#777",
                  cursor:"pointer"
                  }}
                  >
                  {
                  showPassword 
                  ? <EyeOff size={16}/>
                  : <Eye size={16}/>
                  }
                  </button>

                  </div>
                  </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="btn-gold"
                  style={{
                    height: 52, borderRadius: 8, border: "none",
                    cursor: loading ? "wait" : "pointer", fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: loading ? 0.8 : 1, marginTop: 4,
                  }}>
                  {loading ? <><Spinner /> Entrando...</> : "Entrar na conta →"}
                </button>
              </form>
            

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span className="font-condensed" style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>OU</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Trust */}
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              {["🔒 Seguro", "📧 Sem spam", "❌ Sem taxas ocultas"].map(t => (
                <span key={t} className="font-condensed" style={{ fontSize: 10, color: "#333", letterSpacing: "0.05em" }}>{t}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media(max-width:768px){ .auth-layout{grid-template-columns:1fr!important} .auth-hide-mobile{display:none!important} }
        @keyframes fill{from{width:0}to{width:100%}}
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: "spin .8s linear infinite" }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}
