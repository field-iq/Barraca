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

export function StandardFurnitureSection({ tone = "light" }: { tone?: "light" | "dark" }) {
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
  const isDark = tone === "dark";
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
        <h1 id="standard-furniture-title" className={`font-serif text-4xl sm:text-5xl ${isDark ? "text-[#f6f1e9]" : "text-walnut"}`}>
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
              <div className={`mb-4 border-b pb-3 ${isDark ? "border-white/20" : "border-sand"}`}>
                <h2 id={`category-${category.id}`} className={`font-serif text-2xl ${isDark ? "text-[#f6f1e9]" : "text-walnut"}`}>
                  {pickText(language, category.name, category.nameEn)}
                </h2>
                {category.description && (
                  <p className={`mt-1 text-sm ${isDark ? "text-white/55" : "text-walnut/60"}`}>
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
    <article className="group relative aspect-[4/3] min-w-0 overflow-hidden rounded-2xl shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/estandar/${product.id}`}
        aria-label={`${detailTitle} — ${formatARS(product.cashPrice)}`}
        className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ImageSlideshow
          images={product.images}
          alt={product.imageAlt}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          objectFit="cover"
        />
      </Link>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      {discountPercentage > 0 && (
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-emerald-700/70 px-3 py-1 text-xs font-bold text-white shadow-sm ring-1 ring-white/25 backdrop-blur-md">
          {discountPercentage}% OFF
        </span>
      )}

      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl bg-white/15 p-3 shadow-sm ring-1 ring-white/25 backdrop-blur-md">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-serif text-base text-white">{name}</h3>
            <span className="shrink-0 text-[11px] text-white/75">{product.dimensions}</span>
          </div>
          <p className="mt-0.5 truncate font-serif text-xl text-white">{formatARS(product.cashPrice)}</p>
        </div>
        <div className="pointer-events-auto shrink-0">
          <AddToStoreCartButton productId={product.id} compact />
        </div>
      </div>
    </article>
  );
}
