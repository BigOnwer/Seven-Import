"use client";
import { ChangeEvent, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Image, Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateProductProps {
  userId?: string;
}

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  details: string;
  stock: string;
  size: string;
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#888",
  marginBottom: 6,
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0d0d0d",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#f5f5f0",
  fontFamily: "'Barlow', sans-serif",
  fontSize: 14,
  padding: "10px 14px",
  outline: "none",
  transition: "border-color .2s",
};

function Field({
  label,
  field,
  type = "text",
  placeholder,
  required,
  form,
  set,
}: {
  label: string;
  field: keyof ProductFormData;
  type?: string;
  placeholder?: string;
  required?: boolean;
  form: ProductFormData;
  set: (field: keyof ProductFormData, value: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#e74c3c" }}>*</span>}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
      />
    </div>
  );
}

export function ProductForm({ userId }: CreateProductProps) {
  const { showToast } = useToast();

  // Dados do produto
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    details: "",
    stock: "",
    size: "",
  });

  // Mídia
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof ProductFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileType(file.type.startsWith("video/") ? "video" : "image");

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setFileType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setForm({ name: "", price: "", description: "", details: "", stock: "", size: "" });
    removeFile();
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Nome é obrigatório.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return "Preço inválido.";
    if (!form.description.trim()) return "Descrição é obrigatória.";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      return "Estoque inválido.";
    if (!selectedFile) return "Selecione uma imagem ou vídeo.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      showToast(error, "error", "⚠️");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Upload da mídia
      const formData = new FormData();
      formData.append("file", selectedFile!);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || "Erro no upload");

      // 2. Criar produto
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: Number(form.price),
          description: form.description.trim(),
          details: form.details.trim(),
          stock: Number(form.stock),
          size: form.size ? Number(form.size) : null,
          midiaUrl: uploadData.data.url,
          midiaType: uploadData.data.mediaType,
          userId,
        }),
      });

      const productData = await productRes.json();
      if (!productRes.ok) throw new Error(productData.error || "Erro ao criar produto");

      showToast("Produto criado com sucesso!", "success", "✅");
      resetForm();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro desconhecido",
        "error",
        "❌"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 24px",
        background: "var(--black)",
        minHeight: "100vh",
      }}
    >
      <h1
        className="font-display"
        style={{ fontSize: 40, color: "var(--white)", marginBottom: 8 }}
      >
        NOVO <span style={{ color: "var(--gold)" }}>PRODUTO</span>
      </h1>
      <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 32 }}>
        Preencha os dados e faça o upload da mídia para adicionar um produto ao catálogo.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Nome */}
        <Field label="Nome do produto" field="name" form={form} set={set} placeholder="Ex: Air Jordan 4 Yellow Thunder" required />

        {/* Preço + Estoque */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Preço (R$)" field="price" type="number" form={form} set={set} placeholder="899.90" required />
          <Field label="Estoque" field="stock" type="number" form={form} set={set} placeholder="10" required />
        </div>

        {/* Tamanho */}
        <Field label="Tamanho (opcional)" field="size" type="number" form={form} set={set} placeholder="42" />

        {/* Descrição */}
        <div>
          <label style={labelStyle}>
            Descrição <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Descreva o produto em poucas palavras..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </div>

        {/* Detalhes */}
        <div>
          <label style={labelStyle}>Detalhes</label>
          <textarea
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder="Materiais, tecnologias, especificações..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </div>

        {/* Upload de mídia */}
        <div>
          <label style={labelStyle}>
            Imagem / Vídeo <span style={{ color: "#e74c3c" }}>*</span>
          </label>

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed rgba(245,197,24,0.3)",
                borderRadius: 10,
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: "rgba(245,197,24,0.02)",
                transition: "border-color .2s, background .2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(245,197,24,0.6)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(245,197,24,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(245,197,24,0.3)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(245,197,24,0.02)";
              }}
            >
              <Upload
                size={36}
                color="var(--gold)"
                style={{ marginBottom: 12, opacity: 0.7 }}
              />
              <div
                className="font-condensed"
                style={{ fontSize: 14, color: "var(--gray)", letterSpacing: "0.05em" }}
              >
                Clique para selecionar uma foto ou vídeo
              </div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>
                JPG, PNG, WEBP, MP4 — máx. 100MB
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                background: "#111",
                border: "1px solid rgba(245,197,24,0.2)",
              }}
            >
              {fileType === "image" ? (
                <img
                  src={preview!}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block" }}
                />
              ) : (
                <video
                  src={preview!}
                  controls
                  style={{ width: "100%", maxHeight: 320, display: "block" }}
                />
              )}

              {/* Overlay de ações */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: "rgba(0,0,0,0.75)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                  }}
                >
                  {fileType === "image" ? <Image size={14} /> : <Video size={14} />}
                  Trocar
                </button>
                <button
                  type="button"
                  onClick={removeFile}
                  style={{
                    background: "rgba(231,76,60,0.8)",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                  }}
                >
                  <X size={14} /> Remover
                </button>
              </div>

              {/* Nome do arquivo */}
              <div
                style={{
                  padding: "8px 12px",
                  background: "rgba(0,0,0,0.6)",
                  fontSize: 11,
                  color: "var(--gray)",
                }}
              >
                {selectedFile.name} —{" "}
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            disabled={isLoading}
          />
        </div>

        {/* Separador */}
        <div className="stripe-sep" />

        {/* Botões */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={resetForm}
            disabled={isLoading}
            className="btn-outline"
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              background: "transparent",
            }}
          >
            Limpar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold"
            style={{
              flex: 2,
              padding: "14px 0",
              borderRadius: 8,
              border: "none",
              cursor: isLoading ? "wait" : "pointer",
              fontSize: 14,
              opacity: isLoading ? 0.8 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {isLoading ? (
              <>
                <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
                  ⏳
                </span>{" "}
                Salvando...
              </>
            ) : (
              "✓ Criar Produto"
            )}
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}