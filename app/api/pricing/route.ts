import { NextResponse } from "next/server";
import { getPricingConfig } from "@/lib/pricing/pricingStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPricingConfig(), { headers: { "Cache-Control": "no-store" } });
}
