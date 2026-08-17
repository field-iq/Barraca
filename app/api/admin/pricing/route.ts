import { NextRequest, NextResponse } from "next/server";
import { getPricingConfig, savePricingConfig } from "@/lib/pricing/pricingStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPricingConfig());
}

export async function PUT(request: NextRequest) {
  try {
    return NextResponse.json(await savePricingConfig(await request.json()));
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar la configuración.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
