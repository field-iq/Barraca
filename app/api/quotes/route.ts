import { NextRequest, NextResponse } from "next/server";
import { calculateBenchQuote } from "@/lib/pricing/benchPricing";
import { calculateMirrorQuote } from "@/lib/pricing/mirrorPricing";
import { validateProductDimensions, type CustomProductId } from "@/lib/pricing/pricingConfig";
import { getPricingConfig } from "@/lib/pricing/pricingStore";
import { calculateDeliveryCost, calculateTableQuote } from "@/lib/pricing/tablePricing";
import type { CartQuoteRequest, TableDimensions } from "@/lib/quoteTypes";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<CartQuoteRequest>;
    const config = await getPricingConfig();
    const items = validateItems(payload.items, config);
    const deliveryOption = payload.deliveryOption === "pickup" ? "pickup" : "delivery";
    const deliveryAddress = cleanString(payload.deliveryAddress, 240);

    if (deliveryOption === "delivery" && !deliveryAddress) {
      throw new QuoteError("Ingresá una dirección de entrega.");
    }

    const subtotal = items.reduce((sum, item) => {
      const quote = item.productType === "bench"
        ? calculateBenchQuote(item.dimensions, null, config.banco, config.delivery, false)
        : item.productType === "mirror"
          ? calculateMirrorQuote(item.dimensions, null, config.espejo, config.delivery, false)
          : calculateTableQuote(item.dimensions, null, config.mesa, config.delivery, false);
      return sum + quote.total;
    }, 0);

    let deliveryCost = 0;
    let deliveryDescription = "Retiro en taller";

    if (deliveryOption === "delivery") {
      if (payload.deliveryMethod === "zone") {
        if (!config.delivery.zonesEnabled) throw new QuoteError("El envío por zona no está disponible.");
        const zone = config.delivery.zones.find(
          (item) => item.id === payload.deliveryZoneId && item.enabled,
        );
        if (!zone) throw new QuoteError("La zona seleccionada ya no está disponible.");
        deliveryCost = zone.price;
        deliveryDescription = `Zona: ${zone.name}`;
      } else if (payload.deliveryMethod === "distance") {
        if (!config.delivery.distanceEnabled) {
          throw new QuoteError("El cálculo por kilómetros no está disponible.");
        }
        const distanceKm = Number(payload.deliveryDistanceKm);
        if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
          throw new QuoteError("Ingresá una distancia válida en kilómetros.");
        }
        if (distanceKm > config.delivery.maximumDistanceKm) {
          throw new QuoteError(
            `La distancia supera el máximo de ${config.delivery.maximumDistanceKm} km.`,
            422,
          );
        }
        deliveryCost = calculateDeliveryCost(distanceKm, config.delivery);
        deliveryDescription = `Distancia informada: ${distanceKm} km (estimado)`;
      } else {
        throw new QuoteError("Elegí cómo querés cotizar el envío.");
      }
    }

    return NextResponse.json({
      ok: true,
      id: crypto.randomUUID(),
      deliveryCost,
      deliveryDescription,
      subtotal,
      total: subtotal + deliveryCost,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo calcular la cotización.";
    return NextResponse.json({ error: message }, { status: error instanceof QuoteError ? error.status : 500 });
  }
}

type ValidatedItem = {
  id: string;
  productType: CustomProductId;
  dimensions: TableDimensions;
};

function validateItems(value: unknown, config: Awaited<ReturnType<typeof getPricingConfig>>): ValidatedItem[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw new QuoteError("La cotización debe tener entre 1 y 20 muebles.");
  }

  return value.map((raw, index) => {
    if (!raw || typeof raw !== "object") throw new QuoteError(`El mueble ${index + 1} no es válido.`);
    const item = raw as Record<string, unknown>;
    const productType = item.productType;
    if (productType !== "table" && productType !== "bench" && productType !== "mirror") {
      throw new QuoteError(`El mueble ${index + 1} no admite cotización automática.`);
    }
    const dimensions = parseDimensions(item.dimensions);
    const errors = validateProductDimensions(productType, dimensions, config);
    if (errors.length > 0) throw new QuoteError(errors[0]);
    return {
      id: typeof item.id === "string" ? item.id.slice(0, 100) : crypto.randomUUID(),
      productType: productType as CustomProductId,
      dimensions,
    };
  });
}

function parseDimensions(value: unknown): TableDimensions {
  if (!value || typeof value !== "object") throw new QuoteError("Las medidas no son válidas.");
  const dimensions = value as Record<string, unknown>;
  return {
    widthCm: Number(dimensions.widthCm),
    lengthCm: Number(dimensions.lengthCm),
    heightCm: Number(dimensions.heightCm),
  };
}

function cleanString(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

class QuoteError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}
