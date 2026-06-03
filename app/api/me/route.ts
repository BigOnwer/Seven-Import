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
      id:        session.user.id,
      email:     session.user.email,
      name:      session.user.name,
      createdAt: session.user.createdAt,
      cpf:       session.user.cpf,
      address:   session.user.address,
      phone:     session.user.phone,
      role:      session.user.role,
    },
  });
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { name, phone } = await req.json();

    // Email não pode ser trocado por aqui — exigiria verificação
    if (!name?.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name:  name.trim(),
        phone: phone?.trim() ?? null,
      },
    });

    return NextResponse.json({
      user: {
        id:    updated.id,
        email: updated.email,
        name:  updated.name,
        phone: updated.phone,
      },
    });
  } catch (error) {
    console.error("[UPDATE_USER]", error);
    return NextResponse.json({ error: "Erro ao atualizar usuário." }, { status: 500 });
  }
}

export async function DELETE() {
  await deleteSession();
  return NextResponse.json({ success: true });
}