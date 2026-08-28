import { STANDARD_FURNITURE } from "./standardFurniture";

export interface CatalogCategory {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  sortOrder: number;
  visible: boolean;
}

export interface CatalogProduct {
  id: string;
  categoryId: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  detailTitle: string;
  detailTitleEn?: string;
  detailDescription: string;
  detailDescriptionEn?: string;
  dimensions: string;
  listPrice: number;
  cashPrice: number;
  images: string[];
  imageAlt: string;
  sortOrder: number;
  visible: boolean;
}

export interface CatalogData {
  version: number;
  updatedAt: string;
  categories: CatalogCategory[];
  products: CatalogProduct[];
}

const DEFAULT_CATEGORIES: CatalogCategory[] = [
  {
    id: "mesas-comedor",
    name: "Mesas de comedor",
    nameEn: "Dining tables",
    description: "Mesas de madera maciza en medidas estándar.",
    descriptionEn: "Solid wood tables in standard sizes.",
    sortOrder: 0,
    visible: true,
  },
  {
    id: "camastros",
    name: "Camastros",
    nameEn: "Daybeds",
    description: "Camastros de madera para espacios de descanso.",
    descriptionEn: "Wooden daybeds for relaxation spaces.",
    sortOrder: 1,
    visible: true,
  },
  {
    id: "mesas-ratonas",
    name: "Mesas ratonas",
    nameEn: "Coffee tables",
    description: "Mesas bajas para living.",
    descriptionEn: "Low tables for the living room.",
    sortOrder: 2,
    visible: true,
  },
  {
    id: "cilindros",
    name: "Cilindros",
    nameEn: "Cylinders",
    description: "Mesas auxiliares y piezas decorativas.",
    descriptionEn: "Side tables and decorative pieces.",
    sortOrder: 3,
    visible: true,
  },
];

function categoryForProduct(id: string): string {
  if (id.startsWith("mesa-comedor")) return "mesas-comedor";
  if (id.startsWith("camastro")) return "camastros";
  if (id.startsWith("mesa-ratona")) return "mesas-ratonas";
  return "cilindros";
}

export const DEFAULT_CATALOG: CatalogData = {
  version: 1,
  updatedAt: new Date(0).toISOString(),
  categories: DEFAULT_CATEGORIES,
  products: STANDARD_FURNITURE.map((item, index) => ({
    id: item.id,
    categoryId: categoryForProduct(item.id),
    name: item.name,
    nameEn: item.nameEn,
    description: item.description,
    descriptionEn: item.descriptionEn,
    detailTitle: item.detailTitle,
    detailTitleEn: item.detailTitleEn,
    detailDescription: item.detailDescription,
    detailDescriptionEn: item.detailDescriptionEn,
    dimensions: item.dimensions,
    listPrice: item.listPrice,
    cashPrice: item.cashPrice,
    images: item.images,
    imageAlt: item.imageAlt,
    sortOrder: index,
    visible: true,
  })),
};

export function getVisibleProducts(catalog: CatalogData): CatalogProduct[] {
  const visibleCategories = new Set(
    catalog.categories.filter((category) => category.visible).map((category) => category.id),
  );

  return catalog.products
    .filter((product) => product.visible && visibleCategories.has(product.categoryId))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function validateCatalog(value: unknown): CatalogData {
  if (!value || typeof value !== "object") {
    throw new Error("El catálogo enviado no es válido.");
  }

  const catalog = value as Partial<CatalogData>;
  if (!Array.isArray(catalog.categories) || !Array.isArray(catalog.products)) {
    throw new Error("El catálogo debe incluir categorías y productos.");
  }

  const categoryIds = new Set<string>();
  for (const category of catalog.categories) {
    if (!category.id || !category.name || categoryIds.has(category.id)) {
      throw new Error("Hay una categoría sin nombre o con identificador repetido.");
    }
    categoryIds.add(category.id);
  }

  const productIds = new Set<string>();
  for (const product of catalog.products) {
    if (!product.id || !product.name || productIds.has(product.id)) {
      throw new Error("Hay un producto sin nombre o con identificador repetido.");
    }
    if (!categoryIds.has(product.categoryId)) {
      throw new Error(`El producto ${product.name} no tiene una categoría válida.`);
    }
    if (
      !Number.isFinite(product.listPrice) ||
      !Number.isFinite(product.cashPrice) ||
      product.listPrice < 0 ||
      product.cashPrice < 0
    ) {
      throw new Error(`Los precios de ${product.name} deben ser números válidos y positivos.`);
    }
    if (product.cashPrice > product.listPrice) {
      throw new Error(`El precio en efectivo de ${product.name} no puede superar el de lista.`);
    }
    if (!Array.isArray(product.images)) {
      throw new Error(`Las imágenes de ${product.name} no son válidas.`);
    }
    if (product.visible && product.images.length === 0) {
      throw new Error(`Agregá al menos una foto a ${product.name} antes de publicarlo.`);
    }
    if (product.visible && product.images.length === 0) {
      throw new Error(`Agregá al menos una foto a ${product.name} antes de publicarlo.`);
    }
    productIds.add(product.id);
  }

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    categories: catalog.categories as CatalogCategory[],
    products: catalog.products as CatalogProduct[],
  };
}
