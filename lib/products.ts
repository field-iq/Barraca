import type { ProductId } from "./quoteTypes";

export interface ProductDefinition {
  id: ProductId;
  name: string; // Spanish UI label
  description: string;
  /**
   * Imágenes en /public. Si hay más de una, la card va a ciclarlas con un
   * slideshow (ver ImageSlideshow.tsx). Si está vacío o ausente, se muestra
   * un dibujo SVG como placeholder.
   */
  images?: string[];
  /** Cómo ajustar las imágenes al contenedor del card. Default: 'cover'. */
  imageFit?: "cover" | "contain";
  available: boolean; // false → "Próximamente"
}

export const PRODUCTS: ProductDefinition[] = [
  {
    id: "table",
    name: "Mesa",
    description: "Mesa a medida en madera maciza.",
    images: ["/mesa-1.jpeg", "/mesa-2.jpeg", "/mesa-3.jpeg"],
    available: true,
  },
  {
    id: "bench",
    name: "Bancos",
    description: "Bancos artesanales, con o sin respaldo.",
    images: ["/banco-1.jpeg", "/banco-2.jpeg"],
    available: true,
  },
  {
    id: "mirror",
    name: "Espejo",
    description: "Espejo a medida con marco de madera maciza.",
    images: ["/espejo-1.jpeg", "/espejo-2.jpeg", "/espejo-3.jpeg", "/espejo-4.jpeg"],
    imageFit: "contain",
    available: true,
  },
  {
    id: "chair",
    name: "Silla",
    description: "Silla artesanal en madera.",
    images: ["/silla.jpeg"],
    available: false,
  },
  {
    id: "shelf",
    name: "Estantería",
    description: "Estantería a medida para tu espacio.",
    images: [
      "/estanteria-1.jpeg",
      "/estanteria-2.jpeg",
      "/estanteria-3.jpeg",
      "/estanteria-cajones.jpeg",
      "/mesada-entrada.jpeg",
    ],
    available: false,
  },
  {
    id: "coffee-table",
    name: "Mesa ratona",
    description: "Mesa baja para living.",
    images: [
      "/mesa-ratona-1.jpeg",
      "/mesa-ratona-2.jpeg",
      "/mesa-ratona-3.jpeg",
    ],
    available: false,
  },
  {
    id: "bedside-table",
    name: "Mesa de luz",
    description: "Mesa de luz para dormitorio.",
    images: ["/mesa-luz.jpeg"],
    available: false,
  },
  {
    id: "cylinder",
    name: "Cirindros",
    description: "Cirindros de madera maciza, usados como banqueta o mesa auxiliar.",
    images: ["/cirindros.jpeg"],
    available: false,
  },
];

export function getProduct(id: ProductId): ProductDefinition | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
