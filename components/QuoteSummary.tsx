import type { CartQuoteRequest } from "@/lib/quoteTypes";
import { formatARS } from "@/lib/format";

const PRODUCT_LABEL: Record<string, string> = {
  table: "Mesa a medida",
  bench: "Banco a medida",
};

interface QuoteSummaryProps {
  request: CartQuoteRequest;
  deliveryCost: number;
  subtotal: number;
  total: number;
  onNew: () => void;
}

export function QuoteSummary({
  request,
  deliveryCost,
  subtotal,
  total,
  onNew,
}: QuoteSummaryProps) {
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
        <h2 className="font-serif text-2xl text-walnut">¡Gracias!</h2>
        <p className="mt-2 text-walnut/80">
          Te enviamos la cotización a tu{" "}
          {contact.preferredMethod === "email" ? "email" : "WhatsApp"}.
        </p>
      </div>

      {/* Datos de contacto */}
      <dl className="mt-6 border-t border-sand pt-6 space-y-3 text-sm">
        {contact.email && <Row label="Email" value={contact.email} />}
        {contact.phone && <Row label="Teléfono / WhatsApp" value={contact.phone} />}
        {deliveryOption === "delivery" && deliveryAddress && (
          <Row label="Dirección de entrega" value={deliveryAddress} />
        )}
        {deliveryOption === "pickup" && (
          <Row label="Retiro en" value="Saenz Peña 1213, Tigre" />
        )}
      </dl>

      {/* Lista de muebles */}
      <div className="mt-6 border-t border-sand pt-6">
        <h3 className="font-serif text-lg text-walnut mb-3">Muebles cotizados</h3>
        <dl className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <dt className="text-walnut/60">
                {PRODUCT_LABEL[item.productType] ?? "Mueble a medida"} —{" "}
                {item.dimensions.widthCm} × {item.dimensions.lengthCm} × {item.dimensions.heightCm} cm
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Desglose de precios */}
      <div className="mt-6 border-t border-sand pt-6">
        <dl className="space-y-2 text-sm">
          <Row label="Muebles" value={formatARS(subtotal)} />
          <Row
            label="Envío"
            value={deliveryOption === "pickup" ? "Gratis (retiro)" : formatARS(deliveryCost)}
          />
        </dl>
        <div className="mt-4 pt-4 border-t border-sand flex justify-between items-baseline">
          <span className="font-serif text-walnut">Total estimado</span>
          <span className="font-serif text-2xl text-walnut">{formatARS(total)}</span>
        </div>
        <p className="mt-3 text-xs text-walnut/60">
          Esta cotización es estimativa. Puede ajustarse según el tipo de madera
          y la terminación elegida.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onNew}
          className="text-sm text-bark hover:text-walnut underline underline-offset-4"
        >
          Hacer otra cotización
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
