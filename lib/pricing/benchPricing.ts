import type { PriceEstimate, TableDimensions } from "../quoteTypes";
import { calculateDeliveryCost } from "./tablePricing";
import {
  type ProductPricingConfig,
  DEFAULT_PRICING_CONFIG,
} from "./pricingConfig";

export function calculateBenchQuote(
  dimensions: TableDimensions,
  distanceKm: number | null,
  config: ProductPricingConfig = DEFAULT_PRICING_CONFIG.banco,
): PriceEstimate {
  const surfaceM2 = (dimensions.widthCm * dimensions.lengthCm) / 10_000;

  const materialCost = surfaceM2 * config.materialCostPerM2;
  const labourCost = config.baseLabourCost;
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

function roundUpToThousand(amount: number): number {
  return Math.ceil(amount / 1000) * 1000;
}
