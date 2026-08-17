"use client";

import { Calculator, MapPin, Plus, Route, Save, Trash2, Truck } from "lucide-react";
import { useMemo, useState } from "react";
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
    <div>
      <div className="mb-5 flex flex-col gap-4 border-b border-sand pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl">Precios y límites de fabricación</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-walnut/60">
            Definí cuánto cuesta cada pieza y qué medidas puede pedir el cliente. El cotizador se actualiza al publicar.
          </p>
          <p className="mt-1 text-xs text-walnut/45">
            {cloudStorageConfigured
              ? "Los cambios se guardan en Vercel y quedan disponibles en producción."
              : "Modo local: conectá Vercel Blob antes de publicar en producción."}
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saveState === "saving"}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-bark px-4 text-sm font-medium text-cream hover:bg-walnut disabled:opacity-50"
        >
          <Save size={17} aria-hidden="true" />
          {saveState === "saving" ? "Guardando..." : "Guardar y publicar"}
        </button>
      </div>

      {message && (
        <div className={`mb-5 rounded-md border px-4 py-3 text-sm ${
          saveState === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`} role="status">
          {message}
        </div>
      )}

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-sand" role="tablist">
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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="overflow-hidden rounded-md border border-sand bg-white">
        <div className="border-b border-sand px-5 py-4 sm:px-6">
          <h3 className="font-serif text-xl">{meta.name}</h3>
          <p className="mt-1 text-sm text-walnut/55">{meta.subtitle}</p>
        </div>

        <div className="space-y-8 p-5 sm:p-6">
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
            <p className="text-xs leading-5 text-walnut/50">
              Fórmula: superficie × material + mano de obra + terminación; luego se aplica el margen. Si el resultado es menor, se usa el precio mínimo.
            </p>
          </EditorSection>

          <EditorSection title="Medidas permitidas">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-sand text-xs text-walnut/50">
                  <tr>
                    <th className="pb-2 font-medium">Dimensión</th>
                    <th className="pb-2 font-medium">Mínimo</th>
                    <th className="pb-2 font-medium">Valor inicial</th>
                    <th className="pb-2 font-medium">Máximo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {dimensionRows.map(({ key, label }) => {
                    const range = product.dimensions[key];
                    return (
                      <tr key={key}>
                        <th className="py-3 pr-4 font-medium">{label}</th>
                        <td className="py-3 pr-3"><CompactNumber value={range.min} onChange={(min) => updateRange(key, { min })} /></td>
                        <td className="py-3 pr-3"><CompactNumber value={range.default} onChange={(defaultValue) => updateRange(key, { default: defaultValue })} /></td>
                        <td className="py-3"><CompactNumber value={range.max} onChange={(max) => updateRange(key, { max })} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </EditorSection>
        </div>
      </section>

      <aside className="h-fit rounded-md border border-sand bg-[#20352d] p-5 text-white xl:sticky xl:top-24">
        <div className="flex items-center gap-2 text-white/65">
          <Calculator size={17} />
          <span className="text-xs font-semibold uppercase tracking-[0.12em]">Vista previa</span>
        </div>
        <p className="mt-5 text-sm text-white/65">Con las medidas iniciales</p>
        <p className="mt-1 font-serif text-3xl">{formatARS(preview)}</p>
        <p className="mt-4 border-t border-white/15 pt-4 text-xs leading-5 text-white/55">
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
    <section className="overflow-hidden rounded-md border border-sand bg-white">
      <div className="flex items-center gap-3 border-b border-sand px-5 py-4 sm:px-6">
        <Truck size={20} className="text-bark" />
        <div>
          <h3 className="font-serif text-xl">Métodos de envío</h3>
          <p className="mt-1 text-sm text-walnut/55">
            Configurá precios fijos por zona y estimaciones según los kilómetros informados.
          </p>
        </div>
      </div>

      <div className="grid gap-3 border-b border-sand p-5 sm:grid-cols-2 sm:p-6">
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

      <div className="border-b border-sand p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-serif text-lg">Zonas con precio fijo</h4>
            <p className="mt-1 text-sm text-walnut/55">
              Usá la descripción para aclarar barrios, partidos o límites incluidos.
            </p>
          </div>
          <button
            type="button"
            onClick={addZone}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-bark px-3 text-sm font-medium text-bark hover:bg-sand/40"
          >
            <Plus size={17} /> Agregar zona
          </button>
        </div>

        {delivery.zones.length === 0 ? (
          <div className="mt-5 rounded-md border border-dashed border-sand bg-[#faf9f7] px-4 py-8 text-center text-sm text-walnut/50">
            Todavía no hay zonas. Agregá la primera para ofrecer precios fijos.
          </div>
        ) : (
          <div className="mt-5 divide-y divide-sand border-y border-sand">
            {delivery.zones.map((zone) => (
              <div key={zone.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_1.4fr_180px_auto] lg:items-end">
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
                <div className="flex h-10 items-center justify-between gap-3 lg:justify-end">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={zone.enabled}
                      onChange={(event) => updateZone(zone.id, { enabled: event.target.checked })}
                      className="h-4 w-4 accent-emerald-700"
                    />
                    Visible
                  </label>
                  <button
                    type="button"
                    title={`Eliminar ${zone.name}`}
                    aria-label={`Eliminar ${zone.name}`}
                    onClick={() => removeZone(zone.id, zone.name)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div>
          <h4 className="font-serif text-lg">Cálculo por kilómetros</h4>
          <p className="mt-1 text-sm text-walnut/55">
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
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-sand p-4 hover:bg-sand/20">
      <span className="mt-0.5 text-bark">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-walnut/50">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-emerald-700"
      />
    </label>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t border-sand pt-6 first:border-0 first:pt-0">
      <legend className="mb-4 font-serif text-lg">{title}</legend>
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
      className={`h-11 shrink-0 border-b-2 px-4 text-sm ${active ? "border-bark font-medium text-bark" : "border-transparent text-walnut/55 hover:text-walnut"}`}
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
  return (
    <label className="block min-w-0 text-sm font-medium">
      {label}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-10 w-full rounded-md border border-sand bg-white px-3 font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
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
  return (
    <label className="block text-sm font-medium">
      {label}
      <span className="relative mt-1.5 block">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/45">{prefix}</span>}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`h-10 w-full rounded-md border border-sand bg-white px-3 font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 ${prefix ? "pl-7" : ""} ${suffix ? "pr-12" : ""}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-walnut/45">{suffix}</span>}
      </span>
    </label>
  );
}

function CompactNumber({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <span className="relative block w-32">
      <input
        type="number"
        min={0.1}
        step={0.1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Medida en centímetros"
        className="h-9 w-full rounded-md border border-sand bg-white px-3 pr-9 font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-walnut/45">cm</span>
    </span>
  );
}
