"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, CreditCard, AlertCircle, Check } from "lucide-react";
import AuthLeft from "@/components/ui/AuthLeft";
import { useToast } from "@/components/ui/Toast";
import { AuthContext } from "@/contexts/authContext";

function maskCPF(v: string) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  return v;
}

function maskTel(v: string) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  if (v.length > 2) return v.replace(/(\d{2})(\d+)/, "($1) $2");
  return v;
}

function getStrength(p: string): number {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) || /[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

const strengthLabel = ["", "Fraca", "Razoável", "Boa", "Forte"];
const strengthColor = ["", "#e74c3c", "#f5c518", "#f5c518", "#22C55E"];

export default function CadastroPage() {
  const router = useRouter();
  const { handleRegister, user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  //useEffect(() => { if (user) router.replace("/conta"); }, [user, router]);

  const strength = getStrength(password);

  const inp = (field: string, withIconRight = false): React.CSSProperties => ({
    width: "100%", height: 48,
    paddingLeft: 44,
    paddingRight: withIconRight ? 44 : 14,
    background: "#0d0d0d",
    border: `1.5px solid ${focused === field ? "#f5c518" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 8, color: "#f5f5f0", fontSize: 14,
    fontFamily: "'Barlow', sans-serif", outline: "none",
    transition: "border-color .2s, box-shadow .2s",
    boxShadow: focused === field ? "0 0 0 3px rgba(245,197,24,0.1)" : "none",
  });

  const label: React.CSSProperties = {
    fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11,
    fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
    color: "#888", marginBottom: 6, display: "block",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try{
      e.preventDefault();
      if (!nome || !email ) { setError("Preencha os campos obrigatórios."); return; }
      //if (password !== password2) { setError("As senhas não coincidem."); return; }
      //if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
      if (!terms) { setError("Aceite os termos de uso para continuar."); return; }
      setError(""); setLoading(true);
      const res = await handleRegister({ name: nome + (sobrenome ? " " + sobrenome : ""), email, cpf, phone: tel });
      setLoading(false);
      setSuccess(true);
      showToast("Conta criada com sucesso! Bem-vindo(a) 👑", "success", "🎉");
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Erro ao criar conta. Tente novamente.");
    }
  };

  const IconWrap = ({ icon: Icon, field }: { icon: React.ElementType; field: string }) => (
    <Icon size={14} style={{
      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
      color: focused === field ? "#f5c518" : "#444", transition: "color .2s",
      pointerEvents: "none",
    }} />
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }} className="auth-layout">
      <div className="auth-hide-mobile"><AuthLeft /></div>

      {/* Right panel */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "40px clamp(20px,5vw,72px)",
        background: "#111", minHeight: "100vh", overflowY: "auto",
      }}>
        <Link href="/login" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          color: "#666", textDecoration: "none", marginBottom: 36,
          fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12,
          fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          transition: "color .2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f5c518")}
          onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
          <ArrowLeft size={14} /> Já tenho conta
        </Link>

        {success ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
            <h2 className="font-display" style={{ fontSize: 40, color: "#f5f5f0", marginBottom: 10 }}>
              CONTA <span style={{ color: "#f5c518" }}>CRIADA!</span>
            </h2>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Bem-vindo(a) à família Seven. Redirecionando...</p>
            <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "#f5c518", animation: "fillBar 1.4s linear forwards", borderRadius: 2 }} />
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 className="font-display" style={{ fontSize: "clamp(32px,3.5vw,48px)", color: "#f5f5f0", lineHeight: 0.92, marginBottom: 10 }}>
                CRIAR SUA<br /><span style={{ color: "#f5c518" }}>CONTA</span>
              </h1>
              <p style={{ fontSize: 13, color: "#888" }}>
                Já tem conta?{" "}
                <Link href="/login" style={{ color: "#f5c518", textDecoration: "none", fontWeight: 600 }}>Fazer login</Link>
              </p>
            </div>

            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)",
                borderRadius: 8, padding: "11px 14px", marginBottom: 18,
              }}>
                <AlertCircle size={14} color="#e74c3c" />
                <span style={{ fontSize: 12, color: "#e74c3c", fontFamily: "'Barlow',sans-serif" }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Nome + Sobrenome */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={label}>Nome <span style={{ color: "#e74c3c" }}>*</span></label>
                  <div style={{ position: "relative" }}>
                    <IconWrap icon={User} field="nome" />
                    <input
                      type="text" value={nome} placeholder="Miguel"
                      onChange={e => { setNome(e.target.value); setError(""); }}
                      onFocus={() => setFocused("nome")} onBlur={() => setFocused(null)}
                      autoComplete="given-name" style={inp("nome")}
                    />
                  </div>
                </div>
                <div>
                  <label style={label}>Sobrenome</label>
                  <div style={{ position: "relative" }}>
                    <IconWrap icon={User} field="sobrenome" />
                    <input
                      type="text" value={sobrenome} placeholder="Silva"
                      onChange={e => setSobrenome(e.target.value)}
                      onFocus={() => setFocused("sobrenome")} onBlur={() => setFocused(null)}
                      autoComplete="family-name" style={inp("sobrenome")}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={label}>E-mail <span style={{ color: "#e74c3c" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <IconWrap icon={Mail} field="email" />
                  <input
                    type="email" value={email} placeholder="seu@email.com"
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    autoComplete="email" style={inp("email")}
                  />
                </div>
              </div>

              {/* CPF + Telefone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={label}>CPF</label>
                  <div style={{ position: "relative" }}>
                    <IconWrap icon={CreditCard} field="cpf" />
                    <input
                      type="text" value={cpf} placeholder="000.000.000-00"
                      onChange={e => setCpf(maskCPF(e.target.value))}
                      onFocus={() => setFocused("cpf")} onBlur={() => setFocused(null)}
                      style={inp("cpf")}
                    />
                  </div>
                </div>
                <div>
                  <label style={label}>Telefone</label>
                  <div style={{ position: "relative" }}>
                    <IconWrap icon={Phone} field="tel" />
                    <input
                      type="tel" value={tel} placeholder="(31) 9 0000-0000"
                      onChange={e => setTel(maskTel(e.target.value))}
                      onFocus={() => setFocused("tel")} onBlur={() => setFocused(null)}
                      style={inp("tel")}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              

              {/* Terms */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <div
                  onClick={() => setTerms(!terms)}
                  style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                    border: `1.5px solid ${terms ? "#f5c518" : "rgba(255,255,255,0.2)"}`,
                    background: terms ? "rgba(245,197,24,0.15)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all .2s",
                  }}>
                  {terms && <Check size={11} color="#f5c518" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 12, color: "#888", lineHeight: 1.55, fontFamily: "'Barlow',sans-serif" }}>
                  Li e aceito os{" "}
                  <Link href="/faq" style={{ color: "#f5c518", textDecoration: "none" }}>termos de uso</Link>{" "}
                  e a{" "}
                  <Link href="/faq" style={{ color: "#f5c518", textDecoration: "none" }}>política de privacidade</Link>{" "}
                  da Seven Import BR.
                </span>
              </label>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-gold"
                style={{
                  height: 52, borderRadius: 8, border: "none",
                  cursor: loading ? "wait" : "pointer", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: loading ? 0.8 : 1, marginTop: 4,
                }}>
                {loading ? <><Spinner /> Criando conta...</> : "Criar minha conta →"}
              </button>

            </form>

            {/* Trust */}
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              {["🔒 Dados seguros", "📧 Sem spam", "❌ Gratuito"].map(t => (
                <span key={t} className="font-condensed" style={{ fontSize: 10, color: "#333", letterSpacing: "0.05em" }}>{t}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media(max-width:768px){ .auth-layout{grid-template-columns:1fr!important} .auth-hide-mobile{display:none!important} }
        @keyframes fillBar{from{width:0}to{width:100%}}
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
