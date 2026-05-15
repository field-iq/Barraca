/**
 * Ofertas en stock que se muestran en la pantalla principal.
 *
 * Estas son piezas ya fabricadas, disponibles para entrega inmediata.
 * Para agregar / sacar / editar una oferta, modificá el array OFFERS.
 *
 * Más adelante esto se puede leer desde Supabase / Airtable / Sheets:
 *   export async function getOffers(): Promise<Offer[]> { ... }
 */

export interface Offer {
  id: string;
  name: string;
  description: string;
  /** Precio actual (lo que paga el cliente). */
  price: number;
  /** Precio anterior, opcional — si se completa se muestra tachado. */
  oldPrice?: number;
  /** Ruta a la imagen dentro de /public. */
  image: string;
  /** Mostrar etiqueta "Última unidad" / "Pieza única", etc. */
  badge?: string;
}

export const OFFERS: Offer[] = [
  // EJEMPLO — reemplazá con las piezas reales en stock.
  {
    id: "mesa-roble-200x100",
    name: "Mesa de roble 200 × 100",
    description: "Mesa de comedor en roble macizo, terminación al aceite.",
    price: 1_580_000,
    oldPrice: 1_750_000,
    image: "/mesa-3.jpeg",
    badge: "Pieza única",
  },
];
