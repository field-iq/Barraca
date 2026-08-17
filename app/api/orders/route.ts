import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getVisibleProducts } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import type { PricingConfig } from "@/lib/pricing/pricingConfig";
import { getPricingConfig } from "@/lib/pricing/pricingStore";
import { calculateDeliveryCost } from "@/lib/pricing/tablePricing";
import {
  buildAdminOrderEmail,
  buildCustomerOrderEmail,
  buildOrderText,
  type ResolvedOrder,
} from "@/lib/orderEmail";
import type { StoreOrderRequest } from "@/lib/orderTypes";

export const runtime = "nodejs";

const ADMIN_EMAIL = "admin@fieldiq.com.au";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<StoreOrderRequest>;
    if (payload.website) {
      return NextResponse.json({ ok: true, orderId: "RECIBIDO" });
    }

    const customer = validateCustomer(payload.customer);
    const requestedItems = validateItems(payload.items);
    const [catalog, pricingConfig] = await Promise.all([getCatalog(), getPricingConfig()]);
    const delivery = validateDelivery(payload.delivery, pricingConfig);
    const products = new Map(
      getVisibleProducts(catalog).map((product) => [product.id, product]),
    );

    const items = requestedItems.map((requested) => {
      const product = products.get(requested.productId);
      if (!product) throw new OrderError("Uno de los productos ya no está disponible.");
      return {
        name: product.name,
        dimensions: product.dimensions,
        quantity: requested.quantity,
        unitPrice: product.cashPrice,
        subtotal: product.cashPrice * requested.quantity,
      };
    });

    const itemsSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const order: ResolvedOrder = {
      orderId: createOrderId(),
      customer,
      items,
      itemsSubtotal,
      delivery,
      total: itemsSubtotal + delivery.cost,
      createdAt: new Date(),
    };

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.ORDER_FROM_EMAIL;
    if (!apiKey || !from) {
      console.error("[orders] RESEND_API_KEY u ORDER_FROM_EMAIL no configurados.");
      return NextResponse.json(
        { error: "El envío de pedidos todavía no está configurado. Contactá a La Barraca." },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.batch.send(
      [
        {
          from,
          to: [ADMIN_EMAIL],
          subject: `Nuevo pedido ${order.orderId} - ${order.customer.name}`,
          html: buildAdminOrderEmail(order),
          text: buildOrderText(order, false),
        },
        {
          from,
          to: [order.customer.email],
          subject: `Recibimos tu pedido ${order.orderId} - La Barraca De Juan`,
          html: buildCustomerOrderEmail(order),
          text: buildOrderText(order, true),
        },
      ],
      { idempotencyKey: `barraca-order-${order.orderId}` },
    );

    if (error) {
      console.error("[orders] Resend error:", error);
      return NextResponse.json(
        { error: "No pudimos enviar el pedido. Intentá nuevamente en unos minutos." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, orderId: order.orderId });
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[orders] Unexpected error:", error);
    return NextResponse.json(
      { error: "No pudimos procesar el pedido. Intentá nuevamente." },
      { status: 500 },
    );
  }
}

function validateCustomer(value: unknown): ResolvedOrder["customer"] {
  if (!value || typeof value !== "object") throw new OrderError("Completá tus datos.");
  const customer = value as Record<string, unknown>;
  const name = cleanString(customer.name, 100);
  const email = cleanString(customer.email, 254).toLowerCase();
  const phone = cleanOptionalString(customer.phone, 40);
  const notes = cleanOptionalString(customer.notes, 1000);

  if (name.length < 2) throw new OrderError("Ingresá tu nombre y apellido.");
  if (!EMAIL_PATTERN.test(email)) throw new OrderError("Ingresá un email válido.");
  return { name, email, phone, notes };
}

function validateItems(value: unknown): Array<{ productId: string; quantity: number }> {
  if (!Array.isArray(value) || value.length === 0 || value.length > 30) {
    throw new OrderError("El carrito está vacío o contiene demasiados productos.");
  }

  const quantities = new Map<string, number>();
  for (const valueItem of value) {
    if (!valueItem || typeof valueItem !== "object") throw new OrderError("El carrito no es válido.");
    const item = valueItem as Record<string, unknown>;
    const productId = cleanString(item.productId, 100);
    const quantity = Number(item.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new OrderError("Una cantidad del carrito no es válida.");
    }
    const combinedQuantity = (quantities.get(productId) ?? 0) + quantity;
    if (combinedQuantity > 20) {
      throw new OrderError("Una cantidad del carrito no es válida.");
    }
    quantities.set(productId, combinedQuantity);
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}

function validateDelivery(value: unknown, config: PricingConfig): ResolvedOrder["delivery"] {
  if (!value || typeof value !== "object") {
    throw new OrderError("Elegí si querés recibir el pedido con envío o retirarlo.");
  }
  const delivery = value as Record<string, unknown>;
  const option = delivery.option;
  if (option === "pickup") {
    return { option, description: "Sin envío · retiro a coordinar", cost: 0 };
  }
  if (option !== "delivery") {
    throw new OrderError("Elegí si querés recibir el pedido con envío o retirarlo.");
  }

  if (delivery.method === "zone") {
    if (!config.delivery.zonesEnabled) {
      throw new OrderError("El envío por zona no está disponible.");
    }
    const zone = config.delivery.zones.find(
      (item) => item.id === delivery.zoneId && item.enabled,
    );
    if (!zone) throw new OrderError("La zona seleccionada ya no está disponible.");
    return {
      option,
      description: `Con envío · zona ${zone.name}`,
      cost: zone.price,
    };
  }

  if (delivery.method === "distance") {
    if (!config.delivery.distanceEnabled) {
      throw new OrderError("El cálculo por kilómetros no está disponible.");
    }
    const distanceKm = Number(delivery.distanceKm);
    if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
      throw new OrderError("Ingresá una distancia válida en kilómetros.");
    }
    if (distanceKm > config.delivery.maximumDistanceKm) {
      throw new OrderError(
        `La distancia supera el máximo de ${config.delivery.maximumDistanceKm} km.`,
      );
    }
    return {
      option,
      description: `Con envío · ${distanceKm} km informados (estimado)`,
      cost: calculateDeliveryCost(distanceKm, config.delivery),
    };
  }

  throw new OrderError("Elegí cómo querés cotizar el envío.");
}

function cleanString(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanOptionalString(value: unknown, maxLength: number): string | undefined {
  const cleaned = cleanString(value, maxLength);
  return cleaned || undefined;
}

function createOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `LB-${date}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

class OrderError extends Error {}
