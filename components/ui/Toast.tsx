"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  emoji?: string;
};

type ToastContextType = {
  showToast: (message: string, type?: Toast["type"], emoji?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success", emoji?: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, emoji }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const colors = { success: "#22C55E", error: "#e74c3c", info: "var(--gold)" };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: "fixed", bottom: 24, right: 24,
        zIndex: 9999, display: "flex", flexDirection: "column", gap: 8,
        pointerEvents: "none",
      }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            background: "var(--black-2)",
            border: `1px solid ${colors[t.type]}40`,
            borderLeft: `3px solid ${colors[t.type]}`,
            borderRadius: 8,
            padding: "12px 18px",
            display: "flex", alignItems: "center", gap: 10,
            minWidth: 240, maxWidth: 340,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.2)`,
            animation: "toastIn 0.3s cubic-bezier(0.23,1,0.32,1) forwards",
            pointerEvents: "auto",
          }}>
            {t.emoji && <span style={{ fontSize: 18 }}>{t.emoji}</span>}
            <span className="font-condensed" style={{ fontSize: 13, fontWeight: 600, color: "var(--white)", letterSpacing: "0.03em" }}>
              {t.message}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
