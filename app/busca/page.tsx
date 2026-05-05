"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, Star, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cartContext";

const SUGGESTIONS = ["Air Force 1", "Jordan 4", "Nike SB", "Air Max", "Off-White", "Timberland", "Vans", "Outlet"];

function BuscaContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inputVal, setInputVal] = useState(searchParams.get("q") || "");
  const { addItem } = useCart();
  const [added, setAdded] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.longDesc.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSearch = (val: string) => {
    setInputVal(val);
    setQuery(val);
  };

  const handleAddCart = (p: typeof products[0]) => {
    addItem(p, p.sizes[1] || p.sizes[0]);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      <div style={{ paddingTop: 108 }}>
        {/* Search hero */}
        <div style={{
          padding: "60px 24px",
          background: "var(--black-2)", borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h1 className="font-display" style={{ fontSize: "clamp(36px,5vw,60px)", color: "var(--white)", textAlign: "center", marginBottom: 32, lineHeight: 0.95 }}>
              BUSCAR <span style={{ color: "var(--gold)" }}>TÊNIS</span>
            </h1>

            {/* Search input */}
            <div style={{ position: "relative" }}>
              <Search size={20} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }} />
              <input
                autoFocus
                value={inputVal}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Ex: Air Force 1, Jordan, Nike..."
                className="font-condensed"
                style={{
                  width: "100%", height: 60, paddingLeft: 52, paddingRight: inputVal ? 48 : 20,
                  background: "var(--black)", border: "1.5px solid rgba(245,197,24,0.3)",
                  borderRadius: 8, color: "var(--white)", fontSize: 18, fontWeight: 500,
                  letterSpacing: "0.04em", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.3)")}
              />
              {inputVal && (
                <button onClick={() => handleSearch("")}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Suggestions */}
            {!query && (
              <div style={{ marginTop: 20 }}>
                <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Sugestões</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => handleSearch(s)} className="font-condensed"
                      style={{
                        padding: "7px 14px", borderRadius: 20, cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                        color: "var(--gray)", fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--gray)"; }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
          {query && (
            <div className="font-condensed" style={{ fontSize: 13, color: "var(--gray)", marginBottom: 28, letterSpacing: "0.05em" }}>
              {results.length > 0
                ? <><span style={{ color: "var(--gold)" }}>{results.length}</span> resultado{results.length !== 1 ? "s" : ""} para "<span style={{ color: "var(--white)" }}>{query}</span>"</>
                : <>Nenhum resultado para "<span style={{ color: "var(--white)" }}>{query}</span>"</>}
            </div>
          )}

          {query && results.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
              <h2 className="font-display" style={{ fontSize: 32, color: "var(--white)", marginBottom: 8 }}>SEM RESULTADOS</h2>
              <p style={{ color: "var(--gray)", marginBottom: 24 }}>Tente buscar por: Nike, Jordan, Air Force, Vans...</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => handleSearch(s)} className="font-condensed"
                    style={{ padding: "8px 16px", borderRadius: 4, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--gray)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div>
              <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,44px)", color: "var(--white)", marginBottom: 24 }}>
                TODOS OS <span style={{ color: "var(--gold)" }}>PRODUTOS</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                {products.map(p => <SearchCard key={p.id} product={p} onAdd={() => handleAddCart(p)} wasAdded={added === p.id} />)}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {results.map(p => <SearchCard key={p.id} product={p} onAdd={() => handleAddCart(p)} wasAdded={added === p.id} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function SearchCard({ product: p, onAdd, wasAdded }: { product: typeof products[0]; onAdd: () => void; wasAdded: boolean }) {
  const [hov, setHov] = useState(false);
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  return (
    <div className="product-card"
      style={{ background: hov ? "var(--black-3)" : "var(--black-2)", border: hov ? "1px solid rgba(245,197,24,0.35)" : "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", transition: "background 0.3s,border 0.3s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, background: "rgba(255,255,255,0.02)", position: "relative" }}>
          <span style={{ transition: "transform 0.3s", transform: hov ? "scale(1.1)" : "scale(1)" }}>{p.emoji}</span>
          {p.tag && <span className="tag" style={{ position: "absolute", top: 10, left: 10 }}>{p.tag}</span>}
          {disc && <span className="font-condensed" style={{ position: "absolute", top: 10, right: 10, background: "#e74c3c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 2 }}>-{disc}%</span>}
        </div>
      </Link>
      <div style={{ padding: "12px 14px 16px" }}>
        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3 }}>{p.brand}</div>
        <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none" }}>
          <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>{p.name}</div>
        </Link>
        <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => <Star key={i} size={9} fill={i <= Math.round(p.stars) ? "var(--gold)" : "none"} color="var(--gold)" />)}
          <span style={{ fontSize: 10, color: "var(--gray)", marginLeft: 2 }}>({p.reviews})</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {p.oldPrice && <div style={{ fontSize: 10, color: "var(--gray)", textDecoration: "line-through", fontFamily: "'Barlow Condensed',sans-serif" }}>R$ {p.oldPrice.toLocaleString("pt-BR")}</div>}
            <div className="font-display" style={{ fontSize: 20, color: "var(--gold)" }}>R$ {p.price.toLocaleString("pt-BR")}</div>
          </div>
          <button onClick={onAdd} className="btn-gold"
            style={{ padding: "8px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5, background: wasAdded ? "#22C55E" : "var(--gold)" }}>
            <ShoppingBag size={12} />{wasAdded ? "✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuscaPage() {
  return <Suspense><BuscaContent /></Suspense>;
}
