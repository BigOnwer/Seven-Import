"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, User, Phone, CreditCard, AlertCircle, Check } from "lucide-react";
import AuthLeft from "@/components/ui/AuthLeft";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";

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

export default function CadastroPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [tel, setTel] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  // Após cadastro bem-sucedido, redireciona para /login?email=...
  // para o usuário inserir o código que chegou por email

  const inp = (field: string): React.CSSProperties => ({
    width: "100%", height: 48, paddingLeft: 44, paddingRight: 14,
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
    e.preventDefault();
    if (!nome || !email) { setError("Preencha nome e email."); return; }
    if (!terms) { setError("Aceite os termos para continuar."); return; }

    setError("");
    setLoading(true);

    try {
      await register({
        name: `${nome}${sobrenome ? " " + sobrenome : ""}`,
        email,
        cpf: cpf || undefined,
        phone: tel || undefined,
      });

      showToast("Conta criada! Verifique seu email.", "success", "📧");
      // Redireciona para o login já com o email preenchido
      // e na etapa de código (o send-code já foi disparado pelo register)
      router.push(`/login?email=${encodeURIComponent(email)}&step=code`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar conta.";
      setError(message);
    } finally {
      setLoading(false);
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
        }}>
          <ArrowLeft size={14} /> Já tenho conta
        </Link>

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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={label}>Nome <span style={{ color: "#e74c3c" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <IconWrap icon={User} field="nome" />
                <input type="text" value={nome} placeholder="Miguel"
                  onChange={e => { setNome(e.target.value); setError(""); }}
                  onFocus={() => setFocused("nome")} onBlur={() => setFocused(null)}
                  autoComplete="given-name" style={inp("nome")} />
              </div>
            </div>
            <div>
              <label style={label}>Sobrenome</label>
              <div style={{ position: "relative" }}>
                <IconWrap icon={User} field="sobrenome" />
                <input type="text" value={sobrenome} placeholder="Silva"
                  onChange={e => setSobrenome(e.target.value)}
                  onFocus={() => setFocused("sobrenome")} onBlur={() => setFocused(null)}
                  autoComplete="family-name" style={inp("sobrenome")} />
              </div>
            </div>
          </div>

          <div>
            <label style={label}>E-mail <span style={{ color: "#e74c3c" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <IconWrap icon={Mail} field="email" />
              <input type="email" value={email} placeholder="seu@email.com"
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                autoComplete="email" style={inp("email")} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={label}>CPF</label>
              <div style={{ position: "relative" }}>
                <IconWrap icon={CreditCard} field="cpf" />
                <input type="text" value={cpf} placeholder="000.000.000-00"
                  onChange={e => setCpf(maskCPF(e.target.value))}
                  onFocus={() => setFocused("cpf")} onBlur={() => setFocused(null)}
                  style={inp("cpf")} />
              </div>
            </div>
            <div>
              <label style={label}>Telefone</label>
              <div style={{ position: "relative" }}>
                <IconWrap icon={Phone} field="tel" />
                <input type="tel" value={tel} placeholder="(31) 9 0000-0000"
                  onChange={e => setTel(maskTel(e.target.value))}
                  onFocus={() => setFocused("tel")} onBlur={() => setFocused(null)}
                  style={inp("tel")} />
              </div>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <div onClick={() => setTerms(!terms)} style={{
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
              <Link href="/faq" style={{ color: "#f5c518", textDecoration: "none" }}>política de privacidade</Link>.
            </span>
          </label>

          <button type="submit" disabled={loading} className="btn-gold"
            style={{
              height: 52, borderRadius: 8, border: "none",
              cursor: loading ? "wait" : "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: loading ? 0.8 : 1, marginTop: 4,
            }}>
            {loading ? "Criando conta..." : "Criar minha conta →"}
          </button>
        </form>
      </div>

      <style>{`
        @media(max-width:768px){ .auth-layout{grid-template-columns:1fr!important} .auth-hide-mobile{display:none!important} }
      `}</style>
    </div>
  );
}