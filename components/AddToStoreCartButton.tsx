"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useStoreCart } from "./StoreCartProvider";

export function AddToStoreCartButton({
  productId,
  fullWidth = false,
  compact = false,
}: {
  productId: string;
  fullWidth?: boolean;
  /** Icon-only round button, for floating over an image instead of a full-width bar. */
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const { addProduct } = useStoreCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addProduct(productId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        title={t("addToCart.add")}
        aria-label={t("addToCart.add")}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm transition hover:bg-emerald-800"
      >
        {added ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={17} aria-hidden="true" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      <ShoppingBag size={17} aria-hidden="true" />
      {added ? t("addToCart.added") : t("addToCart.add")}
    </button>
  );
}
