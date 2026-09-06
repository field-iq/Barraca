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
import { pickText, useLanguage } from "@/lib/i18n/LanguageContext";
import { useStoreCart } from "./StoreCartProvider";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Divider } from "@/components/ui/divider";
import { Alert } from "@/components/feedback/alert";

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
  const { language, t } = useLanguage();
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
        ? t("storeCart.errorDeliveryDetails")
        : t("storeCart.errorChooseDelivery"));
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
        throw new Error("error" in result ? result.error : t("storeCart.errorOrderFailed"));
      }

      setOrderId(result.orderId);
      clearCart();
      setStep("success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("storeCart.errorOrderFailedRetry"),
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
        aria-label={t("storeCart.closeAriaLabel")}
        onClick={close}
        className="absolute inset-0 bg-black/35"
      />
      <section className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col rounded-l-soft-lg bg-nm-surface shadow-soft-lg">
        <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <IconButton
                size="sm"
                label={t("storeCart.backToCartAriaLabel")}
                title={t("storeCart.backToCartAriaLabel")}
                onClick={() => {
                  setStep("cart");
                  setError("");
                }}
              >
                <ChevronLeft className="size-4" />
              </IconButton>
            )}
            <ShoppingBag className="size-5 text-nm-accent" aria-hidden="true" />
            <h2 className="font-heading text-xl text-nm-text">
              {step === "cart" && t("storeCart.title")}
              {step === "checkout" && t("storeCart.checkoutTitle")}
              {step === "success" && t("storeCart.successTitle")}
            </h2>
          </div>
          <IconButton
            size="sm"
            label={t("storeCart.closeAriaLabel")}
            title={t("storeCart.close")}
            onClick={close}
          >
            <X className="size-4" />
          </IconButton>
        </header>
        <div className="px-4 sm:px-6">
          <Divider />
        </div>

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              {resolvedItems.length === 0 ? (
                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-nm-surface text-nm-accent shadow-soft">
                    <ShoppingBag className="size-7" />
                  </span>
                  <p className="mt-5 font-heading text-xl text-nm-text">{t("storeCart.empty")}</p>
                  <p className="mt-1 max-w-xs text-sm text-nm-muted">
                    {t("storeCart.emptyDescription")}
                  </p>
                  <Button
                    type="button"
                    variant="accent"
                    className="mt-5"
                    onClick={closeCart}
                  >
                    {t("storeCart.keepBrowsing")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resolvedItems.map(({ productId, quantity, product }) => {
                    const productName = pickText(language, product.name, product.nameEn);
                    return (
                    <article key={productId} className="flex gap-4 rounded-soft bg-nm-surface p-4 shadow-soft">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-soft-sm shadow-soft-inset">
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
                            <h3 className="truncate text-sm font-semibold text-nm-text">{productName}</h3>
                            <p className="mt-0.5 truncate text-xs text-nm-muted">{product.dimensions}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(productId)}
                            title={t("storeCart.removeProductTitle")}
                            aria-label={t("storeCart.removeProductAriaLabel", { name: productName })}
                            className="nm-transition grid size-8 shrink-0 place-items-center rounded-full text-nm-danger shadow-soft-sm hover:shadow-soft"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 font-heading text-lg text-nm-text">{formatARS(product.cashPrice)}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex h-9 items-center gap-1 rounded-pill px-1 shadow-soft-inset">
                            <QuantityButton
                              label={t("storeCart.removeOneAriaLabel", { name: productName })}
                              onClick={() => updateQuantity(productId, quantity - 1)}
                            >
                              <Minus className="size-3.5" />
                            </QuantityButton>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums text-nm-text">{quantity}</span>
                            <QuantityButton
                              label={t("storeCart.addOneAriaLabel", { name: productName })}
                              disabled={quantity >= 20}
                              onClick={() => updateQuantity(productId, quantity + 1)}
                            >
                              <Plus className="size-3.5" />
                            </QuantityButton>
                          </div>
                          <p className="text-sm font-semibold text-nm-text">{formatARS(product.cashPrice * quantity)}</p>
                        </div>
                      </div>
                    </article>
                    );
                  })}
                </div>
              )}
            </div>

            {resolvedItems.length > 0 && (
              <footer className="shrink-0 px-4 py-4 sm:px-6">
                <Divider className="mb-4" />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-nm-muted">{t("storeCart.totalCash")}</span>
                  <span className="font-heading text-2xl text-nm-text">{formatARS(total)}</span>
                </div>
                <p className="mt-1 text-xs text-nm-muted">{t("storeCart.coordinateNotice")}</p>
                <Button
                  type="button"
                  variant="accent"
                  size="lg"
                  block
                  className="mt-4"
                  trailing={<ChevronLeft className="size-4 rotate-180" />}
                  onClick={() => {
                    setDeliveryOption("");
                    setDeliveryMethod("");
                    setDistanceInput("");
                    setError("");
                    setStep("checkout");
                  }}
                >
                  {t("storeCart.continueOrder")}
                </Button>
              </footer>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={submitOrder} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="rounded-soft bg-nm-surface px-5 py-4 shadow-soft-inset">
                <div className="flex justify-between gap-4 text-sm text-nm-muted">
                  <span>{resolvedItems.reduce((sum, item) => sum + item.quantity, 0)} {t("storeCart.items")}</span>
                  <span>{formatARS(total)}</span>
                </div>
                {deliveryOption && (
                  <div className="mt-2 flex justify-between gap-4 text-sm text-nm-muted">
                    <span>{deliveryOption === "pickup" ? t("storeCart.pickup") : t("storeCart.shipping")}</span>
                    <span>{deliveryCost === null ? t("checkout.toCalculate") : deliveryCost === 0 ? t("storeCart.free") : formatARS(deliveryCost)}</span>
                  </div>
                )}
                {deliveryCost !== null && deliveryOption && (
                  <>
                    <Divider className="my-3" />
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm font-medium text-nm-text">{t("storeCart.estimatedTotal")}</span>
                      <span className="font-heading text-xl text-nm-text">{formatARS(orderTotal)}</span>
                    </div>
                  </>
                )}
              </div>

              <fieldset>
                <legend className="font-heading text-lg text-nm-text">{t("storeCart.wantDelivery")}</legend>
                <p className="mt-1 text-xs leading-5 text-nm-muted">
                  {t("storeCart.wantDeliveryDescription")}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <DeliveryChoice
                    active={deliveryOption === "delivery"}
                    icon={<Truck className="size-5" />}
                    title={t("storeCart.withDelivery")}
                    subtitle={t("storeCart.calculateDelivery")}
                    onClick={() => {
                      setDeliveryOption("delivery");
                      setDeliveryMethod(zoneAvailable ? "zone" : distanceAvailable ? "distance" : "");
                      setDeliveryZoneId(enabledZones[0]?.id ?? "");
                      setError("");
                    }}
                  />
                  <DeliveryChoice
                    active={deliveryOption === "pickup"}
                    icon={<Store className="size-5" />}
                    title={t("storeCart.withoutDelivery")}
                    subtitle={t("storeCart.pickupToArrange")}
                    onClick={() => {
                      setDeliveryOption("pickup");
                      setDeliveryMethod("");
                      setError("");
                    }}
                  />
                </div>

                {deliveryOption === "delivery" && (
                  <div className="mt-4 space-y-4">
                    <Divider />
                    {!zoneAvailable && !distanceAvailable ? (
                      <Alert tone="warning" title={t("storeCart.deliveryUnavailable")} />
                    ) : (
                      <>
                        {zoneAvailable && distanceAvailable && (
                          <div>
                            <p className="mb-2 text-sm font-medium text-nm-text">{t("storeCart.howToCalculate")}</p>
                            <div className="grid grid-cols-2 gap-2">
                              <DeliveryMethodChoice
                                active={deliveryMethod === "zone"}
                                icon={<MapPin className="size-4" />}
                                label={t("checkout.byZone")}
                                onClick={() => setDeliveryMethod("zone")}
                              />
                              <DeliveryMethodChoice
                                active={deliveryMethod === "distance"}
                                icon={<Route className="size-4" />}
                                label={t("storeCart.byKm")}
                                onClick={() => setDeliveryMethod("distance")}
                              />
                            </div>
                          </div>
                        )}

                        {deliveryMethod === "zone" && zoneAvailable && (
                          <FormField label={t("checkout.deliveryZone")} htmlFor="store-delivery-zone">
                            <Select
                              id="store-delivery-zone"
                              value={deliveryZoneId}
                              onChange={(event) => setDeliveryZoneId(event.target.value)}
                              options={enabledZones.map((zone) => ({
                                value: zone.id,
                                label: `${zone.name} · ${formatARS(zone.price)}`,
                              }))}
                            />
                            {selectedZone?.description && (
                              <p className="mt-1.5 text-xs leading-5 text-nm-muted">{t("checkout.includes", { description: selectedZone.description })}</p>
                            )}
                          </FormField>
                        )}

                        {deliveryMethod === "distance" && distanceAvailable && (
                          <FormField label={t("storeCart.approxDistance")} htmlFor="store-delivery-distance">
                            <Input
                              id="store-delivery-distance"
                              type="number"
                              inputMode="decimal"
                              min="0.1"
                              max={pricingConfig.delivery.maximumDistanceKm}
                              step="0.1"
                              value={distanceInput}
                              onChange={(event) => setDistanceInput(event.target.value)}
                              placeholder={t("checkout.distancePlaceholder")}
                              trailing={<span className="text-sm text-nm-muted">km</span>}
                              invalid={distanceInput !== "" && !distanceValid}
                            />
                            <p className="mt-1.5 text-xs leading-5 text-nm-muted">
                              {t("storeCart.routeHintShort", { origin: pricingConfig.delivery.originAddress })}
                            </p>
                            {distanceInput !== "" && !distanceValid && (
                              <p className="mt-2 text-xs text-nm-warning">
                                {t("storeCart.distanceRangeError", { min: "0.1", max: pricingConfig.delivery.maximumDistanceKm })}
                              </p>
                            )}
                          </FormField>
                        )}

                        {deliveryCost !== null && deliveryCost > 0 && (
                          <div className="flex items-center justify-between gap-3 rounded-soft-sm bg-nm-surface px-4 py-3 text-sm text-nm-text shadow-soft-inset-sm">
                            <span className="text-nm-muted">{t("storeCart.estimatedShipping")}</span>
                            <strong className="font-heading text-nm-accent">{formatARS(deliveryCost)}</strong>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </fieldset>

              <div className="grid gap-4">
                <FormField label={t("storeCart.fullName")} htmlFor="order-name" required>
                  <Input
                    id="order-name"
                    required
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </FormField>
                <FormField
                  label={t("storeCart.email")}
                  htmlFor="order-email"
                  required
                  hint={t("storeCart.emailCopyNotice")}
                >
                  <Input
                    id="order-email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder={t("contactGate.emailPlaceholder")}
                  />
                </FormField>
                <FormField label={t("storeCart.phoneOptional")} htmlFor="order-phone">
                  <Input
                    id="order-phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  />
                </FormField>
                <FormField label={t("storeCart.commentsOptional")} htmlFor="order-notes">
                  <Textarea
                    id="order-notes"
                    rows={4}
                    maxLength={1000}
                    value={form.notes}
                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                    placeholder={t("storeCart.commentsPlaceholder")}
                  />
                </FormField>
                <label className="sr-only" aria-hidden="true">
                  {t("storeCart.website")}
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                  />
                </label>
              </div>

              {error && <Alert tone="danger" title={error} />}
            </div>
            <footer className="shrink-0 px-4 py-4 sm:px-6">
              <Divider className="mb-4" />
              <Button
                type="submit"
                variant="accent"
                size="lg"
                block
                disabled={sending || !deliveryValid}
                loading={sending}
                leading={!sending ? <Send className="size-4" /> : undefined}
              >
                {sending ? t("storeCart.sendingOrder") : t("storeCart.sendOrder")}
              </Button>
              <p className="mt-2 text-center text-xs text-nm-muted">
                {t("storeCart.noChargeNotice")}
              </p>
            </footer>
          </form>
        )}

        {step === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-nm-accent text-nm-accent-fg shadow-soft">
              <Check className="size-7" />
            </span>
            <h3 className="mt-5 font-heading text-2xl text-nm-text">{t("storeCart.orderReceived")}</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-nm-muted">
              {t("storeCart.orderReceivedDescription", { email: form.email })}
            </p>
            <p className="mt-4 font-heading text-lg text-nm-accent">{t("storeCart.orderId", { orderId })}</p>
            <Button
              type="button"
              variant="raised"
              className="mt-6"
              onClick={close}
            >
              {t("storeCart.keepBrowsing")}
            </Button>
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
      className={cn(
        "nm-transition min-h-24 rounded-soft bg-nm-surface p-4 text-left",
        active ? "text-nm-accent shadow-soft-inset" : "text-nm-text shadow-soft hover:shadow-soft-lg",
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </span>
      <span className="mt-2 block text-xs text-nm-muted">{subtitle}</span>
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
      className={cn(
        "nm-transition inline-flex h-10 items-center justify-center gap-2 rounded-pill bg-nm-surface text-sm font-medium",
        active ? "text-nm-accent shadow-soft-inset" : "text-nm-text shadow-soft-sm hover:shadow-soft",
      )}
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
      className="nm-transition grid size-7 place-items-center rounded-full bg-nm-surface text-nm-muted shadow-soft-sm hover:shadow-soft hover:text-nm-text active:shadow-soft-inset-sm disabled:opacity-30 disabled:shadow-none"
    >
      {children}
    </button>
  );
}
