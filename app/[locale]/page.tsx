import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { CONTACT_EMAIL, SITE_URL, WHATSAPP_NUMBER } from "@/lib/contactInfo";
import { getHeroSettings } from "@/lib/heroStore";
import { getStorePhotoSettings } from "@/lib/storePhotoStore";
import { HomeContent } from "./HomeContent";

// Re-render at most once a minute; saving from /admin also revalidates immediately.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: locale === "en" ? "/en" : "/",
      languages: { es: "/", en: "/en", "x-default": "/" },
    },
    // Page-level openGraph replaces the layout's whole object, so repeat the shared fields.
    openGraph: {
      title: "La Barraca de Juan | Muebles & deco",
      description:
        locale === "en"
          ? "Ready-to-take-home pieces and custom-made furniture in Tigre, Argentina."
          : "Piezas listas para llevar y muebles hechos a medida en Tigre.",
      url: locale === "en" ? "/en" : "/",
      locale: locale === "en" ? "en_US" : "es_AR",
      type: "website",
      siteName: "La Barraca de Juan",
      images: [{ url: "/hero-poster.jpg", alt: "La Barraca de Juan, muebles y deco en Tigre" }],
    },
  };
}

const businessData = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: "La Barraca de Juan",
  url: SITE_URL,
  image: `${SITE_URL}/local-tigre.jpg`,
  logo: `${SITE_URL}/logo.png`,
  description: "Muebles con historia, piezas listas para llevar y diseños a medida en Tigre.",
  email: CONTACT_EMAIL,
  telephone: `+${WHATSAPP_NUMBER}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Boulevard Sáenz Peña 1213",
    addressLocality: "Tigre",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "09:00", closes: "19:30" },
  ],
  sameAs: ["https://www.instagram.com/labarracadejuan_/"],
};

export default async function HomePage() {
  const [hero, storePhoto] = await Promise.all([getHeroSettings(), getStorePhotoSettings()]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData).replace(/</g, "\\u003c") }}
      />
      <HomeContent
        storePhotoUrl={storePhoto.photoUrl}
        hero={<Hero title="La Barraca de Juan" videoSrc={hero.videoUrl} posterSrc={hero.posterUrl ?? undefined} />}
      />
    </>
  );
}
