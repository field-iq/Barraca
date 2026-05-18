import { NextRequest, NextResponse } from "next/server";
import {
  getPricingConfig,
  setPricingConfig,
  isKvConfigured,
} from "@/lib/pricing/pricingConfig";

export async function GET() {
  const config = await getPricingConfig();
  return NextResponse.json({ config, canEdit: isKvConfigured() });
}

export async function PUT(request: NextRequest) {
  if (!isKvConfigured()) {
    return NextResponse.json(
      { error: "Vercel KV no está configurado." },
      { status: 503 },
    );
  }
  const config = await request.json();
  await setPricingConfig(config);
  return NextResponse.json({ ok: true });
}
