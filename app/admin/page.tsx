'use client'
import { useSession } from "next-auth/react";
import { ProductForm } from "./components/ProductForm";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user } = useAuth();
    
    return (
        <div className="">
            <ProductForm userId={user?.id} />
        </div>
    )
}