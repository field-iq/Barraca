import type { PriceEstimate, TableDimensions } from "../quoteTypes";

/**
 * Placeholder pricing configuration for tables.
 *
 * The real values will come from the workshop's cost sheet (and eventually a
 * remote config in Supabase / Airtable / Google Sheets). The shape below is
 * what the future pricing engine should consume — keep adding inputs here
 * (wood type, finish, edge profile, delivery zone...) as the engine grows.
 */
interface TablePricingConfig {
  /** ARS per m² of table top surface (material). */
  materialCostPerM2: number;
  /** Flat labour cost for a standard table build, in ARS. */
  baseLabourCost: number;
  /** Additional labour for taller / sturdier frames, per cm of height. */
  labourPerCmHeight: number;
  /** Fixed finish cost (lacquer / oil / wax) in ARS. */
  finishCost: number;
  /** Flat delivery cost in ARS within the local zone. */
  deliveryCost: number;
  /** Gross margin applied on top of cost+labour, expressed as a multiplier. */
  marginMultiplier: number;
}

// TODO: load from remote config (Supabase / Airtable / Sheets) once available.
const DEFAULT_CONFIG: TablePricingConfig = {
  materialCostPerM2: 504_000,
  baseLabourCost: 90_000,
  labourPerCmHeight: 350,
  finishCost: 35_000,
  deliveryCost: 25_000,
  marginMultiplier: 1.35,
};

/**
 * Calculate an internal price estimate for a custom table.
 *
 * IMPORTANT: This is intentionally NOT shown to the user in the MVP. It exists
 * so we can wire the rest of the pricing pipeline (storage, admin review,
 * notification email) without further refactoring later.
 */
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

  // Si hay distancia calculada, usarla. Si no, usar costo fijo como fallback.
  const deliveryCost =
    distanceKm !== null
      ? Math.round(distanceKm * 8_000)
      : config.deliveryCost;

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
        ? `Envío calculado: ${distanceKm} km × $8.000/km`
        : "Envío a confirmar con el taller (dirección no calculada automáticamente).",
  };
}

/** Redondea hacia arriba al múltiplo de 1.000 más cercano. */
function roundUpToThousand(amount: number): number {
  return Math.ceil(amount / 1000) * 1000;
}
