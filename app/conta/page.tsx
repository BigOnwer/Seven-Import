"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Package, Heart, MapPin, CreditCard,
  ChevronRight, Star, ShoppingBag, LogOut, Edit3, Save, X
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/lib/data";
import { useWishlist } from "@/lib/wishlistContext";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { DateFormartter } from "@/utils/formatedBR";
import { API } from "@/lib/axios";

const MOCK_ORDERS = [
  { id: "#S7-2024-001", date: "15/03/2024", status: "Entregue",   total: 899,  items: [products[0]], tracking: "BR123456789" },
  { id: "#S7-2024-002", date: "02/04/2024", status: "Em trânsito", total: 1249, items: [products[1]], tracking: "BR987654321" },
  { id: "#S7-2024-003", date: "18/04/2024", status: "Processando", total: 699,  items: [products[2]], tracking: null },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING:    "#888",
  CONFIRMED:  "#F5C518",
  PROCESSING: "#F5C518",
  SHIPPED:    "#60A5FA",
  DELIVERED:  "#22C55E",
  CANCELLED:  "#e74c3c",
  REFUNDED:   "#e74c3c",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "Aguardando pagamento",
  CONFIRMED:  "Confirmado",
  PROCESSING: "Em separação",
  SHIPPED:    "Em trânsito",
  DELIVERED:  "Entregue",
  CANCELLED:  "Cancelado",
  REFUNDED:   "Reembolsado",
};

const TABS = [
  { id: "pedidos",    label: "Meus Pedidos",  icon: Package    },
  { id: "favoritos",  label: "Favoritos",      icon: Heart      },
  { id: "enderecos",  label: "Endereços",      icon: MapPin     },
  { id: "pagamento",  label: "Pagamento",      icon: CreditCard },
  { id: "perfil",     label: "Meu Perfil",     icon: User       },
];

