"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Banknote, Camera, CreditCard, HandCoins, Hammer, MapPin, MessageCircle, Recycle, Ruler, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/nav/footer";
import { ContactCard } from "@/components/nav/contact-card";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { CtaSection } from "@/components/marketing/cta-section";
import { GoogleRatingBadge, GoogleReviewCard } from "@/components/reviews/google-reviews";
import { TestimonialCard } from "@/components/reviews/testimonial-card";
import { AutoCarousel, type CarouselItem } from "@/components/ui/auto-carousel";
import { ModelCard, groupModels } from "@/components/StandardFurnitureSection";
import { getVisibleProducts, type CatalogData } from "@/lib/catalog";
import { WHATSAPP_URL } from "@/lib/contactInfo";
import type { GoogleReviewsData } from "@/lib/googleReviews";
import type { LocalizedTestimonial } from "@/lib/reviews";
import { pickText, useLanguage, withLocalePrefix } from "@/lib/i18n/LanguageContext";

const INSTAGRAM_URL = "https://www.instagram.com/labarracadejuan_/";
const FEATURED_MODELS = 3;

const storeAddresses = [
  {
    name: "Boulevard Sáenz Peña",
    address: "Boulevard Sáenz Peña 1213, esquina Guareschi",
    hoursKey: "home.stores.hours",
    map: "https://www.google.com/maps/search/?api=1&query=Boulevard+Saenz+Pena+1213+Tigre",
  },
] as const;

