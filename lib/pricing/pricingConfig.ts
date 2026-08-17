import type { ProductId, TableDimensions } from "../quoteTypes";

export interface DimensionRange {
  min: number;
  max: number;
  default: number;
}

export interface FurnitureDimensionsConfig {
  widthCm: DimensionRange;
  lengthCm: DimensionRange;
  heightCm: DimensionRange;
}

export interface ProductPricingConfig {
  materialCostPerM2: number;
  baseLabourCost: number;
  finishCost: number;
  deliveryCostFallback: number;
  marginMultiplier: number;
  minimumPrice: number;
  dimensions: FurnitureDimensionsConfig;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
}

export interface DeliveryPricingConfig {
  zonesEnabled: boolean;
  distanceEnabled: boolean;
  zones: DeliveryZone[];
  originAddress: string;
  baseCost: number;
  ratePerKm: number;
  minimumCost: number;
  maximumDistanceKm: number;
}

export interface PricingConfig {
  mesa: ProductPricingConfig;
  banco: ProductPricingConfig;
  espejo: ProductPricingConfig;
  delivery: DeliveryPricingConfig;
}

export type CustomProductId = "table" | "bench" | "mirror";

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  mesa: {
    materialCostPerM2: 504_000,
    baseLabourCost: 90_000,
    finishCost: 35_000,
    deliveryCostFallback: 25_000,
    marginMultiplier: 1.35,
    minimumPrice: 0,
    dimensions: {
      widthCm: { min: 60, max: 160, default: 100 },
      lengthCm: { min: 100, max: 350, default: 200 },
      heightCm: { min: 70, max: 90, default: 80 },
    },
  },
  banco: {
    materialCostPerM2: 380_000,
    baseLabourCost: 60_000,
    finishCost: 25_000,
    deliveryCostFallback: 25_000,
    marginMultiplier: 1.35,
    minimumPrice: 0,
    dimensions: {
      widthCm: { min: 30, max: 70, default: 40 },
      lengthCm: { min: 60, max: 300, default: 180 },
      heightCm: { min: 35, max: 60, default: 45 },
    },
  },
  espejo: {
    materialCostPerM2: 250_000,
    baseLabourCost: 0,
    finishCost: 0,
    deliveryCostFallback: 25_000,
    marginMultiplier: 1,
    minimumPrice: 0,
    dimensions: {
      widthCm: { min: 30, max: 200, default: 60 },
      lengthCm: { min: 40, max: 250, default: 80 },
      heightCm: { min: 1, max: 1, default: 1 },
    },
  },
  delivery: {
    zonesEnabled: true,
    distanceEnabled: true,
    zones: [],
    originAddress: "Boulevard Sáenz Peña 1213, Tigre, Buenos Aires, Argentina",
    baseCost: 20_000,
    ratePerKm: 1_500,
    minimumCost: 25_000,
    maximumDistanceKm: 120,
  },
};

export function validatePricingConfig(value: unknown): PricingConfig {
  if (!isRecord(value)) throw new Error("La configuración de precios no es válida.");
  return {
    mesa: validateProductConfig(value.mesa, "Mesa"),
    banco: validateProductConfig(value.banco, "Banco"),
    espejo: validateProductConfig(value.espejo, "Espejo"),
    delivery: validateDeliveryConfig(value.delivery),
  };
}

export function getProductPricingConfig(config: PricingConfig, productType: CustomProductId): ProductPricingConfig {
  if (productType === "bench") return config.banco;
  if (productType === "mirror") return config.espejo;
  return config.mesa;
}

export function getDefaultDimensions(productType: CustomProductId, config: PricingConfig): TableDimensions {
  const dimensions = getProductPricingConfig(config, productType).dimensions;
  return {
    widthCm: dimensions.widthCm.default,
    lengthCm: dimensions.lengthCm.default,
    heightCm: dimensions.heightCm.default,
  };
}

export function validateProductDimensions(
  productType: ProductId,
  dimensions: TableDimensions,
  config: PricingConfig,
): string[] {
  if (productType !== "table" && productType !== "bench" && productType !== "mirror") {
    return ["El tipo de mueble no admite cotización automática."];
  }
  const ranges = getProductPricingConfig(config, productType).dimensions;
  const fields: Array<[keyof TableDimensions, string]> = productType === "mirror"
    ? [["widthCm", "ancho"], ["lengthCm", "alto"]]
    : [["widthCm", "ancho"], ["lengthCm", "largo"], ["heightCm", "alto"]];

  return fields.flatMap(([key, label]) => {
    const value = dimensions[key];
    const range = ranges[key];
    if (!Number.isFinite(value) || value < range.min || value > range.max) {
      return [`El ${label} debe estar entre ${range.min} y ${range.max} cm.`];
    }
    return [];
  });
}

