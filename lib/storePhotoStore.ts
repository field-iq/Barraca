import { promises as fs } from "node:fs";
import path from "node:path";
import { head, put } from "@vercel/blob";
import { isCatalogCloudStorageConfigured } from "./catalogStore";

export interface StorePhotoSettings {
  photoUrl: string;
  updatedAt: string | null;
}

export const DEFAULT_STORE_PHOTO: StorePhotoSettings = {
  photoUrl: "/local-tigre.jpg",
  updatedAt: null,
};

const STORE_PHOTO_BLOB_PATH = "site/store-photo.json";
const LOCAL_STORE_PHOTO_PATH = path.join(process.cwd(), ".data", "store-photo.json");
const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;
const LOCAL_UPLOAD = /^\/uploads\/local\/[a-z0-9._-]+$/i;

/** Accepts only the bundled default, local dev uploads, or files in a Vercel Blob store. */
export function isAllowedStorePhotoUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value === DEFAULT_STORE_PHOTO.photoUrl || LOCAL_UPLOAD.test(value) || BLOB_HOST.test(value))
  );
}

export function parseStorePhotoSettings(value: unknown): StorePhotoSettings {
  const data = (value ?? {}) as Record<string, unknown>;
  if (!isAllowedStorePhotoUrl(data.photoUrl)) return structuredClone(DEFAULT_STORE_PHOTO);
  return {
    photoUrl: data.photoUrl,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
  };
}

export async function getStorePhotoSettings(): Promise<StorePhotoSettings> {
  if (isCatalogCloudStorageConfigured()) {
    try {
      const metadata = await head(STORE_PHOTO_BLOB_PATH);
      const response = await fetch(`${metadata.url}?version=${encodeURIComponent(metadata.etag)}`, {
        cache: "no-store",
      });
      if (response.ok) return parseStorePhotoSettings(await response.json());
    } catch {
      // Nothing saved yet: fall through to local/default.
    }
  }

  try {
    return parseStorePhotoSettings(JSON.parse(await fs.readFile(LOCAL_STORE_PHOTO_PATH, "utf8")));
  } catch {
    return structuredClone(DEFAULT_STORE_PHOTO);
  }
}

export async function saveStorePhotoSettings(input: { photoUrl: unknown }): Promise<StorePhotoSettings> {
  if (!isAllowedStorePhotoUrl(input.photoUrl)) throw new Error("La foto no es válida.");
  const settings: StorePhotoSettings = {
    photoUrl: input.photoUrl,
    updatedAt: new Date().toISOString(),
  };

  if (isCatalogCloudStorageConfigured()) {
    await put(STORE_PHOTO_BLOB_PATH, JSON.stringify(settings), {
      access: "public",
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });
    return settings;
  }

  if (process.env.VERCEL) {
    throw new Error("Conectá Vercel Blob antes de guardar cambios en producción.");
  }

  await fs.mkdir(path.dirname(LOCAL_STORE_PHOTO_PATH), { recursive: true });
  await fs.writeFile(LOCAL_STORE_PHOTO_PATH, JSON.stringify(settings, null, 2), "utf8");
  return settings;
}
