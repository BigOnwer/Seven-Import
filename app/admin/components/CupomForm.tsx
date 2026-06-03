"use client";
import { useState, useId } from "react";

// ─── tipos ────────────────────────────────────────────────────────────────────
type DiscountType = "PERCENTAGE" | "FIXED";
type CouponStatus  = "ACTIVE" | "INACTIVE";

interface CouponFormData {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  minOrderValue: string;
  maxUses: string;
  expiresAt: string;
  status: CouponStatus;
  singleUsePerUser: boolean;
}

const INITIAL: CouponFormData = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderValue: "",
  maxUses: "",
  expiresAt: "",
  status: "ACTIVE",
  singleUsePerUser: false,
};

// ─── helpers ──────────────────────────────────────────────────────────────────
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ─── ícones ───────────────────────────────────────────────────────────────────
const IconPercent = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);
const IconDollar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconTag = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

// ─── componente ───────────────────────────────────────────────────────────────
interface Props {
  onSubmit?: (data: CouponFormData) => Promise<void> | void;
}

export default function CouponForm({ onSubmit }: Props) {
  const uid = useId();
  const [form, setForm]       = useState<CouponFormData>(INITIAL);
  const [errors, setErrors]   = useState<Partial<Record<keyof CouponFormData, string>>>({});
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);

  // ── handlers ────────────────────────────────────────────────────────────────
  const set = <K extends keyof CouponFormData>(key: K, value: CouponFormData[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
    setSuccess(false);
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.code.trim())          e.code          = "Código obrigatório";
    if (!form.discountValue)        e.discountValue  = "Valor obrigatório";
    else if (isNaN(Number(form.discountValue)) || Number(form.discountValue) <= 0)
                                    e.discountValue  = "Valor inválido";
    else if (form.discountType === "PERCENTAGE" && Number(form.discountValue) > 100)
                                    e.discountValue  = "Máximo 100%";
    if (form.maxUses && (isNaN(Number(form.maxUses)) || Number(form.maxUses) < 1))
                                    e.maxUses        = "Número inteiro positivo";
    if (form.minOrderValue && isNaN(Number(form.minOrderValue)))
                                    e.minOrderValue  = "Valor inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit?.(form);
      setSuccess(true);
      setForm(INITIAL);
    } catch {
      setErrors({ code: "Erro ao salvar cupom. Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --black:      #0a0a0a;
          --surface:    #111111;
          --surface2:   #161616;
          --border:     #222222;
          --border-hi:  #2e2e2e;
          --gold-dim:   #8a6f2e;
          --gold-glow:  rgba(201,168,76,.15);
          --text:       #e8e2d5;
          --muted:      #5a5550;
          --danger:     #c0443a;
          --success:    #4a9e6e;
        }

        .cf-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

        .cf-wrap {
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          max-width: 680px;
        }

        /* header */
        .cf-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 28px;
        }
        .cf-header-icon {
          width: 38px; height: 38px; border-radius: 8px;
          background: var(--gold-glow);
          border: 1px solid rgba(201,168,76,.25);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
          flex-shrink: 0;
        }
        .cf-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600;
          color: var(--gold);
          letter-spacing: .03em;
          line-height: 1;
        }
        .cf-subtitle {
          font-size: 12px; color: var(--muted);
          margin-top: 3px; letter-spacing: .02em;
        }

        /* card */
        .cf-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 24px;
          display: flex; flex-direction: column; gap: 20px;
        }

        /* section label */
        .cf-section {
          font-size: 10px; font-weight: 500;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--gold-dim);
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 4px;
        }

        /* field */
        .cf-field { display: flex; flex-direction: column; gap: 6px; }
        .cf-label {
          font-size: 11px; font-weight: 500;
          letter-spacing: .06em; text-transform: uppercase;
          color: var(--muted);
        }

        /* input wrapper */
        .cf-input-wrap {
          position: relative;
          display: flex; align-items: center;
        }
        .cf-input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
          -webkit-appearance: none;
        }
        .cf-input::placeholder { color: var(--muted); }
        .cf-input:focus {
          border-color: rgba(201,168,76,.5);
          box-shadow: 0 0 0 3px rgba(201,168,76,.07);
        }
        .cf-input.error { border-color: var(--danger); }
        .cf-input.has-suffix { padding-right: 48px; }
        .cf-input.has-prefix { padding-left: 38px; }
        .cf-input.monospace {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 14px; letter-spacing: .08em;
          text-transform: uppercase;
        }

        .cf-input-suffix, .cf-input-prefix {
          position: absolute;
          font-size: 11px; font-weight: 500;
          color: var(--muted);
          pointer-events: none;
          letter-spacing: .04em;
        }
        .cf-input-suffix { right: 14px; }
        .cf-input-prefix { left: 14px; }

        /* generate button */
        .cf-gen-btn {
          position: absolute; right: 8px;
          background: rgba(201,168,76,.1);
          border: 1px solid rgba(201,168,76,.2);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 10px; font-weight: 500; letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--gold);
          cursor: pointer;
          display: flex; align-items: center; gap: 4px;
          transition: background .15s, border-color .15s;
          white-space: nowrap;
        }
        .cf-gen-btn:hover {
          background: rgba(201,168,76,.18);
          border-color: rgba(201,168,76,.4);
        }

        /* error msg */
        .cf-error {
          font-size: 11px; color: var(--danger);
          display: flex; align-items: center; gap: 4px;
        }

        /* grid */
        .cf-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 520px) { .cf-grid-2 { grid-template-columns: 1fr; } }

        /* discount type toggle */
        .cf-type-toggle {
          display: flex;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
        }
        .cf-type-btn {
          flex: 1;
          padding: 9px 12px;
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          color: var(--muted);
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: background .15s, color .15s;
          letter-spacing: .02em;
        }
        .cf-type-btn.active {
          background: var(--gold-glow);
          color: var(--gold);
        }

        /* status toggle */
        .cf-status-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }
        .cf-status-label {
          font-size: 13px; color: var(--text);
          display: flex; flex-direction: column; gap: 2px;
        }
        .cf-status-hint { font-size: 11px; color: var(--muted); }

        /* switch */
        .cf-switch {
          position: relative; width: 40px; height: 22px;
          flex-shrink: 0;
        }
        .cf-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
        .cf-slider {
          position: absolute; inset: 0;
          background: var(--border-hi);
          border-radius: 99px;
          cursor: pointer;
          transition: background .2s;
        }
        .cf-slider::before {
          content: '';
          position: absolute;
          width: 16px; height: 16px;
          left: 3px; top: 3px;
          border-radius: 50%;
          background: var(--muted);
          transition: transform .2s, background .2s;
        }
        .cf-switch input:checked + .cf-slider { background: rgba(201,168,76,.25); }
        .cf-switch input:checked + .cf-slider::before {
          transform: translateX(18px);
          background: var(--gold);
        }

        /* status badge */
        .cf-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 500; letter-spacing: .07em;
          text-transform: uppercase; padding: 3px 8px; border-radius: 99px;
        }
        .cf-status-badge.active {
          background: rgba(74,158,110,.12);
          border: 1px solid rgba(74,158,110,.25);
          color: var(--success);
        }
        .cf-status-badge.inactive {
          background: rgba(90,85,80,.12);
          border: 1px solid var(--border);
          color: var(--muted);
        }
        .cf-status-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: currentColor;
        }

        /* textarea */
        .cf-textarea {
          resize: vertical; min-height: 72px;
        }

        /* divider */
        .cf-divider {
          height: 1px; background: var(--border);
        }

        /* actions */
        .cf-actions {
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          padding-top: 4px;
        }
        .cf-btn-ghost {
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 9px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--muted);
          cursor: pointer;
          transition: border-color .15s, color .15s;
        }
        .cf-btn-ghost:hover { border-color: var(--border-hi); color: var(--text); }

        .cf-btn-submit {
          background: var(--gold);
          border: none; border-radius: 6px;
          padding: 9px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: #0a0a0a;
          cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          transition: opacity .15s, transform .1s;
          letter-spacing: .01em;
        }
        .cf-btn-submit:hover { opacity: .88; }
        .cf-btn-submit:active { transform: scale(.98); }
        .cf-btn-submit:disabled { opacity: .4; cursor: not-allowed; transform: none; }

        /* success banner */
        .cf-success {
          display: flex; align-items: center; gap: 8px;
          background: rgba(74,158,110,.1);
          border: 1px solid rgba(74,158,110,.25);
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 13px; color: var(--success);
          animation: cf-fade-in .3s ease;
        }
        @keyframes cf-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* preview ticket */
        .cf-preview {
          background: var(--surface2);
          border: 1px dashed var(--border-hi);
          border-radius: 8px;
          padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cf-preview-code {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 18px; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--gold);
        }
        .cf-preview-empty {
          font-size: 12px; color: var(--muted);
          font-style: italic;
        }
        .cf-preview-meta {
          display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
        }
        .cf-preview-discount {
          font-size: 20px; font-weight: 500; color: var(--text);
          font-family: 'Cormorant Garamond', serif;
          letter-spacing: .02em;
        }
        .cf-preview-info { font-size: 11px; color: var(--muted); }
      `}</style>

      <div className="cf-wrap">
        {/* cabeçalho */}
        <div className="cf-header">
          <div className="cf-header-icon"><IconTag /></div>
          <div>
            <div className="cf-title">Criar Cupom</div>
            <div className="cf-subtitle">Configure um novo código de desconto</div>
          </div>
        </div>

        {/* success */}
        {success && (
          <div className="cf-success" style={{ marginBottom: 20 }}>
            <IconCheck />
            Cupom criado com sucesso!
          </div>
        )}

        <div className="cf-card">

          {/* ── preview ── */}
          <div className="cf-preview">
            {form.code
              ? <span className="cf-preview-code">{form.code}</span>
              : <span className="cf-preview-empty">Pré-visualização do cupom</span>
            }
            {(form.discountValue && !isNaN(Number(form.discountValue))) && (
              <div className="cf-preview-meta">
                <span className="cf-preview-discount">
                  {form.discountType === "PERCENTAGE"
                    ? `${form.discountValue}% OFF`
                    : `R$ ${Number(form.discountValue).toFixed(2)} OFF`}
                </span>
                {form.minOrderValue && (
                  <span className="cf-preview-info">
                    Pedido mín. R$ {Number(form.minOrderValue).toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="cf-divider" />

          {/* ── código ── */}
          <div className="cf-section">Identificação</div>

          <div className="cf-field">
            <label className="cf-label" htmlFor={`${uid}-code`}>Código do cupom</label>
            <div className="cf-input-wrap">
              <input
                id={`${uid}-code`}
                className={`cf-input cf-input monospace has-suffix${errors.code ? " error" : ""}`}
                style={{ paddingRight: 110 }}
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="EX: PROMO20"
                maxLength={20}
                autoComplete="off"
              />
              <button
                type="button"
                className="cf-gen-btn"
                onClick={() => set("code", generateCode())}
              >
                <IconRefresh /> Gerar
              </button>
            </div>
            {errors.code && <span className="cf-error">⚠ {errors.code}</span>}
          </div>

          <div className="cf-field">
            <label className="cf-label" htmlFor={`${uid}-desc`}>Descrição <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opcional)</span></label>
            <textarea
              id={`${uid}-desc`}
              className="cf-input cf-textarea"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Ex: Desconto de boas-vindas para novos clientes"
            />
          </div>

          <div className="cf-divider" />

          {/* ── desconto ── */}
          <div className="cf-section">Desconto</div>

          <div className="cf-field">
            <span className="cf-label">Tipo de desconto</span>
            <div className="cf-type-toggle">
              <button
                type="button"
                className={`cf-type-btn${form.discountType === "PERCENTAGE" ? " active" : ""}`}
                onClick={() => set("discountType", "PERCENTAGE")}
              >
                <IconPercent /> Porcentagem
              </button>
              <button
                type="button"
                className={`cf-type-btn${form.discountType === "FIXED" ? " active" : ""}`}
                onClick={() => set("discountType", "FIXED")}
              >
                <IconDollar /> Valor fixo
              </button>
            </div>
          </div>

          <div className="cf-grid-2">
            <div className="cf-field">
              <label className="cf-label" htmlFor={`${uid}-val`}>
                {form.discountType === "PERCENTAGE" ? "Percentual" : "Valor (R$)"}
              </label>
              <div className="cf-input-wrap">
                <input
                  id={`${uid}-val`}
                  className={`cf-input has-suffix${errors.discountValue ? " error" : ""}`}
                  type="number" min="0" step="0.01"
                  value={form.discountValue}
                  onChange={(e) => set("discountValue", e.target.value)}
                  placeholder="0"
                />
                <span className="cf-input-suffix">
                  {form.discountType === "PERCENTAGE" ? "%" : "R$"}
                </span>
              </div>
              {errors.discountValue && <span className="cf-error">⚠ {errors.discountValue}</span>}
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor={`${uid}-min`}>Pedido mínimo <span style={{ color: "var(--muted)" }}>(opcional)</span></label>
              <div className="cf-input-wrap">
                <span className="cf-input-prefix" style={{ fontSize: 12 }}>R$</span>
                <input
                  id={`${uid}-min`}
                  className={`cf-input has-prefix${errors.minOrderValue ? " error" : ""}`}
                  type="number" min="0" step="0.01"
                  value={form.minOrderValue}
                  onChange={(e) => set("minOrderValue", e.target.value)}
                  placeholder="0,00"
                />
              </div>
              {errors.minOrderValue && <span className="cf-error">⚠ {errors.minOrderValue}</span>}
            </div>
          </div>

          <div className="cf-divider" />

          {/* ── limites ── */}
          <div className="cf-section">Limites & Validade</div>

          <div className="cf-grid-2">
            <div className="cf-field">
              <label className="cf-label" htmlFor={`${uid}-uses`}>Máx. de usos <span style={{ color: "var(--muted)" }}>(opcional)</span></label>
              <input
                id={`${uid}-uses`}
                className={`cf-input${errors.maxUses ? " error" : ""}`}
                type="number" min="1" step="1"
                value={form.maxUses}
                onChange={(e) => set("maxUses", e.target.value)}
                placeholder="Ilimitado"
              />
              {errors.maxUses && <span className="cf-error">⚠ {errors.maxUses}</span>}
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor={`${uid}-exp`}>Expira em <span style={{ color: "var(--muted)" }}>(opcional)</span></label>
              <input
                id={`${uid}-exp`}
                className="cf-input"
                type="date"
                value={form.expiresAt}
                onChange={(e) => set("expiresAt", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          <div className="cf-divider" />

          {/* ── configurações ── */}
          <div className="cf-section">Configurações</div>

          <div className="cf-status-row">
            <div className="cf-status-label">
              Status
              <span className="cf-status-hint">Cupom ativo pode ser usado imediatamente</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className={`cf-status-badge ${form.status === "ACTIVE" ? "active" : "inactive"}`}>
                <span className="cf-status-dot" />
                {form.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </span>
              <label className="cf-switch">
                <input
                  type="checkbox"
                  checked={form.status === "ACTIVE"}
                  onChange={(e) => set("status", e.target.checked ? "ACTIVE" : "INACTIVE")}
                />
                <span className="cf-slider" />
              </label>
            </div>
          </div>

          <div className="cf-status-row">
            <div className="cf-status-label">
              Uso único por usuário
              <span className="cf-status-hint">Cada usuário pode usar o cupom apenas uma vez</span>
            </div>
            <label className="cf-switch">
              <input
                type="checkbox"
                checked={form.singleUsePerUser}
                onChange={(e) => set("singleUsePerUser", e.target.checked)}
              />
              <span className="cf-slider" />
            </label>
          </div>

          <div className="cf-divider" />

          {/* ── ações ── */}
          <div className="cf-actions">
            <button
              type="button"
              className="cf-btn-ghost"
              onClick={() => { setForm(INITIAL); setErrors({}); setSuccess(false); }}
            >
              Limpar
            </button>
            <button
              type="button"
              className="cf-btn-submit"
              disabled={saving}
              onClick={handleSubmit}
            >
              {saving ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Salvando…
                </>
              ) : (
                <>
                  <IconCheck />
                  Criar Cupom
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}