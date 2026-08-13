"use client";

import { ShoppingBasket } from "lucide-react";
import { useStoreCart } from "./StoreCartProvider";

export function StoreCartButton({ overlay = false }: { overlay?: boolean }) {
  const { itemCount, openCart } = useStoreCart();

  return (
    <button
      type="button"
      onClick={openCart}
      title="Abrir canasta"
      aria-label={`Abrir carrito, ${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}`}
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center transition ${
        overlay
          ? "ml-1 border-l border-white/25 pl-3 text-[#f1c0a7] hover:text-white"
          : "rounded-md border border-sand bg-white text-walnut hover:bg-sand/40"
      }`}
    >
      <ShoppingBasket size={20} strokeWidth={1.55} aria-hidden="true" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[11px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
