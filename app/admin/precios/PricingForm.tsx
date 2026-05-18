"use client";

import { useState } from "react";
import type { PricingConfig } from "@/lib/pricing/pricingConfig";

interface PricingFormProps {
  config: PricingConfig;
  canEdit: boolean;
}

export function PricingForm({ config: initialConfig, canEdit }: PricingFormProps) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<"success" | "error" | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaveResult(res.ok ? "success" : "error");
    } catch {
      setSaveResult("error");
    } finally {
      setSaving(false);
    }
  }

  function updateMesa(key: keyof typeof config.mesa, value: number) {
    setConfig((c) => ({ ...c, mesa: { ...c.mesa, [key]: value } }));
  }

  function updateBanco(key: keyof typeof config.banco, value: number) {
    setConfig((c) => ({ ...c, banco: { ...c.banco, [key]: value } }));
  }

  function updateDelivery(key: keyof typeof config.delivery, value: number) {
    setConfig((c) => ({ ...c, delivery: { ...c.delivery, [key]: value } }));
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-sand/50 border border-sand rounded-xl text-sm text-walnut/70">
        Para cambiar los precios, editá{" "}
        <code className="font-mono text-walnut">lib/pricing/pricingConfig.ts</code>{" "}
        y hacé deploy. Los cambios se aplican en ~2 minutos.
      </div>

      <PricingSection title="Mesa" subtitle="Precio por m² de superficie (ancho × largo)">
        <PriceField
          label="Material ($ por m²)"
          description="Costo de madera por metro cuadrado de tablero"
          value={config.mesa.materialCostPerM2}
          onChange={(v) => updateMesa("materialCostPerM2", v)}
          disabled={!canEdit}
        />
        <PriceField
          label="Mano de obra"
          description="Costo fijo de fabricación por mesa"
          value={config.mesa.baseLabourCost}
          onChange={(v) => updateMesa("baseLabourCost", v)}
          disabled={!canEdit}
        />
        <PriceField
          label="Terminación"
          description="Lacado, aceite o cera"
          value={config.mesa.finishCost}
          onChange={(v) => updateMesa("finishCost", v)}
          disabled={!canEdit}
        />
        <NumberField
          label="Margen (multiplicador)"
          description="1.35 = 35% de margen sobre el costo total"
          value={config.mesa.marginMultiplier}
          step={0.01}
          onChange={(v) => updateMesa("marginMultiplier", v)}
          disabled={!canEdit}
        />
        <PriceField
          label="Envío estimado (fallback)"
          description="Se usa cuando no se puede calcular la distancia"
          value={config.mesa.deliveryCostFallback}
          onChange={(v) => updateMesa("deliveryCostFallback", v)}
          disabled={!canEdit}
        />
      </PricingSection>

      <PricingSection title="Banco" subtitle="Precio por m² de superficie del asiento (ancho × largo)">
        <PriceField
          label="Material ($ por m²)"
          description="Costo de madera por metro cuadrado de asiento"
          value={config.banco.materialCostPerM2}
          onChange={(v) => updateBanco("materialCostPerM2", v)}
          disabled={!canEdit}
        />
        <PriceField
          label="Mano de obra"
          description="Costo fijo de fabricación por banco"
          value={config.banco.baseLabourCost}
          onChange={(v) => updateBanco("baseLabourCost", v)}
          disabled={!canEdit}
        />
        <PriceField
          label="Terminación"
          description="Lacado, aceite o cera"
          value={config.banco.finishCost}
          onChange={(v) => updateBanco("finishCost", v)}
          disabled={!canEdit}
        />
        <NumberField
          label="Margen (multiplicador)"
          description="1.35 = 35% de margen sobre el costo total"
          value={config.banco.marginMultiplier}
          step={0.01}
          onChange={(v) => updateBanco("marginMultiplier", v)}
          disabled={!canEdit}
        />
        <PriceField
          label="Envío estimado (fallback)"
          description="Se usa cuando no se puede calcular la distancia"
          value={config.banco.deliveryCostFallback}
          onChange={(v) => updateBanco("deliveryCostFallback", v)}
          disabled={!canEdit}
        />
      </PricingSection>

      <PricingSection title="Envío" subtitle="Modelo progresivo: base fija + costo por km según tramo">
        <PriceField
          label="Costo base"
          description="Cargo fijo por carga y descarga, independiente de la distancia"
          value={config.delivery.baseCost}
          onChange={(v) => updateDelivery("baseCost", v)}
          disabled={!canEdit}
        />
        <NumberField
          label="Límite tramo 1 (km)"
          description="Hasta este km rige la tarifa del tramo 1"
          value={config.delivery.tier1LimitKm}
          onChange={(v) => updateDelivery("tier1LimitKm", v)}
          disabled={!canEdit}
        />
        <NumberField
          label="Límite tramo 2 (km)"
          description="Hasta este km rige la tarifa del tramo 2; después aplica tramo 3"
          value={config.delivery.tier2LimitKm}
          onChange={(v) => updateDelivery("tier2LimitKm", v)}
          disabled={!canEdit}
        />
        <PriceField
          label={`Tramo 1 ($ por km, hasta ${config.delivery.tier1LimitKm} km)`}
          description="Tarifa para distancias cortas"
          value={config.delivery.rate1PerKm}
          onChange={(v) => updateDelivery("rate1PerKm", v)}
          disabled={!canEdit}
        />
        <PriceField
          label={`Tramo 2 ($ por km, ${config.delivery.tier1LimitKm}–${config.delivery.tier2LimitKm} km)`}
          description="Tarifa para distancias medias"
          value={config.delivery.rate2PerKm}
          onChange={(v) => updateDelivery("rate2PerKm", v)}
          disabled={!canEdit}
        />
        <PriceField
          label={`Tramo 3 ($ por km, más de ${config.delivery.tier2LimitKm} km)`}
          description="Tarifa para distancias largas"
          value={config.delivery.rate3PerKm}
          onChange={(v) => updateDelivery("rate3PerKm", v)}
          disabled={!canEdit}
        />
      </PricingSection>

      {canEdit && (
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-bark text-cream px-6 py-3 text-sm font-medium hover:bg-walnut transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          {saveResult === "success" && (
            <span className="text-sm text-green-700">✓ Cambios guardados</span>
          )}
          {saveResult === "error" && (
            <span className="text-sm text-red-600">Error al guardar. Intentá de nuevo.</span>
          )}
        </div>
      )}
    </div>
  );
}

function PricingSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-sand rounded-2xl p-6">
      <div className="mb-4">
        <h2 className="font-serif text-lg text-walnut">{title}</h2>
        <p className="text-xs text-walnut/50 mt-0.5">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function PriceField({
  label,
  description,
  value,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-walnut mb-0.5">{label}</label>
      <p className="text-xs text-walnut/50 mb-1.5">{description}</p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-walnut/40">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full rounded-lg border border-sand pl-7 pr-3 py-2 text-sm text-walnut focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-sand/30 disabled:text-walnut/50"
        />
      </div>
    </div>
  );
}

function NumberField({
  label,
  description,
  value,
  onChange,
  step,
  disabled,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-walnut mb-0.5">{label}</label>
      <p className="text-xs text-walnut/50 mb-1.5">{description}</p>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-walnut focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-sand/30 disabled:text-walnut/50"
      />
    </div>
  );
}
