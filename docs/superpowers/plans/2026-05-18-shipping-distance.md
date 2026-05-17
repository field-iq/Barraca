# Shipping Distance Calculation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar un campo de dirección de entrega al formulario de cotización y calcular el costo de envío dinámicamente usando Google Maps Distance Matrix API ($8.000 ARS/km desde Saenz Peña 1213, Tigre).

**Architecture:** El formulario captura la dirección del cliente. Al hacer submit, `submitQuote` llama a la API route `/api/distance` (server-side, con la key de Google Maps segura en el servidor), obtiene los km, y los pasa a `calculateTableQuote` para calcular `deliveryCost = km × 8000`. El resultado aparece en la pantalla de confirmación.

**Tech Stack:** Next.js 14 App Router, TypeScript, Google Maps Distance Matrix API (REST), fetch nativo.

---

## File Map

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `lib/quoteTypes.ts` | Modificar | Agregar `deliveryAddress: string` a `QuoteRequest` |
| `components/TableQuoteForm.tsx` | Modificar | Campo de texto para la dirección de entrega |
| `.env.local` | Crear | API key de Google Maps (nunca commiteada) |
| `.gitignore` | Verificar | Que `.env.local` esté ignorado |
| `app/api/distance/route.ts` | Crear | API route server-side que llama a Google Maps |
| `lib/pricing/tablePricing.ts` | Modificar | Calcular `deliveryCost` a partir de `distanceKm` |
| `lib/submitQuote.ts` | Modificar | Llamar a `/api/distance` y pasar km al motor de pricing |
| `components/QuoteSummary.tsx` | Modificar | Mostrar dirección de entrega en el resumen |

---

## Task 1: Agregar `deliveryAddress` al tipo `QuoteRequest`

**Files:**
- Modify: `lib/quoteTypes.ts`

- [ ] **Step 1: Agregar el campo al tipo**

En `lib/quoteTypes.ts`, agregar `deliveryAddress` a la interfaz `QuoteRequest`:

```typescript
export interface QuoteRequest {
  productType: ProductId;
  dimensions: TableDimensions;
  contact: ContactDetails;
  deliveryAddress: string;          // ← agregar esta línea
  /** ISO 8601 timestamp generated at submit time. */
  requestedAt: string;
}
```

- [ ] **Step 2: Verificar que TypeScript compile**

```bash
npx tsc --noEmit
```

Esperado: errores de TypeScript porque `TableQuoteForm` y `submitQuote` todavía no pasan `deliveryAddress`. Están bien por ahora — los vamos a resolver en las tareas siguientes.

- [ ] **Step 3: Commit**

```bash
git add lib/quoteTypes.ts
git commit -m "feat: agregar deliveryAddress al tipo QuoteRequest"
```

---

## Task 2: Agregar campo de dirección al formulario

**Files:**
- Modify: `components/TableQuoteForm.tsx`

- [ ] **Step 1: Agregar estado para la dirección**

En `TableQuoteForm`, agregar estado para `deliveryAddress`:

```typescript
// Después de: const [contact, setContact] = useState<ContactDetails>(DEFAULT_CONTACT);
const [deliveryAddress, setDeliveryAddress] = useState("");
```

- [ ] **Step 2: Actualizar la validación del formulario**

Reemplazar la línea `const canSubmit = ...` para incluir validación de dirección:

```typescript
const addressValid = deliveryAddress.trim().length > 0;
const canSubmit = dimensionsValid && contactValid && addressValid && !submitting;
```

- [ ] **Step 3: Pasar `deliveryAddress` al submit**

Dentro de `handleSubmit`, agregar el campo al objeto que se pasa a `onSubmit`:

```typescript
await onSubmit({
  productType: "table",
  dimensions,
  contact,
  deliveryAddress,                  // ← agregar esta línea
  requestedAt: new Date().toISOString(),
});
```

- [ ] **Step 4: Agregar el campo visual en el formulario**

Agregar un fieldset para la dirección **entre** el fieldset de medidas y el `<ContactGate>`. En `TableQuoteForm.tsx`, insertar después del cierre del `</fieldset>` de medidas:

