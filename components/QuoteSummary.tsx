import type { PriceEstimate, QuoteRequest } from "@/lib/quoteTypes";

interface QuoteSummaryProps {
  request: QuoteRequest;
  estimate: PriceEstimate | null;
  onNew: () => void;
}

/**
 * Confirmation + price breakdown shown after the user submits a quotation.
 *
 * The price comes from `calculateTableQuote` in lib/pricing/tablePricing.ts.
 * If `estimate` is null (e.g. a product whose pricing engine isn't ready yet),
 * we fall back to a "we'll get back to you" message without numbers.
 */
export function QuoteSummary({ request, estimate, onNew }: QuoteSummaryProps) {
  const { contact, dimensions } = request;

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
        <h2 className="font-serif text-2xl text-walnut">¡Gracias!</h2>
        <p className="mt-2 text-walnut/80">
          Te enviamos la cotización a tu{" "}
          {contact.preferredMethod === "email" ? "email" : "WhatsApp"}. Aquí
          abajo también la podés ver.
        </p>
      </div>

      <dl className="mt-6 border-t border-sand pt-6 space-y-3 text-sm">
        <Row label="Producto" value="Mesa a medida" />
        <Row
          label="Medidas"
          value={`${dimensions.widthCm} × ${dimensions.lengthCm} × ${dimensions.heightCm} cm`}
        />
        {contact.email && <Row label="Email" value={contact.email} />}
        {contact.phone && <Row label="Teléfono / WhatsApp" value={contact.phone} />}
      </dl>

      {estimate ? (
        <PriceBreakdown estimate={estimate} />
      ) : (
        <p className="mt-6 border-t border-sand pt-6 text-sm text-walnut/70">
          La Barraca te enviará la cotización a la brevedad.
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onNew}
          className="text-sm text-bark hover:text-walnut underline underline-offset-4"
        >
          Cotizar otro mueble
        </button>
      </div>
    </section>
  );
}

function PriceBreakdown({ estimate }: { estimate: PriceEstimate }) {
  return (
    <div className="mt-6 border-t border-sand pt-6">
      <h3 className="font-serif text-lg text-walnut mb-3">Cotización</h3>

      <dl className="space-y-2 text-sm">
        <Row label="Materiales" value={formatARS(estimate.materialCost)} />
        <Row label="Mano de obra" value={formatARS(estimate.labourCost)} />
        <Row label="Terminación" value={formatARS(estimate.finishCost)} />
        <Row label="Envío" value={formatARS(estimate.deliveryCost)} />
      </dl>

      <div className="mt-4 pt-4 border-t border-sand flex justify-between items-baseline">
        <span className="font-serif text-walnut">Total estimado</span>
        <span className="font-serif text-2xl text-walnut">
          {formatARS(estimate.total)}
        </span>
      </div>

      <p className="mt-3 text-xs text-walnut/60">
        Esta cotización es estimativa. Puede ajustarse según el tipo de madera,
        la terminación elegida y la zona de envío.
      </p>
    </div>
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

function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
