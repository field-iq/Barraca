import { promises as fs } from "node:fs";
import path from "node:path";
import { head, put } from "@vercel/blob";
import {
  DEFAULT_CATALOG,
  type CatalogData,
  validateCatalog,
} from "./catalog";

const CATALOG_BLOB_PATH = "catalog/catalog.json";
const LOCAL_CATALOG_PATH = path.join(process.cwd(), ".data", "catalog.json");

export function isCatalogCloudStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getCatalog(): Promise<CatalogData> {
  if (isCatalogCloudStorageConfigured()) {
    try {
      const metadata = await head(CATALOG_BLOB_PATH);
      const response = await fetch(
        `${metadata.url}?version=${encodeURIComponent(metadata.etag)}`,
        { cache: "no-store" },
      );
      if (response.ok) return validateCatalog(await response.json());
    } catch {
      // The first save creates the cloud catalog. Until then use local/default data.
    }
  }

  try {
    const content = await fs.readFile(LOCAL_CATALOG_PATH, "utf8");
    return validateCatalog(JSON.parse(content));
  } catch {
    return structuredClone(DEFAULT_CATALOG);
  }
}

export async function saveCatalog(value: unknown): Promise<CatalogData> {
  const catalog = validateCatalog(value);

  if (isCatalogCloudStorageConfigured()) {
    await put(CATALOG_BLOB_PATH, JSON.stringify(catalog), {
      access: "public",
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });
    return catalog;
  }

  if (process.env.VERCEL) {
    throw new Error("Conecta Vercel Blob antes de guardar cambios en produccion.");
  }

  await fs.mkdir(path.dirname(LOCAL_CATALOG_PATH), { recursive: true });
  await fs.writeFile(LOCAL_CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf8");
  return catalog;
}
