// components/admin/ProductForm.tsx
'use client';
import { useState } from "react";
import { X, Plus, Minus, Save, Loader2 } from "lucide-react";
import { createProduct, updateProduct, type ApiProduct } from "@/lib/useProducts";
import { categories } from "@/lib/data";
import MultiImageInput from "./MultiImageInput";

type Props = {
  product?: ApiProduct;       // se fornecido, é edição; se não, é criação
  onSuccess?: (p: ApiProduct) => void;
  onCancel?: () => void;
};

const EMOJIS = ["👟","🏀","⚡","💚","🛹","🥾","♟️","🟡","👞","🩴","🥿","👠"];
const CATEGORY_OPTIONS = categories.filter(c => c !== "Todos");

function slugify(str: string) {
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <label className="font-condensed" style={{ display: "block", fontSize: 10, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}{required && <span style={{ color: "var(--gold)" }}> *</span>}
      </label>
      {children}
    </div>
  );

export default function ProductForm({ product, onSuccess, onCancel }: Props) {
  const isEdit = !!product;
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    name:        product?.name        ?? "",
    slug:        product?.slug        ?? "",
    brand:       product?.brand       ?? "",
    category:    product?.category    ?? CATEGORY_OPTIONS[0],
    price:       product?.price       ?? "",
    oldPrice:    product?.oldPrice    ?? "",
    description: product?.description ?? "",
    details:     product?.details     ?? "",
    stock:       product?.stock       ?? 0,
    tag:         product?.tag         ?? "",
    emoji:       product?.emoji       ?? "👟",
    midiaUrl:    product?.midiaUrl    ?? "",
    midiaType:   product?.midiaType   ?? "image",
    isNew:       product?.isNew       ?? false,
    isSale:      product?.isSale      ?? false,
    inStock:     product?.inStock     ?? true,
    sizes:       product?.sizes       ?? [] as number[],
    colors:      product?.colors      ?? [] as string[],
    colorNames:  product?.colorNames  ?? [] as string[],
  });

  const [sizeInput,  setSizeInput]  = useState("");
  const [colorInput, setColorInput] = useState({ hex: "#F5C518", name: "" });
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [touched,    setTouched]    = useState(false);

  const set = (key: string, value: any) => {
    setForm(f => {
      const next = { ...f, [key]: value };
      // Auto-gera slug a partir do nome (só se não editando)
      if (key === "name" && !isEdit) next.slug = slugify(value);
      return next;
    });
  };

  const addSize = () => {
    const n = Number(sizeInput);
    if (!n || form.sizes.includes(n)) return;
    set("sizes", [...form.sizes, n].sort((a, b) => a - b));
    setSizeInput("");
  };

  const removeSize = (s: number) => set("sizes", form.sizes.filter(x => x !== s));

  // ✅ FIX: atualiza colors e colorNames atomicamente num único setForm
  const addColor = () => {
    if (!colorInput.name.trim()) return;
    setForm(f => ({
      ...f,
      colors:     [...f.colors,     colorInput.hex],
      colorNames: [...f.colorNames, colorInput.name.trim()],
    }));
    setColorInput({ hex: "#F5C518", name: "" });
  };

  // ✅ FIX: mesmo aqui — uma única chamada setForm
  const removeColor = (i: number) => {
    setForm(f => ({
      ...f,
      colors:     f.colors.filter((_,    idx) => idx !== i),
      colorNames: f.colorNames.filter((_, idx) => idx !== i),
    }));
  };

  const handleSubmit = async () => {
    setTouched(true);
    setError(null);

    // Validação client-side básica
    if (!form.name.trim() || !form.brand.trim() || !form.description.trim() || !form.slug.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (Number(form.price) <= 0) { setError("Preço inválido."); return; }
    if (Number(form.stock) < 0)  { setError("Estoque inválido."); return; }

    setLoading(true);
    const payload = {
      ...form,
      price:    Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock:    Number(form.stock),
      tag:      form.tag || null,
      details:  form.details || null,
      midiaUrl: form.midiaUrl || null,
      images,
    };

    const result = isEdit
      ? await updateProduct(product!.id, payload)
      : await createProduct(payload);

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Erro desconhecido.");
      return;
    }
    onSuccess?.(result.data!);
  };

  const inputStyle = (invalid = false): React.CSSProperties => ({
    width: "100%", boxSizing: "border-box",
    background: "var(--black)", border: `1px solid ${invalid && touched ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 6, padding: "10px 14px", color: "var(--white)", fontSize: 14, outline: "none",
    transition: "border 0.2s",
  });

  return (
    <div style={{ background: "var(--black-2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 32, maxWidth: 720}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h2 className="font-display" style={{ fontSize: 28, color: "var(--white)" }}>
          {isEdit ? "EDITAR" : "NOVO"} <span style={{ color: "var(--gold)" }}>PRODUTO</span>
        </h2>
        {onCancel && (
          <button onClick={onCancel} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 12px", cursor: "pointer", color: "var(--gray)", display: "flex", alignItems: "center", gap: 6 }}>
            <X size={14} /> Cancelar
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, padding: "12px 16px", color: "#e74c3c", fontSize: 13, marginBottom: 24 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>

        {/* Nome */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Nome do produto" required>
            <input style={inputStyle(!form.name)} value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="Ex: Air Force 1 × LV"
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
              onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
          </Field>
        </div>

        {/* Slug */}
        <Field label="Slug (URL)" required>
          <input style={inputStyle(!form.slug)} value={form.slug} onChange={e => set("slug", slugify(e.target.value))}
            placeholder="air-force-1-lv"
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
        </Field>

        {/* Marca */}
        <Field label="Marca" required>
          <input style={inputStyle(!form.brand)} value={form.brand} onChange={e => set("brand", e.target.value)}
            placeholder="Nike, Jordan, Adidas..."
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
        </Field>

        {/* Categoria */}
        <Field label="Categoria" required>
          <select style={{ ...inputStyle(), cursor: "pointer" }} value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        {/* Preço */}
        <Field label="Preço (R$)" required>
          <input style={inputStyle(Number(form.price) <= 0)} type="number" min={0} step={0.01}
            value={form.price} onChange={e => set("price", e.target.value)}
            placeholder="899.00"
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
        </Field>

        {/* Preço antigo */}
        <Field label="Preço anterior (R$)">
          <input style={inputStyle()} type="number" min={0} step={0.01}
            value={form.oldPrice} onChange={e => set("oldPrice", e.target.value)}
            placeholder="1199.00 (opcional)"
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
        </Field>

        {/* Estoque */}
        <Field label="Estoque" required>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => set("stock", Math.max(0, Number(form.stock) - 1))}
              style={{ width: 36, height: 36, borderRadius: 6, background: "var(--black)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "var(--gray)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Minus size={14} />
            </button>
            <input style={{ ...inputStyle(Number(form.stock) < 0), textAlign: "center" }} type="number" min={0}
              value={form.stock} onChange={e => set("stock", e.target.value)} />
            <button onClick={() => set("stock", Number(form.stock) + 1)}
              style={{ width: 36, height: 36, borderRadius: 6, background: "var(--black)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "var(--gray)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Plus size={14} />
            </button>
          </div>
        </Field>

        {/* Tag */}
        <Field label="Tag / Badge">
          <input style={inputStyle()} value={form.tag} onChange={e => set("tag", e.target.value)}
            placeholder="Lançamento, Exclusivo, Raro..."
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
        </Field>

        {/* Descrição curta */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Descrição curta" required>
            <input style={inputStyle(!form.description)} value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Collab icônica LV × Nike"
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
              onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
          </Field>
        </div>

        {/* Detalhes longos */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Detalhes / Descrição completa">
            <textarea style={{ ...inputStyle(), minHeight: 100, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
              value={form.details} onChange={e => set("details", e.target.value)}
              placeholder="Descreva materiais, tecnologias, história do produto..."
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
              onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
          </Field>
        </div>

        {/* Emoji */}
        <Field label="Emoji do produto">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => set("emoji", e)}
                style={{
                  width: 40, height: 40, fontSize: 22, borderRadius: 6, cursor: "pointer",
                  border: form.emoji === e ? "2px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                  background: form.emoji === e ? "rgba(245,197,24,0.1)" : "var(--black)",
                }}>
                {e}
              </button>
            ))}
          </div>
        </Field>

        {/* URL de mídia */}
        <Field label="URL da imagem">
          <MultiImageInput value={images} onChange={setImages} maxImages={6} />
        </Field>

        {/* Tamanhos */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Tamanhos disponíveis">
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                style={{ ...inputStyle(), flex: 1 }} type="number"
                value={sizeInput} onChange={e => setSizeInput(e.target.value)}
                placeholder="Ex: 42"
                onKeyDown={e => e.key === "Enter" && addSize()}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
              <button onClick={addSize}
                style={{ padding: "10px 16px", background: "var(--gold)", border: "none", borderRadius: 6, cursor: "pointer", color: "var(--black)", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <Plus size={14} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {form.sizes.map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: 4, padding: "4px 10px" }}>
                  <span className="font-condensed" style={{ fontSize: 13, color: "var(--gold)", fontWeight: 700 }}>{s}</span>
                  <button onClick={() => removeSize(s)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--gold)", padding: 0, lineHeight: 1 }}>
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </Field>
        </div>

        {/* Cores */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Cores disponíveis">
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input type="color" value={colorInput.hex} onChange={e => setColorInput(c => ({ ...c, hex: e.target.value }))}
                style={{ width: 44, height: 44, borderRadius: 6, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", padding: 2 }} />
              <input style={{ ...inputStyle(), flex: 1 }} placeholder="Nome da cor (ex: Wheat)"
                value={colorInput.name} onChange={e => setColorInput(c => ({ ...c, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addColor()}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
              <button onClick={addColor}
                style={{ padding: "10px 16px", background: "var(--gold)", border: "none", borderRadius: 6, cursor: "pointer", color: "var(--black)", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <Plus size={14} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {form.colors.map((hex, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--black)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: hex, border: "1px solid rgba(255,255,255,0.2)" }} />
                  <span className="font-condensed" style={{ fontSize: 12, color: "var(--white)" }}>{form.colorNames[i]}</span>
                  <button onClick={() => removeColor(i)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--gray)", padding: 0 }}>
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </Field>
        </div>

        {/* Flags */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Flags do produto">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {([
                { key: "isNew",   label: "Novo lançamento" },
                { key: "isSale",  label: "Em promoção"     },
                { key: "inStock", label: "Em estoque"       },
              ] as const).map(({ key, label }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={Boolean(form[key])} onChange={e => set(key, e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "var(--gold)", cursor: "pointer" }} />
                  <span className="font-condensed" style={{ fontSize: 13, color: "var(--gray)", letterSpacing: "0.08em" }}>{label}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>
      </div>

      {/* Submit */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, marginTop: 8, display: "flex", justifyContent: "flex-end", gap: 12 }}>
        {onCancel && (
          <button onClick={onCancel}
            style={{ padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, cursor: "pointer", color: "var(--gray)", fontSize: 14 }}>
            Cancelar
          </button>
        )}
        <button onClick={handleSubmit} disabled={loading}
          style={{
            padding: "12px 32px", background: loading ? "rgba(245,197,24,0.5)" : "var(--gold)",
            border: "none", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer",
            color: "var(--black)", fontSize: 14, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8,
          }}>
          {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar produto"}
        </button>
      </div>
    </div>
  );
}