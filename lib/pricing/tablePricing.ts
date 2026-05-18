import type { PriceEstimate, TableDimensions } from "../quoteTypes";

interface TablePricingConfig {
  /** ARS per m² of table top surface (material). */
  materialCostPerM2: number;
  /** Flat labour cost for a standard table build, in ARS. */
  baseLabourCost: number;
  /** Additional labour for taller / sturdier frames, per cm of height. */
  labourPerCmHeight: number;
  /** Fixed finish cost (lacquer / oil / wax) in ARS. */
  finishCost: number;
  /** Fallback flat delivery cost when distance is unknown, in ARS. */
  deliveryCostFallback: number;
  /** Gross margin applied on top of cost+labour, expressed as a multiplier. */
  marginMultiplier: number;
}

// TODO: load from remote config (Supabase / Airtable / Sheets) once available.
const DEFAULT_CONFIG: TablePricingConfig = {
  materialCostPerM2: 504_000,
  baseLabourCost: 90_000,
  labourPerCmHeight: 350,
  finishCost: 35_000,
  deliveryCostFallback: 25_000,
  marginMultiplier: 1.35,
};

/**
 * Modelo C: base fija (carga/descarga) + costo por km progresivo.
 *
 * Tramos:
 *   km  0–15  → $1.500/km
 *   km 15–40  → $3.000/km
 *   km 40+    → $5.000/km
 *
 * Estos valores se pueden ajustar fácilmente para reflejar los costos reales del taller.
 */
export function calculateDeliveryCost(distanceKm: number): number {
  const BASE = 20_000;
  const TIER1_LIMIT = 15;
  const TIER2_LIMIT = 40;
  const RATE1 = 1_500; // $/km tramo 0–15
  const RATE2 = 3_000; // $/km tramo 15–40
  const RATE3 = 5_000; // $/km tramo 40+

  let cost = BASE;

  if (distanceKm <= TIER1_LIMIT) {
    cost += distanceKm * RATE1;
  } else if (distanceKm <= TIER2_LIMIT) {
    cost += TIER1_LIMIT * RATE1 + (distanceKm - TIER1_LIMIT) * RATE2;
  } else {
    cost +=
      TIER1_LIMIT * RATE1 +
      (TIER2_LIMIT - TIER1_LIMIT) * RATE2 +
      (distanceKm - TIER2_LIMIT) * RATE3;
  }

  return Math.round(cost);
}

export function calculateTableQuote(
  dimensions: TableDimensions,
  distanceKm: number | null,
  config: TablePricingConfig = DEFAULT_CONFIG,
): PriceEstimate {
  const surfaceM2 = (dimensions.widthCm * dimensions.lengthCm) / 10_000;

  const materialCost = surfaceM2 * config.materialCostPerM2;
  const labourCost =
    config.baseLabourCost + dimensions.heightCm * config.labourPerCmHeight;
  const finishCost = config.finishCost;

  const deliveryCost =
    distanceKm !== null
      ? calculateDeliveryCost(distanceKm)
      : config.deliveryCostFallback;

  const subtotal = materialCost + labourCost + finishCost + deliveryCost;
  const total = roundUpToThousand(subtotal * config.marginMultiplier);
  const margin = total - subtotal;

  return {
    currency: "ARS",
    materialCost: Math.round(materialCost),
    labourCost: Math.round(labourCost),
    finishCost,
    deliveryCost,
    margin,
    subtotal: Math.round(subtotal),
    total,
    notes:
      distanceKm !== null
        ? `Envío: base $20.000 + ${distanceKm} km (tarifa progresiva)`
        : "Envío a confirmar con el taller (dirección no calculada automáticamente).",
  };
}

/** Redondea hacia arriba al múltiplo de 1.000 más cercano. */
function roundUpToThousand(amount: number): number {
  return Math.ceil(amount / 1000) * 1000;
}
