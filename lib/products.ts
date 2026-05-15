import type { ProductId } from "./quoteTypes";

export interface ProductDefinition {
  id: ProductId;
  name: string; // Spanish UI label
  description: string;
  /**
   * Path to a hero image inside `/public`. The MVP uses CSS placeholders, so
   * this is optional and the UI falls back to an illustrative tile.
   */
  image?: string;
  available: boolean; // false → "Próximamente"
}

export const PRODUCTS: ProductDefinition[] = [
  {
    id: "table",
    name: "Mesa",
    description: "Mesa a medida en madera maciza.",
    image: "/mesa-2.jpeg",
    available: true,
  },
  {
    id: "bench",
    name: "Banco",
    description: "Banco sin respaldo para mesa o entrada.",
    // TODO: copiar a /public/banco.jpeg y referenciarla acá
    available: false,
  },
  {
    id: "bench-backrest",
    name: "Banco con respaldo",
    description: "Banco con respaldo, ideal para comedor.",
    // TODO: copiar a /public/banco-respaldo.jpeg y referenciarla acá
    available: false,
  },
  {
    id: "chair",
    name: "Silla",
    description: "Silla artesanal en madera.",
    available: false,
  },
  {
    id: "shelf",
    name: "Estantería",
    description: "Estantería a medida para tu espacio.",
    // TODO: copiar a /public/estanteria.jpeg y referenciarla acá
    available: false,
  },
  {
    id: "coffee-table",
    name: "Mesa ratona",
    description: "Mesa baja para living.",
    // TODO: copiar a /public/mesa-ratona.jpeg y referenciarla acá
    available: false,
  },
  {
    id: "bedside-table",
    name: "Mesa de luz",
    description: "Mesa de luz para dormitorio.",
    // TODO: copiar a /public/mesa-luz.jpeg y referenciarla acá
    available: false,
  },
];

export function getProduct(id: ProductId): ProductDefinition | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
