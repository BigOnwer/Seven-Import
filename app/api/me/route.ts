import { NextResponse } from "next/server";
import { getSession, deleteSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      createdAt: session.user.createdAt,
      cpf: session.user.cpf,
      address: session.user.address,
      phone: session.user.phone,
    },
  });
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { name, email, phone } = await req.json();

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Nome, email e telefone são obrigatórios." }, { status: 400 });
    }

    const atualizedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email, phone },
    });
    return NextResponse.json({ user: atualizedUser });
  }catch (error) {
    console.error("[UPDATE_USER]", error);
    return NextResponse.json({ error: "Erro ao atualizar usuário." }, { status: 500 });
  }
}

export async function DELETE() {
  await deleteSession();
  return NextResponse.json({ success: true });
}