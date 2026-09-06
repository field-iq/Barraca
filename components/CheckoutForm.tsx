"use client";

import { MapPin, Route } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cartSubtotal, cartTotal } from "@/lib/cart";
import { formatARS } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { PricingConfig } from "@/lib/pricing/pricingConfig";
import { calculateDeliveryCost } from "@/lib/pricing/tablePricing";
import type {
  CartItem,
  ContactDetails,
  DeliveryMethod,
  DeliveryOption,
  DeliverySelection,
} from "@/lib/quoteTypes";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";
import { ContactGate, isContactValid } from "./ContactGate";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/feedback/alert";
import { Divider } from "@/components/ui/divider";

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
  const { t } = useLanguage();
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
      setSubmitError(error instanceof Error ? error.message : t("checkout.submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-8 rounded-soft-lg bg-nm-surface p-5 shadow-soft sm:p-8"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl text-nm-text sm:text-3xl">{t("checkout.title")}</h2>
          <p className="mt-1 text-sm text-nm-muted">
            {items.length} {items.length === 1 ? t("checkout.itemCountPiece") : t("checkout.itemCountPieces")} · subtotal {formatARS(subtotal)}
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onBack} className="shrink-0">
          {t("checkout.backToCart")}
        </Button>
      </header>

      <fieldset className="space-y-5">
        <legend className="font-heading text-xl text-nm-text">{t("checkout.delivery")}</legend>
        <RadioGroup
          name="deliveryOption"
          value={deliveryOption}
          onChange={(value) => setDeliveryOption(value as DeliveryOption)}
          className={cn(deliveryAvailable && "sm:grid-cols-2")}
          options={[
            ...(deliveryAvailable
              ? [{
                value: "delivery",
                label: t("checkout.homeDelivery"),
                hint: t("checkout.homeDeliverySubtitle"),
              }]
              : []),
            {
              value: "pickup",
              label: t("checkout.pickup"),
              hint: t("checkout.pickupSubtitle"),
            },
          ]}
        />

        {deliveryOption === "delivery" && (
          <div className="space-y-5 pt-2">
            <Divider />
            {zoneAvailable && distanceAvailable && (
              <div>
                <p className="mb-2 text-sm font-medium text-nm-text">{t("checkout.howToQuoteShipping")}</p>
                <div className="grid grid-cols-2 gap-2">
                  <DeliveryMethodButton
                    active={deliveryMethod === "zone"}
                    icon={<MapPin size={18} />}
                    label={t("checkout.byZone")}
                    onClick={() => setDeliveryMethod("zone")}
                  />
                  <DeliveryMethodButton
                    active={deliveryMethod === "distance"}
                    icon={<Route size={18} />}
                    label={t("checkout.byKm")}
                    onClick={() => setDeliveryMethod("distance")}
                  />
                </div>
              </div>
            )}

            <FormField label={t("checkout.deliveryAddress")} htmlFor="delivery-address">
              <Input
                id="delivery-address"
                type="text"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                placeholder={t("checkout.addressPlaceholder")}
                autoComplete="street-address"
              />
            </FormField>

            {deliveryMethod === "zone" ? (
              <FormField
                label={t("checkout.deliveryZone")}
                htmlFor="delivery-zone"
                hint={selectedZone?.description ? t("checkout.includes", { description: selectedZone.description }) : undefined}
              >
                <Select
                  id="delivery-zone"
                  value={deliveryZoneId}
                  onChange={(event) => setDeliveryZoneId(event.target.value)}
                  options={enabledZones.map((zone) => ({
                    value: zone.id,
                    label: `${zone.name} · ${formatARS(zone.price)}`,
                  }))}
                />
              </FormField>
            ) : (
              <div className="space-y-3">
                <FormField
                  label={t("checkout.approxDistance")}
                  htmlFor="delivery-distance"
                  hint={t("checkout.routeHint", { origin: config.delivery.originAddress })}
                >
                  <Input
                    id="delivery-distance"
                    type="number"
                    inputMode="decimal"
                    min="0.1"
                    max={config.delivery.maximumDistanceKm}
                    step="0.1"
                    value={distanceInput}
                    onChange={(event) => setDistanceInput(event.target.value)}
                    placeholder={t("checkout.distancePlaceholder")}
                    trailing={<span className="text-xs">km</span>}
                  />
                </FormField>
                {distanceValid && previewDeliveryCost !== null && (
                  <div className="rounded-soft-sm bg-nm-surface px-4 py-3 text-sm text-nm-success shadow-soft-inset-sm">
                    {t("checkout.distanceEstimate", { km: distanceKm, amount: formatARS(previewDeliveryCost) })}
                  </div>
                )}
                {distanceInput !== "" && !distanceValid && (
                  <Alert tone="warning" title={t("checkout.distanceRangeError", { min: "0.1", max: config.delivery.maximumDistanceKm })} />
                )}
              </div>
            )}
          </div>
        )}
      </fieldset>

      <ContactGate value={contact} onChange={setContact} />

      {submitError && <Alert tone="danger" title={submitError} />}

      <div className="space-y-3">
        <Divider />
        <div className="space-y-2 pt-1 text-sm">
          <SummaryRow label={t("checkout.furniture")} value={formatARS(subtotal)} />
          <SummaryRow
            label={t("checkout.shipping")}
            value={deliveryOption === "pickup"
              ? t("checkout.freePickup")
              : previewDeliveryCost === null
                ? t("checkout.toCalculate")
                : formatARS(previewDeliveryCost)}
          />
          {previewTotal !== null && (
            <div className="flex justify-between border-t border-nm-line pt-3">
              <span className="font-heading text-lg text-nm-text">{t("checkout.estimatedTotal")}</span>
              <span className="font-heading text-lg text-nm-accent">{formatARS(previewTotal)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {!canSubmit && !submitting && (
          <p className="text-xs text-nm-muted sm:mr-auto">
            {submitHint(t, deliveryOption, addressValid, deliveryMethod, methodValid, isContactValid(contact))}
          </p>
        )}
        <Button type="submit" variant="accent" size="lg" disabled={!canSubmit} loading={submitting}>
          {submitting ? t("checkout.sending") : t("checkout.sendQuote")}
        </Button>
      </div>
    </form>
  );
}

function submitHint(
  t: (key: TranslationKey) => string,
  option: DeliveryOption,
  addressValid: boolean,
  method: DeliveryMethod,
  methodValid: boolean,
  contactValid: boolean,
): string {
  if (option === "delivery" && !addressValid) return t("checkout.hintAddress");
  if (option === "delivery" && method === "zone" && !methodValid) return t("checkout.hintZone");
  if (option === "delivery" && method === "distance" && !methodValid) return t("checkout.hintDistance");
  if (!contactValid) return t("checkout.hintContact");
  return "";
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
      aria-pressed={active}
      className={cn(
        "nm-transition flex h-11 items-center justify-center gap-2 rounded-soft-sm bg-nm-surface text-sm font-medium",
        active ? "text-nm-accent shadow-soft-inset-sm" : "text-nm-text shadow-soft-sm hover:shadow-soft",
      )}
    >
      {icon} {label}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-nm-muted">
      <span>{label}</span>
      <span className="text-right text-nm-text">{value}</span>
    </div>
  );
}
