"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductSelector } from "@/components/ProductSelector";
import { TableQuoteForm } from "@/components/TableQuoteForm";
import { ComingSoon } from "@/components/ComingSoon";
import { QuoteSummary } from "@/components/QuoteSummary";
import { OffersSection } from "@/components/OffersSection";
import { getProduct } from "@/lib/products";
import { submitQuote } from "@/lib/submitQuote";
import type { PriceEstimate, ProductId, QuoteRequest } from "@/lib/quoteTypes";

type Step =
  | { name: "select" }
  | { name: "table-form" }
  | { name: "coming-soon"; product: ProductId }
  | {
      name: "confirmation";
      request: QuoteRequest;
      estimate: PriceEstimate | null;
    };

export default function HomePage() {
  const [step, setStep] = useState<Step>({ name: "select" });

  function handleProductSelect(id: ProductId) {
    if (id === "table") {
      setStep({ name: "table-form" });
    } else {
      setStep({ name: "coming-soon", product: id });
    }
  }

  async function handleQuoteSubmit(request: QuoteRequest) {
    // Future: replace `submitQuote` with a Supabase / Airtable / API call.
    const result = await submitQuote(request);
    setStep({ name: "confirmation", request, estimate: result.estimate });
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {step.name === "select" && (
          <>
            <OffersSection />
            <div className="mt-12 sm:mt-16 border-t border-sand pt-10">
              <ProductSelector onSelect={handleProductSelect} />
            </div>
          </>
        )}

        {step.name === "table-form" && (
          <TableQuoteForm
            onBack={() => setStep({ name: "select" })}
            onSubmit={handleQuoteSubmit}
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
            estimate={step.estimate}
            onNew={() => setStep({ name: "select" })}
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
