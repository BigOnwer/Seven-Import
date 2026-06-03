"use client";
/**
 * ProductCardImage
 * ─────────────────
 * Substitui o bloco da imagem dentro de <ProductCard>.
 *
 * Comportamento:
 *  - 1 imagem  → mostra ela, sem carrossel (igual ao atual)
 *  - 2+ imagens → ao hover, avança automaticamente quadro a quadro
 *                 dots clicáveis aparecem na parte inferior
 *  - Fallback para midiaUrl (retrocompatível)
 *  - Fallback final para emoji
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { ApiProduct } from "@/lib/useProducts"; // ajuste o caminho se necessário

interface Props {
  product: ApiProduct;
  hovered: boolean;
  /** Botão de wishlist passado como children, posicionado sobre a imagem */
  children?: React.ReactNode;
}

export default function ProductCardImage({ product: p, hovered, children }: Props) {
  // Constrói lista de todas as imagens disponíveis
  const allImages: string[] = [
    ...(p.midiaUrl && p.midiaType === "image" ? [p.midiaUrl] : []),
    ...(Array.isArray(p.images) ? p.images : []),
  ];

  const hasImages   = allImages.length > 0;
  const isCarousel  = allImages.length > 1;
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-avança enquanto hovered e há múltiplas imagens
  useEffect(() => {
    if (!isCarousel) return;
    if (hovered) {
      intervalRef.current = setInterval(() => {
        setActiveIdx(i => (i + 1) % allImages.length);
      }, 900);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveIdx(0); // volta para principal ao sair
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, isCarousel, allImages.length]);

  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

  return (
    <div style={{ position: "relative" /* remove gap entre imgs */ }}>
      <Link href={`/produtos/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          background: "rgba(255,255,255,0.02)",
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontSize: 72,
          overflow: "hidden",
        }}>
          {hasImages ? (
            <>
              {/* Pré-carrega todas as imagens do carrossel mas exibe só a ativa */}
              {allImages.map((url, i) => (
                <img
                  key={url}
                  src={url}
                  alt={`${p.name} — imagem ${i + 1}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: i === activeIdx ? 1 : 0,
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                    transform: i === activeIdx && hovered ? "scale(1.05)" : "scale(1)",
                    willChange: "opacity, transform",
                  }}
                />
              ))}
            </>
          ) : (
            // Fallback: emoji
            <span style={{
              transition: "transform 0.3s",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}>
              {p.emoji}
            </span>
          )}

          {/* Badge desconto */}
          {discount && (
            <div className="font-condensed" style={{
              position: "absolute", top: 12, right: 12, zIndex: 2,
              background: "#e74c3c", color: "#fff",
              fontSize: 11, fontWeight: 700,
              padding: "2px 8px", borderRadius: 2,
            }}>
              -{discount}%
            </div>
          )}

          {/* Overlay esgotado */}
          {!p.inStock && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 3,
              background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span className="font-condensed" style={{
                color: "var(--gray)", fontSize: 12,
                letterSpacing: "0.2em", textTransform: "uppercase",
              }}>
                Esgotado
              </span>
            </div>
          )}

          {/* Dots do carrossel — aparecem ao hover */}
          {isCarousel && (
            <div style={{
              position: "absolute", bottom: 10, left: 0, right: 0, zIndex: 4,
              display: "flex", justifyContent: "center", gap: 5,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.25s",
              pointerEvents: hovered ? "auto" : "none",
            }}>
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={e => { e.preventDefault(); setActiveIdx(i); }}
                  aria-label={`Imagem ${i + 1}`}
                  style={{
                    width:  i === activeIdx ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    background: i === activeIdx ? "var(--gold)" : "rgba(255,255,255,0.45)",
                    transition: "width 0.25s ease, background 0.25s ease",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist button (passado pelo pai) */}
      {children}
    </div>
  );
}