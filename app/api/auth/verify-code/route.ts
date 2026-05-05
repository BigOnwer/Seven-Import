import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email e código são obrigatórios." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const verification = await prisma.verificationCode.findFirst({
      where: {
        email: normalizedEmail,
        code: code.trim(),
        used: false,
        expiresAt: { gte: new Date() },
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Código inválido ou expirado." },
        { status: 401 }
      );
    }

    // Marcar código como usado
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { used: true },
    });

    const user = verification.user!;
    const sessionToken = await createSession(user.id);
    const cookie = setSessionCookie(sessionToken);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    });

    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error("[VERIFY_CODE]", error);
    return NextResponse.json(
      { error: "Erro ao verificar código." },
      { status: 500 }
    );
  }
}