import { calculateTableQuote } from "./pricing/tablePricing";
import type { PriceEstimate, QuoteRequest } from "./quoteTypes";

export interface SubmitQuoteResult {
  ok: true;
  id: string;
  /** Price breakdown shown to the user after submission. */
  estimate: PriceEstimate | null;
}

/**
 * Mock submission for the MVP.
 *
 * Replace the body with a real integration when ready:
 *   - Supabase:   await supabase.from("quotes").insert(payload)
 *   - Airtable:   POST https://api.airtable.com/v0/{base}/quotes
 *   - Sheets:     POST to a Google Apps Script web app
 *   - Email:      POST a server route (e.g. /api/quote) that calls Resend /
 *                 SendGrid / Nodemailer to email the customer + the workshop.
 *
 * The function signature should stay the same so the UI doesn't need to change.
 */
export async function submitQuote(
  request: QuoteRequest,
): Promise<SubmitQuoteResult> {
  const estimate =
    request.productType === "table"
      ? calculateTableQuote(request.dimensions)
      : null;

  const payload = { ...request, estimate };

  // eslint-disable-next-line no-console
  console.log("[La Barraca] Nueva cotización:", payload);

  // TODO: enviar email al cliente y a La Barraca con este payload.
  // En el cliente esto no se puede hacer directo — hay que crear una API
  // route (app/api/quote/route.ts) que use Resend / SendGrid / Nodemailer.

  // Latencia simulada para que el botón "Enviando..." se vea.
  await new Promise((r) => setTimeout(r, 300));

  return { ok: true, id: cryptoRandomId(), estimate };
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}
