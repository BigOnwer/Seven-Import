"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, Lock, ArrowLeft, CreditCard, Smartphone, Building2, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/cartContext";

type Step = "dados" | "entrega" | "pagamento" | "confirmado";

const STEPS: { id: Step; label: string }[] = [
  { id: "dados", label: "Seus dados" },
  { id: "entrega", label: "Entrega" },
  { id: "pagamento", label: "Pagamento" },
  { id: "confirmado", label: "Confirmado" },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("dados");
  const [payMethod, setPayMethod] = useState<"cartao" | "pix" | "boleto">("cartao");
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    nome: "", email: "", cpf: "", telefone: "",
    cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
    cardNumber: "", cardName: "", cardExpiry: "", cardCvv: "",
    frete: "standard",
  });

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const fretes = [
    { id: "standard", label: "PAC", days: "8–12 dias úteis", price: total >= 800 ? 0 : 19.90 },
    { id: "express", label: "SEDEX", days: "3–5 dias úteis", price: total >= 800 ? 0 : 39.90 },
    { id: "express2", label: "SEDEX 10", days: "Próximo dia útil", price: total >= 800 ? 0 : 69.90 },
  ];

  const selectedFrete = fretes.find(f => f.id === form.frete)!;
  const finalTotal = total + selectedFrete.price;

  const handleNext = () => {
    const stepOrder: Step[] = ["dados", "entrega", "pagamento", "confirmado"];
    const idx = stepOrder.indexOf(step);
    if (idx < 3) setStep(stepOrder[idx + 1]);
  };

  const handleFinish = () => {
    setProcessing(true);
    setTimeout(() => {
      clearCart();
      setStep("confirmado");
      setProcessing(false);
    }, 2200);
  };

  const stepIdx = STEPS.findIndex(s => s.id === step);

  const inputStyle = {
    width: "100%", height: 46, padding: "0 14px",
    background: "var(--black)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6, color: "var(--white)", fontSize: 14,
    fontFamily: "'Barlow', sans-serif", outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 11, fontWeight: 600, letterSpacing: "0.15em",
    textTransform: "uppercase" as const, color: "var(--gray)", marginBottom: 6,
    display: "block",
  };

  const fieldGroup = (label: string, field: string, placeholder: string, extra?: React.CSSProperties) => (
    <div style={extra}>
      <label style={labelStyle}>{label}</label>
      <input
        value={form[field as keyof typeof form]}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
      />
    </div>
  );

  if (items.length === 0 && step !== "confirmado") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <Navbar />
        <div style={{ fontSize: 56 }}>🛒</div>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--white)" }}>CARRINHO VAZIO</h1>
        <Link href="/produtos" className="btn-gold" style={{ padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 14 }}>Ver produtos</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      <div style={{ paddingTop: 108 }}>
        {/* Step progress */}
        <div style={{ background: "var(--black-2)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", height: 56 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: i < stepIdx ? "var(--gold)" : i === stepIdx ? "var(--gold)" : "rgba(255,255,255,0.08)",
                    border: i <= stepIdx ? "none" : "1px solid rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s",
                  }}>
                    {i < stepIdx
                      ? <Check size={12} color="var(--black)" strokeWidth={3} />
                      : <span className="font-condensed" style={{ fontSize: 11, fontWeight: 700, color: i === stepIdx ? "var(--black)" : "var(--gray)" }}>{i + 1}</span>
                    }
                  </div>
                  <span className="font-condensed" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: i <= stepIdx ? "var(--white)" : "var(--gray)" }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: i < stepIdx ? "var(--gold)" : "rgba(255,255,255,0.08)", margin: "0 12px", transition: "background 0.3s" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }} className="checkout-grid">

          {/* Left: steps */}
          <div>
            {/* STEP 1: Dados */}
            {step === "dados" && (
              <div>
                <h2 className="font-display" style={{ fontSize: 36, color: "var(--white)", marginBottom: 28 }}>
                  SEUS <span style={{ color: "var(--gold)" }}>DADOS</span>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {fieldGroup("Nome completo", "nome", "Miguel da Silva", { gridColumn: "1/-1" })}
                  {fieldGroup("E-mail", "email", "email@exemplo.com")}
                  {fieldGroup("Telefone", "telefone", "(31) 99999-9999")}
                  {fieldGroup("CPF", "cpf", "000.000.000-00", { gridColumn: "1/-1" })}
                </div>
                <button onClick={handleNext} className="btn-gold" style={{ width: "100%", padding: "15px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Continuar <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: Entrega */}
            {step === "entrega" && (
              <div>
                <h2 className="font-display" style={{ fontSize: 36, color: "var(--white)", marginBottom: 28 }}>
                  ENDEREÇO DE <span style={{ color: "var(--gold)" }}>ENTREGA</span>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  {fieldGroup("CEP", "cep", "00000-000")}
                  {fieldGroup("Estado", "estado", "MG")}
                  {fieldGroup("Cidade", "cidade", "Belo Horizonte", { gridColumn: "1/-1" })}
                  {fieldGroup("Bairro", "bairro", "Centro")}
                  {fieldGroup("Rua / Av.", "rua", "Rua das Flores", { gridColumn: "1/-1" })}
                  {fieldGroup("Número", "numero", "123")}
                  {fieldGroup("Complemento", "complemento", "Apto 12 (opcional)")}
                </div>

                {/* Frete options */}
                <div style={{ marginBottom: 24 }}>
                  <div className="font-condensed" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                    <Truck size={12} style={{ display: "inline", marginRight: 6 }} />Opções de frete
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {fretes.map(f => (
                      <label key={f.id} style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 16px", borderRadius: 8, cursor: "pointer",
                        border: form.frete === f.id ? "1.5px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                        background: form.frete === f.id ? "rgba(245,197,24,0.06)" : "var(--black-3)",
                        transition: "all 0.2s",
                      }}>
                        <input type="radio" name="frete" value={f.id} checked={form.frete === f.id} onChange={() => set("frete", f.id)}
                          style={{ accentColor: "var(--gold)", width: 16, height: 16 }} />
                        <div style={{ flex: 1 }}>
                          <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>{f.label}</div>
                          <div style={{ fontSize: 12, color: "var(--gray)" }}>{f.days}</div>
                        </div>
                        <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: f.price === 0 ? "#22C55E" : "var(--white)" }}>
                          {f.price === 0 ? "GRÁTIS" : `R$ ${f.price.toFixed(2).replace(".", ",")}`}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep("dados")} className="btn-outline" style={{ flex: 1, padding: "14px 0", borderRadius: 6, cursor: "pointer", fontSize: 14, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <ArrowLeft size={15} /> Voltar
                  </button>
                  <button onClick={handleNext} className="btn-gold" style={{ flex: 2, padding: "14px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Continuar <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Pagamento */}
            {step === "pagamento" && (
              <div>
                <h2 className="font-display" style={{ fontSize: 36, color: "var(--white)", marginBottom: 28 }}>
                  FORMA DE <span style={{ color: "var(--gold)" }}>PAGAMENTO</span>
                </h2>

                {/* Method selector */}
                <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                  {([
                    { id: "cartao", label: "Cartão", icon: CreditCard },
                    { id: "pix", label: "Pix", icon: Smartphone },
                    { id: "boleto", label: "Boleto", icon: Building2 },
                  ] as const).map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id)}
                      style={{
                        flex: 1, padding: "14px 8px", borderRadius: 8, cursor: "pointer",
                        border: payMethod === m.id ? "2px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                        background: payMethod === m.id ? "rgba(245,197,24,0.08)" : "transparent",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        transition: "all 0.2s",
                      }}>
                      <m.icon size={20} color={payMethod === m.id ? "var(--gold)" : "var(--gray)"} />
                      <span className="font-condensed" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: payMethod === m.id ? "var(--gold)" : "var(--gray)" }}>{m.label}</span>
                    </button>
                  ))}
                </div>

                {payMethod === "cartao" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    {fieldGroup("Número do cartão", "cardNumber", "0000 0000 0000 0000", { gridColumn: "1/-1" })}
                    {fieldGroup("Nome no cartão", "cardName", "MIGUEL SILVA", { gridColumn: "1/-1" })}
                    {fieldGroup("Validade", "cardExpiry", "MM/AA")}
                    {fieldGroup("CVV", "cardCvv", "000")}
                    <div style={{ gridColumn: "1/-1" }}>
                      <label style={labelStyle}>Parcelas</label>
                      <select style={{ ...inputStyle, cursor: "pointer" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                        {[1,2,3,4,5,6,8,10,12].map(n => (
                          <option key={n} value={n} style={{ background: "#111" }}>
                            {n}x de R$ {(finalTotal / n).toFixed(2).replace(".", ",")} {n === 1 ? "(à vista)" : "sem juros"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {payMethod === "pix" && (
                  <div style={{ background: "var(--black-3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 28, textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: 60, marginBottom: 12 }}>📱</div>
                    <div className="font-display" style={{ fontSize: 24, color: "var(--white)", marginBottom: 8 }}>PAGAMENTO VIA PIX</div>
                    <div style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.7, maxWidth: 340, margin: "0 auto 16px" }}>
                      Após confirmar o pedido, você receberá o QR Code e a chave Pix por e-mail.
                      Aprovação imediata após o pagamento.
                    </div>
                    <div style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 8, padding: "10px 16px", display: "inline-block" }}>
                      <span className="font-condensed" style={{ fontSize: 12, color: "var(--gold)" }}>💡 5% de desconto no Pix!</span>
                    </div>
                  </div>
                )}

                {payMethod === "boleto" && (
                  <div style={{ background: "var(--black-3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 28, textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: 60, marginBottom: 12 }}>🏦</div>
                    <div className="font-display" style={{ fontSize: 24, color: "var(--white)", marginBottom: 8 }}>BOLETO BANCÁRIO</div>
                    <div style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
                      Prazo de compensação: 1–3 dias úteis. O boleto será gerado após a confirmação do pedido e enviado ao seu e-mail.
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                  <Lock size={13} color="var(--gray)" />
                  <span style={{ fontSize: 12, color: "var(--gray)" }}>Pagamento 100% seguro e criptografado</span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep("entrega")} className="btn-outline" style={{ flex: 1, padding: "14px 0", borderRadius: 6, cursor: "pointer", fontSize: 14, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <ArrowLeft size={15} /> Voltar
                  </button>
                  <button onClick={handleFinish} disabled={processing} className="btn-gold"
                    style={{ flex: 2, padding: "14px 0", borderRadius: 6, border: "none", cursor: processing ? "wait" : "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: processing ? 0.85 : 1 }}>
                    {processing ? (
                      <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span> Processando...</>
                    ) : (
                      <><Lock size={15} /> Confirmar Pedido — R$ {finalTotal.toLocaleString("pt-BR")}</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Confirmado */}
            {step === "confirmado" && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: "rgba(34,197,94,0.15)", border: "2px solid #22C55E",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 28px", fontSize: 40,
                }}>✅</div>
                <h2 className="font-display" style={{ fontSize: "clamp(36px,5vw,56px)", color: "var(--white)", marginBottom: 12, lineHeight: 0.95 }}>
                  PEDIDO <span style={{ color: "#22C55E" }}>CONFIRMADO!</span>
                </h2>
                <p style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 32px" }}>
                  Seu pedido foi recebido com sucesso! Entraremos em contato pelo Instagram{" "}
                  <a href="https://instagram.com/sevenimportbr" target="_blank" style={{ color: "var(--gold)", textDecoration: "none" }}>@sevenimportbr</a>{" "}
                  para confirmar os detalhes e o pagamento.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/produtos" className="btn-gold" style={{ padding: "13px 28px", borderRadius: 6, textDecoration: "none", fontSize: 14, display: "inline-block" }}>
                    Continuar comprando
                  </Link>
                  <Link href="/conta" className="btn-outline" style={{ padding: "13px 28px", borderRadius: 6, textDecoration: "none", fontSize: 14, display: "inline-block", background: "transparent" }}>
                    Ver meus pedidos
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right: order summary */}
          {step !== "confirmado" && (
            <div style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 24, position: "sticky", top: 90 }}>
              <h3 className="font-display" style={{ fontSize: 20, color: "var(--white)", marginBottom: 20 }}>RESUMO DO PEDIDO</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.03)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, position: "relative" }}>
                      {item.product.emoji}
                      <span style={{
                        position: "absolute", top: -6, right: -6,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "var(--gold)", color: "var(--black)",
                        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{item.quantity}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="font-condensed" style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product.name}</div>
                      <div style={{ fontSize: 11, color: "var(--gray)" }}>Tam. {item.size}</div>
                    </div>
                    <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", flexShrink: 0 }}>
                      R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="stripe-sep" style={{ marginBottom: 16 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--gray)" }}>Subtotal</span>
                  <span className="font-condensed" style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}>R$ {total.toLocaleString("pt-BR")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--gray)" }}>Frete ({selectedFrete.label})</span>
                  <span className="font-condensed" style={{ fontSize: 13, fontWeight: 600, color: selectedFrete.price === 0 ? "#22C55E" : "var(--white)" }}>
                    {selectedFrete.price === 0 ? "Grátis" : `R$ ${selectedFrete.price.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>
              </div>

              <div className="stripe-sep" style={{ marginBottom: 16 }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total</span>
                <div style={{ textAlign: "right" }}>
                  <div className="font-display" style={{ fontSize: 26, color: "var(--gold)" }}>R$ {finalTotal.toLocaleString("pt-BR")}</div>
                  <div style={{ fontSize: 10, color: "var(--gray)", fontFamily: "'Barlow Condensed',sans-serif" }}>ou 12x de R$ {Math.round(finalTotal / 12).toLocaleString("pt-BR")}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
