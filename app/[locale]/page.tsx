import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { HomeSeoText } from "@/components/seo/HomeSeoText";
import { getHeroSettings } from "@/lib/heroStore";
import { getStorePhotoSettings } from "@/lib/storePhotoStore";
import {
  BUSINESS_NAME, HOME_SEO, businessSchema, faqSchema, jsonLd, localePath, pageAlternates, toLocale, websiteSchema,
} from "@/lib/seo";
import { HomeContent } from "./HomeContent";

// Re-render at most once a minute; saving from /admin also revalidates immediately.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const seo = HOME_SEO[locale];
  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords:
      locale === "en"
        ? ["custom wooden furniture", "solid wood furniture", "furniture in Tigre", "custom dining tables", "reclaimed wood furniture", "furniture Buenos Aires", "reclaimed wood", "recycled wood furniture", "upcycled furniture", "circular economy", "sustainable furniture", "second life furniture", "reuse"]
        : ["muebles de madera", "muebles a medida", "muebles en Tigre", "mesas de madera maciza", "mesas a medida", "muebles de madera recuperada", "muebles zona norte", "madera recuperada", "madera reciclada", "muebles reciclados", "reciclaje", "reciclado", "segunda vida", "economía circular", "muebles circulares", "reutilizar madera", "reutilización", "muebles sustentables"],
    alternates: pageAlternates("/", locale),
    // Page-level openGraph replaces the layout's whole object, so repeat the shared fields.
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: localePath("/", locale),
      locale: locale === "en" ? "en_US" : "es_AR",
      type: "website",
      siteName: BUSINESS_NAME,
      images: [{ url: "/hero-poster.jpg", alt: "La Barraca de Juan, muebles y deco en Tigre" }],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale);
  const [hero, storePhoto] = await Promise.all([getHeroSettings(), getStorePhotoSettings()]);
  return (
    <>
      {[businessSchema(locale), websiteSchema(), faqSchema(locale)].map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      ))}
      <HomeContent
        storePhotoUrl={storePhoto.photoUrl}
        seoText={<HomeSeoText locale={locale} />}
        hero={<Hero title={HOME_SEO[locale].h1} videoSrc={hero.videoUrl} posterSrc={hero.posterUrl ?? undefined} />}
      />
    </>
  );
}