export function HomeContent({
  hero,
  faq,
  storePhotoUrl,
  catalog,
  reviews,
  reviewsAreSample,
  google,
}: {
  hero: React.ReactNode;
  faq: React.ReactNode;
  storePhotoUrl: string;
  catalog: CatalogData;
  reviews: LocalizedTestimonial[];
  reviewsAreSample: boolean;
  google: GoogleReviewsData | null;
}) {
  const { language, t } = useLanguage();

  const catalogHref = withLocalePrefix("/catalogo", language);
  const customHref = withLocalePrefix("/catalogo#a-medida", language);

  const products = useMemo(() => getVisibleProducts(catalog), [catalog]);
  const models = useMemo(() => groupModels(products), [products]);
  const featuredModels = models.slice(0, FEATURED_MODELS);

  const categories = useMemo(
    () =>
      catalog.categories
        .filter((category) => category.visible)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((category) => {
          const inCategory = models.filter((group) => group[0].categoryId === category.id);
          return { category, count: inCategory.length, image: inCategory[0]?.[0].images[0] };
        })
        .filter((entry) => entry.count > 0 && entry.image),
    [catalog.categories, models],
  );

  const trust = [
    { icon: Hammer, title: t("home.trust.handmade"), body: t("home.trust.handmadeBody") },
    { icon: Recycle, title: t("home.trust.wood"), body: t("home.trust.woodBody") },
    { icon: Ruler, title: t("home.trust.custom"), body: t("home.trust.customBody") },
    { icon: HandCoins, title: t("home.trust.cash"), body: t("home.trust.cashBody") },
  ];

  const steps = [1, 2, 3, 4].map((n) => ({
    title: t(`home.how.step${n}.title` as "home.how.step1.title"),
    body: t(`home.how.step${n}.body` as "home.how.step1.body"),
  }));

  const payment = [
    { icon: Banknote, title: t("home.pay.cash"), body: t("home.pay.cashBody") },
    { icon: CreditCard, title: t("home.pay.card"), body: t("home.pay.cardBody") },
    { icon: MapPin, title: t("home.pay.pickup"), body: t("home.pay.pickupBody") },
    { icon: Truck, title: t("home.pay.delivery"), body: t("home.pay.deliveryBody") },
  ];

  const announcements = [
    { text: t("home.announce.cash"), href: catalogHref, cta: t("home.announce.catalogCta") },
    { text: t("home.announce.pickup") },
    { text: t("home.announce.custom"), href: customHref, cta: t("home.announce.customCta") },
  ];

  const stepCard = (step: { title: string; body: string }, index: number) => (
    <div className="h-full rounded-soft bg-nm-surface p-6 shadow-soft">
      <span className="grid size-11 place-items-center rounded-full font-heading text-lg text-nm-accent shadow-soft-inset-sm">
        {index + 1}
      </span>
      <h3 className="mt-5 font-heading text-xl text-nm-text">{step.title}</h3>
      <p className="mt-2 text-sm leading-6 text-nm-muted">{step.body}</p>
    </div>
  );

  const paymentCard = ({ icon: Icon, title, body }: (typeof payment)[number]) => (
    <div className="flex h-full flex-col gap-3 rounded-soft bg-nm-surface p-5 shadow-soft-sm">
      <span className="grid size-11 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="font-semibold text-nm-text">{title}</h3>
      <p className="text-sm leading-6 text-nm-muted">{body}</p>
    </div>
  );

  const googleReviews = google?.reviews ?? [];
  const reviewItems: CarouselItem[] =
    googleReviews.length > 0
      ? googleReviews.map((review) => ({ key: review.id, node: <GoogleReviewCard review={review} /> }))
      : reviews.map((review, index) => ({
          key: String(index),
          node: (
            <TestimonialCard
              t={{ ...review, quote: pickText(language, review.quote.es, review.quote.en), piece: pickText(language, review.piece.es, review.piece.en) }}
            />
          ),
        }));
  const showReviewsSample = googleReviews.length === 0 && reviewsAreSample;

  const stores = storeAddresses.map((store) => ({ ...store, hours: t(store.hoursKey) }));

  return (
    <>
      <AnnouncementBar
        messages={announcements}
        dismissLabel={t("home.announce.dismiss")}
        previousLabel={t("home.announce.previous")}
        nextLabel={t("home.announce.next")}
      />
      <Header />
      <main>
        {hero}

        <section aria-label={t("home.shop.eyebrow")} className="px-4 pt-10 sm:px-6 lg:px-8">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {trust.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-center gap-3 rounded-soft bg-nm-surface p-4 shadow-soft-sm sm:p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight text-nm-text">{title}</span>
                  <span className="mt-0.5 hidden text-xs leading-snug text-nm-muted sm:block">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {categories.length > 0 && (
          <section id="categorias" className="scroll-mt-4 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-muted">{t("home.categories.eyebrow")}</p>
              <h2 className="mt-3 font-heading text-3xl text-nm-text sm:text-4xl">{t("home.categories.title")}</h2>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {categories.map(({ category, count, image }) => (
                  <Link
                    key={category.id}
                    href={catalogHref}
                    className="group nm-transition block rounded-soft bg-nm-surface p-2.5 shadow-soft hover:shadow-soft-lg sm:p-3"
                  >
                    <span className="relative block aspect-square overflow-hidden rounded-soft-sm shadow-soft-inset">
                      <Image
                        src={image as string}
                        alt={pickText(language, category.name, category.nameEn)}
                        fill
                        sizes="(min-width: 1024px) 22vw, 45vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="flex items-center justify-between gap-2 px-2 pb-1 pt-4">
                      <span className="min-w-0">
                        <span className="block truncate font-heading text-lg text-nm-text sm:text-xl">
                          {pickText(language, category.name, category.nameEn)}
                        </span>
                        <span className="text-xs text-nm-muted">{t("home.categories.count", { count })}</span>
                      </span>
                      <span className="nm-transition grid size-9 shrink-0 place-items-center rounded-full shadow-soft-sm group-hover:text-nm-accent group-hover:shadow-soft-inset-sm">
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="home-how-title" className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-muted">{t("home.how.eyebrow")}</p>
            <h2 id="home-how-title" className="mt-3 max-w-2xl font-heading text-3xl text-nm-text sm:text-4xl">
              {t("home.how.title")}
            </h2>
            <ol className="mt-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step.title}>{stepCard(step, index)}</li>
              ))}
            </ol>
            <div className="mt-6 md:hidden">
              <AutoCarousel
                items={steps.map((step, index) => ({ key: step.title, node: stepCard(step, index) }))}
                perViewWide={1}
                intervalMs={5000}
                previousLabel={t("home.how.previous")}
                nextLabel={t("home.how.next")}
              />
            </div>
          </div>
        </section>

        {featuredModels.length > 0 && (
          <section id="coleccion" className="scroll-mt-4 px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-muted">{t("home.shop.eyebrow")}</p>
                  <h2 className="mt-3 font-heading text-3xl text-nm-text sm:text-4xl">{t("home.shop.title")}</h2>
                </div>
                <Link
                  href={catalogHref}
                  className="nm-transition inline-flex h-11 items-center gap-2 rounded-pill bg-nm-surface px-5 text-sm font-semibold text-nm-text shadow-soft-sm hover:text-nm-accent hover:shadow-soft"
                >
                  {t("home.shop.all")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-8 hidden min-w-0 gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
                {featuredModels.map((group) => (
                  <ModelCard key={group[0].id} sizes={group} />
                ))}
              </div>
              <div className="mt-6 md:hidden">
                <AutoCarousel
                  items={featuredModels.map((group) => ({ key: group[0].id, node: <ModelCard sizes={group} /> }))}
                  perViewWide={1}
                  intervalMs={6000}
                  previousLabel={t("home.shop.previous")}
                  nextLabel={t("home.shop.next")}
                />
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="home-pay-title" className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-soft-lg p-6 shadow-soft-inset sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-muted">{t("home.pay.eyebrow")}</p>
            <h2 id="home-pay-title" className="mt-3 font-heading text-3xl text-nm-text sm:text-4xl">{t("home.pay.title")}</h2>
            <ul className="mt-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
              {payment.map((item) => (
                <li key={item.title}>{paymentCard(item)}</li>
              ))}
            </ul>
            <div className="mt-6 md:hidden">
              <AutoCarousel
                items={payment.map((item) => ({ key: item.title, node: paymentCard(item) }))}
                perViewWide={1}
                intervalMs={5000}
                previousLabel={t("home.pay.previous")}
                nextLabel={t("home.pay.next")}
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="home-custom-title" className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
          <div className="mx-auto grid max-w-6xl items-center gap-6 rounded-soft-lg bg-nm-surface p-4 shadow-soft sm:p-6 md:grid-cols-2 md:gap-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-soft shadow-soft-inset">
              <Image
                src="/mesa-2.jpeg"
                alt={language === "en" ? "Custom solid wood dining table" : "Mesa de comedor a medida en madera maciza"}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="px-2 pb-2 md:px-0 md:pb-0 md:pr-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-accent">{t("home.custom.eyebrow")}</p>
              <h2 id="home-custom-title" className="mt-3 font-heading text-3xl text-nm-text sm:text-4xl">
                {t("home.custom.title")}
              </h2>
              <p className="mt-4 text-sm leading-6 text-nm-muted sm:text-base sm:leading-7">{t("home.custom.body")}</p>
              <Link
                href={customHref}
                className="nm-transition mt-6 inline-flex h-12 items-center gap-2 rounded-pill bg-nm-accent px-6 text-sm font-semibold text-nm-accent-fg shadow-soft hover:brightness-105 active:shadow-soft-inset-sm"
              >
                {t("home.custom.cta")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {(google || reviewItems.length > 0) && (
          <section aria-labelledby="home-reviews-title" className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-muted">{t("home.reviews.eyebrow")}</p>
                  <h2 id="home-reviews-title" className="mt-3 max-w-xl font-heading text-3xl text-nm-text sm:text-4xl">
                    {t("home.reviews.title")}
                  </h2>
                  {showReviewsSample && (
                    <p className="mt-3 inline-block rounded-pill px-3 py-1 text-xs font-semibold text-nm-warning shadow-soft-inset-sm">
                      {t("home.reviews.sample")}
                    </p>
                  )}
                </div>
                {google && google.rating !== null && google.count !== null && (
                  <GoogleRatingBadge
                    rating={google.rating}
                    label={t("home.reviews.googleCount", { count: google.count })}
                    href={google.mapsUrl}
                  />
                )}
              </div>
              {reviewItems.length > 0 && (
                <div className="mt-8">
                  <AutoCarousel
                    items={reviewItems}
                    intervalMs={5000}
                    previousLabel={t("home.reviews.previous")}
                    nextLabel={t("home.reviews.next")}
                  />
                </div>
              )}
              {google && (
                <div className="mt-6 flex justify-center">
                  <a
                    href={google.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="nm-transition inline-flex h-11 items-center gap-2 rounded-pill bg-nm-surface px-5 text-sm font-semibold text-nm-text shadow-soft-sm hover:text-nm-accent hover:shadow-soft"
                  >
                    {t("home.reviews.googleAll")}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {faq}

        <section id="locales" className="scroll-mt-20 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nm-muted">{t("home.stores.eyebrow")}</p>
            <h2 className="mt-3 font-heading text-4xl text-nm-text sm:text-5xl">{t("home.stores.title")}</h2>
            <div className="mt-8 grid items-center gap-6 md:grid-cols-2 md:gap-10">
              <div className="grid gap-4 sm:gap-6">
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
                <Link
                  href={withLocalePrefix("/quienes-somos", language)}
                  className="nm-transition inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-nm-surface px-6 text-sm font-semibold text-nm-text shadow-soft-sm hover:text-nm-accent hover:shadow-soft"
                >
                  {t("home.stores.about")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-soft shadow-soft">
                <Image
                  src={storePhotoUrl}
                  alt={language === "en"
                    ? "Storefront of La Barraca de Juan on Boulevard Sáenz Peña, Tigre"
                    : "Fachada del local de La Barraca de Juan en Boulevard Sáenz Peña, Tigre"}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
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
