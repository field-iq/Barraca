import type { Metadata } from "next";
import { AboutSeoText } from "@/components/seo/HomeSeoText";
import { getAboutSettings } from "@/lib/aboutStore";
import { BUSINESS_NAME, breadcrumbSchema, jsonLd, localePath, pageAlternates, toLocale } from "@/lib/seo";
import { AboutContent } from "./AboutContent";

// Re-render at most once a minute; saving from /admin also revalidates immediately.
export const revalidate = 60;

const PAGE_NAME = { es: "Quiénes somos", en: "About us" } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const about = await getAboutSettings();
  const text = locale === "en" ? about.en : about.es;
  const description = (text.body.split(/\n{2,}/)[0] ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
  const title = `${PAGE_NAME[locale]} | ${BUSINESS_NAME}`;
  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates("/quienes-somos", locale),
    openGraph: {
      title,
      description,
      url: localePath("/quienes-somos", locale),
      locale: locale === "en" ? "en_US" : "es_AR",
      type: "website",
      siteName: BUSINESS_NAME,
      images: [{ url: about.photoUrl, alt: text.title }],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale);
  const about = await getAboutSettings();
  const schema = breadcrumbSchema([
    { name: BUSINESS_NAME, path: localePath("/", locale) },
    { name: PAGE_NAME[locale], path: localePath("/quienes-somos", locale) },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <AboutContent about={about} seoText={<AboutSeoText locale={locale} />} />
    </>
  );
}
