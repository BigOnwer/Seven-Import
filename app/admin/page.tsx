"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "./components/ProductForm";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    // Descomente quando quiser bloquear por role:
    // if (!loading && user && user.role !== "ADMIN") router.replace("/");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--black)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Navbar />
        <div className="font-display" style={{ fontSize: 24, color: "var(--gold)" }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar />
        <ProductForm userId={user.id}/>
    </div>
  );
}