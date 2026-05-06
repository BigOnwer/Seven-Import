"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./ProductForm";

interface ProductDialogProps {
  userId?: string;
}

export function ProductDialog({ userId }: ProductDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 mx-2">Criar Produto</Button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: 720 }} className="max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border-white/10 p-0">
        <div className="border-b border-white/10 px-6 py-5">
          <DialogHeader>
            <DialogTitle>Criar produto</DialogTitle>
            <DialogDescription>
              Preencha os dados e faça o upload da mídia para adicionar um produto ao catálogo.
            </DialogDescription>
          </DialogHeader>
        </div>
        <ProductForm userId={userId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}