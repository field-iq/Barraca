"use client";

import { cartSubtotal } from "@/lib/cart";
import { formatARS } from "@/lib/format";
import type { CartItem } from "@/lib/quoteTypes";
import type { PricingConfig } from "@/lib/pricing/pricingConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CartItemCard } from "./CartItemCard";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onAddMore: () => void;
  onCheckout: () => void;
  config: PricingConfig;
}

export function Cart({ items, onRemove, onAddMore, onCheckout, config }: CartProps) {
  const { t } = useLanguage();
  const subtotal = cartSubtotal(items, config);

  return (
    <section className="mx-auto max-w-2xl rounded-soft-lg bg-nm-surface p-5 shadow-soft sm:p-8">
      <h2 className="font-heading text-2xl text-nm-text sm:text-3xl">
        {t("cart.title")}
      </h2>

      {items.length === 0 ? (
        <div className="mt-6 grid place-items-center gap-4 rounded-soft p-10 text-center shadow-soft-inset">
          <p className="text-sm text-nm-muted">{t("cart.empty")}</p>
          <Button type="button" variant="accent" onClick={onAddMore}>
            {t("cart.addPiece")}
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} onRemove={onRemove} config={config} />
            ))}
          </div>

          <div className="mt-6">
            <Divider />
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-sm text-nm-muted">{t("cart.subtotal")}</span>
              <span className="font-heading text-xl text-nm-text">
                {formatARS(subtotal)}
              </span>
            </div>
            <p className="mt-1 text-right text-xs text-nm-muted">
              {t("cart.shippingNextStep")}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" onClick={onAddMore}>
              {t("cart.addAnother")}
            </Button>
            <Button type="button" variant="accent" onClick={onCheckout}>
              {t("cart.quoteAll")}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
