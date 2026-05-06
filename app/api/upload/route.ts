import { NextRequest, NextResponse } from "next/server";
import { uploadService } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const url = await uploadService.uploadFile(file);
    const mediaType = uploadService.getMediaType(file);

    return NextResponse.json({
      success: true,
      data: { url, mediaType },
    });
  } catch (error) {
    console.error("[UPLOAD]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro no upload.",
      },
      { status: 400 }
    );
  }
}