"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Camera,
  MapPin,
  MessageCircle,
  Ruler,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/Header";
import { SqueezeCarousel, type SqueezeSlide } from "@/components/ui/carousel-squeeze";
import { ParallaxHero } from "@/components/ui/parallax-hero";
import { useLanguage, withLocalePrefix } from "@/lib/i18n/LanguageContext";

const pieceTag = (category: string, status: string) => (
  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
    {category} · {status}
  </span>
);

const WHATSAPP_URL = "https://wa.me/5491153791654";

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
  const pieceCta = t("home.piece.cta");

  const featuredPieces: SqueezeSlide[] = [
    {
      id: "piece1",
      title: t("home.piece1.title"),
      description: t("home.piece1.description"),
      overlay: pieceTag(t("home.piece1.eyebrow"), t("home.piece1.detail")),
      image: "/mesa-2.jpeg",
      imageAlt: "Mesa de comedor artesanal de madera",
      action: pieceCta,
      href: catalogHref,
    },
    {
      id: "piece2",
      title: t("home.piece2.title"),
      description: t("home.piece2.description"),
      overlay: pieceTag(t("home.piece2.eyebrow"), t("home.piece2.detail")),
      image: "/mesa-ratona-1.jpeg",
      imageAlt: "Mesa ratona artesanal con detalles recuperados",
      action: pieceCta,
      href: catalogHref,
    },
    {
      id: "piece3",
      title: t("home.piece3.title"),
      description: t("home.piece3.description"),
      overlay: pieceTag(t("home.piece3.eyebrow"), t("home.piece3.detail")),
      image: "/estanteria-1.jpeg",
      imageAlt: "Estantería artesanal de madera",
      action: pieceCta,
      href: catalogHref,
    },
    {
      id: "piece4",
      title: t("home.piece4.title"),
      description: t("home.piece4.description"),
      overlay: pieceTag(t("home.piece4.eyebrow"), t("home.piece4.detail")),
      image: "/banco-1.jpeg",
      imageAlt: "Banco artesanal de madera",
      action: pieceCta,
      href: catalogHref,
    },
    {
      id: "piece5",
      title: t("home.piece5.title"),
      description: t("home.piece5.description"),
      overlay: pieceTag(t("home.piece5.eyebrow"), t("home.piece5.detail")),
      image: "/espejo-1.jpeg",
      imageAlt: "Espejo con marco de madera maciza",
      action: pieceCta,
      href: catalogHref,
    },
    {
      id: "piece6",
      title: t("home.piece6.title"),
      description: t("home.piece6.description"),
      overlay: pieceTag(t("home.piece6.eyebrow"), t("home.piece6.detail")),
      image: "/catalogo/cilindros/1.jpeg",
      imageAlt: "Cilindros de madera maciza",
      action: pieceCta,
      href: catalogHref,
    },
  ];

  const stores = storeAddresses.map((store) => ({ ...store, hours: t(store.hoursKey) }));

  return (
    <>
      <Header overlay />
      <main>
        <ParallaxHero />

        <section id="coleccion" className="scroll-mt-4 bg-[#f7f4ee] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto grid max-w-[1800px] gap-4 sm:gap-6 md:grid-cols-2">
            <Link
              href={withLocalePrefix("/catalogo", language)}
              className="group flex items-center justify-center gap-5 rounded-2xl border border-sand bg-white p-8 shadow-[0_15px_25px_-5px_rgba(20,15,10,0.25),0_25px_45px_-10px_rgba(20,15,10,0.3)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_25px_35px_-5px_rgba(20,15,10,0.3),0_35px_60px_-12px_rgba(20,15,10,0.4)] sm:p-10 lg:p-12"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#233c33] text-white">
                <ShoppingBag size={24} aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-2.5 font-serif text-2xl text-walnut sm:text-3xl">
                {t("home.ready.cta")} <ArrowRight size={22} className="shrink-0 text-[#216e4e] transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={withLocalePrefix("/catalogo#a-medida", language)}
              className="group flex items-center justify-center gap-5 rounded-2xl border border-sand bg-white p-8 shadow-[0_15px_25px_-5px_rgba(20,15,10,0.25),0_25px_45px_-10px_rgba(20,15,10,0.3)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_25px_35px_-5px_rgba(20,15,10,0.3),0_35px_60px_-12px_rgba(20,15,10,0.4)] sm:p-10 lg:p-12"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#b85c3d] text-white">
                <Ruler size={24} aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-2.5 font-serif text-2xl text-walnut sm:text-3xl">
                {t("home.custom.cta")} <ArrowRight size={22} className="shrink-0 text-[#b04d31] transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#17211e] py-16 text-white sm:py-24">
          <Image src="/textures/aged-painted-boards.jpg" alt="" fill sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-[#14201c]/75" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/20" />
          <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
            <SqueezeCarousel
              slides={featuredPieces}
              label={t("home.featured.label")}
              radius={20}
              height="clamp(180px, 38cqi, 460px)"
              aspectRatio={4 / 3}
              style={
                {
                  "--foreground": "#f7efe4",
                  "--muted-foreground": "#cbbfae",
                  "--background": "#17211e",
                  "--muted": "#22312c",
                } as React.CSSProperties
              }
            />
          </div>
        </section>

        <section id="locales" className="scroll-mt-20 bg-[#f7f4ee]">
          <div className="relative flex min-h-[360px] items-end overflow-hidden text-white sm:min-h-[460px]">
            <Image src="/textures/timber-rings.jpg" alt="Troncos de madera vistos de frente" fill sizes="100vw" className="object-cover object-center" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#1d241f]/90 via-[#1d241f]/55 to-black/15" />
            <div className="relative mx-auto w-full max-w-[1800px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
              <div className="max-w-2xl border-l border-white/45 pl-5 sm:pl-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">{t("home.stores.eyebrow")}</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{t("home.stores.title")}</h2>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1800px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-4 sm:gap-6 md:max-w-md">
              {stores.map((store) => (
                <article
                  key={store.name}
                  className="rounded-2xl border border-sand bg-white p-6 shadow-[0_15px_25px_-5px_rgba(20,15,10,0.25),0_25px_45px_-10px_rgba(20,15,10,0.3)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_25px_35px_-5px_rgba(20,15,10,0.3),0_35px_60px_-12px_rgba(20,15,10,0.4)] sm:p-8"
                >
                  <MapPin size={22} className="text-[#b04d31]" aria-hidden="true" />
                  <h3 className="mt-5 font-serif text-2xl text-walnut">{store.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-walnut/70">{store.address}</p>
                  <p className="mt-4 flex items-start gap-2 text-sm font-medium text-walnut">
                    <Clock3 size={16} className="mt-0.5 shrink-0 text-[#216e4e]" aria-hidden="true" />
                    {store.hours}
                  </p>
                  <a href={store.map} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#216e4e] hover:underline">
                    {t("home.stores.directions")} <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-16 text-white sm:px-6 sm:py-20">
          <Image src="/textures/blue-boards.jpg" alt="" fill sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-[#182522]/80 mix-blend-multiply" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />
          <div className="relative mx-auto flex max-w-[1800px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl">{t("home.idea.title")}</h2>
              <p className="mt-2 text-sm text-white/80">{t("home.idea.description")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-[#77321f]">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a href="https://www.instagram.com/labarracadejuan_/" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md border border-white/50 px-5 text-sm font-semibold text-white hover:bg-white/10">
                <Camera size={18} /> Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#17231f] text-white/65">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-2 px-4 py-7 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{t("footer.tagline")}</p>
          <p>{t("footer.notice")}</p>
        </div>
        <div className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/40 sm:px-6 lg:px-8">
          {t("footer.developedBy")}{" "}
          <a
            href="https://taheebo.com.au"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 transition hover:text-white/70"
          >
            Taheebo
          </a>
        </div>
      </footer>
    </>
  );
}
