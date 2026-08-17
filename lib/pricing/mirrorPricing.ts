import type { PriceEstimate, TableDimensions } from "../quoteTypes";
import {
  DEFAULT_PRICING_CONFIG,
  type DeliveryPricingConfig,
  type ProductPricingConfig,
} from "./pricingConfig";
import { calculateAreaBasedQuote } from "./tablePricing";

export function calculateMirrorQuote(
  dimensions: TableDimensions,
  distanceKm: number | null,
  config: ProductPricingConfig = DEFAULT_PRICING_CONFIG.espejo,
  deliveryConfig: DeliveryPricingConfig = DEFAULT_PRICING_CONFIG.delivery,
  includeDelivery = true,
): PriceEstimate {
  const surfaceM2 = (dimensions.widthCm * dimensions.lengthCm) / 10_000;
  return calculateAreaBasedQuote(surfaceM2, distanceKm, config, deliveryConfig, includeDelivery);
}
