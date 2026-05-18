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
  const body = await request.json();
  if (!isValidPricingConfig(body)) {
    return NextResponse.json({ error: "Configuración de precios inválida." }, { status: 400 });
  }
  await setPricingConfig(body);
  return NextResponse.json({ ok: true });
}

function isValidPricingConfig(v: unknown): v is import("@/lib/pricing/pricingConfig").PricingConfig {
  if (!v || typeof v !== "object") return false;
  const c = v as Record<string, unknown>;
  return (
    isProductConfig(c.mesa) &&
    isProductConfig(c.banco) &&
    isDeliveryConfig(c.delivery)
  );
}

function isProductConfig(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const c = v as Record<string, unknown>;
  return (
    typeof c.materialCostPerM2 === "number" &&
    typeof c.baseLabourCost === "number" &&
    typeof c.finishCost === "number" &&
    typeof c.deliveryCostFallback === "number" &&
    typeof c.marginMultiplier === "number"
  );
}

function isDeliveryConfig(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const c = v as Record<string, unknown>;
  return (
    typeof c.baseCost === "number" &&
    typeof c.tier1LimitKm === "number" &&
    typeof c.tier2LimitKm === "number" &&
    typeof c.rate1PerKm === "number" &&
    typeof c.rate2PerKm === "number" &&
    typeof c.rate3PerKm === "number"
  );
}
