"use client";

import Image from "next/image";
import {
  Check,
  ChevronLeft,
  MapPin,
  Minus,
  Plus,
  Route,
  Send,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatARS } from "@/lib/format";
import {
  DEFAULT_PRICING_CONFIG,
  type PricingConfig,
} from "@/lib/pricing/pricingConfig";
import { calculateDeliveryCost } from "@/lib/pricing/tablePricing";
import type {
  StoreDeliveryMethod,
  StoreDeliveryOption,
  StoreOrderResult,
} from "@/lib/orderTypes";
import { useStoreCart } from "./StoreCartProvider";

type DrawerStep = "cart" | "checkout" | "success";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  notes: string;
  website: string;
}

const EMPTY_FORM: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  notes: "",
  website: "",
};

export function StoreCartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    clearCart,
    getProduct,
    updateQuantity,
    removeProduct,
  } = useStoreCart();
  const [step, setStep] = useState<DrawerStep>("cart");
  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [deliveryOption, setDeliveryOption] = useState<StoreDeliveryOption | "">("");
  const [deliveryMethod, setDeliveryMethod] = useState<StoreDeliveryMethod | "">("");
  const [deliveryZoneId, setDeliveryZoneId] = useState("");
  const [distanceInput, setDistanceInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    fetch("/api/pricing", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: PricingConfig) => setPricingConfig(data))
      .catch(() => {
        // Keep bundled defaults if the pricing service is temporarily unavailable.
      });
  }, []);

  const resolvedItems = useMemo(
    () =>
      items.flatMap((item) => {
        const product = getProduct(item.productId);
        return product ? [{ ...item, product }] : [];
      }),
    [items, getProduct],
  );
  const total = resolvedItems.reduce(
    (sum, item) => sum + item.product.cashPrice * item.quantity,
    0,
  );
  const enabledZones = useMemo(
    () => pricingConfig.delivery.zones.filter((zone) => zone.enabled),
    [pricingConfig.delivery.zones],
  );
  const zoneAvailable = pricingConfig.delivery.zonesEnabled && enabledZones.length > 0;
  const distanceAvailable = pricingConfig.delivery.distanceEnabled;
  const selectedZone = enabledZones.find((zone) => zone.id === deliveryZoneId);
  const distanceKm = Number(distanceInput.replace(",", "."));
  const distanceValid = Number.isFinite(distanceKm)
    && distanceKm > 0
    && distanceKm <= pricingConfig.delivery.maximumDistanceKm;
  const deliveryCost = deliveryOption !== "delivery"
    ? 0
    : deliveryMethod === "zone"
      ? selectedZone?.price ?? null
      : deliveryMethod === "distance" && distanceValid
        ? calculateDeliveryCost(distanceKm, pricingConfig.delivery)
        : null;
  const orderTotal = total + (deliveryCost ?? 0);
  const deliveryValid = deliveryOption === "pickup"
    || (deliveryOption === "delivery" && deliveryCost !== null);

  useEffect(() => {
    if (!enabledZones.some((zone) => zone.id === deliveryZoneId)) {
      setDeliveryZoneId(enabledZones[0]?.id ?? "");
    }
    if (deliveryMethod === "zone" && !zoneAvailable) {
      setDeliveryMethod(distanceAvailable ? "distance" : "");
    }
    if (deliveryMethod === "distance" && !distanceAvailable) {
      setDeliveryMethod(zoneAvailable ? "zone" : "");
    }
  }, [deliveryMethod, deliveryZoneId, distanceAvailable, enabledZones, zoneAvailable]);

  function close() {
    closeCart();
    setStep("cart");
    setError("");
    setDeliveryOption("");
    setDeliveryMethod("");
    setDistanceInput("");
    if (step === "success") {
      setOrderId("");
      setForm(EMPTY_FORM);
    }
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || resolvedItems.length === 0) return;
    if (!deliveryValid) {
      setError(deliveryOption
        ? "Completá los datos para calcular el envío."
        : "Elegí si querés recibir el pedido con envío o retirarlo.");
      return;
    }
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: resolvedItems.map(({ productId, quantity }) => ({ productId, quantity })),
          customer: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || undefined,
            notes: form.notes.trim() || undefined,
          },
          delivery: deliveryOption === "pickup"
            ? { option: deliveryOption }
            : {
                option: deliveryOption,
                method: deliveryMethod,
                ...(deliveryMethod === "zone" ? { zoneId: deliveryZoneId } : {}),
                ...(deliveryMethod === "distance" ? { distanceKm } : {}),
              },
          website: form.website,
        }),
      });
      const result = (await response.json()) as StoreOrderResult | { error?: string };
      if (!response.ok || !("ok" in result)) {
        throw new Error("error" in result ? result.error : "No se pudo enviar el pedido.");
      }

      setOrderId(result.orderId);
      clearCart();
      setStep("success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo enviar el pedido. Intentá nuevamente.",
      );
    } finally {
      setSending(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={close}
        className="absolute inset-0 bg-black/35"
      />
      <section className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sand bg-white px-4 sm:px-5">
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <button
                type="button"
                onClick={() => {
                  setStep("cart");
                  setError("");
                }}
                title="Volver al carrito"
                aria-label="Volver al carrito"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-sand/50"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <ShoppingBag size={20} className="text-bark" aria-hidden="true" />
            <h2 className="font-serif text-xl">
              {step === "cart" && "Tu carrito"}
              {step === "checkout" && "Completar pedido"}
              {step === "success" && "Pedido enviado"}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            title="Cerrar"
            aria-label="Cerrar carrito"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-sand/50"
          >
            <X size={20} />
          </button>
        </header>

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
              {resolvedItems.length === 0 ? (
                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                  <ShoppingBag size={36} className="text-walnut/25" />
                  <p className="mt-4 font-serif text-xl">Tu carrito está vacío</p>
                  <p className="mt-1 max-w-xs text-sm text-walnut/60">
                    Agregá muebles del catálogo para preparar tu pedido.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-5 h-10 rounded-md bg-bark px-4 text-sm font-medium text-cream"
                  >
                    Seguir viendo muebles
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resolvedItems.map(({ productId, quantity, product }) => (
                    <article key={productId} className="flex gap-3 border-b border-sand pb-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-sand">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.imageAlt}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                            <p className="mt-0.5 truncate text-xs text-walnut/55">{product.dimensions}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(productId)}
                            title="Quitar producto"
                            aria-label={`Quitar ${product.name}`}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="mt-2 font-serif text-lg">{formatARS(product.cashPrice)}</p>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div className="flex h-9 items-center rounded-md border border-sand bg-white">
                            <QuantityButton
                              label={`Quitar una unidad de ${product.name}`}
                              onClick={() => updateQuantity(productId, quantity - 1)}
                            >
                              <Minus size={14} />
                            </QuantityButton>
                            <span className="w-9 text-center text-sm font-medium">{quantity}</span>
                            <QuantityButton
                              label={`Agregar una unidad de ${product.name}`}
                              disabled={quantity >= 20}
                              onClick={() => updateQuantity(productId, quantity + 1)}
                            >
                              <Plus size={14} />
                            </QuantityButton>
                          </div>
                          <p className="text-sm font-semibold">{formatARS(product.cashPrice * quantity)}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {resolvedItems.length > 0 && (
              <footer className="shrink-0 border-t border-sand bg-white px-4 py-4 sm:px-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-walnut/65">Total en efectivo</span>
                  <span className="font-serif text-2xl">{formatARS(total)}</span>
                </div>
                <p className="mt-1 text-xs text-walnut/50">Entrega y forma de pago se coordinan con el taller.</p>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryOption("");
                    setDeliveryMethod("");
                    setDistanceInput("");
                    setError("");
                    setStep("checkout");
                  }}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Continuar pedido <ChevronLeft size={17} className="rotate-180" />
                </button>
              </footer>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={submitOrder} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
              <div className="rounded-md border border-sand bg-white px-4 py-3">
                <div className="flex justify-between gap-4 text-sm text-walnut/65">
                  <span>{resolvedItems.reduce((sum, item) => sum + item.quantity, 0)} artículos</span>
                  <span>{formatARS(total)}</span>
                </div>
                {deliveryOption && (
                  <div className="mt-2 flex justify-between gap-4 text-sm text-walnut/65">
                    <span>{deliveryOption === "pickup" ? "Retiro" : "Envío"}</span>
                    <span>{deliveryCost === null ? "A calcular" : deliveryCost === 0 ? "Sin cargo" : formatARS(deliveryCost)}</span>
                  </div>
                )}
                {deliveryCost !== null && deliveryOption && (
                  <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-sand pt-3">
                    <span className="text-sm font-medium text-walnut">Total estimado</span>
                    <span className="font-serif text-xl">{formatARS(orderTotal)}</span>
                  </div>
                )}
                </div>

              <fieldset>
                <legend className="font-serif text-lg text-walnut">¿Querés envío?</legend>
                <p className="mt-1 text-xs leading-5 text-walnut/55">
                  Elegí cómo querés recibir el pedido. Los detalles se coordinan con el taller.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <DeliveryChoice
                    active={deliveryOption === "delivery"}
                    icon={<Truck size={20} />}
                    title="Con envío"
                    subtitle="Calcular entrega"
                    onClick={() => {
                      setDeliveryOption("delivery");
                      setDeliveryMethod(zoneAvailable ? "zone" : distanceAvailable ? "distance" : "");
                      setDeliveryZoneId(enabledZones[0]?.id ?? "");
                      setError("");
                    }}
                  />
                  <DeliveryChoice
                    active={deliveryOption === "pickup"}
                    icon={<Store size={20} />}
                    title="Sin envío"
                    subtitle="Retiro a coordinar"
                    onClick={() => {
                      setDeliveryOption("pickup");
                      setDeliveryMethod("");
                      setError("");
                    }}
                  />
                </div>

                {deliveryOption === "delivery" && (
                  <div className="mt-4 space-y-4 border-t border-sand pt-4">
                    {!zoneAvailable && !distanceAvailable ? (
                      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        El envío no está disponible en este momento. Elegí retiro o consultanos antes de enviar el pedido.
                      </p>
                    ) : (
                      <>
                        {zoneAvailable && distanceAvailable && (
                          <div>
                            <p className="mb-2 text-sm font-medium text-walnut">Cómo calcularlo</p>
                            <div className="grid grid-cols-2 gap-2">
                              <DeliveryMethodChoice
                                active={deliveryMethod === "zone"}
                                icon={<MapPin size={17} />}
                                label="Por zona"
                                onClick={() => setDeliveryMethod("zone")}
                              />
                              <DeliveryMethodChoice
                                active={deliveryMethod === "distance"}
                                icon={<Route size={17} />}
                                label="Por km"
                                onClick={() => setDeliveryMethod("distance")}
                              />
                            </div>
                          </div>
                        )}

                        {deliveryMethod === "zone" && zoneAvailable && (
                          <FormField label="Zona de entrega" htmlFor="store-delivery-zone">
                            <select
                              id="store-delivery-zone"
                              value={deliveryZoneId}
                              onChange={(event) => setDeliveryZoneId(event.target.value)}
                              className="h-11 w-full rounded-md border border-sand bg-white px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                            >
                              {enabledZones.map((zone) => (
                                <option key={zone.id} value={zone.id}>{zone.name} · {formatARS(zone.price)}</option>
                              ))}
                            </select>
                            {selectedZone?.description && (
                              <p className="mt-1.5 text-xs leading-5 text-walnut/50">Incluye: {selectedZone.description}</p>
                            )}
                          </FormField>
                        )}

                        {deliveryMethod === "distance" && distanceAvailable && (
                          <FormField label="Distancia aproximada" htmlFor="store-delivery-distance">
                            <div className="relative">
                              <input
                                id="store-delivery-distance"
                                type="number"
                                inputMode="decimal"
                                min="0.1"
                                max={pricingConfig.delivery.maximumDistanceKm}
                                step="0.1"
                                value={distanceInput}
                                onChange={(event) => setDistanceInput(event.target.value)}
                                placeholder="Ej: 24"
                                className="h-11 w-full rounded-md border border-sand bg-white px-3 pr-12 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                              />
                              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-walnut/55">km</span>
                            </div>
                            <p className="mt-1.5 text-xs leading-5 text-walnut/50">
                              Calculá la ruta desde {pricingConfig.delivery.originAddress}. El importe es estimativo.
                            </p>
                            {distanceInput !== "" && !distanceValid && (
                              <p className="mt-2 text-xs text-amber-700">
                                Ingresá entre 0,1 y {pricingConfig.delivery.maximumDistanceKm} km.
                              </p>
                            )}
                          </FormField>
                        )}

                        {deliveryCost !== null && deliveryCost > 0 && (
                          <div className="flex items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
                            <span>Envío estimado</span>
                            <strong>{formatARS(deliveryCost)}</strong>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </fieldset>

              <div className="grid gap-4">
                <FormField label="Nombre y apellido" htmlFor="order-name">
                  <input
                    id="order-name"
                    required
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="h-11 w-full rounded-md border border-sand bg-white px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </FormField>
                <FormField label="Email" htmlFor="order-email">
                  <input
                    id="order-email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="nombre@email.com"
                    className="h-11 w-full rounded-md border border-sand bg-white px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <p className="mt-1.5 text-xs text-walnut/50">Te enviaremos una copia del pedido a este correo.</p>
                </FormField>
                <FormField label="Teléfono (opcional)" htmlFor="order-phone">
                  <input
                    id="order-phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    className="h-11 w-full rounded-md border border-sand bg-white px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </FormField>
                <FormField label="Comentarios (opcional)" htmlFor="order-notes">
                  <textarea
                    id="order-notes"
                    rows={4}
                    maxLength={1000}
                    value={form.notes}
                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                    placeholder="Entrega, terminación u otra consulta"
                    className="w-full resize-y rounded-md border border-sand bg-white px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </FormField>
                <label className="sr-only" aria-hidden="true">
                  Sitio web
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                  />
                </label>
              </div>

              {error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>
            <footer className="shrink-0 border-t border-sand bg-white px-4 py-4 sm:px-5">
              <button
                type="submit"
                disabled={sending || !deliveryValid}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                <Send size={17} /> {sending ? "Enviando pedido..." : "Enviar pedido"}
              </button>
              <p className="mt-2 text-center text-xs text-walnut/50">
                Este pedido no realiza un cobro. La Barraca confirmará disponibilidad y entrega.
              </p>
            </footer>
          </form>
        )}

        {step === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white">
              <Check size={28} />
            </div>
            <h3 className="mt-5 font-serif text-2xl">Recibimos tu pedido</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-walnut/65">
              Enviamos una copia a <strong className="text-walnut">{form.email}</strong>. La Barraca se pondrá en contacto para confirmar los detalles.
            </p>
            <p className="mt-4 text-xs text-walnut/45">Pedido {orderId}</p>
            <button
              type="button"
              onClick={close}
              className="mt-6 h-11 rounded-md bg-bark px-5 text-sm font-medium text-cream"
            >
              Seguir viendo muebles
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function DeliveryChoice({
  active,
  icon,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-24 rounded-md border p-3 text-left transition ${
        active
          ? "border-emerald-700 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-700"
          : "border-sand bg-white text-walnut hover:border-bark/50"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </span>
      <span className="mt-2 block text-xs opacity-65">{subtitle}</span>
    </button>
  );
}

function DeliveryMethodChoice({
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
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition ${
        active
          ? "border-bark bg-bark text-cream"
          : "border-sand bg-white text-walnut hover:border-bark/50"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function QuantityButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center text-walnut/65 hover:bg-sand/50 disabled:opacity-25"
    >
      {children}
    </button>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5 font-normal">{children}</div>
    </div>
  );
}
