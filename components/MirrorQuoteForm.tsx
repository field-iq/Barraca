"use client";

import { useState } from "react";
import type { TableDimensions } from "@/lib/quoteTypes";
import { calculateMirrorQuote } from "@/lib/pricing/mirrorPricing";
import { formatARS } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { ImageSlideshow } from "./ImageSlideshow";

interface MirrorQuoteFormProps {
  onBack: () => void;
  onAdd: (dimensions: TableDimensions) => void;
}

const DEFAULT_DIMENSIONS: TableDimensions = {
  widthCm: 60,
  lengthCm: 80,
  heightCm: 1,
};

export function MirrorQuoteForm({ onBack, onAdd }: MirrorQuoteFormProps) {
  const [dimensions, setDimensions] = useState<TableDimensions>(DEFAULT_DIMENSIONS);

  const dimensionsValid = isDimensionsValid(dimensions);
  const estimatedPrice = dimensionsValid
    ? calculateMirrorQuote(dimensions, null).total
    : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dimensionsValid) return;
    onAdd(dimensions);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white border border-sand rounded-2xl p-5 sm:p-8 space-y-8"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-walnut">Espejo</h2>
          <p className="mt-1 text-sm text-walnut/70">
            El precio se calcula por metro cuadrado de superficie (ancho × alto).
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-sm text-bark hover:text-walnut underline underline-offset-4"
        >
          Cambiar producto
        </button>
      </header>

      <div className="relative aspect-[16/9] w-full rounded-xl bg-sand overflow-hidden">
        <ImageSlideshow
          images={getProduct("mirror")?.images ?? ["/espejo-1.jpeg"]}
          alt="Espejo con marco de madera maciza hecho en el taller de La Barraca"
          sizes="(max-width: 768px) 100vw, 720px"
          objectFit="contain"
          priority
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="font-serif text-xl text-walnut">Medidas</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DimensionField
            label="Ancho"
            id="dim-width"
            value={dimensions.widthCm}
            onChange={(widthCm) => setDimensions((d) => ({ ...d, widthCm }))}
          />
          <DimensionField
            label="Alto"
            id="dim-length"
            value={dimensions.lengthCm}
            onChange={(lengthCm) => setDimensions((d) => ({ ...d, lengthCm }))}
          />
        </div>
      </fieldset>

      <div className="pt-2 border-t border-sand flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        {estimatedPrice !== null && (
          <p className="text-sm text-walnut/70 sm:mr-auto">
            Precio estimado del espejo:{" "}
            <span className="font-serif text-walnut font-medium">
              {formatARS(estimatedPrice)}
            </span>
          </p>
        )}
        <button
          type="submit"
          disabled={!dimensionsValid}
          className="inline-flex items-center justify-center rounded-lg bg-bark text-cream px-5 py-3 text-sm font-medium hover:bg-walnut transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar al carrito
        </button>
      </div>
    </form>
  );
}

function DimensionField({
  label,
  id,
  value,
  onChange,
  hint,
}: {
  label: string;
  id: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-walnut">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          max={500}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-sand bg-white pl-3 pr-10 py-2.5 text-walnut focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-walnut/50">
          cm
        </span>
      </div>
      {hint && <p className="text-xs text-walnut/40">{hint}</p>}
    </div>
  );
}

function isDimensionsValid(d: TableDimensions): boolean {
  return [d.widthCm, d.lengthCm].every(
    (n) => Number.isFinite(n) && n > 0 && n <= 500,
  );
}
