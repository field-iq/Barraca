import { promises as fs } from "node:fs";
import path from "node:path";
import { head, put } from "@vercel/blob";
import { DEFAULT_PRICING_CONFIG, type PricingConfig, validatePricingConfig } from "./pricingConfig";

const PRICING_BLOB_PATH = "pricing/pricing.json";
const LOCAL_PRICING_PATH = path.join(process.cwd(), ".data", "pricing.json");

export function isPricingCloudStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getPricingConfig(): Promise<PricingConfig> {
  if (isPricingCloudStorageConfigured()) {
    try {
      const metadata = await head(PRICING_BLOB_PATH);
      const response = await fetch(`${metadata.url}?version=${encodeURIComponent(metadata.etag)}`, { cache: "no-store" });
      if (response.ok) return validatePricingConfig(await response.json());
    } catch {
      // The first save creates the cloud configuration.
    }
  }
  try {
    const content = await fs.readFile(LOCAL_PRICING_PATH, "utf8");
    return validatePricingConfig(JSON.parse(content));
  } catch {
    return structuredClone(DEFAULT_PRICING_CONFIG);
  }
}

export async function savePricingConfig(value: unknown): Promise<PricingConfig> {
  const config = validatePricingConfig(value);
  if (isPricingCloudStorageConfigured()) {
    await put(PRICING_BLOB_PATH, JSON.stringify(config), {
      access: "public",
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });
    return config;
  }
  if (process.env.VERCEL) {
    throw new Error("Conectá Vercel Blob antes de guardar cambios en producción.");
  }
  await fs.mkdir(path.dirname(LOCAL_PRICING_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PRICING_PATH, JSON.stringify(config, null, 2), "utf8");
  return config;
}
