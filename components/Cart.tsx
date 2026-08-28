"use client";

import { cartSubtotal } from "@/lib/cart";
import { formatARS } from "@/lib/format";
import type { CartItem } from "@/lib/quoteTypes";
import type { PricingConfig } from "@/lib/pricing/pricingConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CartItemCard } from "./CartItemCard";

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
    <section className="max-w-2xl mx-auto bg-white border border-sand rounded-2xl p-5 sm:p-8">
      <h2 className="font-serif text-2xl sm:text-3xl text-walnut mb-6">
        {t("cart.title")}
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-walnut/60 mb-4">{t("cart.empty")}</p>
          <button
            type="button"
            onClick={onAddMore}
            className="inline-flex items-center justify-center rounded-lg bg-bark text-cream px-5 py-3 text-sm font-medium hover:bg-walnut transition"
          >
            {t("cart.addPiece")}
          </button>
        </div>
      ) : (
        <>
          <div>
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} onRemove={onRemove} config={config} />
            ))}
          </div>

          <div className="mt-4 pt-4 flex justify-between items-baseline">
            <span className="text-sm text-walnut/60">{t("cart.subtotal")}</span>
            <span className="font-serif text-xl text-walnut">
              {formatARS(subtotal)}
            </span>
          </div>
          <p className="text-xs text-walnut/50 mt-1 text-right">
            {t("cart.shippingNextStep")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between">
            <button
              type="button"
              onClick={onAddMore}
              className="text-sm text-bark hover:text-walnut underline underline-offset-4"
            >
              {t("cart.addAnother")}
            </button>
            <button
              type="button"
              onClick={onCheckout}
              className="inline-flex items-center justify-center rounded-lg bg-bark text-cream px-6 py-3 text-sm font-medium hover:bg-walnut transition"
            >
              {t("cart.quoteAll")}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
