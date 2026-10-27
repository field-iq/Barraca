"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatARS, localizeDimensions } from "@/lib/format";
import {
  DEFAULT_CATALOG,
  getVisibleProducts,
  type CatalogData,
  type CatalogProduct,
} from "@/lib/catalog";
import { pickText, useLanguage } from "@/lib/i18n/LanguageContext";
import { ImageSlideshow } from "./ImageSlideshow";
import { AddToStoreCartButton } from "./AddToStoreCartButton";

/** Junta en un mismo modelo las medidas que comparten categoría y nombre, o la misma foto. */
export function groupModels(products: CatalogProduct[]): CatalogProduct[][] {
  const groups: CatalogProduct[][] = [];
  for (const product of products) {
    const group = groups.find((items) =>
      items.some(
        (item) =>
          (item.categoryId === product.categoryId && item.name === product.name) ||
          item.images[0] === product.images[0],
      ),
    );
    if (group) group.push(product);
    else groups.push([product]);
  }
  return groups;
}

export function StandardFurnitureSection() {
  const { language, t } = useLanguage();
  const [catalog, setCatalog] = useState<CatalogData>(DEFAULT_CATALOG);
  const [activeCategory, setActiveCategory] = useState("all");

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
  const models = useMemo(() => groupModels(visibleProducts), [visibleProducts]);
  const shownModels =
    activeCategory === "all" ? models : models.filter((group) => group[0].categoryId === activeCategory);

  return (
    <section aria-labelledby="standard-furniture-title">
      <div className="mb-7 mt-4 sm:mt-8">
        <h1 id="standard-furniture-title" className="font-heading text-4xl text-nm-text sm:text-5xl">
          {t("standard.title")}
        </h1>
      </div>

      <div role="group" aria-label={t("standard.categories")} className="flex flex-wrap gap-3">
        <CategoryChip active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
          {t("standard.all")}
        </CategoryChip>
        {visibleCategories.map((category) => (
          <CategoryChip
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {pickText(language, category.name, category.nameEn)}
          </CategoryChip>
        ))}
      </div>

      <div className="mt-8 grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {shownModels.map((group) => (
          <ModelCard key={group[0].id} sizes={group} />
        ))}
      </div>
    </section>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`nm-transition h-11 rounded-pill bg-nm-surface px-5 text-sm font-semibold ${
        active ? "text-nm-accent shadow-soft-inset-sm" : "text-nm-text shadow-soft-sm hover:shadow-soft"
      }`}
    >
      {children}
    </button>
  );
}

export function ModelCard({ sizes }: { sizes: CatalogProduct[] }) {
  const { language, t } = useLanguage();
  const [selectedId, setSelectedId] = useState(sizes[Math.floor(sizes.length / 2)].id);
  const product = sizes.find((item) => item.id === selectedId) ?? sizes[0];
  const savings = Math.max(0, product.listPrice - product.cashPrice);
  const discount = product.listPrice > 0 ? Math.round((savings / product.listPrice) * 100) : 0;

  return (
    <article className="nm-transition flex min-w-0 flex-col rounded-soft bg-nm-surface p-3 shadow-soft hover:shadow-soft-lg">
      <Link
        href={`/estandar/${product.id}`}
        aria-label={pickText(language, product.detailTitle, product.detailTitleEn)}
        className="relative block aspect-[4/5] overflow-hidden sm:aspect-[3/4] rounded-soft-sm shadow-soft-inset focus:outline-none focus-visible:ring-2 focus-visible:ring-nm-accent"
      >
        <ImageSlideshow
          key={product.id}
          images={product.images}
          alt={language === "en" ? pickText(language, product.detailTitle, product.detailTitleEn) : product.imageAlt}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {discount > 0 && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-pill bg-nm-accent px-3 py-1 text-xs font-bold text-nm-accent-fg shadow-soft-xs">
            {discount}% OFF
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 px-2 pb-2 pt-5">
        <div>
          <h3 className="font-heading text-2xl text-nm-text">{pickText(language, product.name, product.nameEn)}</h3>
          <p className="mt-1 text-sm text-nm-muted">
            {pickText(language, product.description, product.descriptionEn)}
          </p>
        </div>

        {sizes.length > 1 ? (
          <div
            role="radiogroup"
            aria-label={t("standard.dimensions")}
            className="flex flex-wrap gap-1.5 rounded-soft-sm p-1.5 shadow-soft-inset-sm"
          >
            {sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                role="radio"
                aria-checked={size.id === product.id}
                onClick={() => setSelectedId(size.id)}
                className={`nm-transition rounded-pill px-3.5 py-1.5 text-left text-xs font-semibold ${
                  size.id === product.id ? "bg-nm-surface text-nm-accent shadow-soft-xs" : "text-nm-muted hover:text-nm-text"
                }`}
              >
                {localizeDimensions(size.dimensions, language)}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-nm-muted">{localizeDimensions(product.dimensions, language)}</p>
        )}

        <div className="mt-auto border-t border-nm-line pt-4">
          <p className="text-xs font-medium text-nm-muted">{t("standard.cashPrice")}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
            <p className="font-heading text-3xl text-nm-text">{formatARS(product.cashPrice)}</p>
            {savings > 0 && (
              <p className="text-sm text-nm-muted">
                {t("standard.before")} <span className="line-through">{formatARS(product.listPrice)}</span>
              </p>
            )}
          </div>
          <div className="mt-4">
            <AddToStoreCartButton productId={product.id} fullWidth />
          </div>
        </div>
      </div>
    </article>
  );
}
