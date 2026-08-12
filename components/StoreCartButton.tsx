"use client";

import { ShoppingBag } from "lucide-react";
import { useStoreCart } from "./StoreCartProvider";

export function StoreCartButton() {
  const { itemCount, openCart } = useStoreCart();

  return (
    <button
      type="button"
      onClick={openCart}
      title="Abrir carrito"
      aria-label={`Abrir carrito, ${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}`}
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-sand bg-white text-walnut hover:bg-sand/40"
    >
      <ShoppingBag size={19} aria-hidden="true" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[11px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
