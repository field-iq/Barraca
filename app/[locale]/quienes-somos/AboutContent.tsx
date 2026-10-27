"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, HandCoins, Hammer, MapPin, MessageCircle, Recycle, Ruler } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/nav/footer";
import { CtaSection } from "@/components/marketing/cta-section";
import type { AboutSettings } from "@/lib/aboutShared";
import { WHATSAPP_URL } from "@/lib/contactInfo";
import { useLanguage, withLocalePrefix } from "@/lib/i18n/LanguageContext";

const INSTAGRAM_URL = "https://www.instagram.com/labarracadejuan_/";

export function AboutContent({ about, seoText }: { about: AboutSettings; seoText: React.ReactNode }) {
  const { language, t } = useLanguage();
  const text = language === "en" ? about.en : about.es;
  const paragraphs = text.body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const [lead, ...rest] = paragraphs;

  const values = [
    { icon: Hammer, title: t("home.trust.handmade"), body: t("home.trust.handmadeBody") },
    { icon: Recycle, title: t("home.trust.wood"), body: t("home.trust.woodBody") },
    { icon: Ruler, title: t("home.trust.custom"), body: t("home.trust.customBody") },
    { icon: HandCoins, title: t("home.trust.cash"), body: t("home.trust.cashBody") },
  ];

  return (
    <>
      <Header />
      <main>
        <section aria-labelledby="about-title" className="px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <div className="mx-auto grid max-w-6xl items-start gap-x-8 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:grid-rows-[auto_1fr] md:gap-x-12 lg:gap-x-16">
            <div className="md:col-start-1 md:row-start-1 md:pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-accent">{t("about.eyebrow")}</p>
              <h1 id="about-title" className="mt-3 font-heading text-4xl leading-tight text-nm-text sm:text-5xl">
                {text.title}
              </h1>
            </div>

            <div className="mx-auto w-full max-w-md rounded-soft-lg p-3 shadow-soft md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-soft shadow-soft-inset">
                <Image
                  src={about.photoUrl}
                  alt={t("about.photoAlt")}
                  fill
                  priority
                  sizes="(min-width: 768px) 24rem, (min-width: 448px) 28rem, 100vw"
                  className="object-cover object-[50%_30%]"
                />
              </div>
            </div>

            <div className="space-y-5 text-base leading-7 text-nm-muted sm:text-lg sm:leading-8 md:col-start-1 md:row-start-2">
              {lead && <p className="font-heading text-xl leading-snug text-nm-text sm:text-2xl">{lead}</p>}
              {rest.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section aria-label={t("about.valuesLabel")} className="px-4 pb-12 sm:px-6 lg:px-8">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {values.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex flex-col gap-3 rounded-soft bg-nm-surface p-5 shadow-soft-sm">
                <span className="grid size-11 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold leading-tight text-nm-text">{title}</span>
                <span className="text-xs leading-snug text-nm-muted">{body}</span>
              </li>
            ))}
          </ul>
        </section>

        {seoText}

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-soft-lg bg-nm-surface p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-2xl text-nm-text">{t("about.visit.title")}</h2>
                <p className="mt-1 text-sm leading-6 text-nm-muted">{t("about.visit.body")}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
              <Link
                href={withLocalePrefix("/catalogo", language)}
                className="nm-transition inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-nm-accent px-6 text-sm font-semibold text-nm-accent-fg shadow-soft hover:brightness-105 active:shadow-soft-inset-sm"
              >
                {t("about.cta.catalog")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={withLocalePrefix("/#locales", language)}
                className="nm-transition inline-flex h-12 items-center justify-center rounded-pill bg-nm-surface px-6 text-sm font-semibold text-nm-text shadow-soft-sm hover:text-nm-accent hover:shadow-soft"
              >
                {t("about.cta.visit")}
              </Link>
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
