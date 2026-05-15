/**
 * Shared types for the quotation flow.
 *
 * These types describe the in-memory quotation object that travels through the
 * UI and is eventually persisted (Supabase / Airtable / Sheets / custom API).
 * Keep this file free of UI and storage concerns so it can be reused on the
 * server side later.
 */

export type ProductId =
  | "table"
  | "bench"
  | "chair"
  | "shelf"
  | "coffee-table"
  | "bedside-table"
  | "cylinder";

export type ContactMethod = "email" | "whatsapp";

/** Dimensions captured for a table, in centimeters. */
export interface TableDimensions {
  widthCm: number;
  lengthCm: number;
  heightCm: number;
}

export interface ContactDetails {
  email?: string;
  phone?: string;
  preferredMethod: ContactMethod;
  consent: boolean;
}

/**
 * The full quotation request collected from the user. Discriminated by
 * `productType` so that later we can add other products (bench, chair...) with
 * their own `dimensions` / `specs` shape without breaking the table flow.
 */
export interface QuoteRequest {
  productType: ProductId;
  dimensions: TableDimensions; // For now only "table" is implemented.
  contact: ContactDetails;
  /** ISO 8601 timestamp generated at submit time. */
  requestedAt: string;
}

/**
 * Internal-only pricing breakdown. Never shown to the user in the MVP — it's
 * here so the future pricing engine has a stable contract to render into.
 */
export interface PriceEstimate {
  currency: "ARS" | "USD";
  materialCost: number;
  labourCost: number;
  finishCost: number;
  deliveryCost: number;
  margin: number;
  subtotal: number;
  total: number;
  notes?: string;
}
