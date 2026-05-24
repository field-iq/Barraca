import type { PriceEstimate, TableDimensions } from "../quoteTypes";
import { calculateDeliveryCost } from "./tablePricing";
import {
  type ProductPricingConfig,
  DEFAULT_PRICING_CONFIG,
} from "./pricingConfig";
import { roundUpToThousand } from "./pricingUtils";

export function calculateMirrorQuote(
  dimensions: TableDimensions,
  distanceKm: number | null,
  config: ProductPricingConfig = DEFAULT_PRICING_CONFIG.espejo,
): PriceEstimate {
  const surfaceM2 = (dimensions.widthCm * dimensions.lengthCm) / 10_000;

  const materialCost = surfaceM2 * config.materialCostPerM2;

  const deliveryCost =
    distanceKm !== null
      ? calculateDeliveryCost(distanceKm)
      : config.deliveryCostFallback;

  const subtotal = materialCost + deliveryCost;
  const total = roundUpToThousand(subtotal * config.marginMultiplier);
  const margin = total - subtotal;

  return {
    currency: "ARS",
    materialCost: Math.round(materialCost),
    labourCost: 0,
    finishCost: 0,
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
