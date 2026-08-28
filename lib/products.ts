import type { ProductId } from "./quoteTypes";
import type { Language } from "./i18n/translations";

export interface ProductDefinition {
  id: ProductId;
  name: string; // Spanish UI label
  nameEn?: string;
  description: string;
  descriptionEn?: string;
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
    nameEn: "Table",
    description: "Mesa a medida en madera maciza.",
    descriptionEn: "Custom table in solid wood.",
    images: ["/mesa-1.jpeg", "/mesa-2.jpeg", "/mesa-3.jpeg"],
    available: true,
  },
  {
    id: "bench",
    name: "Bancos",
    nameEn: "Benches",
    description: "Bancos artesanales, con o sin respaldo.",
    descriptionEn: "Handmade benches, with or without a backrest.",
    images: ["/banco-1.jpeg", "/banco-2.jpeg"],
    available: true,
  },
  {
    id: "mirror",
    name: "Espejo",
    nameEn: "Mirror",
    description: "Espejo a medida con marco de madera maciza.",
    descriptionEn: "Custom mirror with a solid wood frame.",
    images: ["/espejo-1.jpeg", "/espejo-2.jpeg", "/espejo-3.jpeg", "/espejo-4.jpeg"],
    imageFit: "contain",
    available: true,
  },
  {
    id: "chair",
    name: "Silla",
    nameEn: "Chair",
    description: "Silla artesanal en madera.",
    descriptionEn: "Handmade wooden chair.",
    images: ["/silla.jpeg"],
    available: false,
  },
  {
    id: "shelf",
    name: "Estantería",
    nameEn: "Shelving unit",
    description: "Estantería a medida para tu espacio.",
    descriptionEn: "Custom shelving for your space.",
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
    nameEn: "Coffee table",
    description: "Mesa baja para living.",
    descriptionEn: "Low table for the living room.",
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
    nameEn: "Nightstand",
    description: "Mesa de luz para dormitorio.",
    descriptionEn: "Nightstand for the bedroom.",
    images: ["/mesa-luz.jpeg"],
    available: false,
  },
  {
    id: "cylinder",
    name: "Cirindros",
    nameEn: "Cylinders",
    description: "Cilindros de madera maciza, usados como banqueta o mesa auxiliar.",
    descriptionEn: "Solid wood cylinders, used as a stool or side table.",
    images: ["/cirindros.jpeg"],
    available: false,
  },
];

export function getProduct(id: ProductId): ProductDefinition | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductName(id: ProductId, language: Language): string | undefined {
  const product = getProduct(id);
  if (!product) return undefined;
  return language === "en" && product.nameEn ? product.nameEn : product.name;
}
