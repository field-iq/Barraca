import type { MetadataRoute } from "next";
import { getVisibleProducts } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { SITE_URL } from "@/lib/contactInfo";

export const dynamic = "force-dynamic";

function bothLanguages(path: string, priority: number): MetadataRoute.Sitemap {
  const es = `${SITE_URL}${path === "/" ? "" : path}`;
  const en = `${SITE_URL}/en${path === "/" ? "" : path}`;
  const alternates = { languages: { es, en } };
  return [
    { url: es, changeFrequency: "weekly", priority, alternates },
    { url: en, changeFrequency: "weekly", priority: priority - 0.1, alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const products = getVisibleProducts(catalog).filter((product) => product.images.length > 0);
  return [
    ...bothLanguages("/", 1),
    ...bothLanguages("/catalogo", 0.9),
    ...bothLanguages("/quienes-somos", 0.6),
    ...products.flatMap((product) => bothLanguages(`/estandar/${product.id}`, 0.7)),
  ];
}
