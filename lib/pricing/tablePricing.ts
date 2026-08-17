import type { PriceEstimate, TableDimensions } from "../quoteTypes";
import {
  DEFAULT_PRICING_CONFIG,
  type DeliveryPricingConfig,
  type ProductPricingConfig,
} from "./pricingConfig";
import { roundUpToThousand } from "./pricingUtils";

export function calculateDeliveryCost(
  distanceKm: number,
  config: DeliveryPricingConfig = DEFAULT_PRICING_CONFIG.delivery,
): number {
  const calculated = config.baseCost + distanceKm * config.ratePerKm;
  return roundUpToThousand(Math.max(calculated, config.minimumCost));
}

export function calculateTableQuote(
  dimensions: TableDimensions,
  distanceKm: number | null,
  config: ProductPricingConfig = DEFAULT_PRICING_CONFIG.mesa,
  deliveryConfig: DeliveryPricingConfig = DEFAULT_PRICING_CONFIG.delivery,
  includeDelivery = true,
): PriceEstimate {
  const surfaceM2 = (dimensions.widthCm * dimensions.lengthCm) / 10_000;
  return calculateAreaBasedQuote(surfaceM2, distanceKm, config, deliveryConfig, includeDelivery);
}

export function calculateAreaBasedQuote(
  surfaceM2: number,
  distanceKm: number | null,
  config: ProductPricingConfig,
  deliveryConfig: DeliveryPricingConfig,
  includeDelivery: boolean,
): PriceEstimate {
  const materialCost = surfaceM2 * config.materialCostPerM2;
  const productCost = materialCost + config.baseLabourCost + config.finishCost;
  const calculatedPrice = roundUpToThousand(productCost * config.marginMultiplier);
  const furniturePrice = Math.max(calculatedPrice, config.minimumPrice);
  const deliveryCost = includeDelivery
    ? distanceKm === null
      ? config.deliveryCostFallback
      : calculateDeliveryCost(distanceKm, deliveryConfig)
    : 0;

  return {
    currency: "ARS",
    materialCost: Math.round(materialCost),
    labourCost: Math.round(config.baseLabourCost),
    finishCost: config.finishCost,
    deliveryCost,
    margin: furniturePrice - productCost,
    subtotal: Math.round(productCost + deliveryCost),
    total: furniturePrice + deliveryCost,
    notes: includeDelivery
      ? distanceKm !== null
        ? `Envío calculado para ${distanceKm} km.`
        : "Envío estimado, sujeto a confirmación con el taller."
      : "Envío no incluido.",
  };
}
