import type { Metadata } from "next";
import { getVisibleProducts } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import {
  BUSINESS_NAME, CATALOG_SEO, breadcrumbSchema, catalogSchema, jsonLd, localePath, pageAlternates, toLocale,
} from "@/lib/seo";
import CatalogContent from "./CatalogContent";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const seo = CATALOG_SEO[locale];
  return {
    title: seo.title,
    description: seo.description,
    alternates: pageAlternates("/catalogo", locale),
    openGraph: {
      title: `${seo.title} | ${BUSINESS_NAME}`,
      description: seo.description,
      url: localePath("/catalogo", locale),
      locale: locale === "en" ? "en_US" : "es_AR",
      type: "website",
      siteName: BUSINESS_NAME,
      images: [{ url: "/hero-poster.jpg", alt: "La Barraca de Juan, muebles y deco en Tigre" }],
    },
  };
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale);
  const catalog = await getCatalog();
  const products = getVisibleProducts(catalog).filter((product) => product.images.length > 0);
  const schemas = [
    catalogSchema(products, locale),
    breadcrumbSchema([
      { name: BUSINESS_NAME, path: localePath("/", locale) },
      { name: CATALOG_SEO[locale].h1, path: localePath("/catalogo", locale) },
    ]),
  ];

  return (
    <>
      {schemas.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      ))}
      <CatalogContent />
    </>
  );
}
