"use client";

import { X } from "lucide-react";
import { formatARS } from "@/lib/format";
import { itemPrice } from "@/lib/cart";
import type { CartItem } from "@/lib/quoteTypes";
import type { PricingConfig } from "@/lib/pricing/pricingConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";
import { IconButton } from "@/components/ui/icon-button";

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
    <div className="flex items-center justify-between gap-4 rounded-soft-sm bg-nm-surface p-4 shadow-soft-inset-sm">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-nm-text">
          {t(PRODUCT_LABEL_KEY[item.productType] ?? "cartItem.fallback")}
        </p>
        <p className="mt-0.5 text-sm text-nm-muted">
          {item.productType === "mirror"
            ? `${dimensions.widthCm} × ${dimensions.lengthCm} cm`
            : `${dimensions.widthCm} × ${dimensions.lengthCm} × ${dimensions.heightCm} cm`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-heading text-nm-text">{formatARS(price)}</span>
        <IconButton
          label={t("cartItem.removeAriaLabel")}
          size="sm"
          onClick={() => onRemove(item.id)}
        >
          <X className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}
