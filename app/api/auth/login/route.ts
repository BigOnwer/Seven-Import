import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/session";
import bcrypt from "bcrypt";


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();


    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }


    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });


    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha incorretos." },
        { status: 401 }
      );
    }


    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Email ou senha incorretos." },
        { status: 401 }
      );
    }


    const token = await createSession(user.id);


    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });


    response.cookies.set(
      setSessionCookie(token)
    );


    return response;


  } catch (error) {
    console.error("[LOGIN]", error);

    return NextResponse.json(
      { error: "Erro interno no login." },
      { status: 500 }
    );
  }
}