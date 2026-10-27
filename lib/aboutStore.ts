import { promises as fs } from "node:fs";
import path from "node:path";
import { head, put } from "@vercel/blob";
import { ABOUT_LIMITS, type AboutSettings, type AboutText } from "./aboutShared";
import { isCatalogCloudStorageConfigured } from "./catalogStore";
import { DEFAULT_STORE_PHOTO, isAllowedStorePhotoUrl } from "./storePhotoStore";

export const DEFAULT_ABOUT: AboutSettings = {
  photoUrl: DEFAULT_STORE_PHOTO.photoUrl,
  es: {
    title: "Una mueblería familiar en Tigre",
    body: [
      "La Barraca de Juan es una mueblería familiar: Juan y Luis están al frente del taller y del local en Tigre. Trabajamos la madera a mano, con la idea de que cada mueble tenga carácter y dure toda la vida.",
      "Buena parte de lo que hacemos nace de madera recuperada. Les damos una segunda vida a tablones, puertas y persianas, y las convertimos en mesas, bancos, estanterías y espejos con historia.",
      "Hacemos piezas listas para llevar y también muebles a medida. Si tenés una idea, la pensamos juntos. Pasá por el local, en Boulevard Sáenz Peña 1213, y conocenos.",
    ].join("\n\n"),
  },
  en: {
    title: "A family furniture shop in Tigre",
    body: [
      "La Barraca de Juan is a family furniture shop: Juan and Luis run the workshop and the store in Tigre. We work the wood by hand, so that every piece has character and lasts a lifetime.",
      "A good part of what we make starts as reclaimed wood. We give planks, doors and shutters a second life and turn them into tables, benches, shelves and mirrors with a story.",
      "We make ready-to-take-home pieces and custom furniture too. If you have an idea, we'll figure it out together. Come by the store at Boulevard Sáenz Peña 1213 and say hello.",
    ].join("\n\n"),
  },
  updatedAt: null,
};

const ABOUT_BLOB_PATH = "site/about.json";
const LOCAL_ABOUT_PATH = path.join(process.cwd(), ".data", "about.json");

function cleanText(value: unknown, fallback: AboutText): AboutText {
  const data = (value ?? {}) as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title.trim().slice(0, ABOUT_LIMITS.title) : "";
  const body = typeof data.body === "string" ? data.body.replace(/\r\n/g, "\n").trim().slice(0, ABOUT_LIMITS.body) : "";
  return { title: title || fallback.title, body: body || fallback.body };
}

export function parseAboutSettings(value: unknown): AboutSettings {
  const data = (value ?? {}) as Record<string, unknown>;
  return {
    photoUrl: isAllowedStorePhotoUrl(data.photoUrl) ? data.photoUrl : DEFAULT_ABOUT.photoUrl,
    es: cleanText(data.es, DEFAULT_ABOUT.es),
    en: cleanText(data.en, DEFAULT_ABOUT.en),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
  };
}

export async function getAboutSettings(): Promise<AboutSettings> {
  if (isCatalogCloudStorageConfigured()) {
    try {
      const metadata = await head(ABOUT_BLOB_PATH);
      const response = await fetch(`${metadata.url}?version=${encodeURIComponent(metadata.etag)}`, {
        cache: "no-store",
      });
      if (response.ok) return parseAboutSettings(await response.json());
    } catch {
      // Nothing saved yet: fall through to local/default.
    }
  }

  try {
    return parseAboutSettings(JSON.parse(await fs.readFile(LOCAL_ABOUT_PATH, "utf8")));
  } catch {
    return structuredClone(DEFAULT_ABOUT);
  }
}

export async function saveAboutSettings(input: unknown): Promise<AboutSettings> {
  const data = (input ?? {}) as Record<string, unknown>;
  if (data.photoUrl !== undefined && !isAllowedStorePhotoUrl(data.photoUrl)) {
    throw new Error("La foto no es válida.");
  }
  const settings: AboutSettings = { ...parseAboutSettings(data), updatedAt: new Date().toISOString() };

  if (isCatalogCloudStorageConfigured()) {
    await put(ABOUT_BLOB_PATH, JSON.stringify(settings), {
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

  await fs.mkdir(path.dirname(LOCAL_ABOUT_PATH), { recursive: true });
  await fs.writeFile(LOCAL_ABOUT_PATH, JSON.stringify(settings, null, 2), "utf8");
  return settings;
}