function validateProductConfig(value: unknown, label: string): ProductPricingConfig {
  if (!isRecord(value)) throw new Error(`La configuración de ${label} no es válida.`);
  return {
    materialCostPerM2: finiteNumber(value.materialCostPerM2, `${label}: material`, 0),
    baseLabourCost: finiteNumber(value.baseLabourCost, `${label}: mano de obra`, 0),
    finishCost: finiteNumber(value.finishCost, `${label}: terminación`, 0),
    deliveryCostFallback: finiteNumber(value.deliveryCostFallback, `${label}: envío`, 0),
    marginMultiplier: finiteNumber(value.marginMultiplier, `${label}: margen`, 0.01, 20),
    minimumPrice: finiteNumber(value.minimumPrice, `${label}: precio mínimo`, 0),
    dimensions: validateDimensions(value.dimensions, label),
  };
}

function validateDimensions(value: unknown, label: string): FurnitureDimensionsConfig {
  if (!isRecord(value)) throw new Error(`Las dimensiones de ${label} no son válidas.`);
  return {
    widthCm: validateRange(value.widthCm, `${label}: ancho`),
    lengthCm: validateRange(value.lengthCm, `${label}: largo/alto`),
    heightCm: validateRange(value.heightCm, `${label}: alto`),
  };
}

function validateRange(value: unknown, label: string): DimensionRange {
  if (!isRecord(value)) throw new Error(`El rango de ${label} no es válido.`);
  const min = finiteNumber(value.min, `${label} mínimo`, 0.1, 10_000);
  const max = finiteNumber(value.max, `${label} máximo`, min, 10_000);
  const defaultValue = finiteNumber(value.default, `${label} inicial`, min, max);
  return { min, max, default: defaultValue };
}

function validateDeliveryConfig(value: unknown): DeliveryPricingConfig {
  if (!isRecord(value)) throw new Error("La configuración de envío no es válida.");
  const legacyRate = value.rate1PerKm ?? DEFAULT_PRICING_CONFIG.delivery.ratePerKm;
  const zones = value.zones === undefined
    ? []
    : validateDeliveryZones(value.zones);
  return {
    zonesEnabled: booleanValue(value.zonesEnabled, true),
    distanceEnabled: booleanValue(value.distanceEnabled, true),
    zones,
    originAddress: finiteString(
      value.originAddress,
      "Dirección de origen",
      DEFAULT_PRICING_CONFIG.delivery.originAddress,
      240,
    ),
    baseCost: finiteNumber(value.baseCost, "Costo base de envío", 0),
    ratePerKm: finiteNumber(value.ratePerKm ?? legacyRate, "Tarifa por km", 0),
    minimumCost: finiteNumber(
      value.minimumCost ?? DEFAULT_PRICING_CONFIG.delivery.minimumCost,
      "Precio mínimo de envío",
      0,
    ),
    maximumDistanceKm: finiteNumber(
      value.maximumDistanceKm ?? DEFAULT_PRICING_CONFIG.delivery.maximumDistanceKm,
      "Distancia máxima",
      0.1,
      10_000,
    ),
  };
}

function validateDeliveryZones(value: unknown): DeliveryZone[] {
  if (!Array.isArray(value) || value.length > 100) {
    throw new Error("Las zonas de envío no son válidas.");
  }
  const ids = new Set<string>();
  return value.map((zoneValue, index) => {
    if (!isRecord(zoneValue)) throw new Error(`La zona ${index + 1} no es válida.`);
    const id = finiteString(zoneValue.id, `Zona ${index + 1}: ID`, "", 100);
    if (!id || ids.has(id)) throw new Error("Cada zona debe tener un identificador único.");
    ids.add(id);
    return {
      id,
      name: finiteString(zoneValue.name, `Zona ${index + 1}: nombre`, "", 100),
      description: optionalString(zoneValue.description, `Zona ${index + 1}: descripción`, 240),
      price: finiteNumber(zoneValue.price, `Zona ${index + 1}: precio`, 0),
      enabled: booleanValue(zoneValue.enabled, false),
    };
  });
}

function finiteString(value: unknown, label: string, fallback: string, maxLength: number): string {
  const string = typeof value === "string" ? value.trim() : fallback;
  if (!string || string.length > maxLength) {
    throw new Error(`${label} debe tener entre 1 y ${maxLength} caracteres.`);
  }
  return string;
}

function optionalString(value: unknown, label: string, maxLength: number): string {
  const string = typeof value === "string" ? value.trim() : "";
  if (string.length > maxLength) throw new Error(`${label} no puede superar ${maxLength} caracteres.`);
  return string;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function finiteNumber(value: unknown, label: string, min: number, max = 100_000_000_000): number {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error(`${label} debe ser un número entre ${min} y ${max}.`);
  }
  return number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
