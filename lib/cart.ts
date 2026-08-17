import { calculateBenchQuote } from "./pricing/benchPricing";
import { calculateMirrorQuote } from "./pricing/mirrorPricing";
import type { PricingConfig } from "./pricing/pricingConfig";
import { calculateTableQuote } from "./pricing/tablePricing";
import type { CartItem } from "./quoteTypes";

export function itemPrice(item: CartItem, config: PricingConfig): number {
  if (item.productType === "bench") {
    return calculateBenchQuote(item.dimensions, null, config.banco, config.delivery, false).total;
  }
  if (item.productType === "mirror") {
    return calculateMirrorQuote(item.dimensions, null, config.espejo, config.delivery, false).total;
  }
  return calculateTableQuote(item.dimensions, null, config.mesa, config.delivery, false).total;
}

export function cartSubtotal(items: CartItem[], config: PricingConfig): number {
  return items.reduce((sum, item) => sum + itemPrice(item, config), 0);
}

export function cartTotal(items: CartItem[], deliveryCost: number, config: PricingConfig): number {
  return cartSubtotal(items, config) + deliveryCost;
}
