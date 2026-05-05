"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, AlertCircle, Code } from "lucide-react";
import AuthLeft from "@/components/ui/AuthLeft";
import { useToast } from "@/components/ui/Toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";


type Step = "email" | "code";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  const [step, setStep] = useState<Step>("email");
  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

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
  
 
  function startResendTimer() {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  }
 
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("code");
      startResendTimer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }
 
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/produtos");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }
 
  async function handleResend() {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      startResendTimer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
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
              {step === "email" ? (
                <h1 className="font-display" style={{ fontSize: "clamp(36px,4vw,52px)", color: "#f5f5f0", lineHeight: 0.92, marginBottom: 10 }}>
                ENTRAR NA<br /><span style={{ color: "#f5c518" }}>SUA CONTA</span>
              </h1>
              ) : (
                <h1 className="font-display" style={{ fontSize: "clamp(36px,4vw,52px)", color: "#f5f5f0", lineHeight: 0.92, marginBottom: 10 }}>
                VERIFICAR<br /><span style={{ color: "#f5c518" }}>E-MAIL</span>
              </h1>
              )}
              
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

            {step === "email" ? (
              <form onSubmit={handleSendCode} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
            ) : (
              <form onSubmit={handleVerifyCode} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Code */}
                <div>
                  <div className="flex gap-1">
                    <Eye size={15} />
                    <label style={label}>Código de verificação</label>
                  </div>
                  <div style={{ position: "relative" }}>
                    
                    <InputOTP maxLength={6} defaultValue="" required onChange={setCode} autoFocus value={code}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="border-neutral-500 w-13 h-13 text-xl"/>
                        <InputOTPSlot index={1} className="border-neutral-500 w-13 h-13 text-xl"/>
                        <InputOTPSlot index={2} className="border-neutral-500 w-13 h-13 text-xl"/>
                        <InputOTPSlot index={3} className="border-neutral-500 w-13 h-13 text-xl"/>
                        <InputOTPSlot index={4} className="border-neutral-500 w-13 h-13 text-xl"/>
                        <InputOTPSlot index={5} className="border-neutral-500 w-13 h-13 text-xl"/>
                      </InputOTPGroup>
                    </InputOTP>
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

                <div className="flex items-center justify-between text-sm pt-1">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setCode(""); setError(""); }}
                  className="text-zinc-500 hover:text-zinc-300 transition"
                >
                  ← Trocar email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="text-zinc-500 hover:text-zinc-300 transition
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : "Reenviar código"}
                </button>
              </div>
              </form>
            )}
            

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
