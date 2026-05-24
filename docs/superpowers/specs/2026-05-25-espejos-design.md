# Diseño: Producto Espejos

**Fecha:** 2026-05-25  
**Estado:** Aprobado

## Resumen

Agregar "Espejo" como producto disponible (cotizable) en el cotizador de La Barraca De Juan. El cliente ingresa ancho y alto en centímetros y ve el precio estimado en tiempo real.

## Pricing

- **Precio final:** `superficie_m2 × $250.000 ARS`
- `superficie_m2 = (anchoCm × altoCm) / 10.000`
- Sin costo de mano de obra, terminación, ni margen adicional.
- En `pricingConfig`: `materialCostPerM2: 250_000`, `baseLabourCost: 0`, `finishCost: 0`, `marginMultiplier: 1.0`, `deliveryCostFallback: 25_000`.

El envío sigue el mismo modelo progresivo compartido con mesa y banco.

## Dimensiones

Solo dos campos: **Ancho (cm)** y **Alto (cm)**. No hay campo de profundidad. La superficie se calcula como `widthCm × lengthCm` (se reutiliza `TableDimensions`, usando `lengthCm` como el alto del espejo). `heightCm` se fija en 1 (no se muestra al usuario).

## Fotos

Cuatro fotos en `Fotos/Espejos/` se copian a `/public/` con nombres `espejo-1.jpeg` a `espejo-4.jpeg`.

## Archivos

| Archivo | Operación | Detalle |
|---|---|---|
| `public/espejo-{1..4}.jpeg` | Crear | Copiar desde `Fotos/Espejos/` |
| `lib/quoteTypes.ts` | Editar | Agregar `"mirror"` a `ProductId` |
| `lib/products.ts` | Editar | Agregar espejo con `available: true` |
| `lib/pricing/pricingConfig.ts` | Editar | Agregar `espejo: ProductPricingConfig` a la interfaz y default |
| `lib/pricing/mirrorPricing.ts` | Crear | Función `calculateMirrorQuote` |
| `components/MirrorQuoteForm.tsx` | Crear | Form con campos Ancho + Alto, precio en tiempo real |
| `app/page.tsx` | Editar | Paso `mirror-form` + handler `handleAddMirrorToCart` |
| `app/admin/precios/PricingForm.tsx` | Editar | Sección "Espejo" con campo `materialCostPerM2` |

## Flujo de usuario

1. Pantalla de selección → clic en "Espejo"  
2. Formulario: ingresa Ancho y Alto → precio se actualiza en tiempo real  
3. "Agregar al carrito" → vuelve al carrito  
4. Carrito muestra el espejo con sus dimensiones y precio  
5. Checkout y confirmación sin cambios (flujo compartido)

## Restricciones

- Reutilizar `TableDimensions` para `CartItem` (sin cambio de tipos en cart).
- No crear una interfaz de dimensiones nueva para evitar cambios en cascade a `Cart`, `CartItemCard`, `CheckoutForm`, `QuoteSummary`.
- El panel admin muestra solo `materialCostPerM2` para espejo (los demás campos son siempre 0 o 1).
