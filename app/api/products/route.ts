import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadService } from "@/lib/upload";
import { Product } from "@/types/product";
import { getSession } from "next-auth/react";

export async function POST(req: NextRequest) {
    const session = await getSession();
    try {
        const body: Product = await req.json();

        const { name, price, description, details, stock, size, midiaType, midiaUrl } = body;

        if(!name || !price || !description || !details || !stock || !size || !midiaType || !midiaUrl) {
        return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
        }

        if (!session /*|| session.user.role !== "ADMIN"*/) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
        }

        const product = await prisma.product.create({
        data: {
            name,
            price,
            description,
            details,
            stock,
            size,
            midiaType,
            midiaUrl
        }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}