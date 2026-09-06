"use client";

import { Check } from "lucide-react";
import type { CartQuoteRequest } from "@/lib/quoteTypes";
import { formatARS } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";

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
    <section className="mx-auto max-w-xl rounded-soft-lg bg-nm-surface p-6 shadow-soft sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden
          className="mb-4 grid size-12 place-items-center rounded-full bg-nm-accent text-nm-accent-fg shadow-soft"
        >
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <h2 className="font-heading text-2xl text-nm-text">{t("quoteSummary.thanks")}</h2>
        <p className="mt-2 text-nm-muted">
          {contact.preferredMethod === "email" ? t("quoteSummary.sentEmail") : t("quoteSummary.sentWhatsapp")}
        </p>
      </div>

      {/* Datos de contacto */}
      <div className="mt-6">
        <Divider />
        <dl className="mt-6 space-y-3 text-sm">
          {contact.email && <Row label={t("contactGate.email")} value={contact.email} />}
          {contact.phone && <Row label={t("contactGate.phone")} value={contact.phone} />}
          {deliveryOption === "delivery" && deliveryAddress && (
            <Row label={t("quoteSummary.deliveryAddress")} value={deliveryAddress} />
          )}
          {deliveryOption === "pickup" && (
            <Row label={t("quoteSummary.pickupAt")} value="Sáenz Peña 1213, Tigre" />
          )}
        </dl>
      </div>

      {/* Lista de muebles */}
      <div className="mt-6">
        <Divider />
        <h3 className="mt-6 font-heading text-lg text-nm-text">{t("quoteSummary.quotedFurniture")}</h3>
        <dl className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <dt className="text-nm-muted">
                {t(PRODUCT_LABEL_KEY[item.productType] ?? "cartItem.fallback")} —{" "}
                {item.dimensions.widthCm} × {item.dimensions.lengthCm} × {item.dimensions.heightCm} cm
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Desglose de precios */}
      <div className="mt-6">
        <Divider />
        <dl className="mt-6 space-y-2 text-sm">
          <Row label={t("checkout.furniture")} value={formatARS(subtotal)} />
          <Row
            label={t("checkout.shipping")}
            value={deliveryOption === "pickup" ? t("checkout.freePickup") : formatARS(deliveryCost)}
          />
          {deliveryOption === "delivery" && (
            <Row label={t("quoteSummary.method")} value={deliveryDescription} />
          )}
        </dl>
        <div className="mt-4 border-t border-nm-line pt-4">
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-nm-text">{t("checkout.estimatedTotal")}</span>
            <span className="font-heading text-2xl text-nm-accent">{formatARS(total)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-nm-muted">
          {t("quoteSummary.disclaimer")}
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <Button type="button" variant="ghost" onClick={onNew}>
          {t("quoteSummary.newQuote")}
        </Button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-nm-muted">{label}</dt>
      <dd className="text-right font-medium text-nm-text">{value}</dd>
    </div>
  );
}
