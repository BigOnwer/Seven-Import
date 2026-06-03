"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  cpf?: string | null;
  address?: string | null;
  createdAt: string;
  role: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function register(data: {
    name: string;
    email: string;
    cpf?: string;
    phone?: string;
  }) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Erro ao criar conta.");
    // Após registrar, dispara o fluxo de login por código
    // para já autenticar o usuário
    const sendRes = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });
    const sendJson = await sendRes.json();
    if (!sendRes.ok) throw new Error(sendJson.error ?? "Erro ao enviar código.");
    return json;
  }

  async function logout() {
    await fetch("/api/me", { method: "DELETE" });
    setUser(null);
    router.push("/login");
  }

  return { user, loading, logout, register };
}