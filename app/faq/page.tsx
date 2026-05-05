"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    category: "Pedidos",
    emoji: "📦",
    items: [
      { q: "Como faço um pedido?", a: "Você pode adicionar produtos ao carrinho pelo site e finalizar o checkout. Após o pedido, entraremos em contato pelo Instagram @sevenimportbr para confirmar os detalhes e o pagamento." },
      { q: "Posso cancelar meu pedido?", a: "Sim! Cancele antes do envio entrando em contato pelo Instagram. Após o envio, o produto precisa ser devolvido para processarmos o reembolso." },
      { q: "Como rastreio meu pedido?", a: "Após o envio, você receberá o código de rastreamento via DM no Instagram. Você pode acompanhar pelo site dos Correios ou da transportadora." },
      { q: "Posso alterar o endereço após o pedido?", a: "Sim, desde que o produto não tenha sido despachado. Entre em contato imediatamente pelo @sevenimportbr." },
    ],
  },
  {
    category: "Pagamento",
    emoji: "💳",
    items: [
      { q: "Quais formas de pagamento aceitam?", a: "Aceitamos cartão de crédito (até 12x sem juros), Pix (com 5% de desconto) e boleto bancário. O pagamento é confirmado via Instagram." },
      { q: "O parcelamento tem juros?", a: "Não! Parcelamos em até 12x sem nenhum acréscimo. O valor da parcela é o preço total dividido pelo número de parcelas escolhido." },
      { q: "É seguro comprar pelo site?", a: "Sim! Todos os dados são protegidos com criptografia. Além disso, você pode confirmar tudo pelo nosso Instagram verificado @sevenimportbr." },
      { q: "Posso pagar metade no cartão e metade no Pix?", a: "Sim! Entre em contato pelo Instagram e vamos resolver da melhor forma para você." },
    ],
  },
  {
    category: "Entrega",
    emoji: "🚀",
    items: [
      { q: "Vocês entregam em todo o Brasil?", a: "Sim! Enviamos para todos os estados brasileiros via Correios (PAC e SEDEX) ou transportadora." },
      { q: "Qual o prazo de entrega?", a: "PAC: 8–12 dias úteis. SEDEX: 3–5 dias úteis. SEDEX 10: próximo dia útil. Os prazos são a partir da postagem e variam de acordo com o destino." },
      { q: "O frete é grátis?", a: "Sim! Pedidos acima de R$ 800 têm frete grátis para todo o Brasil. Abaixo desse valor, o frete é calculado no checkout." },
      { q: "E se o produto demorar além do prazo?", a: "Entre em contato pelo @sevenimportbr. Acompanharemos junto com você e resolveremos qualquer problema com os Correios." },
    ],
  },
  {
    category: "Produto",
    emoji: "👟",
    items: [
      { q: "Os produtos são originais?", a: "100% sim! Todos os produtos vendidos pela Seven Import BR são originais e passam por verificação antes de serem listados. Garantimos autenticidade em cada par." },
      { q: "Como escolher o tamanho certo?", a: "Recomendamos comprar o mesmo tamanho que você usa normalmente. Em caso de dúvida, entre em contato antes de fechar o pedido — podemos ajudar!" },
      { q: "Os produtos vêm na caixa original?", a: "Sim! Todos os produtos acompanham a caixa original do fabricante, manuais e acessórios inclusos." },
      { q: "Vocês têm loja física?", a: "No momento operamos apenas online. Isso nos permite oferecer os melhores preços sem custos de aluguel. Mas você pode agendar uma visita presencial em BH pelo Instagram!" },
    ],
  },
  {
    category: "Troca e Devolução",
    emoji: "🔄",
    items: [
      { q: "Posso trocar de tamanho?", a: "Sim! Aceitamos troca de tamanho em até 7 dias após o recebimento, desde que o produto esteja em perfeito estado, sem uso e na caixa original. O frete de retorno é por conta do cliente." },
      { q: "E se o produto chegar com defeito?", a: "Nesse caso, o frete de devolução é por nossa conta. Entre em contato imediatamente pelo @sevenimportbr com fotos e vídeos do problema." },
      { q: "Como faço uma devolução?", a: "Entre em contato pelo Instagram, explique o motivo e aguarde nossas instruções. O reembolso é processado em até 5 dias úteis após o recebimento do produto devolvido." },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const toggle = (key: string) => {
    setOpenItems(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const filteredFaqs = faqs
    .filter(cat => activeCategory === "Todos" || cat.category === activeCategory)
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* Header */}
      <section style={{
        paddingTop: 108, paddingBottom: 60, textAlign: "center",
        background: "var(--black-2)", borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden",
      }}>
        <div className="font-display" style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          fontSize: "clamp(80px,14vw,180px)", color: "rgba(245,197,24,0.04)",
          pointerEvents: "none", whiteSpace: "nowrap",
        }}>FAQ</div>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <span className="tag" style={{ display: "inline-block", marginBottom: 16 }}>Perguntas frequentes</span>
          <h1 className="font-display" style={{ fontSize: "clamp(40px,6vw,72px)", color: "var(--white)", lineHeight: 0.9, marginBottom: 16 }}>
            COMO PODEMOS<br /><span style={{ color: "var(--gold)" }}>AJUDAR?</span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 32, lineHeight: 1.7 }}>
            Encontre respostas para as dúvidas mais comuns. Não encontrou? Fale com a gente no Instagram.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
            <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar pergunta..."
              className="font-condensed"
              style={{
                width: "100%", height: 50, paddingLeft: 48, paddingRight: 20,
                background: "var(--black)", border: "1.5px solid rgba(245,197,24,0.25)",
                borderRadius: 8, color: "var(--white)", fontSize: 15, fontWeight: 500, outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.25)")}
            />
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40, justifyContent: "center" }}>
          {["Todos", ...faqs.map(f => f.category)].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className="font-condensed"
              style={{
                padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
                background: activeCategory === cat ? "var(--gold)" : "transparent",
                color: activeCategory === cat ? "var(--black)" : "var(--gray)",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}>
              {cat}
            </button>
          ))}
        </div>

        {filteredFaqs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
            <div className="font-display" style={{ fontSize: 28, color: "var(--white)", marginBottom: 8 }}>SEM RESULTADOS</div>
            <p style={{ color: "var(--gray)", marginBottom: 24 }}>Não encontrou o que precisa? Fale conosco!</p>
            <a href="https://instagram.com/sevenimportbr" target="_blank" className="btn-gold"
              style={{ padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 14, display: "inline-block" }}>
              Ir para o Instagram
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {filteredFaqs.map(cat => (
              <div key={cat.category}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 22 }}>{cat.emoji}</span>
                  <h2 className="font-display" style={{ fontSize: 28, color: "var(--white)" }}>{cat.category}</h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {cat.items.map((item, idx) => {
                    const key = `${cat.category}-${idx}`;
                    const isOpen = openItems.includes(key);
                    return (
                      <div key={key}
                        style={{
                          background: isOpen ? "var(--black-3)" : "var(--black-2)",
                          border: isOpen ? "1px solid rgba(245,197,24,0.25)" : "1px solid rgba(255,255,255,0.04)",
                          borderRadius: 8, overflow: "hidden",
                          marginBottom: 4,
                          transition: "all 0.2s",
                        }}>
                        <button onClick={() => toggle(key)}
                          style={{
                            width: "100%", padding: "18px 20px",
                            background: "transparent", border: "none", cursor: "pointer",
                            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                            textAlign: "left",
                          }}>
                          <span className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: isOpen ? "var(--gold)" : "var(--white)", letterSpacing: "0.03em", lineHeight: 1.4 }}>
                            {item.q}
                          </span>
                          <ChevronDown size={18} color={isOpen ? "var(--gold)" : "var(--gray)"}
                            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", flexShrink: 0 }} />
                        </button>
                        {isOpen && (
                          <div style={{ padding: "0 20px 20px" }}>
                            <div style={{ height: 1, background: "rgba(245,197,24,0.15)", marginBottom: 16 }} />
                            <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.75, margin: 0 }}>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: 60, background: "rgba(245,197,24,0.05)",
          border: "1px solid rgba(245,197,24,0.2)", borderRadius: 12,
          padding: "32px 40px", textAlign: "center",
        }}>
          <div className="font-display" style={{ fontSize: 26, color: "var(--white)", marginBottom: 8 }}>
            AINDA TEM DÚVIDAS?
          </div>
          <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 20, lineHeight: 1.65 }}>
            Nossa equipe está disponível no Instagram para responder qualquer pergunta.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://instagram.com/sevenimportbr" target="_blank" className="btn-gold"
              style={{ padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 13, display: "inline-block" }}>
              📷 @sevenimportbr
            </a>
            <Link href="/produtos" className="btn-outline"
              style={{ padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 13, display: "inline-block", background: "transparent" }}>
              Ver produtos
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
