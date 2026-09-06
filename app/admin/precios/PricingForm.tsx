"use client";

import { Calculator, MapPin, Plus, Route, Save, Trash2, Truck } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatARS } from "@/lib/format";
import { calculateBenchQuote } from "@/lib/pricing/benchPricing";
import { calculateMirrorQuote } from "@/lib/pricing/mirrorPricing";
import {
  getDefaultDimensions,
  type DimensionRange,
  type PricingConfig,
  type ProductPricingConfig,
} from "@/lib/pricing/pricingConfig";
import { calculateTableQuote } from "@/lib/pricing/tablePricing";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { Alert } from "@/components/feedback/alert";
import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/feedback/empty-state";

interface PricingFormProps {
  initialConfig: PricingConfig;
  cloudStorageConfigured: boolean;
}

type ProductKey = "mesa" | "banco" | "espejo";
type Tab = ProductKey | "delivery";
type SaveState = "idle" | "saving" | "success" | "error";

const PRODUCT_META: Record<ProductKey, { name: string; subtitle: string }> = {
  mesa: { name: "Mesa", subtitle: "Superficie: ancho × largo" },
  banco: { name: "Banco", subtitle: "Asiento: ancho × largo" },
  espejo: { name: "Espejo", subtitle: "Superficie: ancho × alto" },
};

export function PricingForm({ initialConfig, cloudStorageConfigured }: PricingFormProps) {
  const [config, setConfig] = useState(initialConfig);
  const [tab, setTab] = useState<Tab>("mesa");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  async function save() {
    setSaveState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo guardar.");
      setConfig(data);
      setSaveState("success");
      setMessage("Precios y medidas publicados correctamente.");
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    }
  }

  function updateProduct(key: ProductKey, updates: Partial<ProductPricingConfig>) {
    setConfig((current) => ({ ...current, [key]: { ...current[key], ...updates } }));
    setSaveState("idle");
    setMessage("");
  }

  function replaceConfig(nextConfig: PricingConfig) {
    setConfig(nextConfig);
    setSaveState("idle");
    setMessage("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-heading text-2xl text-nm-text sm:text-3xl">Precios y límites de fabricación</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-nm-muted">
            Definí cuánto cuesta cada pieza y qué medidas puede pedir el cliente. El cotizador se actualiza al publicar.
          </p>
          <p className="mt-1 text-xs text-nm-muted/70">
            {cloudStorageConfigured
              ? "Los cambios se guardan en Vercel y quedan disponibles en producción."
              : "Modo local: conectá Vercel Blob antes de publicar en producción."}
          </p>
        </div>
        <Button
          type="button"
          variant="accent"
          size="lg"
          onClick={save}
          loading={saveState === "saving"}
          leading={<Save size={17} aria-hidden="true" />}
          className="shrink-0"
        >
          {saveState === "saving" ? "Guardando..." : "Guardar y publicar"}
        </Button>
      </div>

      {message && <Alert tone={saveState === "success" ? "success" : "warning"} title={message} />}

      <div role="tablist" className="inline-flex flex-wrap gap-1 rounded-pill p-1.5 shadow-soft-inset">
        {(Object.keys(PRODUCT_META) as ProductKey[]).map((key) => (
          <TabButton key={key} active={tab === key} onClick={() => setTab(key)}>
            {PRODUCT_META[key].name}
          </TabButton>
        ))}
        <TabButton active={tab === "delivery"} onClick={() => setTab("delivery")}>
          Envío
        </TabButton>
      </div>

      {tab === "delivery" ? (
        <DeliveryEditor config={config} onChange={replaceConfig} />
      ) : (
        <ProductEditor
          productKey={tab}
          config={config}
          onChange={(updates) => updateProduct(tab, updates)}
        />
      )}
    </div>
  );
}

