import { NextRequest, NextResponse } from "next/server";
import { getCatalog, saveCatalog } from "@/lib/catalogStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCatalog());
}
export async function PUT(request: NextRequest) {
  try {
    const catalog = await saveCatalog(await request.json());
    return NextResponse.json(catalog);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar el catalogo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
