"use client";
import { useState, useRef } from "react";

interface MultiImageInputProps {
  /** URLs já salvas (vindas do banco ao editar) */
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function MultiImageInput({
  value = [],
  onChange,
  maxImages = 6,
}: MultiImageInputProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function addUrl() {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;

    if (!isValidUrl(trimmed)) {
      setError("URL inválida.");
      return;
    }
    if (value.includes(trimmed)) {
      setError("Essa URL já foi adicionada.");
      return;
    }
    if (value.length >= maxImages) {
      setError(`Máximo de ${maxImages} imagens.`);
      return;
    }

    onChange([...value, trimmed]);
    setInputUrl("");
    setError("");
    inputRef.current?.focus();
  }

  function removeUrl(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index === value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── Entrada de URL ── */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          ref={inputRef}
          type="url"
          placeholder="https://exemplo.com/imagem.jpg"
          value={inputUrl}
          onChange={(e) => {
            setInputUrl(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          disabled={value.length >= maxImages}
          style={{
            flex: 1,
            background: "var(--black, #0a0a0a)",
            border: "1px solid var(--gold, #c9a84c)",
            borderRadius: 6,
            color: "var(--white, #f5f5f5)",
            padding: "8px 12px",
            fontSize: 13,
            outline: "none",
            opacity: value.length >= maxImages ? 0.45 : 1,
          }}
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={value.length >= maxImages || !inputUrl.trim()}
          style={{
            background: "var(--gold, #c9a84c)",
            color: "var(--black, #0a0a0a)",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontWeight: 700,
            fontSize: 13,
            cursor: value.length >= maxImages || !inputUrl.trim() ? "not-allowed" : "pointer",
            opacity: value.length >= maxImages || !inputUrl.trim() ? 0.45 : 1,
            whiteSpace: "nowrap",
            transition: "opacity .15s",
          }}
        >
          + Adicionar
        </button>
      </div>

      {error && (
        <p style={{ color: "#e05c5c", fontSize: 12, margin: 0 }}>{error}</p>
      )}

      <p style={{ color: "var(--gray, #888)", fontSize: 12, margin: 0 }}>
        {value.length} / {maxImages} imagens — a primeira é a imagem principal.
      </p>

      {/* ── Lista de previews ── */}
      {value.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 10,
          }}
        >
          {value.map((url, i) => (
            <div
              key={url}
              style={{
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                border: i === 0
                  ? "2px solid var(--gold, #c9a84c)"
                  : "1px solid #2a2a2a",
                background: "#111",
                aspectRatio: "1 / 1",
              }}
            >
              {/* Índice / badge principal */}
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  background: i === 0 ? "var(--gold, #c9a84c)" : "rgba(0,0,0,.65)",
                  color: i === 0 ? "#000" : "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 4,
                  padding: "1px 5px",
                  zIndex: 2,
                }}
              >
                {i === 0 ? "PRINCIPAL" : `#${i + 1}`}
              </span>

              {/* Preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagem ${i + 1}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23222' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' fill='%23666' font-size='11' text-anchor='middle' dy='.3em'%3ESem prévia%3C/text%3E%3C/svg%3E";
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Controles sobre a imagem */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 4px",
                  background: "rgba(0,0,0,.7)",
                  gap: 2,
                }}
              >
                {/* Mover para esquerda */}
                <button
                  type="button"
                  title="Mover para esquerda"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  style={iconBtn(i === 0)}
                >
                  ‹
                </button>

                {/* Remover */}
                <button
                  type="button"
                  title="Remover imagem"
                  onClick={() => removeUrl(i)}
                  style={iconBtn(false, true)}
                >
                  ✕
                </button>

                {/* Mover para direita */}
                <button
                  type="button"
                  title="Mover para direita"
                  onClick={() => moveDown(i)}
                  disabled={i === value.length - 1}
                  style={iconBtn(i === value.length - 1)}
                >
                  ›
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function iconBtn(disabled: boolean, isDanger = false): React.CSSProperties {
  return {
    background: "transparent",
    border: "none",
    color: isDanger ? "#e05c5c" : disabled ? "#444" : "#ccc",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1,
    padding: "0 4px",
    transition: "color .15s",
  };
}