function ProductEditor({
  productKey,
  config,
  onChange,
}: {
  productKey: ProductKey;
  config: PricingConfig;
  onChange: (updates: Partial<ProductPricingConfig>) => void;
}) {
  const product = config[productKey];
  const meta = PRODUCT_META[productKey];
  const customId = productKey === "mesa" ? "table" : productKey === "banco" ? "bench" : "mirror";
  const preview = useMemo(() => {
    const dimensions = getDefaultDimensions(customId, config);
    if (customId === "bench") return calculateBenchQuote(dimensions, null, product, config.delivery, false).total;
    if (customId === "mirror") return calculateMirrorQuote(dimensions, null, product, config.delivery, false).total;
    return calculateTableQuote(dimensions, null, product, config.delivery, false).total;
  }, [config, customId, product]);

  function updateRange(key: keyof ProductPricingConfig["dimensions"], updates: Partial<DimensionRange>) {
    onChange({
      dimensions: {
        ...product.dimensions,
        [key]: { ...product.dimensions[key], ...updates },
      },
    });
  }

  const dimensionRows: Array<{ key: keyof ProductPricingConfig["dimensions"]; label: string }> = productKey === "espejo"
    ? [{ key: "widthCm", label: "Ancho" }, { key: "lengthCm", label: "Alto" }]
    : [
        { key: "widthCm", label: productKey === "banco" ? "Ancho del asiento" : "Ancho" },
        { key: "lengthCm", label: "Largo" },
        { key: "heightCm", label: "Alto" },
      ];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-8 rounded-soft-lg bg-nm-surface p-6 shadow-soft sm:p-8">
        <div>
          <h3 className="font-heading text-xl text-nm-text">{meta.name}</h3>
          <p className="mt-1 text-sm text-nm-muted">{meta.subtitle}</p>
        </div>

        <Divider />

        <EditorSection title="Cómo se calcula el precio">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField label="Material por m²" value={product.materialCostPerM2} prefix="$" onChange={(materialCostPerM2) => onChange({ materialCostPerM2 })} />
            <NumberField label="Mano de obra fija" value={product.baseLabourCost} prefix="$" onChange={(baseLabourCost) => onChange({ baseLabourCost })} />
            <NumberField label="Terminación fija" value={product.finishCost} prefix="$" onChange={(finishCost) => onChange({ finishCost })} />
            <NumberField
              label="Margen sobre costos"
              value={Math.round((product.marginMultiplier - 1) * 10000) / 100}
              suffix="%"
              min={-99}
              max={1900}
              step={0.01}
              onChange={(margin) => onChange({ marginMultiplier: 1 + margin / 100 })}
            />
            <NumberField
              label="Precio mínimo"
              value={product.minimumPrice}
              prefix="$"
              onChange={(minimumPrice) => onChange({ minimumPrice })}
            />
          </div>
          <p className="text-xs leading-5 text-nm-muted/70">
            Fórmula: superficie × material + mano de obra + terminación; luego se aplica el margen. Si el resultado es menor, se usa el precio mínimo.
          </p>
        </EditorSection>

        <Divider />

        <EditorSection title="Medidas permitidas">
          <div className="overflow-x-auto rounded-soft p-2 shadow-soft-inset">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-nm-muted">Dimensión</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-nm-muted">Mínimo</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-nm-muted">Valor inicial</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-nm-muted">Máximo</th>
                </tr>
              </thead>
              <tbody>
                {dimensionRows.map(({ key, label }) => {
                  const range = product.dimensions[key];
                  return (
                    <tr key={key}>
                      <th className="px-3 py-2.5 text-left font-medium text-nm-text">{label}</th>
                      <td className="px-3 py-2.5"><CompactNumber value={range.min} onChange={(min) => updateRange(key, { min })} /></td>
                      <td className="px-3 py-2.5"><CompactNumber value={range.default} onChange={(defaultValue) => updateRange(key, { default: defaultValue })} /></td>
                      <td className="px-3 py-2.5"><CompactNumber value={range.max} onChange={(max) => updateRange(key, { max })} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </EditorSection>
      </section>

      <aside className="h-fit space-y-4 rounded-soft-lg bg-nm-surface p-6 shadow-soft-lg xl:sticky xl:top-24">
        <div className="flex items-center gap-2 text-nm-muted">
          <span className="grid size-9 shrink-0 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm">
            <Calculator size={16} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em]">Vista previa</span>
        </div>
        <div>
          <p className="text-sm text-nm-muted">Con las medidas iniciales</p>
          <p className="mt-1 font-heading text-3xl text-nm-accent">{formatARS(preview)}</p>
        </div>
        <Divider />
        <p className="text-xs leading-5 text-nm-muted/70">
          No incluye envío. El precio final nunca será inferior a {formatARS(product.minimumPrice)}.
        </p>
      </aside>
    </div>
  );
}

function DeliveryEditor({ config, onChange }: { config: PricingConfig; onChange: (config: PricingConfig) => void }) {
  const delivery = config.delivery;

  function updateDelivery(updates: Partial<PricingConfig["delivery"]>) {
    onChange({ ...config, delivery: { ...delivery, ...updates } });
  }

  function addZone() {
    updateDelivery({
      zones: [
        ...delivery.zones,
        {
          id: `zona-${crypto.randomUUID().slice(0, 8)}`,
          name: "Nueva zona",
          description: "",
          price: 0,
          enabled: false,
        },
      ],
    });
  }

  function updateZone(id: string, updates: Partial<(typeof delivery.zones)[number]>) {
    updateDelivery({
      zones: delivery.zones.map((zone) => zone.id === id ? { ...zone, ...updates } : zone),
    });
  }

  function removeZone(id: string, name: string) {
    if (!window.confirm(`¿Eliminar la zona ${name}?`)) return;
    updateDelivery({ zones: delivery.zones.filter((zone) => zone.id !== id) });
  }

  return (
    <section className="space-y-8 rounded-soft-lg bg-nm-surface p-6 shadow-soft sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm">
          <Truck size={20} />
        </span>
        <div>
          <h3 className="font-heading text-xl text-nm-text">Métodos de envío</h3>
          <p className="mt-1 text-sm text-nm-muted">
            Configurá precios fijos por zona y estimaciones según los kilómetros informados.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MethodToggle
          icon={<MapPin size={19} />}
          title="Precios por zona"
          description="El cliente elige una zona con un precio fijo."
          checked={delivery.zonesEnabled}
          onChange={(zonesEnabled) => updateDelivery({ zonesEnabled })}
        />
        <MethodToggle
          icon={<Route size={19} />}
          title="Precio por kilómetro"
          description="El cliente informa los kilómetros desde el origen."
          checked={delivery.distanceEnabled}
          onChange={(distanceEnabled) => updateDelivery({ distanceEnabled })}
        />
      </div>

      <Divider />

      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-heading text-lg text-nm-text">Zonas con precio fijo</h4>
            <p className="mt-1 text-sm text-nm-muted">
              Usá la descripción para aclarar barrios, partidos o límites incluidos.
            </p>
          </div>
          <Button type="button" variant="raised" size="sm" leading={<Plus size={17} />} onClick={addZone}>
            Agregar zona
          </Button>
        </div>

        {delivery.zones.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="Todavía no hay zonas"
              body="Agregá la primera para ofrecer precios fijos a tus clientes."
            />
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {delivery.zones.map((zone) => (
              <div key={zone.id} className="grid gap-4 rounded-soft p-4 shadow-soft-inset lg:grid-cols-[1fr_1.4fr_180px_auto] lg:items-end">
                <TextField
                  label="Nombre de la zona"
                  value={zone.name}
                  placeholder="Ej: Belgrano, CABA"
                  onChange={(name) => updateZone(zone.id, { name })}
                />
                <TextField
                  label="Descripción / límites"
                  value={zone.description}
                  placeholder="Ej: Belgrano, Núñez y Colegiales"
                  onChange={(description) => updateZone(zone.id, { description })}
                />
                <NumberField
                  label="Precio fijo"
                  value={zone.price}
                  prefix="$"
                  onChange={(price) => updateZone(zone.id, { price })}
                />
                <div className="flex h-12 items-center justify-between gap-3 lg:justify-end">
                  <Checkbox
                    checked={zone.enabled}
                    onChange={(enabled) => updateZone(zone.id, { enabled })}
                    label="Visible"
                  />
                  <IconButton
                    label={`Eliminar ${zone.name}`}
                    onClick={() => removeZone(zone.id, zone.name)}
                    className="text-nm-danger"
                  >
                    <Trash2 size={17} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Divider />

      <div>
        <div>
          <h4 className="font-heading text-lg text-nm-text">Cálculo por kilómetros</h4>
          <p className="mt-1 text-sm text-nm-muted">
            Fórmula: costo base + distancia × tarifa por km, respetando el precio mínimo.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-4">
            <TextField
              label="Punto de origen para calcular la distancia"
              value={delivery.originAddress}
              placeholder="Dirección desde donde sale el envío"
              onChange={(originAddress) => updateDelivery({ originAddress })}
            />
          </div>
          <NumberField label="Costo base" value={delivery.baseCost} prefix="$" onChange={(baseCost) => updateDelivery({ baseCost })} />
          <NumberField label="Tarifa" value={delivery.ratePerKm} prefix="$" suffix="/ km" onChange={(ratePerKm) => updateDelivery({ ratePerKm })} />
          <NumberField label="Precio mínimo" value={delivery.minimumCost} prefix="$" onChange={(minimumCost) => updateDelivery({ minimumCost })} />
          <NumberField label="Distancia máxima" value={delivery.maximumDistanceKm} suffix="km" step={0.1} onChange={(maximumDistanceKm) => updateDelivery({ maximumDistanceKm })} />
        </div>
      </div>
    </section>
  );
}

function MethodToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-soft p-4 shadow-soft-inset-sm">
      <span className="mt-0.5 text-nm-accent">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-nm-text">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-nm-muted">{description}</span>
      </span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 font-heading text-lg text-nm-text">{title}</legend>
      {children}
    </fieldset>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "nm-transition h-10 shrink-0 rounded-pill px-5 text-sm font-semibold",
        active ? "bg-nm-surface text-nm-accent shadow-soft-sm" : "text-nm-muted hover:text-nm-text"
      )}
    >
      {children}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FormField label={label} htmlFor={id}>
      <Input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = useId();
  return (
    <FormField label={label} htmlFor={id}>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        leading={prefix ? <span className="text-sm">{prefix}</span> : undefined}
        trailing={suffix ? <span className="text-xs">{suffix}</span> : undefined}
      />
    </FormField>
  );
}

function CompactNumber({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <Input
      type="number"
      min={0.1}
      step={0.1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      aria-label="Medida en centímetros"
      trailing={<span className="text-xs">cm</span>}
      className="h-10 w-32"
    />
  );
}
