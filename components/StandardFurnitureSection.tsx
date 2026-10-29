"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
  // Cada producto es una pieza única: una tarjeta por producto, aunque compartan nombre o medidas.
  const shownProducts =
    activeCategory === "all"
      ? visibleProducts
      : visibleProducts.filter((product) => product.categoryId === activeCategory);

  return (
    <section aria-labelledby="standard-furniture-title">
      <div className="mb-7 mt-4 sm:mt-8">
        <h1 id="standard-furniture-title" className="font-heading text-4xl text-nm-text sm:text-5xl">
          {t("standard.title")}
        </h1>
      </div>

      <CategoryDropdown
        label={t("standard.categories")}
        value={activeCategory}
        onChange={setActiveCategory}
        options={[
          { id: "all", label: t("standard.all") },
          ...visibleCategories.map((category) => ({
            id: category.id,
            label: pickText(language, category.name, category.nameEn),
          })),
        ]}
      />

      <div className="mt-8 grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {shownProducts.map((product) => (
          <ModelCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function CategoryDropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: { id: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
      } else if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative z-20 w-full sm:w-72">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        className={`nm-transition flex h-11 w-full items-center justify-between rounded-pill bg-nm-surface pl-5 pr-4 text-sm font-semibold text-nm-text outline-none ${
          open ? "shadow-soft-inset-sm" : "shadow-soft-sm hover:shadow-soft"
        }`}
      >
        <span className="truncate">{selected.label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`nm-transition ml-3 h-4 w-4 shrink-0 text-nm-accent ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="nm-scroll absolute left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto rounded-soft bg-nm-surface p-2 shadow-soft-lg"
        >
          {options.map((option) => {
            const active = option.id === value;
            return (
              <li key={option.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  className={`nm-transition w-full rounded-pill px-4 py-2.5 text-left text-sm font-semibold outline-none ${
                    active
                      ? "text-nm-accent shadow-soft-inset-sm"
                      : "text-nm-text hover:text-nm-accent focus-visible:text-nm-accent"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ModelCard({ product }: { product: CatalogProduct }) {
  const { language, t } = useLanguage();
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
          images={product.images.slice(0, 1)}
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

        <p className="text-sm font-medium text-nm-text">{localizeDimensions(product.dimensions, language)}</p>

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
