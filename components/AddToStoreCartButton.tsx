"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useStoreCart } from "./StoreCartProvider";

export function AddToStoreCartButton({
  productId,
  fullWidth = false,
}: {
  productId: string;
  fullWidth?: boolean;
}) {
  const { addProduct } = useStoreCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addProduct(productId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
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
      {added ? "Agregado" : "Agregar al carrito"}
    </button>
  );
}
