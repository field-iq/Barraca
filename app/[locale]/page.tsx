"use client";

import { Camera, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/nav/footer";
import { Hero } from "@/components/marketing/hero";
import { CategoryTile } from "@/components/product/category-tile";
import { ContactCard } from "@/components/nav/contact-card";
import { CtaSection } from "@/components/marketing/cta-section";
import { useLanguage, withLocalePrefix } from "@/lib/i18n/LanguageContext";

const WHATSAPP_URL = "https://wa.me/5491153791654";
const INSTAGRAM_URL = "https://www.instagram.com/labarracadejuan_/";

const storeAddresses = [
  {
    name: "Boulevard Sáenz Peña",
    address: "Boulevard Sáenz Peña 1213, esquina Guareschi",
    hoursKey: "home.stores.hours",
    map: "https://www.google.com/maps/search/?api=1&query=Boulevard+Saenz+Pena+1213+Tigre",
  },
] as const;

export default function HomePage() {
  const { language, t } = useLanguage();

  const catalogHref = withLocalePrefix("/catalogo", language);
  const customHref = withLocalePrefix("/catalogo#a-medida", language);

  const featuredPieces = [
    { id: "piece1", name: t("home.piece1.eyebrow"), subtitle: t("home.piece1.detail"), image: "/mesa-2.jpeg", alt: "Mesa de comedor artesanal de madera" },
    { id: "piece2", name: t("home.piece2.eyebrow"), subtitle: t("home.piece2.detail"), image: "/mesa-ratona-1.jpeg", alt: "Mesa ratona artesanal con detalles recuperados" },
    { id: "piece3", name: t("home.piece3.eyebrow"), subtitle: t("home.piece3.detail"), image: "/estanteria-1.jpeg", alt: "Estantería artesanal de madera" },
    { id: "piece4", name: t("home.piece4.eyebrow"), subtitle: t("home.piece4.detail"), image: "/banco-1.jpeg", alt: "Banco artesanal de madera" },
    { id: "piece5", name: t("home.piece5.eyebrow"), subtitle: t("home.piece5.detail"), image: "/espejo-1.jpeg", alt: "Espejo con marco de madera maciza" },
    { id: "piece6", name: t("home.piece6.eyebrow"), subtitle: t("home.piece6.detail"), image: "/catalogo/cilindros/1.jpeg", alt: "Cilindros de madera maciza" },
  ];

  const stores = storeAddresses.map((store) => ({ ...store, hours: t(store.hoursKey) }));

  return (
    <>
      <Header />
      <main className="pt-2">
        <Hero
          eyebrow={t("home.hero.eyebrow")}
          title={t("home.hero.title")}
          body={t("home.hero.body")}
          image="/mesa-2.jpeg"
          imageAlt="Mesa de comedor artesanal de madera"
          primaryCta={{ label: t("home.custom.cta"), href: customHref }}
          secondaryCta={{ label: t("home.ready.cta"), href: catalogHref }}
        />

        <section id="coleccion" className="scroll-mt-4 px-4 py-8 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-6xl text-xs font-semibold uppercase tracking-[0.14em] text-nm-muted">
            {t("home.featured.label")}
          </p>
          <div className="mx-auto mt-4 grid max-w-6xl gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featuredPieces.map((piece) => (
              <CategoryTile key={piece.id} name={piece.name} subtitle={piece.subtitle} image={piece.image} imageAlt={piece.alt} href={catalogHref} />
            ))}
          </div>
        </section>

        <section id="locales" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-muted">{t("home.stores.eyebrow")}</p>
            <h2 className="mt-3 font-heading text-4xl text-nm-text sm:text-5xl">{t("home.stores.title")}</h2>
            <div className="mt-8 grid gap-4 sm:gap-6 md:max-w-md">
              {stores.map((store) => (
                <ContactCard
                  key={store.name}
                  title={store.name}
                  address={store.address}
                  hours={store.hours}
                  mapHref={store.map}
                  directionsLabel={t("home.stores.directions")}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <CtaSection
            title={t("home.idea.title")}
            body={t("home.idea.description")}
            primary={{ label: "WhatsApp", href: WHATSAPP_URL, icon: <MessageCircle className="size-4" /> }}
            secondary={{ label: "Instagram", href: INSTAGRAM_URL, icon: <Camera className="size-4" /> }}
          />
        </section>
      </main>

      <Footer
        tagline={t("footer.tagline")}
        notice={t("footer.notice")}
        developedByLabel={t("footer.developedBy")}
        instagramUrl={INSTAGRAM_URL}
        whatsappUrl={WHATSAPP_URL}
      />
    </>
  );
}
