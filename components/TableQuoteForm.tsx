"use client";

import { useEffect, useState } from "react";
import type { TableDimensions } from "@/lib/quoteTypes";
import { calculateTableQuote } from "@/lib/pricing/tablePricing";
import {
  getDefaultDimensions,
  validateProductDimensions,
  type DimensionRange,
  type PricingConfig,
} from "@/lib/pricing/pricingConfig";
import { formatARS } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ImageSlideshow } from "./ImageSlideshow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/feedback/alert";
import { Divider } from "@/components/ui/divider";

interface TableQuoteFormProps {
  onBack: () => void;
  onAdd: (dimensions: TableDimensions) => void;
  config: PricingConfig;
}

export function TableQuoteForm({ onBack, onAdd, config }: TableQuoteFormProps) {
  const { t } = useLanguage();
  const [dimensions, setDimensions] = useState<TableDimensions>(() => getDefaultDimensions("table", config));
  const ranges = config.mesa.dimensions;

  useEffect(() => setDimensions(getDefaultDimensions("table", config)), [config]);

  const dimensionErrors = validateProductDimensions("table", dimensions, config);
  const dimensionsValid = dimensionErrors.length === 0;
  const estimatedPrice = dimensionsValid
    ? calculateTableQuote(dimensions, null, config.mesa, config.delivery, false).total
    : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dimensionsValid) return;
    onAdd(dimensions);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto rounded-soft-lg bg-nm-surface p-5 shadow-soft sm:p-10 space-y-8"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl text-nm-text">{t("quoteForm.table.title")}</h2>
          <p className="mt-1 text-sm text-nm-muted">
            {t("quoteForm.table.description")}
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onBack} className="shrink-0">
          {t("quoteForm.changeProduct")}
        </Button>
      </header>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-soft shadow-soft-inset">
        <ImageSlideshow
          images={getProduct("table")?.images ?? ["/mesa-1.jpeg"]}
          alt={t("quoteForm.table.imageAlt")}
          sizes="(max-width: 768px) 100vw, 720px"
          priority
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="font-heading text-xl text-nm-text">{t("quoteForm.dimensions")}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DimensionField
            label={t("quoteForm.width")}
            id="dim-width"
            value={dimensions.widthCm}
            range={ranges.widthCm}
            onChange={(widthCm) => setDimensions((d) => ({ ...d, widthCm }))}
          />
          <DimensionField
            label={t("quoteForm.length")}
            id="dim-length"
            value={dimensions.lengthCm}
            range={ranges.lengthCm}
            onChange={(lengthCm) => setDimensions((d) => ({ ...d, lengthCm }))}
          />
          <DimensionField
            label={t("quoteForm.height")}
            id="dim-height"
            value={dimensions.heightCm}
            range={ranges.heightCm}
            onChange={(heightCm) => setDimensions((d) => ({ ...d, heightCm }))}
          />
        </div>
      </fieldset>

      {!dimensionsValid && <Alert tone="warning" title={dimensionErrors[0]} />}

      <Divider />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        {estimatedPrice !== null && (
          <p className="text-sm text-nm-muted sm:mr-auto">
            {t("quoteForm.table.estimatedPrice")}{" "}
            <span className="font-heading text-xl text-nm-accent">
              {formatARS(estimatedPrice)}
            </span>
          </p>
        )}
        <Button type="submit" variant="accent" size="lg" disabled={!dimensionsValid}>
          {t("quoteForm.addToCart")}
        </Button>
      </div>
    </form>
  );
}

function DimensionField({
  label,
  id,
  value,
  range,
  onChange,
}: {
  label: string;
  id: string;
  value: number;
  range: DimensionRange;
  onChange: (n: number) => void;
}) {
  const { t } = useLanguage();
  return (
    <FormField label={label} htmlFor={id} hint={t("quoteForm.rangeHint", { min: range.min, max: range.max })}>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={range.min}
        max={range.max}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(Number(e.target.value))}
        trailing={<span className="text-xs">cm</span>}
      />
    </FormField>
  );
}
