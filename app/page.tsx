"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductSelector } from "@/components/ProductSelector";
import { TableQuoteForm } from "@/components/TableQuoteForm";
import { BenchQuoteForm } from "@/components/BenchQuoteForm";
import { MirrorQuoteForm } from "@/components/MirrorQuoteForm";
import { Cart } from "@/components/Cart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ComingSoon } from "@/components/ComingSoon";
import { QuoteSummary } from "@/components/QuoteSummary";
import { getProduct } from "@/lib/products";
import { submitQuote } from "@/lib/submitQuote";
import type {
  CartItem,
  CartQuoteRequest,
  ContactDetails,
  DeliveryOption,
  ProductId,
  TableDimensions,
} from "@/lib/quoteTypes";

type Step =
  | { name: "select" }
  | { name: "table-form" }
  | { name: "bench-form" }
  | { name: "mirror-form" }
  | { name: "cart" }
  | { name: "checkout" }
  | {
      name: "confirmation";
      request: CartQuoteRequest;
      deliveryCost: number;
      subtotal: number;
      total: number;
    }
  | { name: "coming-soon"; product: ProductId };

export default function HomePage() {
  const [step, setStep] = useState<Step>({ name: "select" });
  const [cart, setCart] = useState<CartItem[]>([]);

  function handleProductSelect(id: ProductId) {
    if (id === "table") {
      setStep({ name: "table-form" });
    } else if (id === "bench") {
      setStep({ name: "bench-form" });
    } else if (id === "mirror") {
      setStep({ name: "mirror-form" });
    } else {
      setStep({ name: "coming-soon", product: id });
    }
  }

  function handleAddToCart(dimensions: TableDimensions) {
    const item: CartItem = {
      id: crypto.randomUUID(),
      productType: "table",
      dimensions,
    };
    setCart((prev) => [...prev, item]);
    setStep({ name: "cart" });
  }

  function handleAddBenchToCart(dimensions: TableDimensions) {
    const item: CartItem = {
      id: crypto.randomUUID(),
      productType: "bench",
      dimensions,
    };
    setCart((prev) => [...prev, item]);
    setStep({ name: "cart" });
  }

  function handleAddMirrorToCart(dimensions: TableDimensions) {
    const item: CartItem = {
      id: crypto.randomUUID(),
      productType: "mirror",
      dimensions,
    };
    setCart((prev) => [...prev, item]);
    setStep({ name: "cart" });
  }

  function handleRemoveFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleCheckout(
    deliveryOption: DeliveryOption,
    contact: ContactDetails,
    deliveryAddress?: string,
  ) {
    const request: CartQuoteRequest = {
      items: cart,
      deliveryOption,
      deliveryAddress,
      contact,
      requestedAt: new Date().toISOString(),
    };
    const result = await submitQuote(request);
    setStep({
      name: "confirmation",
      request,
      deliveryCost: result.deliveryCost,
      subtotal: result.subtotal,
      total: result.total,
    });
  }

  function handleNew() {
    setCart([]);
    setStep({ name: "select" });
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {step.name === "select" && (
          <ProductSelector onSelect={handleProductSelect} />
        )}

        {step.name === "table-form" && (
          <TableQuoteForm
            onBack={() =>
              setStep(cart.length > 0 ? { name: "cart" } : { name: "select" })
            }
            onAdd={handleAddToCart}
          />
        )}

        {step.name === "bench-form" && (
          <BenchQuoteForm
            onBack={() =>
              setStep(cart.length > 0 ? { name: "cart" } : { name: "select" })
            }
            onAdd={handleAddBenchToCart}
          />
        )}

        {step.name === "mirror-form" && (
          <MirrorQuoteForm
            onBack={() =>
              setStep(cart.length > 0 ? { name: "cart" } : { name: "select" })
            }
            onAdd={handleAddMirrorToCart}
          />
        )}

        {step.name === "cart" && (
          <Cart
            items={cart}
            onRemove={handleRemoveFromCart}
            onAddMore={() => setStep({ name: "select" })}
            onCheckout={() => setStep({ name: "checkout" })}
          />
        )}

        {step.name === "checkout" && (
          <CheckoutForm
            items={cart}
            onBack={() => setStep({ name: "cart" })}
            onSubmit={handleCheckout}
          />
        )}

        {step.name === "coming-soon" && (
          <ComingSoon
            productName={getProduct(step.product)?.name ?? "Producto"}
            onBack={() => setStep({ name: "select" })}
          />
        )}

        {step.name === "confirmation" && (
          <QuoteSummary
            request={step.request}
            deliveryCost={step.deliveryCost}
            subtotal={step.subtotal}
            total={step.total}
            onNew={handleNew}
          />
        )}
      </main>

      <footer className="border-t border-sand mt-12">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-walnut/60">
          La Barraca De Juan — Muebles artesanales
        </div>
      </footer>
    </>
  );
}
