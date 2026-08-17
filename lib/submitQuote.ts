import type { CartQuoteRequest } from "./quoteTypes";

export interface CartSubmitResult {
  ok: true;
  id: string;
  deliveryCost: number;
  deliveryDescription: string;
  subtotal: number;
  total: number;
}

export async function submitQuote(request: CartQuoteRequest): Promise<CartSubmitResult> {
  const response = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "No se pudo enviar la cotización.");
  return data as CartSubmitResult;
}
