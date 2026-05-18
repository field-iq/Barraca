import { calculateTableQuote } from "./pricing/tablePricing";
import type { PriceEstimate, QuoteRequest } from "./quoteTypes";

export interface SubmitQuoteResult {
  ok: true;
  id: string;
  /** Price breakdown shown to the user after submission. */
  estimate: PriceEstimate | null;
}

export async function submitQuote(
  request: QuoteRequest,
): Promise<SubmitQuoteResult> {
  let distanceKm: number | null = null;

  if (request.productType === "table" && request.deliveryAddress) {
    distanceKm = await fetchDistanceKm(request.deliveryAddress);
  }

  const estimate =
    request.productType === "table"
      ? calculateTableQuote(request.dimensions, distanceKm)
      : null;

  const payload = { ...request, estimate };

  // eslint-disable-next-line no-console
  console.log("[La Barraca] Nueva cotización:", payload);

  // TODO: enviar email al cliente y a La Barraca con este payload.
  await new Promise((r) => setTimeout(r, 300));

  return { ok: true, id: cryptoRandomId(), estimate };
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
