"use client";

import type { ProductDefinition } from "@/lib/products";
import { pickText, useLanguage } from "@/lib/i18n/LanguageContext";
import { ImageSlideshow } from "./ImageSlideshow";

interface ProductCardProps {
  product: ProductDefinition;
  onSelect: (id: ProductDefinition["id"]) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { language, t } = useLanguage();
  const disabled = !product.available;

  return (
    <button
      type="button"
      onClick={() => onSelect(product.id)}
      aria-disabled={disabled}
      className={[
        "group relative w-full text-left rounded-2xl border bg-white p-5 transition",
        "border-sand hover:border-bark/40 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        disabled ? "opacity-70" : "",
      ].join(" ")}
    >
      <div className="relative aspect-[4/3] w-full rounded-xl bg-sand mb-4 flex items-center justify-center overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <ImageSlideshow
            images={product.images}
            alt={pickText(language, product.name, product.nameEn)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            objectFit={product.imageFit ?? "cover"}
          />
        ) : (
          <ProductIllustration id={product.id} />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg text-walnut">{pickText(language, product.name, product.nameEn)}</h3>
        {!product.available && (
          <span className="text-xs uppercase tracking-wide text-bark/70 bg-cream border border-sand rounded-full px-2 py-0.5">
            {t("productCard.comingSoon")}
          </span>
        )}
      </div>

      <p className="mt-1 text-sm text-walnut/70">{pickText(language, product.description, product.descriptionEn)}</p>
    </button>
  );
}

/**
 * Lightweight inline illustration so the MVP doesn't need image assets yet.
 * Swap for <Image src={product.image} /> when real photos are available.
 */
function ProductIllustration({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      className="w-3/4 h-3/4 text-bark/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {id === "table" && (
        <>
          <rect x="15" y="35" width="90" height="8" rx="2" />
          <line x1="22" y1="43" x2="22" y2="75" />
          <line x1="98" y1="43" x2="98" y2="75" />
        </>
      )}
      {id === "bench" && (
        <>
          <rect x="15" y="45" width="90" height="6" rx="2" />
          <line x1="22" y1="51" x2="22" y2="75" />
          <line x1="98" y1="51" x2="98" y2="75" />
        </>
      )}
      {id === "chair" && (
        <>
          <rect x="40" y="45" width="40" height="6" rx="2" />
          <line x1="45" y1="51" x2="45" y2="75" />
          <line x1="75" y1="51" x2="75" y2="75" />
          <line x1="45" y1="45" x2="45" y2="15" />
          <line x1="75" y1="45" x2="75" y2="15" />
          <line x1="45" y1="20" x2="75" y2="20" />
          <line x1="45" y1="30" x2="75" y2="30" />
        </>
      )}
      {id === "shelf" && (
        <>
          <rect x="25" y="15" width="70" height="60" rx="2" />
          <line x1="25" y1="35" x2="95" y2="35" />
          <line x1="25" y1="55" x2="95" y2="55" />
        </>
      )}
      {id === "coffee-table" && (
        <>
          <rect x="15" y="50" width="90" height="6" rx="2" />
          <line x1="22" y1="56" x2="22" y2="72" />
          <line x1="98" y1="56" x2="98" y2="72" />
        </>
      )}
      {id === "bedside-table" && (
        <>
          <rect x="35" y="30" width="50" height="50" rx="2" />
          <line x1="35" y1="50" x2="85" y2="50" />
          <circle cx="60" cy="42" r="1.5" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
