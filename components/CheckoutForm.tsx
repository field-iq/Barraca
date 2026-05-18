"use client";

import { useState } from "react";
import { cartSubtotal, cartTotal } from "@/lib/cart";
import { calculateDeliveryCost } from "@/lib/pricing/tablePricing";
import { formatARS } from "@/lib/format";
import type { CartItem, ContactDetails, DeliveryOption } from "@/lib/quoteTypes";
import { ContactGate, isContactValid } from "./ContactGate";

interface CheckoutFormProps {
  items: CartItem[];
  onBack: () => void;
  onSubmit: (
    deliveryOption: DeliveryOption,
    contact: ContactDetails,
    deliveryAddress?: string,
  ) => Promise<void>;
}

type DeliveryPreview =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; distanceKm: number; cost: number }
  | { status: "error" };

const DEFAULT_CONTACT: ContactDetails = {
  email: "",
  phone: "",
  preferredMethod: "email",
  consent: false,
};

export function CheckoutForm({ items, onBack, onSubmit }: CheckoutFormProps) {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPreview, setDeliveryPreview] = useState<DeliveryPreview>({ status: "idle" });
  const [contact, setContact] = useState<ContactDetails>(DEFAULT_CONTACT);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotal(items);
  const previewDeliveryCost =
    deliveryOption === "pickup"
      ? 0
      : deliveryPreview.status === "ok"
        ? deliveryPreview.cost
        : null;
  const previewTotal =
    previewDeliveryCost !== null ? cartTotal(items, previewDeliveryCost) : null;

  const addressValid =
    deliveryOption === "pickup" || deliveryAddress.trim().length > 0;
  const contactValid = isContactValid(contact);
  const canSubmit = addressValid && contactValid && !submitting;

  async function handleAddressBlur() {
    if (deliveryOption !== "delivery" || !deliveryAddress.trim()) return;
    setDeliveryPreview({ status: "loading" });
    try {
      const params = new URLSearchParams({ address: deliveryAddress.trim() });
      const res = await fetch(`/api/distance?${params}`);
      const data: { distanceKm: number | null } = await res.json();
      if (data.distanceKm !== null) {
        setDeliveryPreview({
          status: "ok",
          distanceKm: data.distanceKm,
          cost: calculateDeliveryCost(data.distanceKm),
        });
      } else {
        setDeliveryPreview({ status: "error" });
      }
    } catch {
      setDeliveryPreview({ status: "error" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(
        deliveryOption,
        contact,
        deliveryOption === "delivery" ? deliveryAddress : undefined,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white border border-sand rounded-2xl p-5 sm:p-8 space-y-8"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-walnut">Finalizar cotización</h2>
          <p className="mt-1 text-sm text-walnut/70">
            {items.length} {items.length === 1 ? "mueble" : "muebles"} — subtotal {formatARS(subtotal)}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-sm text-bark hover:text-walnut underline underline-offset-4"
        >
          Volver al carrito
        </button>
      </header>

      {/* Toggle envío / retiro */}
      <fieldset className="space-y-4">
        <legend className="font-serif text-xl text-walnut">Entrega</legend>
        <div className="grid grid-cols-2 gap-3">
          <DeliveryOptionButton
            active={deliveryOption === "delivery"}
            onClick={() => setDeliveryOption("delivery")}
            title="Envío a domicilio"
            subtitle="Calculamos el costo según tu dirección"
          />
          <DeliveryOptionButton
            active={deliveryOption === "pickup"}
            onClick={() => {
              setDeliveryOption("pickup");
              setDeliveryPreview({ status: "idle" });
            }}
            title="Retiro en taller"
            subtitle="Saenz Peña 1213, Tigre — gratis"
          />
        </div>

        {deliveryOption === "delivery" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-address" className="text-sm font-medium text-walnut">
              Dirección de entrega
            </label>
            <input
              id="checkout-address"
              type="text"
              value={deliveryAddress}
              onChange={(e) => {
                setDeliveryAddress(e.target.value);
                setDeliveryPreview({ status: "idle" });
              }}
              onBlur={handleAddressBlur}
              placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
              className="w-full rounded-lg border border-sand bg-white px-3 py-2.5 text-walnut focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <DeliveryPreviewText preview={deliveryPreview} />
          </div>
        )}
      </fieldset>

      <ContactGate value={contact} onChange={setContact} />

      {/* Resumen de totales */}
      <div className="border-t border-sand pt-6 space-y-2 text-sm">
        <div className="flex justify-between text-walnut/70">
          <span>Muebles</span>
          <span>{formatARS(subtotal)}</span>
        </div>
        <div className="flex justify-between text-walnut/70">
          <span>Envío</span>
          <span>
            {deliveryOption === "pickup"
              ? "Gratis (retiro)"
              : deliveryPreview.status === "ok"
                ? formatARS(deliveryPreview.cost)
                : "A calcular"}
          </span>
        </div>
        {previewTotal !== null && (
          <div className="flex justify-between text-walnut font-serif text-lg pt-2 border-t border-sand">
            <span>Total estimado</span>
            <span>{formatARS(previewTotal)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        {!canSubmit && !submitting && (
          <p className="text-xs text-walnut/60 sm:mr-auto">
            {deliveryOption === "delivery" && !deliveryAddress.trim()
              ? "Ingresá tu dirección de entrega."
              : "Completá tus datos de contacto y la confirmación."}
          </p>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-lg bg-bark text-cream px-5 py-3 text-sm font-medium hover:bg-walnut transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Enviando..." : "Enviar cotización"}
        </button>
      </div>
    </form>
  );
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
      className={`rounded-xl border-2 p-4 text-left transition ${
        active
          ? "border-bark bg-bark/5"
          : "border-sand hover:border-bark/40"
      }`}
    >
      <p className={`text-sm font-medium ${active ? "text-bark" : "text-walnut"}`}>
        {title}
      </p>
      <p className="text-xs text-walnut/50 mt-0.5">{subtitle}</p>
    </button>
  );
}

function DeliveryPreviewText({ preview }: { preview: DeliveryPreview }) {
  if (preview.status === "idle") {
    return (
      <p className="text-xs text-walnut/50">
        Calculamos el costo al ingresar tu dirección.
      </p>
    );
  }
  if (preview.status === "loading") {
    return <p className="text-xs text-walnut/50 animate-pulse">Calculando...</p>;
  }
  if (preview.status === "error") {
    return (
      <p className="text-xs text-amber-600">
        No pudimos calcular el envío. Lo confirmaremos al contactarte.
      </p>
    );
  }
  return (
    <p className="text-xs text-bark font-medium">
      {preview.distanceKm} km desde el taller —{" "}
      <span className="text-walnut">
        Envío estimado:{" "}
        {new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(preview.cost)}
      </span>
    </p>
  );
}
