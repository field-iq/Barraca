"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ProductSelector } from "@/components/ProductSelector";
import { TableQuoteForm } from "@/components/TableQuoteForm";
import { BenchQuoteForm } from "@/components/BenchQuoteForm";
import { MirrorQuoteForm } from "@/components/MirrorQuoteForm";
import { Cart } from "@/components/Cart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ComingSoon } from "@/components/ComingSoon";
import { QuoteSummary } from "@/components/QuoteSummary";
import { StandardFurnitureSection } from "@/components/StandardFurnitureSection";
import { getProductName } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { submitQuote } from "@/lib/submitQuote";
import {
  DEFAULT_PRICING_CONFIG,
  type PricingConfig,
} from "@/lib/pricing/pricingConfig";
import type {
  CartItem,
  CartQuoteRequest,
  ContactDetails,
  DeliveryOption,
  DeliverySelection,
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
      deliveryDescription: string;
      subtotal: number;
      total: number;
    }
  | { name: "coming-soon"; product: ProductId };

export default function CatalogPage() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState<Step>({ name: "select" });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quoteSelectorOpen, setQuoteSelectorOpen] = useState(false);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);

  useEffect(() => {
    fetch("/api/pricing", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: PricingConfig) => setPricingConfig(data))
      .catch(() => {
        // Keep the bundled defaults if the pricing service is temporarily unavailable.
      });

    if (window.location.hash !== "#a-medida") return;
    setQuoteSelectorOpen(true);
    window.requestAnimationFrame(() => {
      document.getElementById("a-medida")?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  function handleProductSelect(id: ProductId) {
    if (id === "table") setStep({ name: "table-form" });
    else if (id === "bench") setStep({ name: "bench-form" });
    else if (id === "mirror") setStep({ name: "mirror-form" });
    else setStep({ name: "coming-soon", product: id });
  }

  function addItem(productType: "table" | "bench" | "mirror", dimensions: TableDimensions) {
    setCart((current) => [
      ...current,
      { id: crypto.randomUUID(), productType, dimensions },
    ]);
    setStep({ name: "cart" });
  }

  async function handleCheckout(
    deliveryOption: DeliveryOption,
    contact: ContactDetails,
    deliveryAddress?: string,
    deliverySelection?: DeliverySelection,
  ) {
    const request: CartQuoteRequest = {
      items: cart,
      deliveryOption,
      deliveryMethod: deliverySelection?.method,
      deliveryZoneId: deliverySelection?.zoneId,
      deliveryDistanceKm: deliverySelection?.distanceKm,
      deliveryAddress,
      contact,
      requestedAt: new Date().toISOString(),
    };
    const result = await submitQuote(request);
    setStep({
      name: "confirmation",
      request,
      deliveryCost: result.deliveryCost,
      deliveryDescription: result.deliveryDescription,
      subtotal: result.subtotal,
      total: result.total,
    });
  }

  function handleNew() {
    setCart([]);
    setQuoteSelectorOpen(false);
    setStep({ name: "select" });
  }

  const backStep = () => setStep(cart.length > 0 ? { name: "cart" } : { name: "select" });

  return (
    <>
      <Header overlay />
      <main className="relative -mt-16 min-h-screen overflow-hidden bg-[#18211e] pt-16">
        <div aria-hidden="true" className="absolute inset-0 bg-[url('/textures/catalog-boards.jpg')] bg-[length:auto_980px] bg-repeat opacity-75" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#15201c]/75" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
        <div className="relative mx-auto max-w-[1800px] px-4 py-10 sm:px-6 sm:py-16">
        {step.name === "select" && (
          <>
            <StandardFurnitureSection tone="dark" />
            <section id="a-medida" className="mt-14 scroll-mt-24 border-t border-white/20 pt-10 sm:mt-20 sm:pt-14">
              {quoteSelectorOpen ? (
                <div className="bg-[#f7f4ee] p-5 sm:p-10">
                  <ProductSelector onSelect={handleProductSelect} />
                </div>
              ) : (
                <div className="grid gap-6 rounded-2xl bg-[#22372f] px-6 py-8 text-white shadow-[0_15px_25px_-5px_rgba(20,15,10,0.25),0_25px_45px_-10px_rgba(20,15,10,0.3)] sm:grid-cols-[1fr_auto] sm:items-center sm:px-10 sm:py-10">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e4a58d]">{t("header.nav.custom")}</p>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{t("catalogPage.needOtherSize")}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                      {t("catalogPage.needOtherSizeDescription")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuoteSelectorOpen(true)}
                    className="inline-flex h-12 items-center justify-center rounded-md bg-[#e7a181] px-5 text-sm font-semibold text-[#1f2d28] hover:bg-[#f0b69c]"
                  >
                    {t("catalogPage.quoteCustomPiece")}
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {step.name === "table-form" && (
          <TableQuoteForm config={pricingConfig} onBack={backStep} onAdd={(dimensions) => addItem("table", dimensions)} />
        )}
        {step.name === "bench-form" && (
          <BenchQuoteForm config={pricingConfig} onBack={backStep} onAdd={(dimensions) => addItem("bench", dimensions)} />
        )}
        {step.name === "mirror-form" && (
          <MirrorQuoteForm config={pricingConfig} onBack={backStep} onAdd={(dimensions) => addItem("mirror", dimensions)} />
        )}
        {step.name === "cart" && (
          <Cart
            items={cart}
            onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))}
            onAddMore={() => {
              setQuoteSelectorOpen(true);
              setStep({ name: "select" });
            }}
            onCheckout={() => setStep({ name: "checkout" })}
            config={pricingConfig}
          />
        )}
        {step.name === "checkout" && (
          <CheckoutForm
            items={cart}
            onBack={() => setStep({ name: "cart" })}
            onSubmit={handleCheckout}
            config={pricingConfig}
          />
        )}
        {step.name === "coming-soon" && (
          <ComingSoon
            productName={getProductName(step.product, language) ?? t("catalogPage.productFallback")}
            onBack={() => {
              setQuoteSelectorOpen(true);
              setStep({ name: "select" });
            }}
          />
        )}
        {step.name === "confirmation" && (
          <QuoteSummary
            request={step.request}
            deliveryCost={step.deliveryCost}
            deliveryDescription={step.deliveryDescription}
            subtotal={step.subtotal}
            total={step.total}
            onNew={handleNew}
          />
        )}
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#111916] text-white/60">
        <div className="mx-auto max-w-[1800px] px-4 py-7 text-xs text-white/60 sm:px-6">
          {t("footer.catalogNotice")}
        </div>
        <div className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/40 sm:px-6">
          {t("footer.developedBy")}{" "}
          <a
            href="https://taheebo.com.au"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 transition hover:text-white/70"
          >
            Taheebo
          </a>
        </div>
      </footer>
    </>
  );
}
