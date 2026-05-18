import { calculateDeliveryCost } from "./pricing/tablePricing";
import { cartSubtotal, cartTotal } from "./cart";
import type { CartQuoteRequest } from "./quoteTypes";

export interface CartSubmitResult {
  ok: true;
  id: string;
  deliveryCost: number;
  subtotal: number;
  total: number;
}

export async function submitQuote(
  request: CartQuoteRequest,
): Promise<CartSubmitResult> {
  let distanceKm: number | null = null;

  if (request.deliveryOption === "delivery" && request.deliveryAddress) {
    distanceKm = await fetchDistanceKm(request.deliveryAddress);
  }

  const deliveryCost =
    request.deliveryOption === "delivery" && distanceKm !== null
      ? calculateDeliveryCost(distanceKm)
      : 0;

  const subtotal = cartSubtotal(request.items);
  const total = cartTotal(request.items, deliveryCost);

  const payload = { ...request, deliveryCost, subtotal, total };
  console.log("[La Barraca] Nueva cotización:", payload);

  await new Promise((r) => setTimeout(r, 300));

  return { ok: true, id: cryptoRandomId(), deliveryCost, subtotal, total };
}

async function fetchDistanceKm(address: string): Promise<number | null> {
  try {
    const params = new URLSearchParams({ address });
    const response = await fetch(`/api/distance?${params}`);
    if (!response.ok) return null;
    const data: { distanceKm: number | null } = await response.json();
    return data.distanceKm ?? null;
  } catch {
    return null;
  }
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}
