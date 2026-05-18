# Diseño: Cálculo de envío por distancia

**Fecha:** 2026-05-18  
**Estado:** Aprobado

## Resumen

Agregar un campo de dirección de entrega al formulario de cotización. Al enviar, se calcula la distancia real por ruta desde el taller (`Saenz Peña 1213, Tigre, Buenos Aires`) hasta la dirección del cliente usando Google Maps Distance Matrix API. El costo de envío se calcula como `distanciaKm × $8.000 ARS` y se muestra en la pantalla de confirmación.

## Origen fijo

```
Saenz Peña 1213, Tigre, Buenos Aires, Argentina
```

## Tarifa

```
$8.000 ARS por km
```

## Arquitectura y flujo

```
TableQuoteForm (cliente)
  └─ campo "Dirección de entrega" (string)
       ↓ submit
submitQuote (cliente)
  └─ GET /api/distance?address=<dirección del cliente>
       ↓ resultado: { distanceKm: number } | { error: string }
  └─ calculateTableQuote(dimensions, distanceKm)
       ↓
QuoteSummary (confirmación)
  └─ muestra dirección + desglose con costo de envío calculado
```

## Archivos modificados / creados

| Archivo | Tipo | Descripción |
|---|---|---|
| `lib/quoteTypes.ts` | Modificado | Agrega `deliveryAddress: string` a `QuoteRequest` |
| `components/TableQuoteForm.tsx` | Modificado | Campo de texto para dirección de entrega |
| `app/api/distance/route.ts` | Creado | API route server-side que llama a Google Maps |
| `lib/submitQuote.ts` | Modificado | Llama a `/api/distance` antes de calcular precio |
| `lib/pricing/tablePricing.ts` | Modificado | Acepta `distanceKm`, calcula `km × 8000` como `deliveryCost` |
| `components/QuoteSummary.tsx` | Modificado | Muestra `deliveryAddress` en la sección de datos |
| `.env.local` | Nuevo | `GOOGLE_MAPS_API_KEY=<key del usuario>` |

## Detalles por componente

### `app/api/distance/route.ts`

- Recibe query param `address` (string)
- Llama a `https://maps.googleapis.com/maps/api/distancematrix/json` con:
  - `origins`: `Saenz Peña 1213, Tigre, Buenos Aires, Argentina`
  - `destinations`: la dirección del cliente
  - `key`: `process.env.GOOGLE_MAPS_API_KEY`
- Extrae `rows[0].elements[0].distance.value` (distancia en metros)
- Devuelve `{ distanceKm: number }` redondeado a 1 decimal
- En caso de error (dirección inválida, API key faltante, fallo de red): devuelve `{ distanceKm: null, error: string }` con HTTP 200 para que el cliente pueda hacer fallback

### `lib/pricing/tablePricing.ts`

- `calculateTableQuote` recibe `distanceKm: number | null` como segundo argumento opcional
- Si `distanceKm` es válido: `deliveryCost = Math.round(distanceKm * 8000)`
- Si `distanceKm` es null (fallback): usa el valor fijo del config (`deliveryCost: 25_000`)
- Elimina `deliveryCost` del `DEFAULT_CONFIG` como valor fijo ya que ahora se calcula dinámicamente. Lo mantiene solo como fallback.

### `lib/submitQuote.ts`

- Antes de llamar a `calculateTableQuote`, hace fetch a `/api/distance?address=<request.deliveryAddress>`
- Si la respuesta tiene `distanceKm`, lo pasa a la función de pricing
- Si falla, pasa `null` (usa fallback)

### `components/TableQuoteForm.tsx`

- Nuevo campo de texto debajo de las medidas: "Dirección de entrega"
- Placeholder: `Ej: Av. Corrientes 1234, Buenos Aires`
- Requerido para poder enviar el formulario (validación: no vacío)
- Se almacena en el estado local como `string`

### `components/QuoteSummary.tsx`

- Muestra `deliveryAddress` como nueva fila en el `<dl>` de datos del pedido
- Si el `estimate` tiene `notes` que indiquen fallback de envío, muestra un pequeño aviso: `"Costo de envío a confirmar con el taller"`

### `.env.local`

```
GOOGLE_MAPS_API_KEY=REEMPLAZAR_CON_TU_KEY
```

## Google Maps API: pasos para obtener la key

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear o seleccionar un proyecto
3. Habilitar **Distance Matrix API** en "APIs y servicios"
4. Crear una API key en "Credenciales"
5. Opcional pero recomendado: restringir la key a Distance Matrix API y a la IP del servidor
6. Copiar la key y pegarla en `.env.local`

## Manejo de errores y fallback

| Caso | Comportamiento |
|---|---|
| Dirección válida, API ok | `deliveryCost = km × $8.000` |
| Dirección no encontrada por Google | Fallback: `deliveryCost = $25.000`, nota en `estimate.notes` |
| `GOOGLE_MAPS_API_KEY` no configurada | Fallback igual, log de advertencia en servidor |
| Timeout / error de red | Fallback igual |

## Validación en el formulario

- `deliveryAddress` no puede estar vacío para habilitar el botón de submit
- No se valida el formato de la dirección en el cliente (Google Maps se encarga de detectar si no existe)

## Lo que NO cambia

- El formulario de `TableQuoteForm` sigue siendo el único formulario activo
- La lógica de cotización para otros productos no cambia
- El precio NO se muestra en tiempo real (solo en la confirmación)
- La API key nunca se expone al cliente
