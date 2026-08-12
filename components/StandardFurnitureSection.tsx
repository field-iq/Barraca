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
import { ImageSlideshow } from "./ImageSlideshow";
import { AddToStoreCartButton } from "./AddToStoreCartButton";

export function StandardFurnitureSection() {
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
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase text-bark/70">
            Medidas y precios definidos
          </p>
          <h1 id="standard-furniture-title" className="font-serif text-3xl text-walnut sm:text-4xl">
            Muebles estándar
          </h1>
        </div>
        <p className="max-w-xl text-sm text-walnut/70">
          Modelos con medidas fijas y precio de lista, con valor especial para pago en efectivo.
        </p>
      </div>

      <div className="space-y-10">
        {visibleCategories.map((category) => {
          const products = visibleProducts.filter(
            (product) => product.categoryId === category.id,
          );

          return (
            <section key={category.id} aria-labelledby={`category-${category.id}`}>
              <div className="mb-4 border-b border-sand pb-3">
                <h2 id={`category-${category.id}`} className="font-serif text-2xl text-walnut">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1 text-sm text-walnut/60">{category.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  const savings = Math.max(0, product.listPrice - product.cashPrice);
  const discountPercentage = product.listPrice > 0
    ? Math.max(0, Math.round((savings / product.listPrice) * 100))
    : 0;

  return (
    <article className="overflow-hidden rounded-lg border border-sand bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/estandar/${product.id}`}
        aria-label={`Ver fotos y detalles de ${product.detailTitle}`}
        className="relative block aspect-[4/3] bg-sand focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ImageSlideshow
          images={product.images}
          alt={product.imageAlt}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          objectFit="contain"
        />
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-emerald-700 px-3 py-2 text-sm font-bold text-white shadow-sm">
            {discountPercentage}% OFF
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-walnut shadow-sm">
          Ver fotos
        </span>
      </Link>

      <div className="p-4">
        <div className="min-h-14">
          <h3 className="font-serif text-lg text-walnut">{product.name}</h3>
          <p className="mt-1 text-sm text-walnut/70">{product.description}</p>
        </div>

        <dl className="mt-4 border-t border-sand pt-3 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-walnut/50">Medidas</dt>
            <dd className="text-right font-medium text-walnut">{product.dimensions}</dd>
          </div>
        </dl>

        <div className="mt-4 rounded-md bg-walnut px-4 py-4 text-cream">
          <p className="text-xs font-medium uppercase">Precio especial en efectivo</p>
          <p className="mt-1 font-serif text-3xl">{formatARS(product.cashPrice)}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-cream/20 pt-3 text-xs">
            <p className="text-cream/70">
              Antes: <span className="line-through">{formatARS(product.listPrice)}</span>
            </p>
            {savings > 0 && (
              <p className="rounded-md bg-emerald-700 px-2 py-1 font-semibold text-white">
                Ahorr&aacute;s {formatARS(savings)}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <AddToStoreCartButton productId={product.id} fullWidth />
        </div>
      </div>
    </article>
  );
}