```tsx
<fieldset className="space-y-4">
  <legend className="font-serif text-xl text-walnut">Entrega</legend>
  <div className="flex flex-col gap-1.5">
    <label htmlFor="delivery-address" className="text-sm font-medium text-walnut">
      Dirección de entrega
    </label>
    <input
      id="delivery-address"
      type="text"
      value={deliveryAddress}
      onChange={(e) => setDeliveryAddress(e.target.value)}
      placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
      className="w-full rounded-lg border border-sand bg-white px-3 py-2.5 text-walnut focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
    />
    <p className="text-xs text-walnut/50">
      Usamos esta dirección para calcular el costo de envío.
    </p>
  </div>
</fieldset>
```

- [ ] **Step 5: Actualizar el texto de validación**

Reemplazar el texto del hint de validación para mencionar la dirección:

```tsx
{!canSubmit && (
  <p className="text-xs text-walnut/60 sm:mr-auto">
    Completá las medidas, la dirección de entrega, un medio de contacto y
    la confirmación para enviar.
  </p>
)}
```

- [ ] **Step 6: Verificar en el navegador**

Con `npm run dev` corriendo, abrir [http://localhost:3000](http://localhost:3000), seleccionar Mesa, y verificar que:
- Aparece el campo "Dirección de entrega" entre las medidas y el contacto
- El botón queda deshabilitado si la dirección está vacía
- Al escribir una dirección válida, el botón se habilita (asumiendo que medidas y contacto también están completos)

- [ ] **Step 7: Commit**

```bash
git add components/TableQuoteForm.tsx
git commit -m "feat: agregar campo de direccion de entrega al formulario"
```

---

## Task 3: Crear `.env.local` y la API route de distancia

**Files:**
- Create: `.env.local`
- Create: `app/api/distance/route.ts`
- Verify: `.gitignore`

- [ ] **Step 1: Verificar que `.env.local` está en `.gitignore`**

```bash
grep ".env.local" .gitignore
```

Esperado: que aparezca `.env.local`. Si no aparece, agregarlo:

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 2: Crear `.env.local`**

Crear el archivo `.env.local` en la raíz del proyecto:

```
GOOGLE_MAPS_API_KEY=REEMPLAZAR_CON_TU_KEY
```

**Nota para obtener la key:**
1. Ir a [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Crear o seleccionar un proyecto
3. Ir a "APIs y servicios" → "Habilitar APIs y servicios"
4. Buscar y habilitar **"Distance Matrix API"**
5. Ir a "APIs y servicios" → "Credenciales" → "Crear credenciales" → "Clave de API"
6. Copiar la key y reemplazar `REEMPLAZAR_CON_TU_KEY` en `.env.local`
7. Reiniciar `npm run dev` para que Next.js cargue la nueva variable

- [ ] **Step 3: Crear la API route**

Crear el archivo `app/api/distance/route.ts` con este contenido completo:

```typescript
import { NextRequest, NextResponse } from "next/server";

const ORIGIN = "Saenz Peña 1213, Tigre, Buenos Aires, Argentina";
const MAPS_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!address || address.trim().length === 0) {
    return NextResponse.json({ distanceKm: null, error: "Dirección vacía" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "REEMPLAZAR_CON_TU_KEY") {
    console.warn("[La Barraca] GOOGLE_MAPS_API_KEY no configurada — usando fallback de envío");
    return NextResponse.json({ distanceKm: null, error: "API key no configurada" });
  }

  const params = new URLSearchParams({
    origins: ORIGIN,
    destinations: address.trim(),
    key: apiKey,
    language: "es",
  });

  try {
    const response = await fetch(`${MAPS_URL}?${params}`, {
      next: { revalidate: 0 }, // no cachear — cada dirección puede ser diferente
    });

    if (!response.ok) {
      console.error("[La Barraca] Error HTTP de Google Maps:", response.status);
      return NextResponse.json({ distanceKm: null, error: "Error al contactar Google Maps" });
    }

    const data = await response.json();

    const element = data?.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK") {
      console.warn("[La Barraca] Google Maps no pudo resolver la dirección:", address, element?.status);
      return NextResponse.json({ distanceKm: null, error: "Dirección no encontrada" });
    }

    const meters: number = element.distance.value;
    const distanceKm = Math.round((meters / 1000) * 10) / 10; // 1 decimal

    return NextResponse.json({ distanceKm });
  } catch (err) {
    console.error("[La Barraca] Error inesperado en /api/distance:", err);
    return NextResponse.json({ distanceKm: null, error: "Error interno" });
  }
}
```

- [ ] **Step 4: Probar la API route manualmente**

Con el servidor corriendo y la API key configurada, abrir en el navegador (o usar curl):

```
http://localhost:3000/api/distance?address=Av.%20Corrientes%201234%2C%20Buenos%20Aires
```

Esperado (con key válida):
```json
{ "distanceKm": 34.5 }
```

Esperado (sin key configurada):
```json
{ "distanceKm": null, "error": "API key no configurada" }
```

- [ ] **Step 5: Commit**

```bash
git add app/api/distance/route.ts .gitignore
git commit -m "feat: crear API route de distancia con Google Maps"
```

> `.env.local` NO se commitea — está en `.gitignore`.

---

## Task 4: Actualizar el motor de pricing para usar `distanceKm`

**Files:**
- Modify: `lib/pricing/tablePricing.ts`

- [ ] **Step 1: Agregar `distanceKm` como parámetro de `calculateTableQuote`**

Reemplazar la función `calculateTableQuote` completa con esta versión:

```typescript
export function calculateTableQuote(
  dimensions: TableDimensions,
  distanceKm: number | null,
  config: TablePricingConfig = DEFAULT_CONFIG,
): PriceEstimate {
  const surfaceM2 = (dimensions.widthCm * dimensions.lengthCm) / 10_000;

  const materialCost = surfaceM2 * config.materialCostPerM2;
  const labourCost =
    config.baseLabourCost + dimensions.heightCm * config.labourPerCmHeight;
  const finishCost = config.finishCost;

  // Si hay distancia calculada, usarla. Si no, usar costo fijo como fallback.
  const deliveryCost =
    distanceKm !== null
      ? Math.round(distanceKm * 8_000)
      : config.deliveryCost;

  const subtotal = materialCost + labourCost + finishCost + deliveryCost;
  const total = roundUpToThousand(subtotal * config.marginMultiplier);
  const margin = total - subtotal;

  return {
    currency: "ARS",
    materialCost: Math.round(materialCost),
    labourCost: Math.round(labourCost),
    finishCost,
    deliveryCost,
    margin,
    subtotal: Math.round(subtotal),
    total,
    notes:
      distanceKm !== null
        ? `Envío calculado: ${distanceKm} km × $8.000/km`
        : "Envío a confirmar con el taller (dirección no calculada automáticamente).",
  };
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: error en `submitQuote.ts` porque llama a `calculateTableQuote` con la firma vieja. Se resuelve en la siguiente tarea.

- [ ] **Step 3: Commit**

```bash
git add lib/pricing/tablePricing.ts
git commit -m "feat: calcular deliveryCost a partir de distanceKm en tablePricing"
```

---

## Task 5: Actualizar `submitQuote` para llamar a la API de distancia

**Files:**
- Modify: `lib/submitQuote.ts`

- [ ] **Step 1: Reemplazar `submitQuote` con la versión que llama al endpoint**

Reemplazar el contenido completo de `lib/submitQuote.ts`:

```typescript
import { calculateTableQuote } from "./pricing/tablePricing";
import type { PriceEstimate, QuoteRequest } from "./quoteTypes";

export interface SubmitQuoteResult {
  ok: true;
  id: string;
  estimate: PriceEstimate | null;
}

export async function submitQuote(
  request: QuoteRequest,
): Promise<SubmitQuoteResult> {
  let distanceKm: number | null = null;

  if (request.productType === "table" && request.deliveryAddress) {
    distanceKm = await fetchDistanceKm(request.deliveryAddress);
  }

  const estimate =
    request.productType === "table"
      ? calculateTableQuote(request.dimensions, distanceKm)
      : null;

  const payload = { ...request, estimate };
  console.log("[La Barraca] Nueva cotización:", payload);

  await new Promise((r) => setTimeout(r, 300));

  return { ok: true, id: cryptoRandomId(), estimate };
}

async function fetchDistanceKm(address: string): Promise<number | null> {
  try {
    const params = new URLSearchParams({ address });
    const response = await fetch(`/api/distance?${params}`);
    if (!response.ok) return null;
    const data: { distanceKm: number | null } = await response.json();
    return data.distanceKm ?? null;
  } catch {
    return null;
  }
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add lib/submitQuote.ts
git commit -m "feat: integrar calculo de distancia en submitQuote"
```

---

## Task 6: Mostrar la dirección en la pantalla de confirmación

**Files:**
- Modify: `components/QuoteSummary.tsx`

- [ ] **Step 1: Agregar la dirección al `<dl>` de datos del pedido**

En `QuoteSummary.tsx`, dentro de la función `QuoteSummary`, agregar `deliveryAddress` a los datos del pedido. Reemplazar el bloque `<dl>` existente:

```tsx
<dl className="mt-6 border-t border-sand pt-6 space-y-3 text-sm">
  <Row label="Producto" value="Mesa a medida" />
  <Row
    label="Medidas"
    value={`${dimensions.widthCm} × ${dimensions.lengthCm} × ${dimensions.heightCm} cm`}
  />
  <Row label="Dirección de entrega" value={request.deliveryAddress} />
  {contact.email && <Row label="Email" value={contact.email} />}
  {contact.phone && <Row label="Teléfono / WhatsApp" value={contact.phone} />}
</dl>
```

- [ ] **Step 2: Si el envío es fallback, agregar aviso**

En el componente `PriceBreakdown`, reemplazar el párrafo final para mostrar si el envío fue estimado o calculado:

```tsx
<p className="mt-3 text-xs text-walnut/60">
  {estimate.notes?.startsWith("Envío a confirmar")
    ? "El costo de envío es estimativo y será confirmado por el taller según tu dirección."
    : "Esta cotización es estimativa. Puede ajustarse según el tipo de madera y la terminación elegida."}
</p>
```

- [ ] **Step 3: Verificar en el navegador — flujo completo**

1. Abrir [http://localhost:3000](http://localhost:3000)
2. Seleccionar Mesa
3. Completar medidas (ej: 100 × 200 × 80)
4. Escribir una dirección de entrega real (ej: `Av. Santa Fe 1000, Buenos Aires`)
5. Completar contacto y marcar el consentimiento
6. Hacer click en "Enviar solicitud de cotización"
7. Verificar en la pantalla de confirmación:
   - Aparece la dirección de entrega
   - Aparece el costo de envío calculado en el desglose (distinto a $25.000 fijo)
   - El total refleja el costo dinámico
8. Verificar en la consola del servidor (terminal donde corre `npm run dev`):
   - Aparece `[La Barraca] Nueva cotización:` con el objeto completo

- [ ] **Step 4: Commit**

```bash
git add components/QuoteSummary.tsx
git commit -m "feat: mostrar direccion de entrega y nota de envio en QuoteSummary"
```

---

## Task 7: Verificación final y limpieza

- [ ] **Step 1: Build de producción**

```bash
npm run build
```

Esperado: sin errores de TypeScript ni de compilación.

- [ ] **Step 2: Probar el fallback (sin API key)**

Temporalmente poner en `.env.local`:
```
GOOGLE_MAPS_API_KEY=REEMPLAZAR_CON_TU_KEY
```
Reiniciar el servidor y completar el formulario. Verificar que:
- El formulario igual se puede enviar
- En la confirmación aparece el costo fijo de $25.000
- El párrafo dice "El costo de envío es estimativo y será confirmado por el taller"

Restaurar la key real y reiniciar el servidor.

- [ ] **Step 3: Commit de cierre**

```bash
git add -A
git commit -m "feat: calculo de envio dinamico por distancia con Google Maps completo"
```
