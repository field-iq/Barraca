"use client";

import { formatARS } from "@/lib/format";
import { itemPrice } from "@/lib/cart";
import type { CartItem } from "@/lib/quoteTypes";
import type { PricingConfig } from "@/lib/pricing/pricingConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const PRODUCT_LABEL_KEY: Record<string, TranslationKey> = {
  table: "cartItem.table",
  bench: "cartItem.bench",
  mirror: "cartItem.mirror",
};

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
  config: PricingConfig;
}

export function CartItemCard({ item, onRemove, config }: CartItemCardProps) {
  const { t } = useLanguage();
  const { dimensions } = item;
  const price = itemPrice(item, config);

  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-sand last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-walnut">
          {t(PRODUCT_LABEL_KEY[item.productType] ?? "cartItem.fallback")}
        </p>
        <p className="text-sm text-walnut/60 mt-0.5">
          {item.productType === "mirror"
            ? `${dimensions.widthCm} × ${dimensions.lengthCm} cm`
            : `${dimensions.widthCm} × ${dimensions.lengthCm} × ${dimensions.heightCm} cm`}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-serif text-walnut">{formatARS(price)}</span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={t("cartItem.removeAriaLabel")}
          className="text-walnut/30 hover:text-bark transition text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
