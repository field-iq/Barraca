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
  {
    id: "escritorio",
    name: "Escritorio",
    description: "Escritorio de madera maciza, listo para entrega inmediata.",
    // TODO: ajustar precio real
    price: 0,
    image: "/escritorio.jpeg",
    badge: "En stock",
  },
];