export default function ContaPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { items: wishItems, toggle } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [tab, setTab] = useState("pedidos");

  // Perfil edit state
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (tab !== "pedidos") return;
    setOrdersLoading(true);
    fetch("/api/orders")
      .then(r => r.json())
      .then(d => setOrders(d.data ?? []))
      .finally(() => setOrdersLoading(false));
  }, [tab]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) { setEditName(user.name); setEditPhone(user.phone || ""); }
  }, [user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Navbar />
        <div className="font-display" style={{ fontSize: 24, color: "var(--gold)" }}>Carregando...</div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    const updateUser = async (data: { name?: string, email?: string, phone?: string }) => {
      try {
        await API.put("/me", data);
      }catch (error) {
        console.error("Erro ao atualizar perfil:", error);
      }
    };
    if (updateUser) updateUser({ name: editName, email: user.email, phone: editPhone });
    setEditMode(false);
    showToast("Perfil atualizado!", "success", "✅");
    router.refresh();
  };

  const handleLogout = () => {
    logout();
    showToast("Você saiu da conta.", "info", "👋");
    router.push("/");
  };

  const s: React.CSSProperties = {
    fontFamily: "'Barlow',sans-serif", fontSize: 14,
    background: "var(--black)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, color: "var(--white)", padding: "10px 14px",
    outline: "none", width: "100%", transition: "border-color .2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />

      {/* Profile header */}
      <div style={{ paddingTop: 108, background: "var(--black-2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold) 0%, #c9a000 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 700, color: "var(--black)",
              fontFamily: "'Barlow Condensed',sans-serif",
              boxShadow: "0 0 0 3px rgba(245,197,24,0.25)",
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-display" style={{ fontSize: 26, color: "var(--white)", lineHeight: 0.95 }}>{user.name.toUpperCase()}</div>
              <div className="font-condensed" style={{ fontSize: 12, color: "var(--gray)", letterSpacing: "0.1em", marginTop: 4 }}>{user.email}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <span className="tag">Membro Seven</span>
                <span className="tag-outline">Desde {DateFormartter.format(new Date(user.createdAt))}</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, padding: "10px 16px", cursor: "pointer", color: "#e74c3c", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", transition: "all .2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(231,76,60,0.2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(231,76,60,0.1)")}>
            <LogOut size={14} /> Sair da conta
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, alignItems: "start" }} className="conta-grid">

        {/* Sidebar */}
        <div style={{ position: "sticky", top: 90 }}>
          <div style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ width: "100%", padding: "13px 18px", background: tab === t.id ? "rgba(245,197,24,0.08)" : "transparent", border: "none", borderLeft: tab === t.id ? "3px solid var(--gold)" : "3px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <t.icon size={15} color={tab === t.id ? "var(--gold)" : "var(--gray)"} />
                  <span className="font-condensed" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", color: tab === t.id ? "var(--gold)" : "var(--white)" }}>{t.label}</span>
                </div>
                <ChevronRight size={13} color="var(--gray)" />
              </button>
            ))}
            <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <a href="https://instagram.com/sevenimportbr" target="_blank"
                className="font-condensed"
                style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.1em", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}>
                📷 @sevenimportbr
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>

          {/* PEDIDOS */}
          {tab === "pedidos" && (
            <div>
              <h2 className="font-display" style={{ fontSize: 32, color: "var(--white)", marginBottom: 24 }}>
                MEUS <span style={{ color: "var(--gold)" }}>PEDIDOS</span>
              </h2>

              {ordersLoading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray)" }}>Carregando pedidos...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <div className="font-display" style={{ fontSize: 28, color: "var(--white)", marginBottom: 8 }}>Nenhum pedido ainda</div>
                  <Link href="/produtos" className="btn-gold" style={{ display: "inline-block", marginTop: 16, padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 14 }}>
                    Ver produtos
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {orders.map(order => (
                    <div key={order.id}
                      style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 20, transition: "border-color .2s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.2)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>

                      {/* Cabeçalho */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div className="font-condensed" style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", letterSpacing: "0.05em" }}>
                            #{order.id.slice(-8).toUpperCase()}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--gray)", marginTop: 2 }}>
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <span className="font-condensed" style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[order.status], letterSpacing: "0.12em", textTransform: "uppercase" }}>
                            ● {STATUS_LABEL[order.status]}
                          </span>
                          <div className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>
                            R$ {Number(order.total).toLocaleString("pt-BR")}
                          </div>
                        </div>
                      </div>

                      {/* Itens */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {order.items.map((item: any) => (
                          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.03)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {item.product.images?.[0]
                                ? <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <span style={{ fontSize: 24 }}>{item.product.emoji}</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="font-condensed" style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.product.name}
                              </div>
                              <div style={{ fontSize: 11, color: "var(--gray)" }}>
                                {item.product.brand}
                                {item.size ? ` · Tam. ${item.size}` : ""}
                                {item.quantity > 1 ? ` · Qtd: ${item.quantity}` : ""}
                              </div>
                            </div>
                            <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", flexShrink: 0 }}>
                              R$ {(Number(item.price) * item.quantity).toLocaleString("pt-BR")}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Rastreio */}
                      {order.trackingCode && (
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Rastreio:</span>
                          <span className="font-condensed" style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>{order.trackingCode}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FAVORITOS */}
          {tab === "favoritos" && (
            <div>
              <h2 className="font-display" style={{ fontSize: 32, color: "var(--white)", marginBottom: 24 }}>MEUS <span style={{ color: "var(--gold)" }}>FAVORITOS</span></h2>
              {wishItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💔</div>
                  <div className="font-display" style={{ fontSize: 28, color: "var(--white)", marginBottom: 8 }}>Lista vazia</div>
                  <Link href="/produtos" className="btn-gold" style={{ display: "inline-block", marginTop: 16, padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 14 }}>Ver produtos</Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
                  {wishItems.map(p => (
                    <div key={p.id} style={{ background: "var(--black-2)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: 10, overflow: "hidden", transition: "all .3s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.35)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.15)"; }}>
                      <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                        <div style={{ height: 130, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{p.emoji}</div>
                      </Link>
                      <div style={{ padding: "10px 12px 14px" }}>
                        <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 2 }}>{p.brand}</div>
                        <div className="font-condensed" style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>{p.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div className="font-display" style={{ fontSize: 18, color: "var(--gold)" }}>R$ {p.price.toLocaleString("pt-BR")}</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { toggle(p); showToast("Removido dos favoritos", "info", "💔"); }}
                              style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", cursor: "pointer", color: "#e74c3c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✕</button>
                            <button onClick={() => { addItem(p, p.sizes[1] || p.sizes[0]); showToast(`${p.name} adicionado!`, "success", "👟"); }}
                              className="btn-gold" style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                              <ShoppingBag size={11} /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ENDEREÇOS */}
          {tab === "enderecos" && (
            <div>
              <h2 className="font-display" style={{ fontSize: 32, color: "var(--white)", marginBottom: 24 }}>
                MEUS <span style={{ color: "var(--gold)" }}>ENDEREÇOS</span>
              </h2>

              {user.address && (
                <div style={{
                  background: "var(--black-2)", border: "1px solid rgba(245,197,24,0.2)",
                  borderRadius: 10, padding: 20, marginBottom: 14, maxWidth: 480,
                }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <MapPin size={13} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6 }}>
                      {user.address}
                    </span>
                  </div>
                </div>
              )}

              <button style={{
                background: "transparent", border: "1px dashed rgba(255,255,255,0.12)",
                borderRadius: 10, padding: 20, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 8, minHeight: 100, minWidth: 200,
                transition: "border-color .2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                <span style={{ fontSize: 24, color: "var(--gray)" }}>+</span>
                <span className="font-condensed" style={{ fontSize: 12, color: "var(--gray)", letterSpacing: "0.1em" }}>
                  Adicionar endereço
                </span>
              </button>
            </div>
          )}

          {/* PAGAMENTO */}
          {tab === "pagamento" && (
            <div>
              <h2 className="font-display" style={{ fontSize: 32, color: "var(--white)", marginBottom: 24 }}>FORMAS DE <span style={{ color: "var(--gold)" }}>PAGAMENTO</span></h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
                {[
                  { emoji: "💳", name: "Cartão de Crédito", desc: "Até 12x sem juros", detail: "•••• •••• •••• 4521" },
                  { emoji: "📱", name: "Pix", desc: "Aprovação imediata · 5% de desconto", detail: "Chave: CPF" },
                  { emoji: "🏦", name: "Boleto Bancário", desc: "Prazo de 1–3 dias úteis", detail: "Gerado no momento da compra" },
                ].map(m => (
                  <div key={m.name} style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center", transition: "border-color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.2)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", marginBottom: 2 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "var(--gray)" }}>{m.desc} · {m.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 28, padding: 18, background: "rgba(245,197,24,0.05)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 10, maxWidth: 480 }}>
                <div className="font-condensed" style={{ fontSize: 12, color: "var(--gold)", marginBottom: 6 }}>💡 Dica da Seven</div>
                <p style={{ fontSize: 12, color: "var(--gray)", lineHeight: 1.65 }}>
                  Confirme seu pedido e combine o pagamento via{" "}
                  <a href="https://instagram.com/sevenimportbr" target="_blank" style={{ color: "var(--gold)", textDecoration: "none" }}>@sevenimportbr</a>.
                  Aceitamos todos os cartões, Pix e transferência bancária.
                </p>
              </div>
            </div>
          )}

          {/* PERFIL */}
          {tab === "perfil" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <h2 className="font-display" style={{ fontSize: 32, color: "var(--white)" }}>MEU <span style={{ color: "var(--gold)" }}>PERFIL</span></h2>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)}
                    style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: 8, padding: "9px 16px", cursor: "pointer", color: "var(--gold)", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <Edit3 size={13} /> Editar
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditMode(false)}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "9px 16px", cursor: "pointer", color: "var(--gray)", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      <X size={13} /> Cancelar
                    </button>
                    <button onClick={handleSaveProfile} className="btn-gold"
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12 }}>
                      <Save size={13} /> Salvar
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 560 }} className="profile-grid">
                {[
                  { label: "Nome completo", value: editMode ? editName : user.name, field: "name", editable: true },
                  { label: "E-mail", value: user.email, field: "email", editable: false },
                  { label: "Telefone", value: editMode ? editPhone : (user.phone || "—"), field: "phone", editable: true },
                  { label: "CPF", value: user.cpf || "—", field: "cpf", editable: false },
                  { label: "Membro desde", value: DateFormartter.format(new Date(user.createdAt)), field: "createdAt", editable: false },
                  { label: "Status", value: "Membro Seven", field: "status", editable: false },
                ].map(item => (
                  <div key={item.field}>
                    <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
                    {editMode && item.editable && item.field !== "email" && item.field !== "cpf" ? (
                      <input
                        value={item.field === "name" ? editName : editPhone}
                        onChange={e => item.field === "name" ? setEditName(e.target.value) : setEditPhone(e.target.value)}
                        style={{ ...s, height: 42 }}
                        onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    ) : (
                      <div style={{ fontSize: 14, color: item.editable ? "var(--white)" : "var(--gray)", fontFamily: "'Barlow',sans-serif", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        {item.field === "status" ? <span className="tag">{item.value}</span> : item.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 36, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.06)", maxWidth: 560 }}>
                <div className="font-condensed" style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Zona de perigo</div>
                <button onClick={handleLogout}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.25)", borderRadius: 8, padding: "11px 18px", cursor: "pointer", color: "#e74c3c", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", transition: "all .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(231,76,60,0.16)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(231,76,60,0.08)")}>
                  <LogOut size={14} /> Sair da conta
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />

      <style>{`
        @media(max-width:860px){ .conta-grid{grid-template-columns:1fr!important} .profile-grid{grid-template-columns:1fr!important} }
      `}</style>
    </div>
  );
}
