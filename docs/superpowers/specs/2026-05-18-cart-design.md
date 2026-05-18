# Diseño: Carrito de cotización multi-producto

**Fecha:** 2026-05-18  
**Estado:** Aprobado

## Resumen

Agregar un carrito de cotización que permita al cliente configurar varios muebles a medida, elegir entre envío a domicilio o retiro en taller, y enviar una sola solicitud con todos los items. Solo Mesa está disponible por ahora; otros productos siguen mostrando "Próximamente".

## Flujo completo

```
select → table-form → cart → checkout → confirmation
```

1. **select**: el cliente elige el producto (igual que hoy)
2. **table-form**: configura medidas, ve el precio estimado del mueble (sin envío), botón "Agregar al carrito"
3. **cart**: ve todos los items agregados con precio individual y total. Puede eliminar items, seguir agregando, o ir al checkout
4. **checkout**: elige Envío / Retiro en taller. Si envío → ingresa dirección con preview de costo. Luego datos de contacto. Botón "Enviar cotización"
5. **confirmation**: muestra lista de items, costo de envío (o "Retiro en taller: gratis"), y total general

## Tipos nuevos (`lib/quoteTypes.ts`)

```typescript
interface CartItem {
  id: string;              // crypto.randomUUID() — identifica cada item
  productType: ProductId;
  dimensions: TableDimensions;
}

type DeliveryOption = "delivery" | "pickup";

interface CartQuoteRequest {
  items: CartItem[];
  deliveryOption: DeliveryOption;
  deliveryAddress?: string;  // solo si deliveryOption === "delivery"
  contact: ContactDetails;
  requestedAt: string;
}
```

`QuoteRequest` y `PriceEstimate` existentes se mantienen internamente pero el flujo principal pasa a usar `CartQuoteRequest`.

## Pricing

- **Precio por mueble**: `calculateTableQuote(dimensions, null)` — devuelve el total del mueble sin envío. Se muestra como un número limpio, sin desglose de materiales/mano de obra.
- **Envío**: `calculateDeliveryCost(distanceKm)` — calculado una sola vez para todo el pedido. $0 si el cliente elige retiro.
- **Total**: suma de todos los precios de muebles + envío.

## Archivos

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `lib/quoteTypes.ts` | Modificar | Agregar `CartItem`, `DeliveryOption`, `CartQuoteRequest` |
| `lib/cart.ts` | Crear | `itemPrice(item)`, `cartSubtotal(items)`, `cartTotal(items, deliveryCost)` |
| `lib/submitQuote.ts` | Modificar | Manejar `CartQuoteRequest` en lugar de `QuoteRequest` |
| `components/CartItemCard.tsx` | Crear | Un item: producto, medidas, precio, botón eliminar |
| `components/Cart.tsx` | Crear | Lista de items, total parcial, "Seguir agregando" / "Cotizar todo" |
| `components/CheckoutForm.tsx` | Crear | Toggle envío/retiro, dirección con preview, ContactGate |
| `components/TableQuoteForm.tsx` | Modificar | Quitar sección contacto y dirección, cambiar botón, mostrar precio del item |
| `components/QuoteSummary.tsx` | Modificar | Lista de items + envío + total general |
| `app/page.tsx` | Modificar | Estado `cart: CartItem[]`, pasos `cart` y `checkout` |

## Detalle de cada componente nuevo

### `lib/cart.ts`
```typescript
export function itemPrice(item: CartItem): number
export function cartSubtotal(items: CartItem[]): number
export function cartTotal(items: CartItem[], deliveryCost: number): number
```

### `components/CartItemCard.tsx`
Muestra: nombre del producto ("Mesa a medida"), medidas (100×200×80 cm), precio calculado. Botón "Eliminar" (×).

### `components/Cart.tsx`
- Lista de `CartItemCard`
- Si carrito vacío: mensaje + botón "Agregar un mueble"
- Total parcial de muebles (sin envío)
- Botón secundario: "Seguir agregando" → vuelve a `select`
- Botón primario: "Cotizar todo" → va a `checkout`

### `components/CheckoutForm.tsx`
- Toggle visual: **Envío a domicilio** | **Retiro en taller** (Saenz Peña 1213, Tigre)
- Si envío: campo dirección con onBlur → preview de distancia y costo (reutiliza lógica existente de `TableQuoteForm`)
- `ContactGate` (email/WhatsApp + consentimiento)
- Botón: "Enviar cotización"

### `components/TableQuoteForm.tsx` (cambios)
- Eliminar fieldset "Entrega" (dirección)
- Eliminar `ContactGate`
- Cambiar botón: "Enviar solicitud" → "Agregar al carrito"
- Agregar debajo de las medidas: "Precio estimado del mueble: $340.000" (sin envío)

### `components/QuoteSummary.tsx` (cambios)
- Lista de items: "Mesa a medida — 100×200×80 cm — $340.000"
- Línea de envío: "Envío a [dirección]: $87.500" o "Retiro en taller: gratis"
- Total: suma visible

## Comportamiento del carrito vacío
Si el cliente llega al paso `cart` con 0 items (no debería pasar normalmente), se muestra un mensaje y botón para agregar el primer producto.

## Estado global del carrito
`cart: CartItem[]` vive en `page.tsx` como estado de React. Se pierde al recargar la página (session-only, sin localStorage por ahora).

## Lo que NO cambia
- La API route `/api/distance` — se reutiliza desde `CheckoutForm`
- La función `calculateDeliveryCost` — se reutiliza tal cual
- El modelo de pricing progresivo — igual para todos los muebles
- Los productos "Próximamente" — siguen igual, no entran al carrito
