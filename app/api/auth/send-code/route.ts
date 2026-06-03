import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail, generateCode } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verifica se o usuário existe antes de qualquer coisa
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nenhuma conta encontrada com esse email. Faça seu cadastro primeiro." },
        { status: 404 }
      );
    }

    // Rate limit: máx 3 códigos nos últimos 10 minutos
    const recentCodes = await prisma.verificationCode.count({
      where: {
        email: normalizedEmail,
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
      },
    });

    if (recentCodes >= 3) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde 10 minutos." },
        { status: 429 }
      );
    }

    // Invalida códigos anteriores
    await prisma.verificationCode.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        code,
        email: normalizedEmail,
        expiresAt,
        userId: user.id,
      },
    });

    await sendVerificationEmail(normalizedEmail, code);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SEND_CODE]", error);
    return NextResponse.json(
      { error: "Erro ao enviar código. Tente novamente." },
      { status: 500 }
    );
  }
}