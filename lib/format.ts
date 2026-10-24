export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Las medidas se cargan en español; en inglés se traducen las palabras y las unidades. */
export function localizeDimensions(dimensions: string, language: "es" | "en"): string {
  if (language === "es") return dimensions;
  return dimensions
    .replace(/\bmts\.?/gi, "m")
    .replace(/\bprof\.?/gi, "deep")
    .replace(/\balto\b/gi, "high")
    .replace(/di[aá]metro/gi, "diameter")
    .replace(/ y /g, " and ");
}
