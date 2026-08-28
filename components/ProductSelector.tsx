"use client";

import { PRODUCTS } from "@/lib/products";
import type { ProductId } from "@/lib/quoteTypes";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ProductCard } from "./ProductCard";

interface ProductSelectorProps {
  onSelect: (id: ProductId) => void;
}

export function ProductSelector({ onSelect }: ProductSelectorProps) {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="product-selector-title">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1
          id="product-selector-title"
          className="font-serif text-3xl sm:text-4xl text-walnut"
        >
          {t("productSelector.title")}
        </h1>
        <p className="mt-3 text-walnut/70">
          {t("productSelector.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
