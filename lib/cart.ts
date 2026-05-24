import { calculateTableQuote } from "./pricing/tablePricing";
import { calculateBenchQuote } from "./pricing/benchPricing";
import { calculateMirrorQuote } from "./pricing/mirrorPricing";
import type { CartItem } from "./quoteTypes";

export function itemPrice(item: CartItem): number {
  if (item.productType === "bench") {
    return calculateBenchQuote(item.dimensions, null).total;
  }
  if (item.productType === "mirror") {
    return calculateMirrorQuote(item.dimensions, null).total;
  }
  return calculateTableQuote(item.dimensions, null).total;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + itemPrice(item), 0);
}

export function cartTotal(items: CartItem[], deliveryCost: number): number {
  return cartSubtotal(items) + deliveryCost;
}
