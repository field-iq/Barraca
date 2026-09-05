"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AddToStoreCartButton } from "@/components/AddToStoreCartButton";
import { formatARS } from "@/lib/format";
import type { CatalogProduct } from "@/lib/catalog";
import { pickText, useLanguage, withLocalePrefix } from "@/lib/i18n/LanguageContext";

interface StandardItemViewProps {
  item: CatalogProduct;
  categoryName?: string;
  categoryNameEn?: string;
}

export function StandardItemView({ item, categoryName, categoryNameEn }: StandardItemViewProps) {
  const { language, t } = useLanguage();
  const [mainImage, ...secondaryImages] = item.images;
  const savings = Math.max(0, item.listPrice - item.cashPrice);
  const discountPercentage = item.listPrice > 0
    ? Math.max(0, Math.round((savings / item.listPrice) * 100))
    : 0;

  const detailTitle = pickText(language, item.detailTitle, item.detailTitleEn);
  const description = pickText(language, item.description, item.descriptionEn);
  const detailDescription = pickText(language, item.detailDescription, item.detailDescriptionEn);
  const category = pickText(language, categoryName ?? "La Barraca De Juan", categoryNameEn);

  return (
    <>
      <Header />
      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#18211e]">
        <div aria-hidden="true" className="absolute -inset-8 bg-[url('/textures/catalog-boards.jpg')] bg-[length:auto_980px] bg-repeat opacity-75 blur-md" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#15201c]/78" />
        <div className="relative mx-auto min-w-0 max-w-[1400px] px-4 py-10 sm:py-14">
        <Link
          href={withLocalePrefix("/catalogo", language)}
          className="text-sm text-[#efb296] underline underline-offset-4 hover:text-white"
        >
          {t("standard.backToCatalog")}
        </Link>

        <section className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-[#efb296]">
              {category}
            </p>
            <h1 className="mt-2 break-words font-serif text-4xl text-[#f6f1e9] sm:text-5xl">
              {detailTitle}
            </h1>
            <p className="mt-4 text-lg text-white/70">{description}</p>
            <p className="mt-5 leading-7 text-white/65">{detailDescription}</p>
          </div>

          <div className="min-w-0 max-w-full overflow-hidden rounded-2xl bg-white/15 p-5 text-white shadow-lg ring-1 ring-white/25 backdrop-blur-md sm:p-6">
            <h2 className="font-serif text-xl text-white">{t("standard.priceAndDimensions")}</h2>
            <dl className="mt-4 text-sm">
              <div className="flex min-w-0 flex-col gap-1 min-[420px]:flex-row min-[420px]:items-baseline min-[420px]:justify-between min-[420px]:gap-4">
                <dt className="text-white/60">{t("standard.dimensions")}</dt>
                <dd className="min-w-0 break-words font-medium text-white min-[420px]:text-right">{item.dimensions}</dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-white/20 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase text-white/70">{t("standard.cashPrice")}</p>
                {discountPercentage > 0 && (
                  <p className="rounded-full bg-emerald-700/70 px-3 py-1.5 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur-sm">
                    {discountPercentage}% OFF
                  </p>
                )}
              </div>
              <p className="mt-1 break-words font-serif text-4xl text-white">{formatARS(item.cashPrice)}</p>
              <p className="mt-2 text-sm text-white/60">
                {t("standard.before")} <span className="line-through">{formatARS(item.listPrice)}</span>
              </p>
              {savings > 0 && (
                <p className="mt-4 inline-flex max-w-full whitespace-normal rounded-full bg-emerald-700/70 px-3 py-2 text-sm font-semibold leading-5 text-white ring-1 ring-white/25 backdrop-blur-sm">
                  {t("standard.savingsFull", { amount: formatARS(savings) })}
                </p>
              )}
              <div className="mt-4 border-t border-white/20 pt-4">
                <AddToStoreCartButton productId={item.id} fullWidth />
              </div>
            </div>
          </div>
        </section>

        <section aria-label={`${t("standard.viewPhotos")}: ${detailTitle}`} className="mt-10">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-2xl overflow-hidden rounded-lg bg-sand">
            <Image
              src={mainImage}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-contain"
              priority
            />
          </div>

          {secondaryImages.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {secondaryImages.map((image, index) => (
                <div key={image} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-sand">
                  <Image
                    src={image}
                    alt={`${item.imageAlt} ${index + 2}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
        </div>
      </main>
    </>
  );
}
