import { promises as fs } from "node:fs";
import path from "node:path";
import { head, put } from "@vercel/blob";
import { isCatalogCloudStorageConfigured } from "./catalogStore";

export interface HeroSettings {
  videoUrl: string;
  posterUrl: string | null;
  updatedAt: string | null;
}

export const DEFAULT_HERO: HeroSettings = {
  videoUrl: "/hero.mp4",
  posterUrl: "/hero-poster.jpg",
  updatedAt: null,
};

const HERO_BLOB_PATH = "site/hero.json";
const LOCAL_HERO_PATH = path.join(process.cwd(), ".data", "hero.json");
const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;
const LOCAL_UPLOAD = /^\/uploads\/hero\/[a-z0-9._-]+$/i;

/** Accepts only the bundled default, local dev uploads, or files in our own Blob store. */
export function isAllowedHeroUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value === DEFAULT_HERO.videoUrl ||
      value === DEFAULT_HERO.posterUrl ||
      LOCAL_UPLOAD.test(value) ||
      BLOB_HOST.test(value))
  );
}

export function parseHeroSettings(value: unknown): HeroSettings {
  const data = (value ?? {}) as Record<string, unknown>;
  if (!isAllowedHeroUrl(data.videoUrl)) return structuredClone(DEFAULT_HERO);
  return {
    videoUrl: data.videoUrl,
    posterUrl: isAllowedHeroUrl(data.posterUrl) ? data.posterUrl : null,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
  };
}

export async function getHeroSettings(): Promise<HeroSettings> {
  if (isCatalogCloudStorageConfigured()) {
    try {
      const metadata = await head(HERO_BLOB_PATH);
      const response = await fetch(`${metadata.url}?version=${encodeURIComponent(metadata.etag)}`, {
        cache: "no-store",
      });
      if (response.ok) return parseHeroSettings(await response.json());
    } catch {
      // Nothing saved yet: fall through to local/default.
    }
  }

  try {
    return parseHeroSettings(JSON.parse(await fs.readFile(LOCAL_HERO_PATH, "utf8")));
  } catch {
    return structuredClone(DEFAULT_HERO);
  }
}

export async function saveHeroSettings(input: { videoUrl: unknown; posterUrl: unknown }): Promise<HeroSettings> {
  if (!isAllowedHeroUrl(input.videoUrl)) throw new Error("El video no es válido.");
  const settings: HeroSettings = {
    videoUrl: input.videoUrl,
    posterUrl: isAllowedHeroUrl(input.posterUrl) ? input.posterUrl : null,
    updatedAt: new Date().toISOString(),
  };

  if (isCatalogCloudStorageConfigured()) {
    await put(HERO_BLOB_PATH, JSON.stringify(settings), {
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

  await fs.mkdir(path.dirname(LOCAL_HERO_PATH), { recursive: true });
  await fs.writeFile(LOCAL_HERO_PATH, JSON.stringify(settings, null, 2), "utf8");
  return settings;
}
