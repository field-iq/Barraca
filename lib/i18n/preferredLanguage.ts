import type { Language } from "./translations";

export const LANGUAGE_COOKIE = "lbj-lang";

export function isLanguage(value: unknown): value is Language {
  return value === "es" || value === "en";
}

/**
 * Picks the first supported language the browser lists, honouring q-values
 * ("en-US,en;q=0.9,es;q=0.8" -> "en"). Spanish is the default when none match.
 */
export function languageFromAcceptHeader(header: string | null | undefined): Language {
  if (!header) return "es";
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number(q.slice(2)) : 1;
      return { primary: tag.trim().toLowerCase().split("-")[0], quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.quality > 0 && isLanguage(entry.primary))
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  return (ranked[0]?.primary as Language | undefined) ?? "es";
}
