import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardItemView } from "@/components/StandardItemView";
import { getVisibleProducts } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import {
  BUSINESS_NAME, CATALOG_SEO, breadcrumbSchema, jsonLd, localePath, pageAlternates, productSchema, toLocale,
} from "@/lib/seo";

interface StandardItemPageProps {
  params: Promise<{ locale: string; section: string }>;
}
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: StandardItemPageProps): Promise<Metadata> {
  const { locale: rawLocale, section } = await params;
  const locale = toLocale(rawLocale);
  const catalog = await getCatalog();
  const item = getVisibleProducts(catalog).find((product) => product.id === section);

  if (!item) return { title: "Muebles de madera", robots: { index: false } };

  const title = locale === "en" && item.detailTitleEn ? item.detailTitleEn : item.detailTitle;
  const description = (locale === "en" && item.descriptionEn ? item.descriptionEn : item.description).trim();
  const path = `/estandar/${item.id}`;
  return {
    title,
    description,
    alternates: pageAlternates(path, locale),
    openGraph: {
      title: `${title} | ${BUSINESS_NAME}`,
      description,
      url: localePath(path, locale),
      locale: locale === "en" ? "en_US" : "es_AR",
      type: "website",
      siteName: BUSINESS_NAME,
      images: item.images.slice(0, 1).map((url) => ({ url, alt: item.imageAlt || title })),
    },
  };
}

export default async function StandardItemPage({ params }: StandardItemPageProps) {
  const { locale: rawLocale, section } = await params;
  const locale = toLocale(rawLocale);
  const catalog = await getCatalog();
  const item = getVisibleProducts(catalog).find((product) => product.id === section);

  if (!item || item.images.length === 0) notFound();

  const category = catalog.categories.find((entry) => entry.id === item.categoryId);
  const title = locale === "en" && item.detailTitleEn ? item.detailTitleEn : item.detailTitle;
  const schemas = [
    productSchema(item, locale),
    breadcrumbSchema([
      { name: BUSINESS_NAME, path: localePath("/", locale) },
      { name: CATALOG_SEO[locale].h1, path: localePath("/catalogo", locale) },
      { name: title, path: localePath(`/estandar/${item.id}`, locale) },
    ]),
  ];

  return (
    <>
      {schemas.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      ))}
      <StandardItemView item={item} categoryName={category?.name} categoryNameEn={category?.nameEn} />
    </>
  );
}
