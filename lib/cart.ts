import { calculateTableQuote } from "./pricing/tablePricing";
import type { CartItem } from "./quoteTypes";

export function itemPrice(item: CartItem): number {
  return calculateTableQuote(item.dimensions, null).total;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + itemPrice(item), 0);
}

export function cartTotal(items: CartItem[], deliveryCost: number): number {
  return cartSubtotal(items) + deliveryCost;
}
