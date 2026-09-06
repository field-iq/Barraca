"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatARS } from "@/lib/format";
import {
  DEFAULT_CATALOG,
  getVisibleProducts,
  type CatalogData,
  type CatalogProduct,
} from "@/lib/catalog";
import { pickText, useLanguage } from "@/lib/i18n/LanguageContext";
import { ImageSlideshow } from "./ImageSlideshow";
import { AddToStoreCartButton } from "./AddToStoreCartButton";

export function StandardFurnitureSection() {
  const { language, t } = useLanguage();
  const [catalog, setCatalog] = useState<CatalogData>(DEFAULT_CATALOG);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/catalog", { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: CatalogData) => setCatalog(data))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const visibleProducts = useMemo(() => getVisibleProducts(catalog), [catalog]);
  const visibleCategories = useMemo(
    () =>
      catalog.categories
        .filter((category) =>
          category.visible && visibleProducts.some((product) => product.categoryId === category.id),
        )
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [catalog.categories, visibleProducts],
  );

  return (
    <section aria-labelledby="standard-furniture-title">
      <div className="mb-7 mt-4 sm:mt-8">
        <h1 id="standard-furniture-title" className="font-heading text-4xl text-nm-text sm:text-5xl">
          {t("standard.title")}
        </h1>
      </div>

      <div className="space-y-10">
        {visibleCategories.map((category) => {
          const products = visibleProducts.filter(
            (product) => product.categoryId === category.id,
          );

          return (
            <section key={category.id} aria-labelledby={`category-${category.id}`}>
              <div className="mb-4 border-b border-nm-line pb-3">
                <h2 id={`category-${category.id}`} className="font-heading text-2xl text-nm-text">
                  {pickText(language, category.name, category.nameEn)}
                </h2>
                {category.description && (
                  <p className="mt-1 text-sm text-nm-muted">
                    {pickText(language, category.description, category.descriptionEn)}
                  </p>
                )}
              </div>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <StandardProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
function StandardProductCard({ product }: { product: CatalogProduct }) {
  const { language } = useLanguage();
  const savings = Math.max(0, product.listPrice - product.cashPrice);
  const discountPercentage = product.listPrice > 0
    ? Math.max(0, Math.round((savings / product.listPrice) * 100))
    : 0;
  const detailTitle = pickText(language, product.detailTitle, product.detailTitleEn);
  const name = pickText(language, product.name, product.nameEn);

  return (
    <article className="nm-transition group relative aspect-[4/3] min-w-0 overflow-hidden rounded-soft bg-nm-surface p-1.5 shadow-soft hover:shadow-soft-lg">
      <Link
        href={`/estandar/${product.id}`}
        aria-label={`${detailTitle} — ${formatARS(product.cashPrice)}`}
        className="absolute inset-1.5 overflow-hidden rounded-soft-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-nm-accent"
      >
        <ImageSlideshow
          images={product.images}
          alt={product.imageAlt}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          objectFit="cover"
        />
      </Link>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-1.5 bottom-1.5 h-2/3 rounded-b-soft-sm bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {discountPercentage > 0 && (
        <span className="pointer-events-none absolute left-4 top-4 rounded-pill bg-nm-accent px-3 py-1 text-xs font-bold text-nm-accent-fg shadow-soft-xs">
          {discountPercentage}% OFF
        </span>
      )}

      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-soft-sm bg-nm-surface/90 p-3 shadow-soft-sm backdrop-blur-sm">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-heading text-base text-nm-text">{name}</h3>
            <span className="shrink-0 text-[11px] text-nm-muted">{product.dimensions}</span>
          </div>
          <p className="mt-0.5 truncate font-heading text-xl text-nm-accent">{formatARS(product.cashPrice)}</p>
        </div>
        <div className="pointer-events-auto shrink-0">
          <AddToStoreCartButton productId={product.id} compact />
        </div>
      </div>
    </article>
  );
}
