export interface ProductPricingConfig {
  materialCostPerM2: number;
  baseLabourCost: number;
  finishCost: number;
  deliveryCostFallback: number;
  marginMultiplier: number;
}

export interface DeliveryPricingConfig {
  baseCost: number;
  tier1LimitKm: number;
  tier2LimitKm: number;
  rate1PerKm: number;
  rate2PerKm: number;
  rate3PerKm: number;
}

export interface PricingConfig {
  mesa: ProductPricingConfig;
  banco: ProductPricingConfig;
  espejo: ProductPricingConfig;
  delivery: DeliveryPricingConfig;
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  mesa: {
    materialCostPerM2: 504_000,
    baseLabourCost: 90_000,
    finishCost: 35_000,
    deliveryCostFallback: 25_000,
    marginMultiplier: 1.35,
  },
  banco: {
    materialCostPerM2: 380_000,
    baseLabourCost: 60_000,
    finishCost: 25_000,
    deliveryCostFallback: 25_000,
    marginMultiplier: 1.35,
  },
  espejo: {
    materialCostPerM2: 250_000,
    baseLabourCost: 0,
    finishCost: 0,
    deliveryCostFallback: 25_000,
    marginMultiplier: 1.0,
  },
  delivery: {
    baseCost: 20_000,
    tier1LimitKm: 15,
    tier2LimitKm: 40,
    rate1PerKm: 1_500,
    rate2PerKm: 3_000,
    rate3PerKm: 5_000,
  },
};

export function getPricingConfig(): PricingConfig {
  return DEFAULT_PRICING_CONFIG;
}
