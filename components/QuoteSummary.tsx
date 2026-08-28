"use client";

import type { CartQuoteRequest } from "@/lib/quoteTypes";
import { formatARS } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const PRODUCT_LABEL_KEY: Record<string, TranslationKey> = {
  table: "cartItem.table",
  bench: "cartItem.bench",
  mirror: "cartItem.mirror",
};

interface QuoteSummaryProps {
  request: CartQuoteRequest;
  deliveryCost: number;
  deliveryDescription: string;
  subtotal: number;
  total: number;
  onNew: () => void;
}

export function QuoteSummary({
  request,
  deliveryCost,
  deliveryDescription,
  subtotal,
  total,
  onNew,
}: QuoteSummaryProps) {
  const { t } = useLanguage();
  const { contact, items, deliveryOption, deliveryAddress } = request;

  return (
    <section className="max-w-xl mx-auto bg-white border border-sand rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div
          aria-hidden
          className="h-12 w-12 rounded-full bg-bark text-cream flex items-center justify-center mb-4"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-walnut">{t("quoteSummary.thanks")}</h2>
        <p className="mt-2 text-walnut/80">
          {contact.preferredMethod === "email" ? t("quoteSummary.sentEmail") : t("quoteSummary.sentWhatsapp")}
        </p>
      </div>

      {/* Datos de contacto */}
      <dl className="mt-6 border-t border-sand pt-6 space-y-3 text-sm">
        {contact.email && <Row label={t("contactGate.email")} value={contact.email} />}
        {contact.phone && <Row label={t("contactGate.phone")} value={contact.phone} />}
        {deliveryOption === "delivery" && deliveryAddress && (
          <Row label={t("quoteSummary.deliveryAddress")} value={deliveryAddress} />
        )}
        {deliveryOption === "pickup" && (
          <Row label={t("quoteSummary.pickupAt")} value="Sáenz Peña 1213, Tigre" />
        )}
      </dl>

      {/* Lista de muebles */}
      <div className="mt-6 border-t border-sand pt-6">
        <h3 className="font-serif text-lg text-walnut mb-3">{t("quoteSummary.quotedFurniture")}</h3>
        <dl className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <dt className="text-walnut/60">
                {t(PRODUCT_LABEL_KEY[item.productType] ?? "cartItem.fallback")} —{" "}
                {item.dimensions.widthCm} × {item.dimensions.lengthCm} × {item.dimensions.heightCm} cm
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Desglose de precios */}
      <div className="mt-6 border-t border-sand pt-6">
        <dl className="space-y-2 text-sm">
          <Row label={t("checkout.furniture")} value={formatARS(subtotal)} />
          <Row
            label={t("checkout.shipping")}
            value={deliveryOption === "pickup" ? t("checkout.freePickup") : formatARS(deliveryCost)}
          />
          {deliveryOption === "delivery" && (
            <Row label={t("quoteSummary.method")} value={deliveryDescription} />
          )}
        </dl>
        <div className="mt-4 pt-4 border-t border-sand flex justify-between items-baseline">
          <span className="font-serif text-walnut">{t("checkout.estimatedTotal")}</span>
          <span className="font-serif text-2xl text-walnut">{formatARS(total)}</span>
        </div>
        <p className="mt-3 text-xs text-walnut/60">
          {t("quoteSummary.disclaimer")}
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onNew}
          className="text-sm text-bark hover:text-walnut underline underline-offset-4"
        >
          {t("quoteSummary.newQuote")}
        </button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-walnut/60">{label}</dt>
      <dd className="text-walnut font-medium text-right">{value}</dd>
    </div>
  );
}
