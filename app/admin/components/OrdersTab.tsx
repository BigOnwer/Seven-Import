"use client";
import { useEffect, useState } from "react";
import { Trash2, ChevronDown, Package, User, Calendar, CreditCard, Tag } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "CONFIRMED",  label: "Confirmado",   color: "#F5C518" },
  { value: "PROCESSING", label: "Em separação", color: "#60A5FA" },
  { value: "SHIPPED",    label: "Enviado",       color: "#A78BFA" },
  { value: "DELIVERED",  label: "Entregue",      color: "#22C55E" },
  { value: "CANCELLED",  label: "Cancelado",     color: "#e74c3c" },
  { value: "REFUNDED",   label: "Reembolsado",   color: "#F97316" },
];

const METHOD_LABEL: Record<string, string> = {
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD:  "Cartão de Débito",
  PIX:         "Pix",
  BOLETO:      "Boleto",
};

function StatusBadge({ status }: { status: string }) {
  const opt = STATUS_OPTIONS.find(s => s.value === status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      background: `${opt?.color}18`,
      border: `1px solid ${opt?.color}40`,
      color: opt?.color ?? "var(--gray)",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: opt?.color, display: "inline-block" }} />
      {opt?.label ?? status}
    </span>
  );
}

export default function OrdersTab() {
  const [orders, setOrders]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/orders")
      .then(r => r.json())
      .then(d => setOrders(d.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdating(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este pedido permanentemente?")) return;
    await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    setOrders(prev => prev.filter(o => o.id !== id));
    if (expanded === id) setExpanded(null);
  };

  // ── styles ────────────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: "var(--black-2)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10,
    overflow: "hidden",
    transition: "border-color 0.2s",
  };

  const th: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
    textTransform: "uppercase", color: "var(--gray)",
    padding: "10px 16px", textAlign: "left" as const,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    whiteSpace: "nowrap" as const,
  };

  const td: React.CSSProperties = {
    padding: "14px 16px",
    fontSize: 13, color: "var(--white)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    verticalAlign: "middle" as const,
  };

  const selectStyle: React.CSSProperties = {
    background: "var(--black)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6, padding: "6px 10px",
    color: "var(--white)",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 12, fontWeight: 600,
    cursor: "pointer", outline: "none",
    opacity: updating ? 0.6 : 1,
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray)" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
      <div className="font-condensed" style={{ fontSize: 13, letterSpacing: "0.1em" }}>Carregando pedidos...</div>
    </div>
  );

  if (orders.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
      <div className="font-display" style={{ fontSize: 28, color: "var(--white)", marginBottom: 6 }}>Nenhum pedido ainda</div>
      <div style={{ fontSize: 13, color: "var(--gray)" }}>Pedidos pagos aparecerão aqui.</div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 className="font-display" style={{ fontSize: 32, color: "var(--white)" }}>
          PEDIDOS <span style={{ color: "var(--gold)" }}>({orders.length})</span>
        </h2>
        <button onClick={load} style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 6, padding: "8px 14px", cursor: "pointer", color: "var(--gold)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>
          ↻ Atualizar
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {orders.map(order => (
          <div key={order.id} style={{ ...card, borderColor: expanded === order.id ? "rgba(245,197,24,0.25)" : "rgba(255,255,255,0.06)" }}>

            {/* ── Row principal ── */}
            <div
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto auto", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" }}
            >
              {/* ID + data */}
              <div>
                <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", letterSpacing: "0.05em" }}>
                  #{order.id.slice(-8).toUpperCase()}
                </div>
                <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={10} />
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {/* Cliente */}
              <div style={{ textAlign: "right" as const }}>
                <div style={{ fontSize: 13, color: "var(--white)", fontWeight: 600 }}>{order.user?.name ?? "—"}</div>
                <div style={{ fontSize: 11, color: "var(--gray)" }}>{order.user?.email}</div>
              </div>

              {/* Total */}
              <div className="font-display" style={{ fontSize: 20, color: "var(--gold)", whiteSpace: "nowrap" as const }}>
                R$ {Number(order.total).toLocaleString("pt-BR")}
              </div>

              {/* Status badge + select */}
              <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StatusBadge status={order.status} />
                <select
                  value={order.status}
                  disabled={!!updating}
                  onChange={e => handleStatus(order.id, e.target.value)}
                  style={selectStyle}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Delete */}
              <button
                onClick={e => { e.stopPropagation(); handleDelete(order.id); }}
                style={{ background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)", borderRadius: 6, padding: "7px 10px", cursor: "pointer", color: "#e74c3c", display: "flex", alignItems: "center", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(231,76,60,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(231,76,60,0.08)"; }}
              >
                <Trash2 size={14} />
              </button>

              {/* Expand chevron */}
              <ChevronDown size={16} color="var(--gray)" style={{ transform: expanded === order.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </div>

            {/* ── Detalhe expandido ── */}
            {expanded === order.id && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* Info cliente */}
                <div>
                  <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                    <User size={10} style={{ display: "inline", marginRight: 4 }} /> Cliente
                  </div>
                  {[
                    { label: "Nome",     value: order.user?.name  ?? "—" },
                    { label: "E-mail",   value: order.user?.email ?? "—" },
                    { label: "Telefone", value: order.user?.phone ?? "—" },
                    { label: "CPF",      value: order.user?.cpf   ?? "—" },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: 12, color: "var(--gray)" }}>{row.label}</span>
                      <span style={{ fontSize: 12, color: "var(--white)", fontWeight: 600 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Info pedido */}
                <div>
                  <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                    <CreditCard size={10} style={{ display: "inline", marginRight: 4 }} /> Pedido
                  </div>
                  {[
                    { label: "Pagamento",  value: METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod },
                    { label: "Subtotal",   value: `R$ ${Number(order.subtotal).toLocaleString("pt-BR")}` },
                    { label: "Desconto",   value: `R$ ${Number(order.discount).toLocaleString("pt-BR")}` },
                    { label: "Frete",      value: `R$ ${Number(order.shipping).toLocaleString("pt-BR")}` },
                    { label: "Cupom",      value: order.coupon?.code ?? "—" },
                    { label: "Endereço",   value: `${order.address}, ${order.city} - ${order.state}` },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: 12, color: "var(--gray)" }}>{row.label}</span>
                      <span style={{ fontSize: 12, color: "var(--white)", fontWeight: 600, textAlign: "right", maxWidth: 200 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Itens */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div className="font-condensed" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                    <Package size={10} style={{ display: "inline", marginRight: 4 }} /> Itens ({order.items.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {order.items.map((item: any) => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--black)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 6, overflow: "hidden", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {item.product.images?.[0]
                            ? <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span style={{ fontSize: 20 }}>{item.product.emoji}</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="font-condensed" style={{ fontSize: 13, fontWeight: 700, color: "var(--white)" }}>{item.product.name}</div>
                          <div style={{ fontSize: 11, color: "var(--gray)" }}>
                            {item.product.brand}
                            {item.size ? ` · Tam. ${item.size}` : ""}
                            {` · Qtd: ${item.quantity}`}
                          </div>
                        </div>
                        <div className="font-condensed" style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>
                          R$ {(Number(item.price) * item.quantity).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}