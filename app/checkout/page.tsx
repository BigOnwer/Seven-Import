"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Check, Lock, ArrowLeft, CreditCard, Smartphone, Building2, Truck, Tag, X, Copy, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/cartContext";
import MercadoPagoBrick from "./components/MercadoPagoBrick";

type Step = "entrega" | "pagamento" | "resultado";
type Method = "cartao" | "pix" | "boleto";

const STEPS = [
  { id: "entrega",   label: "Entrega"   },
  { id: "pagamento", label: "Pagamento" },
  { id: "resultado", label: "Confirmado"},
];

interface CouponResult {
  id: string; code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number; description?: string;
}

interface PaymentResult {
  status: string; statusDetail: string;
  qrCode?: string; qrCodeBase64?: string;
  boletoUrl?: string; barcode?: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────
function maskCard(v: string)    { return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim(); }
function maskExpiry(v: string)  { return v.replace(/\D/g,"").slice(0,4).replace(/(\d{2})(\d)/,"$1/$2"); }
function maskCPF(v: string)     { return v.replace(/\D/g,"").slice(0,11).replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,"$1.$2.$3-$4"); }
function maskPhone(v: string)   { return v.replace(/\D/g,"").slice(0,11).replace(/(\d{2})(\d{5})(\d)/,"($1) $2-$3"); }

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();

  const [step,      setStep]      = useState<Step>("entrega");
  const [method,    setMethod]    = useState<Method>("cartao");
  const [processing,setProcessing]= useState(false);
  const [error,     setError]     = useState("");
  const [orderId,   setOrderId]   = useState<string | null>(null);
  const [result,    setResult]    = useState<PaymentResult | null>(null);
  const [copied,    setCopied]    = useState(false);

  // Cupom
  const [couponCode,    setCouponCode]    = useState("");
  const [coupon,        setCoupon]        = useState<CouponResult | null>(null);
  const [couponErr,     setCouponErr]     = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  // Frete
  const [freteId, setFreteId] = useState("standard");
  const fretes = [
    { id: "standard", label: "PAC",      days: "8–12 dias úteis",  price: total >= 800 ? 0 : 19.90 },
    { id: "express",  label: "SEDEX",    days: "3–5 dias úteis",   price: total >= 800 ? 0 : 39.90 },
    { id: "express2", label: "SEDEX 10", days: "Próximo dia útil", price: total >= 800 ? 0 : 69.90 },
  ];
  const selectedFrete = fretes.find(f => f.id === freteId)!;

  // Endereço
  const [addr, setAddr] = useState({ cep:"", rua:"", numero:"", complemento:"", bairro:"", cidade:"", estado:"" });
  const setA = (k: string, v: string) => setAddr(p => ({ ...p, [k]: v }));

  // Dados pessoais
  const [payer, setPayer] = useState({ email:"", cpf:"", firstName:"", lastName:"", phone:"" });
  const setP = (k: string, v: string) => setPayer(p => ({ ...p, [k]: v }));

  // Cartão
  const [card, setCard] = useState({ number:"", name:"", expiry:"", cvv:"", installments: 1 });
  const setC = (k: string, v: any) => setCard(p => ({ ...p, [k]: v }));
  const [cardBrand, setCardBrand] = useState("");

  const [cardToken,          setCardToken]          = useState("");
  const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);

  const fetchCep = async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setAddr(prev => ({
        ...prev,
        rua:    data.logradouro ?? prev.rua,
        bairro: data.bairro     ?? prev.bairro,
        cidade: data.localidade ?? prev.cidade,
        estado: data.uf         ?? prev.estado,
      }));
    } catch {}
  };

  // Desconto
  const discount   = coupon
    ? coupon.discountType === "PERCENTAGE"
      ? total * (coupon.discountValue / 100)
      : Math.min(coupon.discountValue, total)
    : 0;
  const finalTotal = Math.max(0, total - discount + selectedFrete.price);

  // ── Aplica cupom ──────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setLoadingCoupon(true); setCouponErr("");
    try {
      const res  = await fetch(`/api/coupons/validate?code=${couponCode.trim()}&orderValue=${total}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cupom inválido");
      setCoupon(data);
    } catch (e: any) { setCouponErr(e.message); setCoupon(null); }
    finally { setLoadingCoupon(false); }
  };

  // ── Avança para pagamento: cria Order PENDING ─────────────────────────────
  const handleNextToPayment = async () => {
    if (!addr.cep || !addr.rua || !addr.numero || !addr.cidade || !addr.estado) {
      setError("Preencha todos os campos obrigatórios."); return;
    }
    setError(""); setProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.product.id, name: i.product.name,
            price: i.product.price, quantity: i.quantity,
            size: i.size ?? null, image: i.product.images?.[0] ?? null,
          })),
          address: addr,
          couponId: coupon?.id ?? null,
          subtotal: total, discount, shipping: selectedFrete.price, total: finalTotal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao criar pedido");
      setOrderId(data.orderId);
      setStep("pagamento");
    } catch (e: any) { setError(e.message); }
    finally { setProcessing(false); }
  };

  const copyPix = () => {
    if (!result?.qrCode) return;
    navigator.clipboard.writeText(result.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Estilos reutilizáveis ─────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width:"100%", height:46, padding:"0 14px",
    background:"var(--black)", border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:6, color:"var(--white)", fontSize:14,
    fontFamily:"'Barlow', sans-serif", outline:"none", transition:"border-color 0.2s",
    boxSizing:"border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily:"'Barlow Condensed', sans-serif", fontSize:11, fontWeight:600,
    letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--gray)",
    marginBottom:6, display:"block",
  };
  const fo = (e: any) => (e.currentTarget.style.borderColor = "var(--gold)");
  const bl = (e: any) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)");

  const field = (label: string, value: string, onChange: (v:string)=>void, placeholder: string, style?: React.CSSProperties) => (
    <div style={style}>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={inputStyle} onFocus={fo} onBlur={bl} />
    </div>
  );

  const stepIdx = STEPS.findIndex(s => s.id === step);

  if (items.length === 0 && step === "entrega") {
    return (
      <div style={{ minHeight:"100vh", background:"var(--black)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
        <Navbar />
        <div style={{ fontSize:56 }}>🛒</div>
        <h1 className="font-display" style={{ fontSize:36, color:"var(--white)" }}>CARRINHO VAZIO</h1>
        <Link href="/produtos" className="btn-gold" style={{ padding:"12px 24px", borderRadius:4, textDecoration:"none", fontSize:14 }}>Ver produtos</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--black)" }}>
      <Navbar />
      <div style={{ paddingTop:108 }}>

        {/* ── Progress bar ── */}
        <div style={{ background:"var(--black-2)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"0 24px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", height:56 }}>
            {STEPS.map((s,i) => (
              <div key={s.id} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length-1 ? 1 : undefined }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background: i<=stepIdx?"var(--gold)":"rgba(255,255,255,0.08)", border: i<=stepIdx?"none":"1px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
                    {i < stepIdx
                      ? <Check size={12} color="var(--black)" strokeWidth={3} />
                      : <span className="font-condensed" style={{ fontSize:11, fontWeight:700, color: i===stepIdx?"var(--black)":"var(--gray)" }}>{i+1}</span>}
                  </div>
                  <span className="font-condensed" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color: i<=stepIdx?"var(--white)":"var(--gray)" }}>{s.label}</span>
                </div>
                {i < STEPS.length-1 && <div style={{ flex:1, height:1, background: i<stepIdx?"var(--gold)":"rgba(255,255,255,0.08)", margin:"0 12px", transition:"background 0.3s" }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 24px 80px", display:"grid", gridTemplateColumns:"1fr 360px", gap:32, alignItems:"start" }} className="checkout-grid">

          {/* ════════════════ COLUNA ESQUERDA ════════════════ */}
          <div>

            {/* ── STEP 1: Entrega ── */}
            {step === "entrega" && (
              <div>
                <h2 className="font-display" style={{ fontSize:36, color:"var(--white)", marginBottom:28 }}>
                  ENDEREÇO DE <span style={{ color:"var(--gold)" }}>ENTREGA</span>
                </h2>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
                  <div>
                    <label style={labelStyle}>CEP</label>
                    <input
                      value={addr.cep}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 8)
                          .replace(/(\d{5})(\d)/, "$1-$2");
                        setA("cep", v);
                      }}
                      onBlur={e => fetchCep(e.target.value)}
                      placeholder="00000-000"
                      style={inputStyle}
                      onFocus={fo}
                      onBlur={(e) => { bl(e); fetchCep(e.target.value); }}
                    />
                  </div>
                  {field("Estado",      addr.estado,      v=>setA("estado",v),      "MG")}
                  {field("Cidade",      addr.cidade,      v=>setA("cidade",v),      "Belo Horizonte", { gridColumn:"1/-1" })}
                  {field("Bairro",      addr.bairro,      v=>setA("bairro",v),      "Centro")}
                  {field("Rua / Av.",   addr.rua,         v=>setA("rua",v),         "Rua das Flores",  { gridColumn:"1/-1" })}
                  {field("Número",      addr.numero,      v=>setA("numero",v),      "123")}
                  {field("Complemento", addr.complemento, v=>setA("complemento",v), "Apto 12 (opcional)")}
                </div>

                {/* Cupom */}
                <div style={{ background:"var(--black-2)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"20px", marginBottom:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                    <Tag size={15} color="var(--gold)" />
                    <span className="font-condensed" style={{ fontSize:12, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--white)" }}>Cupom de desconto</span>
                  </div>
                  {coupon ? (
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:8 }}>
                      <div>
                        <div className="font-condensed" style={{ fontSize:13, fontWeight:700, color:"#22C55E" }}>
                          {coupon.code} — {coupon.discountType==="PERCENTAGE" ? `${coupon.discountValue}% off` : `R$ ${coupon.discountValue} off`}
                        </div>
                        {coupon.description && <div style={{ fontSize:11, color:"var(--gray)", marginTop:2 }}>{coupon.description}</div>}
                      </div>
                      <button onClick={() => { setCoupon(null); setCouponCode(""); }}
                        style={{ background:"none", border:"none", cursor:"pointer", color:"var(--gray)", lineHeight:0, padding:4 }}><X size={16}/></button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display:"flex", gap:8 }}>
                        <input value={couponCode} onChange={e=>{setCouponCode(e.target.value.toUpperCase());setCouponErr("");}}
                          onKeyDown={e=>e.key==="Enter"&&handleApplyCoupon()} placeholder="SEU CUPOM"
                          className="font-condensed" style={{ ...inputStyle, flex:1, letterSpacing:"0.12em" }} onFocus={fo} onBlur={bl}/>
                        <button onClick={handleApplyCoupon} disabled={loadingCoupon} className="font-condensed"
                          style={{ padding:"0 20px", background:"var(--gold)", border:"none", borderRadius:6, color:"var(--black)", fontWeight:700, fontSize:13, cursor:"pointer", opacity:loadingCoupon?0.6:1 }}>
                          {loadingCoupon?"...":"Aplicar"}
                        </button>
                      </div>
                      {couponErr && <div style={{ fontSize:12, color:"#e74c3c", marginTop:8 }}>{couponErr}</div>}
                    </>
                  )}
                </div>

                {/* Frete */}
                <div style={{ marginBottom:24 }}>
                  <div className="font-condensed" style={{ fontSize:11, color:"var(--gold)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
                    <Truck size={12}/> Opções de frete
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {fretes.map(f=>(
                      <label key={f.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:8, cursor:"pointer", border: freteId===f.id?"1.5px solid var(--gold)":"1px solid rgba(255,255,255,0.1)", background: freteId===f.id?"rgba(245,197,24,0.06)":"var(--black-3)", transition:"all 0.2s" }}>
                        <input type="radio" name="frete" value={f.id} checked={freteId===f.id} onChange={()=>setFreteId(f.id)} style={{ accentColor:"var(--gold)", width:16, height:16 }}/>
                        <div style={{ flex:1 }}>
                          <div className="font-condensed" style={{ fontSize:14, fontWeight:700, color:"var(--white)" }}>{f.label}</div>
                          <div style={{ fontSize:12, color:"var(--gray)" }}>{f.days}</div>
                        </div>
                        <div className="font-condensed" style={{ fontSize:15, fontWeight:700, color: f.price===0?"#22C55E":"var(--white)" }}>
                          {f.price===0?"GRÁTIS":`R$ ${f.price.toFixed(2).replace(".",",")}`}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <div style={{ padding:"10px 14px", background:"rgba(231,76,60,0.1)", border:"1px solid rgba(231,76,60,0.3)", borderRadius:6, fontSize:13, color:"#e74c3c", marginBottom:16 }}>{error}</div>}

                <button onClick={handleNextToPayment} disabled={processing} className="btn-gold"
                  style={{ width:"100%", padding:"14px 0", borderRadius:6, border:"none", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:processing?0.8:1 }}>
                  {processing ? "Aguarde..." : <> Continuar <ChevronRight size={16}/> </>}
                </button>
              </div>
            )}

            {/* ── STEP 2: Pagamento ── */}
            {step === "pagamento" && (
              <div>
                <h2 className="font-display" style={{ fontSize:36, color:"var(--white)", marginBottom:28 }}>
                  FORMA DE <span style={{ color:"var(--gold)" }}>PAGAMENTO</span>
                </h2>

                <MercadoPagoBrick
                  orderId={orderId!}
                  amount={finalTotal}
                  onSuccess={(data) => {
                    if (data.status === "approved") clearCart();
                    setResult(data);
                    setStep("resultado");
                  }}
                  onError={(err) => {
                    console.error("Brick error:", err);
                    setError("Erro ao processar pagamento. Tente novamente.");
                  }}
                />

                <div style={{ marginTop:16, display:"flex", gap:10 }}>
                  <button
                    onClick={() => { setStep("entrega"); setError(""); }}
                    className="btn-outline"
                    style={{ padding:"12px 20px", borderRadius:6, cursor:"pointer", fontSize:14, background:"transparent", display:"flex", alignItems:"center", gap:6 }}>
                    <ArrowLeft size={15}/> Voltar
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Resultado ── */}
            {step === "resultado" && result && (
              <div>
                {/* Aprovado */}
                {result.status === "approved" && (
                  <div style={{ textAlign:"center", padding:"40px 0" }}>
                    <div style={{ width:100, height:100, borderRadius:"50%", background:"rgba(34,197,94,0.15)", border:"2px solid #22C55E", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", fontSize:40 }}>✅</div>
                    <h2 className="font-display" style={{ fontSize:"clamp(36px,5vw,56px)", color:"var(--white)", marginBottom:12, lineHeight:0.95 }}>
                      PAGAMENTO <span style={{ color:"#22C55E" }}>APROVADO!</span>
                    </h2>
                    <p style={{ fontSize:15, color:"var(--gray)", lineHeight:1.7, maxWidth:440, margin:"0 auto 32px" }}>
                      Seu pedido foi confirmado e já está sendo preparado.
                    </p>
                    <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                      <Link href="/produtos" className="btn-gold" style={{ padding:"13px 28px", borderRadius:6, textDecoration:"none", fontSize:14, display:"inline-block" }}>Continuar comprando</Link>
                      <Link href="/conta" className="btn-outline" style={{ padding:"13px 28px", borderRadius:6, textDecoration:"none", fontSize:14, display:"inline-block", background:"transparent" }}>Ver meus pedidos</Link>
                    </div>
                  </div>
                )}

                {/* PIX pendente */}
                {result.status === "pending" && result.qrCode && (
                  <div>
                    <h2 className="font-display" style={{ fontSize:36, color:"var(--white)", marginBottom:8 }}>
                      PAGUE O <span style={{ color:"var(--gold)" }}>PIX</span>
                    </h2>
                    <p style={{ fontSize:14, color:"var(--gray)", marginBottom:28 }}>Escaneie o QR Code ou copie o código abaixo. O pedido será confirmado automaticamente.</p>

                    {result.qrCodeBase64 && (
                      <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
                        <div style={{ background:"var(--white)", borderRadius:12, padding:16, display:"inline-block" }}>
                          <img src={`data:image/png;base64,${result.qrCodeBase64}`} alt="QR Code PIX" style={{ width:200, height:200, display:"block" }}/>
                        </div>
                      </div>
                    )}

                    <div style={{ background:"var(--black-2)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:16, marginBottom:20 }}>
                      <div className="font-condensed" style={{ fontSize:10, color:"var(--gray)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:8 }}>Pix copia e cola</div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <div style={{ flex:1, fontSize:11, color:"var(--gray)", wordBreak:"break-all", lineHeight:1.6, fontFamily:"monospace" }}>
                          {result.qrCode.slice(0,60)}...
                        </div>
                        <button onClick={copyPix} className="font-condensed"
                          style={{ flexShrink:0, padding:"10px 16px", background: copied?"rgba(34,197,94,0.15)":"var(--gold)", border: copied?"1px solid rgba(34,197,94,0.4)":"none", borderRadius:6, color: copied?"#22C55E":"var(--black)", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", transition:"all 0.2s" }}>
                          {copied ? <><Check size={14}/> Copiado!</> : <><Copy size={14}/> Copiar</>}
                        </button>
                      </div>
                    </div>

                    <div style={{ padding:"14px 16px", background:"rgba(245,197,24,0.06)", border:"1px solid rgba(245,197,24,0.2)", borderRadius:8, fontSize:13, color:"var(--gold)" }}>
                      ⏳ Aguardando confirmação do pagamento. Você receberá um e-mail assim que for aprovado.
                    </div>
                  </div>
                )}

                {/* Boleto pendente */}
                {result.status === "pending" && result.boletoUrl && (
                  <div>
                    <h2 className="font-display" style={{ fontSize:36, color:"var(--white)", marginBottom:8 }}>
                      BOLETO <span style={{ color:"var(--gold)" }}>GERADO!</span>
                    </h2>
                    <p style={{ fontSize:14, color:"var(--gray)", marginBottom:28 }}>Seu boleto foi gerado. Pague até o vencimento para confirmar o pedido.</p>

                    {result.barcode && (
                      <div style={{ background:"var(--black-2)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:16, marginBottom:20 }}>
                        <div className="font-condensed" style={{ fontSize:10, color:"var(--gray)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:8 }}>Linha digitável</div>
                        <div style={{ fontSize:13, color:"var(--white)", fontFamily:"monospace", wordBreak:"break-all", lineHeight:1.6 }}>{result.barcode}</div>
                      </div>
                    )}

                    <a href={result.boletoUrl} target="_blank" rel="noopener noreferrer" className="btn-gold"
                      style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"14px 28px", borderRadius:6, textDecoration:"none", fontSize:14, marginBottom:16 }}>
                      <ExternalLink size={16}/> Abrir boleto em PDF
                    </a>

                    <div style={{ padding:"14px 16px", background:"rgba(245,197,24,0.06)", border:"1px solid rgba(245,197,24,0.2)", borderRadius:8, fontSize:13, color:"var(--gold)" }}>
                      ⏳ Compensação em 1–3 dias úteis após o pagamento.
                    </div>
                  </div>
                )}

                {/* Falha */}
                {result.status === "rejected" && (
                  <div style={{ textAlign:"center", padding:"40px 0" }}>
                    <div style={{ fontSize:72, marginBottom:16 }}>❌</div>
                    <h2 className="font-display" style={{ fontSize:"clamp(32px,5vw,48px)", color:"#e74c3c", marginBottom:12 }}>PAGAMENTO RECUSADO</h2>
                    <p style={{ fontSize:14, color:"var(--gray)", marginBottom:28, maxWidth:400, margin:"0 auto 28px" }}>
                      Seu pagamento foi recusado. Verifique os dados do cartão ou tente outro método.
                    </p>
                    <button onClick={()=>{setStep("pagamento");setResult(null);setError("");}} className="btn-gold"
                      style={{ padding:"13px 28px", borderRadius:6, border:"none", fontSize:14, cursor:"pointer" }}>
                      Tentar novamente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ════════════════ RESUMO ════════════════ */}
          {step !== "resultado" && (
            <div style={{ background:"var(--black-2)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:24, position:"sticky", top:90 }}>
              <h3 className="font-display" style={{ fontSize:20, color:"var(--white)", marginBottom:20 }}>RESUMO DO PEDIDO</h3>

              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20, maxHeight:260, overflowY:"auto" }}>
                {items.map(item=>(
                  <div key={`${item.product.id}-${item.size}`} style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ width:44, height:44, background:"rgba(255,255,255,0.03)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, position:"relative" }}>
                      {item.product.emoji}
                      <span style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:"var(--gold)", color:"var(--black)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>{item.quantity}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="font-condensed" style={{ fontSize:13, fontWeight:700, color:"var(--white)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.product.name}</div>
                      <div style={{ fontSize:11, color:"var(--gray)" }}>Tam. {item.size}</div>
                    </div>
                    <div className="font-condensed" style={{ fontSize:14, fontWeight:700, color:"var(--white)", flexShrink:0 }}>
                      R$ {(item.product.price*item.quantity).toLocaleString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:16, display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"var(--gray)" }}>Subtotal</span>
                  <span className="font-condensed" style={{ fontSize:13, color:"var(--white)" }}>R$ {total.toLocaleString("pt-BR")}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, color:"#22C55E" }}>Desconto ({coupon!.code})</span>
                    <span className="font-condensed" style={{ fontSize:13, color:"#22C55E" }}>− R$ {discount.toLocaleString("pt-BR")}</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"var(--gray)" }}>Frete ({selectedFrete.label})</span>
                  <span className="font-condensed" style={{ fontSize:13, color: selectedFrete.price===0?"#22C55E":"var(--white)" }}>
                    {selectedFrete.price===0?"Grátis":`R$ ${selectedFrete.price.toFixed(2).replace(".",",")}`}
                  </span>
                </div>
              </div>

              <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span className="font-condensed" style={{ fontSize:15, fontWeight:700, color:"var(--white)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Total</span>
                <div style={{ textAlign:"right" }}>
                  <div className="font-display" style={{ fontSize:26, color:"var(--gold)" }}>R$ {finalTotal.toLocaleString("pt-BR")}</div>
                  <div style={{ fontSize:10, color:"var(--gray)", fontFamily:"'Barlow Condensed',sans-serif" }}>ou 12x de R$ {Math.round(finalTotal/12).toLocaleString("pt-BR")}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .checkout-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}