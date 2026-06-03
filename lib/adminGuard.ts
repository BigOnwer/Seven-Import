// lib/adminGuard.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    return {
      error: NextResponse.json({ error: "Não autenticado." }, { status: 401 }),
      session: null,
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json({ error: "Acesso negado." }, { status: 403 }),
      session: null,
    };
  }

  return { error: null, session };
}