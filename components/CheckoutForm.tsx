"use client";

import { MapPin, Route } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cartSubtotal, cartTotal } from "@/lib/cart";
import { formatARS } from "@/lib/format";
import type { PricingConfig } from "@/lib/pricing/pricingConfig";
import { calculateDeliveryCost } from "@/lib/pricing/tablePricing";
import type {
  CartItem,
  ContactDetails,
  DeliveryMethod,
  DeliveryOption,
  DeliverySelection,
} from "@/lib/quoteTypes";
import { ContactGate, isContactValid } from "./ContactGate";

interface CheckoutFormProps {
  items: CartItem[];
  onBack: () => void;
  onSubmit: (
    deliveryOption: DeliveryOption,
    contact: ContactDetails,
    deliveryAddress: string | undefined,
    deliverySelection: DeliverySelection | undefined,
  ) => Promise<void>;
  config: PricingConfig;
}

const DEFAULT_CONTACT: ContactDetails = {
  email: "",
  phone: "",
  preferredMethod: "email",
  consent: false,
};

export function CheckoutForm({ items, onBack, onSubmit, config }: CheckoutFormProps) {
  const enabledZones = useMemo(
    () => config.delivery.zones.filter((zone) => zone.enabled),
    [config.delivery.zones],
  );
  const zoneAvailable = config.delivery.zonesEnabled && enabledZones.length > 0;
  const distanceAvailable = config.delivery.distanceEnabled;
  const deliveryAvailable = zoneAvailable || distanceAvailable;

  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(
    deliveryAvailable ? "delivery" : "pickup",
  );
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    zoneAvailable ? "zone" : "distance",
  );
  const [deliveryZoneId, setDeliveryZoneId] = useState(enabledZones[0]?.id ?? "");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [distanceInput, setDistanceInput] = useState("");
  const [contact, setContact] = useState<ContactDetails>(DEFAULT_CONTACT);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!deliveryAvailable) setDeliveryOption("pickup");
    if (deliveryMethod === "zone" && !zoneAvailable && distanceAvailable) setDeliveryMethod("distance");
    if (deliveryMethod === "distance" && !distanceAvailable && zoneAvailable) setDeliveryMethod("zone");
    if (!enabledZones.some((zone) => zone.id === deliveryZoneId)) {
      setDeliveryZoneId(enabledZones[0]?.id ?? "");
    }
  }, [deliveryAvailable, deliveryMethod, deliveryZoneId, distanceAvailable, enabledZones, zoneAvailable]);

  const subtotal = cartSubtotal(items, config);
  const selectedZone = enabledZones.find((zone) => zone.id === deliveryZoneId);
  const distanceKm = Number(distanceInput.replace(",", "."));
  const distanceValid = Number.isFinite(distanceKm)
    && distanceKm > 0
    && distanceKm <= config.delivery.maximumDistanceKm;
  const previewDeliveryCost = deliveryOption === "pickup"
    ? 0
    : deliveryMethod === "zone"
      ? selectedZone?.price ?? null
      : distanceValid
        ? calculateDeliveryCost(distanceKm, config.delivery)
        : null;
  const previewTotal = previewDeliveryCost === null
    ? null
    : cartTotal(items, previewDeliveryCost, config);

  const addressValid = deliveryAddress.trim().length >= 5;
  const methodValid = deliveryMethod === "zone"
    ? Boolean(selectedZone)
    : distanceValid;
  const deliveryValid = deliveryOption === "pickup" || (deliveryAvailable && addressValid && methodValid);
  const canSubmit = deliveryValid && isContactValid(contact) && !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const deliverySelection = deliveryOption === "delivery"
        ? {
          method: deliveryMethod,
          ...(deliveryMethod === "zone" ? { zoneId: deliveryZoneId } : {}),
          ...(deliveryMethod === "distance" ? { distanceKm } : {}),
        }
        : undefined;
      await onSubmit(
        deliveryOption,
        contact,
        deliveryOption === "delivery" ? deliveryAddress.trim() : undefined,
        deliverySelection,
      );
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo enviar la cotización.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-sand bg-white p-5 sm:p-8"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-walnut sm:text-3xl">Finalizar cotización</h2>
          <p className="mt-1 text-sm text-walnut/70">
            {items.length} {items.length === 1 ? "mueble" : "muebles"} · subtotal {formatARS(subtotal)}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-sm text-bark underline underline-offset-4 hover:text-walnut"
        >
          Volver al carrito
        </button>
      </header>

      <fieldset className="space-y-5">
        <legend className="font-serif text-xl text-walnut">Entrega</legend>
        <div className={`grid gap-3 ${deliveryAvailable ? "grid-cols-2" : "grid-cols-1"}`}>
          {deliveryAvailable && (
            <DeliveryOptionButton
              active={deliveryOption === "delivery"}
              onClick={() => setDeliveryOption("delivery")}
              title="Envío a domicilio"
              subtitle="Elegí zona o cálculo por km"
            />
          )}
          <DeliveryOptionButton
            active={deliveryOption === "pickup"}
            onClick={() => setDeliveryOption("pickup")}
            title="Retiro en taller"
            subtitle="Sáenz Peña 1213, Tigre · gratis"
          />
        </div>

        {deliveryOption === "delivery" && (
          <div className="space-y-5 border-t border-sand pt-5">
            {zoneAvailable && distanceAvailable && (
              <div>
                <p className="mb-2 text-sm font-medium text-walnut">Cómo cotizar el envío</p>
                <div className="grid grid-cols-2 gap-2">
                  <DeliveryMethodButton
                    active={deliveryMethod === "zone"}
                    icon={<MapPin size={18} />}
                    label="Por zona"
                    onClick={() => setDeliveryMethod("zone")}
                  />
                  <DeliveryMethodButton
                    active={deliveryMethod === "distance"}
                    icon={<Route size={18} />}
                    label="Por kilómetros"
                    onClick={() => setDeliveryMethod("distance")}
                  />
                </div>
              </div>
            )}

            <label className="block text-sm font-medium text-walnut">
              Dirección de entrega
              <input
                type="text"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                placeholder="Ej: Av. Cabildo 2040, Belgrano, CABA"
                autoComplete="street-address"
                className="mt-1.5 w-full rounded-lg border border-sand bg-white px-3 py-2.5 text-walnut outline-none focus:border-transparent focus:ring-2 focus:ring-accent"
              />
            </label>

            {deliveryMethod === "zone" ? (
              <div>
                <label className="block text-sm font-medium text-walnut">
                  Zona de entrega
                  <select
                    value={deliveryZoneId}
                    onChange={(event) => setDeliveryZoneId(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-sand bg-white px-3 font-normal outline-none focus:border-transparent focus:ring-2 focus:ring-accent"
                  >
                    {enabledZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.name} · {formatARS(zone.price)}</option>
                    ))}
                  </select>
                </label>
                {selectedZone?.description && (
                  <p className="mt-2 text-xs leading-5 text-walnut/55">Incluye: {selectedZone.description}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-walnut">
                  Distancia aproximada desde el taller
                  <div className="relative mt-1.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0.1"
                      max={config.delivery.maximumDistanceKm}
                      step="0.1"
                      value={distanceInput}
                      onChange={(event) => setDistanceInput(event.target.value)}
                      placeholder="Ej: 24"
                      className="h-11 w-full rounded-lg border border-sand bg-white px-3 pr-12 font-normal text-walnut outline-none focus:border-transparent focus:ring-2 focus:ring-accent"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-walnut/55">km</span>
                  </div>
                </label>
                <p className="text-xs leading-5 text-walnut/50">
                  Consultá la ruta desde <strong className="font-medium text-walnut/70">{config.delivery.originAddress}</strong> e ingresá los kilómetros indicados. El valor es estimativo y se confirma antes de coordinar el envío.
                </p>
                {distanceValid && previewDeliveryCost !== null && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Estimación para {distanceKm} km · <strong>{formatARS(previewDeliveryCost)}</strong>
                  </div>
                )}
                {distanceInput !== "" && !distanceValid && (
                  <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
                    Ingresá una distancia entre 0,1 y {config.delivery.maximumDistanceKm} km.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </fieldset>

      <ContactGate value={contact} onChange={setContact} />

      {submitError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <div className="space-y-2 border-t border-sand pt-6 text-sm">
        <SummaryRow label="Muebles" value={formatARS(subtotal)} />
        <SummaryRow
          label="Envío"
          value={deliveryOption === "pickup"
            ? "Gratis (retiro)"
            : previewDeliveryCost === null
              ? "A calcular"
              : formatARS(previewDeliveryCost)}
        />
        {previewTotal !== null && (
          <div className="flex justify-between border-t border-sand pt-3 font-serif text-lg text-walnut">
            <span>Total estimado</span>
            <span>{formatARS(previewTotal)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {!canSubmit && !submitting && (
          <p className="text-xs text-walnut/60 sm:mr-auto">
            {submitHint(deliveryOption, addressValid, deliveryMethod, methodValid, isContactValid(contact))}
          </p>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-lg bg-bark px-5 py-3 text-sm font-medium text-cream transition hover:bg-walnut disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar cotización"}
        </button>
      </div>
    </form>
  );
}

function submitHint(
  option: DeliveryOption,
  addressValid: boolean,
  method: DeliveryMethod,
  methodValid: boolean,
  contactValid: boolean,
): string {
  if (option === "delivery" && !addressValid) return "Ingresá una dirección completa.";
  if (option === "delivery" && method === "zone" && !methodValid) return "Elegí una zona disponible.";
  if (option === "delivery" && method === "distance" && !methodValid) return "Ingresá la distancia aproximada en kilómetros.";
  if (!contactValid) return "Completá tus datos de contacto y la confirmación.";
  return "";
}

function DeliveryOptionButton({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 p-4 text-left transition ${active ? "border-bark bg-bark/5" : "border-sand hover:border-bark/40"}`}
    >
      <p className={`text-sm font-medium ${active ? "text-bark" : "text-walnut"}`}>{title}</p>
      <p className="mt-0.5 text-xs text-walnut/50">{subtitle}</p>
    </button>
  );
}

function DeliveryMethodButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium ${active ? "border-bark bg-bark text-cream" : "border-sand text-walnut hover:border-bark/50"}`}
    >
      {icon} {label}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-walnut/70">
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
